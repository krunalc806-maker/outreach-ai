import { NextRequest, NextResponse } from "next/server";
import { getDocumentType } from "@/lib/documents";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "A document file is required." }, { status: 400 });
  const documentType = getDocumentType(file.name);
  if (!documentType) return NextResponse.json({ error: "Unsupported file type." }, { status: 415 });
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Files must be 20 MB or smaller." }, { status: 413 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to upload documents." }, { status: 401 });

  const { data: existingWorkspace } = await supabase.from("workspaces").select("id").eq("user_id", user.id).order("created_at").limit(1).maybeSingle();
  let workspaceId = existingWorkspace?.id;
  if (!workspaceId) {
    const { data, error } = await supabase.from("workspaces").insert({ user_id: user.id, name: "My workspace" }).select("id").single();
    if (error || !data) return NextResponse.json({ error: "Workspace setup failed. Apply the AI ecosystem migration first." }, { status: 503 });
    workspaceId = data.id;
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from("documents").upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
  if (uploadError) return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 503 });

  const { data: item, error: itemError } = await supabase.from("workspace_items").insert({ workspace_id: workspaceId, user_id: user.id, kind: "document", title: file.name, storage_path: path, mime_type: file.type }).select("id").single();
  if (itemError || !item) {
    await supabase.storage.from("documents").remove([path]);
    return NextResponse.json({ error: "Document metadata could not be saved." }, { status: 500 });
  }
  return NextResponse.json({ success: true, document: { id: item.id, name: file.name, type: documentType } }, { status: 201 });
}
