import { NextRequest, NextResponse } from "next/server";
import { getDbCaseById, listDbCases, saveDbCase } from "@/lib/db/cases";
import { createClient } from "@/lib/supabase/server";
import { agentOrchestrator } from "@/lib/agent/orchestrator";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get("id");
    const demo = searchParams.get("demo") === "true";

    if (caseId) {
      const singleCase = await getDbCaseById(caseId);
      if (!singleCase) {
        return NextResponse.json({ success: false, error: "Case not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, case: singleCase });
    }

    const cases = await listDbCases(undefined, demo);
    return NextResponse.json({ success: true, cases });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to fetch cases." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "Missing request payload" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. If raw consumer input text was passed directly:
    if (body.input || body.consumerInput) {
      const inputText = body.input || body.consumerInput;
      const newCase = await agentOrchestrator.createCaseFromInput(inputText);
      await saveDbCase(newCase, user?.id);
      return NextResponse.json({ success: true, case: newCase, message: "Case created and persisted in Supabase" });
    }

    // 2. If full case object was passed:
    if (body.id) {
      const result = await saveDbCase(body, user?.id);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 });
      }
      return NextResponse.json({ success: true, case: body, message: "Case persisted in Supabase" });
    }

    return NextResponse.json({ success: false, error: "Invalid case payload" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to process case." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get("id");

    if (!caseId) {
      return NextResponse.json({ success: false, error: "Missing case ID" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { deleteDbCase } = await import("@/lib/db/cases");
    const result = await deleteDbCase(caseId, user?.id);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Case deleted from Supabase" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to delete case." }, { status: 500 });
  }
}
