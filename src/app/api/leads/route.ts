import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDbProfile } from "@/lib/db/profiles";

interface LeadItem {
  id: string;
  user_id: string;
  company_name: string;
  category: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  pipeline_stage: string;
  resolution_rate: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

let inMemoryLeads: LeadItem[] = [];

function toValidUuid(id: string): string {
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  const hex = Buffer.from(id).toString("hex").padEnd(32, "0").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    let { data: { user } } = await supabase.auth.getUser();

    let rawUserId = user?.id;
    if (!rawUserId) {
      const activeProfile = await getDbProfile();
      if (activeProfile && activeProfile.id && activeProfile.id !== "guest-user-evaluator") {
        rawUserId = activeProfile.id;
      }
    }

    if (!rawUserId) {
      return NextResponse.json({ success: true, leads: [] });
    }

    const uuid = toValidUuid(rawUserId);

    let dbLeads: any[] = [];
    try {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", uuid)
        .order("created_at", { ascending: false });
      if (data && Array.isArray(data)) {
        dbLeads = data;
      }
    } catch {}

    const memLeads = inMemoryLeads.filter((l) => l.user_id === rawUserId || l.user_id === uuid);
    const combined = [...dbLeads, ...memLeads.filter((m) => !dbLeads.some((d) => d.id === m.id))];

    return NextResponse.json({ success: true, leads: combined });
  } catch (err: any) {
    return NextResponse.json({ success: true, leads: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.company_name) {
      return NextResponse.json({ success: false, error: "Company name is required." }, { status: 400 });
    }

    const supabase = await createClient();
    let { data: { user } } = await supabase.auth.getUser();

    let rawUserId = user?.id;
    if (!rawUserId) {
      const activeProfile = await getDbProfile();
      if (activeProfile && activeProfile.id && activeProfile.id !== "guest-user-evaluator") {
        rawUserId = activeProfile.id;
      }
    }

    if (!rawUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const uuid = toValidUuid(rawUserId);
    const leadId = `lead-${Date.now()}`;

    const newLead: LeadItem = {
      id: leadId,
      user_id: rawUserId,
      company_name: body.company_name,
      category: body.category || "E-Commerce",
      contact_email: body.contact_email || null,
      contact_phone: body.contact_phone || null,
      pipeline_stage: body.pipeline_stage || "New",
      resolution_rate: body.resolution_rate || 90.0,
      notes: body.notes || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await supabase.from("leads").insert({ ...newLead, user_id: uuid });
    } catch {}

    inMemoryLeads = [newLead, ...inMemoryLeads];

    return NextResponse.json({ success: true, lead: newLead });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to create lead." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Lead ID is required." }, { status: 400 });
    }

    const supabase = await createClient();
    let { data: { user } } = await supabase.auth.getUser();

    let rawUserId = user?.id;
    if (!rawUserId) {
      const activeProfile = await getDbProfile();
      if (activeProfile && activeProfile.id && activeProfile.id !== "guest-user-evaluator") {
        rawUserId = activeProfile.id;
      }
    }

    if (!rawUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const uuid = toValidUuid(rawUserId);

    try {
      await supabase.from("leads").delete().eq("id", id).eq("user_id", uuid);
    } catch {}

    inMemoryLeads = inMemoryLeads.filter((l) => l.id !== id);

    return NextResponse.json({ success: true, message: "Lead deleted." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to delete lead." }, { status: 500 });
  }
}
