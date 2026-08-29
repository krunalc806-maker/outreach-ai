import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface SequenceStep {
  id: string;
  stepNumber: number;
  title: string;
  channel: "Email Grievance (CPA 2019)" | "Delhivery Logistics Override" | "Pine Labs Switch Audit" | "Gnani Regional Voice Call" | "National Consumer Helpline (NCH)";
  delayHours: number;
  statutorySla: string;
  actionPayload: string;
}

export interface EscalationSequence {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Paused" | "Completed";
  maxAttempts: number;
  currentAttempt?: number;
  steps: SequenceStep[];
  linkedMerchant?: string;
  createdAt: string;
  updatedAt: string;
}

const defaultSequences: EscalationSequence[] = [
  {
    id: "seq-cpa-statutory",
    name: "Statutory 3-Tier Consumer Grievance Sequence",
    description: "Standard bounded escalation sequence citing CPA 2019 Section 2(47) and E-Commerce Rules 2020.",
    status: "Active",
    maxAttempts: 3,
    currentAttempt: 1,
    linkedMerchant: "Zara India",
    createdAt: "2026-08-25T10:00:00.000Z",
    updatedAt: "2026-08-27T10:00:00.000Z",
    steps: [
      {
        id: "step-1",
        stepNumber: 1,
        title: "Formal Statutory Grievance Dispatch",
        channel: "Email Grievance (CPA 2019)",
        delayHours: 0,
        statutorySla: "24-48 Hours",
        actionPayload: "Dispatches CPA 2019 notice with order details and refund demand to nodal officer.",
      },
      {
        id: "step-2",
        stepNumber: 2,
        title: "Automated Banking & Logistics Rail Verification",
        channel: "Pine Labs Switch Audit",
        delayHours: 24,
        statutorySla: "24 Hours",
        actionPayload: "Scans Pine Labs gateway for UTR transaction credit and queries Delhivery NDR logs.",
      },
      {
        id: "step-3",
        stepNumber: 3,
        title: "Regional Voice Outreach to Hub Supervisor",
        channel: "Gnani Regional Voice Call",
        delayHours: 48,
        statutorySla: "12 Hours",
        actionPayload: "Triggers automated Hinglish voice call to delivery hub manager to override false NDR.",
      },
      {
        id: "step-4",
        stepNumber: 4,
        title: "National Consumer Helpline (NCH) Docket Generation",
        channel: "National Consumer Helpline (NCH)",
        delayHours: 72,
        statutorySla: "Statutory Finality",
        actionPayload: "Compiles evidence dossier and submits regulatory dispute token to NCH / INGRAM portal.",
      },
    ],
  },
  {
    id: "seq-ndr-override",
    name: "Delhivery NDR Logistics Escalation Sequence",
    description: "Rapid turnaround sequence specifically designed for delivery disputes marked with false 'Customer Not Reachable' attempts.",
    status: "Active",
    maxAttempts: 2,
    currentAttempt: 1,
    linkedMerchant: "Delhivery Logistics Hub",
    createdAt: "2026-08-26T08:00:00.000Z",
    updatedAt: "2026-08-27T11:00:00.000Z",
    steps: [
      {
        id: "step-ndr-1",
        stepNumber: 1,
        title: "Logistics Hub False NDR Flag Override",
        channel: "Delhivery Logistics Override",
        delayHours: 0,
        statutorySla: "6 Hours",
        actionPayload: "Instructs Indiranagar delivery hub to freeze RTO and re-schedule delivery window.",
      },
      {
        id: "step-ndr-2",
        stepNumber: 2,
        title: "Consumer Landmark Voice Verification",
        channel: "Gnani Regional Voice Call",
        delayHours: 12,
        statutorySla: "12 Hours",
        actionPayload: "Calls consumer to capture verified delivery landmark and routes instructions to rider.",
      },
    ],
  },
];

let inMemorySequences: EscalationSequence[] = [...defaultSequences];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let dbSequences: EscalationSequence[] = [];
    if (user) {
      const { data } = await supabase
        .from("sequences")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data && Array.isArray(data)) {
        dbSequences = data.map((s: any) => ({
          id: s.id,
          name: s.name,
          description: s.description || "",
          status: s.status || "Active",
          maxAttempts: s.max_attempts || 3,
          currentAttempt: s.current_attempt || 1,
          linkedMerchant: s.linked_merchant,
          steps: Array.isArray(s.steps) ? s.steps : [],
          createdAt: s.created_at || new Date().toISOString(),
          updatedAt: s.updated_at || new Date().toISOString(),
        }));
      }
    }

    const combined = [...dbSequences, ...inMemorySequences.filter(s => !dbSequences.some(d => d.id === s.id))];
    return NextResponse.json({ success: true, sequences: combined });
  } catch (err: any) {
    return NextResponse.json({ success: true, sequences: inMemorySequences });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, maxAttempts, steps, linkedMerchant } = body;

    if (!name || !Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json({ success: false, error: "Sequence name and at least 1 step are required." }, { status: 400 });
    }

    const newSeq: EscalationSequence = {
      id: `seq-${Date.now()}`,
      name: name.trim(),
      description: description?.trim() || "Custom Escalation Sequence",
      status: "Active",
      maxAttempts: maxAttempts || 3,
      currentAttempt: 1,
      linkedMerchant: linkedMerchant?.trim() || "Multi-Merchant",
      steps: steps.map((st: any, idx: number) => ({
        id: st.id || `step-${Date.now()}-${idx}`,
        stepNumber: idx + 1,
        title: st.title || `Escalation Step ${idx + 1}`,
        channel: st.channel || "Email Grievance (CPA 2019)",
        delayHours: Number(st.delayHours) || 0,
        statutorySla: st.statutorySla || `${st.delayHours || 24} Hours`,
        actionPayload: st.actionPayload || "Autonomous action dispatched by agent.",
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("sequences").insert({
        id: newSeq.id,
        user_id: user.id,
        name: newSeq.name,
        description: newSeq.description,
        status: newSeq.status,
        max_attempts: newSeq.maxAttempts,
        current_attempt: newSeq.currentAttempt,
        linked_merchant: newSeq.linkedMerchant,
        steps: newSeq.steps,
        created_at: newSeq.createdAt,
        updated_at: newSeq.updatedAt,
      });
    }

    inMemorySequences = [newSeq, ...inMemorySequences];

    return NextResponse.json({ success: true, sequence: newSeq });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to create sequence." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Sequence ID required." }, { status: 400 });
    }

    inMemorySequences = inMemorySequences.map((s) =>
      s.id === id ? { ...s, status: status || (s.status === "Active" ? "Paused" : "Active"), updatedAt: new Date().toISOString() } : s
    );

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("sequences").update({ status, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", user.id);
    }

    const updated = inMemorySequences.find((s) => s.id === id);
    return NextResponse.json({ success: true, sequence: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to update sequence." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Sequence ID is required." }, { status: 400 });
    }

    inMemorySequences = inMemorySequences.filter((s) => s.id !== id);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("sequences").delete().eq("id", id).eq("user_id", user.id);
    }

    return NextResponse.json({ success: true, message: "Sequence deleted." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to delete sequence." }, { status: 500 });
  }
}

