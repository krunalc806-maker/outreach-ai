import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDbProfile } from "@/lib/db/profiles";

export interface GrievanceTemplate {
  id: string;
  name: string;
  category: string;
  statutoryRef: string;
  subject: string;
  body: string;
  variables: string[];
  isCustom?: boolean;
  createdAt: string;
}

function toValidUuid(id?: string | null): string | null {
  if (!id) return null;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  const hex = Buffer.from(id).toString("hex").padEnd(32, "0").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

export const STATUTORY_TEMPLATES: GrievanceTemplate[] = [
  {
    id: "tmpl-cpa-ndr",
    name: "Consumer Protection Act (2019) Formal Grievance",
    category: "Consumer Rights (CPA)",
    statutoryRef: "Section 2(47) & Section 35, Consumer Protection Act 2019",
    subject: "STATUTORY NOTICE: Unfair Trade Practice & Deficiency of Service - Order #{{order_id}}",
    body: `To,\nThe Nodal Officer & Principal Grievance Officer,\n{{merchant}}\n\nSubject: Formal Notice under Consumer Protection Act (2019) for Deficiency of Service (Order #{{order_id}})\n\nDear Sir/Madam,\n\nI am issuing this formal statutory notice regarding order #{{order_id}} for the transaction amount of INR {{amount}}.\n\nSummary of Dispute:\n{{issue}}\n\nUnder Section 2(47) of the Consumer Protection Act, 2019, failure to deliver promised goods/services and withholding authorized refunds beyond statutory banking SLAs constitutes an 'Unfair Trade Practice' and 'Deficiency of Service'.\n\nDEMAND FOR RESOLUTION:\n{{requested_resolution}}\n\nKindly note that if this grievance is not resolved within {{deadline}}, I reserve the statutory right to escalate this matter to the National Consumer Helpline (NCH Docket) and institute proceedings before the District Consumer Disputes Redressal Commission (DCDRC).\n\nSincerely,\n{{consumer_name}}\nOutreachAI Autonomous Dispute Docket Ref: {{case_id}}`,
    variables: ["consumer_name", "merchant", "order_id", "amount", "issue", "requested_resolution", "deadline", "case_id"],
    createdAt: "2026-08-25T10:00:00.000Z",
  },
  {
    id: "tmpl-delhivery-ndr",
    name: "Delhivery Hub NDR Escalation & Rider Audit",
    category: "Logistics & NDR",
    statutoryRef: "Logistics Carriage SLA & False Non-Delivery Investigation",
    subject: "URGENT: False NDR Marking & Immediate Delivery Re-Attempt - AWB #{{awb_number}}",
    body: `To,\nThe Operations Supervisor & Hub In-Charge,\nDelhivery Logistics Hub,\n\nSubject: Formal Escalation for False NDR Exception on AWB #{{awb_number}}\n\nDear Delhivery Operations Team,\n\nI am writing regarding consignment AWB #{{awb_number}} (Merchant: {{merchant}}).\n\nThe tracking system marked this shipment as 'Customer Not Reachable / Premises Closed', whereas no delivery attempt or phone call was made to the registered mobile number.\n\nREVISED INSTRUCTIONS:\n1. Schedule priority re-attempt within next 24 hours.\n2. Ensure delivery personnel calls prior to arrival.\n\nDemanded Resolution:\n{{requested_resolution}}\n\nRegards,\n{{consumer_name}}`,
    variables: ["consumer_name", "merchant", "awb_number", "requested_resolution"],
    createdAt: "2026-08-25T10:00:00.000Z",
  },
  {
    id: "tmpl-pine-labs-refund",
    name: "Pine Labs Gateway Refund Statutory Reversal",
    category: "Payments & Refunds",
    statutoryRef: "RBI Circular DPSS.CO.PD No.629/02.01.014/2019-20 (Turn Around Time & Compensation)",
    subject: "PAYMENT DISPUTE: Statutory Reversal Request under RBI TAT Framework | TxID #{{order_id}}",
    body: `To,\nMerchant Acquiring & Nodal Escalation Desk,\nPine Labs / Payment Gateway Partner,\n\nSubject: Delayed Refund Reversal Request for Transaction ID #{{order_id}}\n\nDear Nodal Officer,\n\nI refer to payment transaction of INR {{amount}} debited for merchant {{merchant}} under reference #{{order_id}}.\n\nIssue:\n{{issue}}\n\nIn terms of the Reserve Bank of India Harmonisation of Turn Around Time (TAT) framework, failed transactions and authorized refunds must be reversed within T + 1 day, failing which a compensation of INR 100/- per day is mandated.\n\nDemanded Action: Verify gateway reversal status and provide Bank UTR Number immediately.\n\nRegards,\n{{consumer_name}}`,
    variables: ["consumer_name", "merchant", "order_id", "amount", "issue"],
    createdAt: "2026-08-25T10:00:00.000Z",
  },
  {
    id: "tmpl-dgca-airline",
    name: "DGCA Airline Weather / Cancellation Claim",
    category: "Aviation & Travel",
    statutoryRef: "DGCA Civil Aviation Requirements (CAR) Section 3, Series M, Part IV",
    subject: "STATUTORY CLAIM: Mandatory Ticket Refund & Delay Relief | PNR #{{order_id}}",
    body: `To,\nThe Appellate Authority & Customer Care Nodal Desk,\n{{merchant}}\n\nSubject: Full Refund Claim under DGCA CAR Passenger Charter for PNR #{{order_id}}\n\nDear Airline Grievance Team,\n\nBooking Reference: PNR {{order_id}}\nPassenger Name: {{consumer_name}}\nClaim Amount: INR {{amount}}\n\nReason for Dispute:\n{{issue}}\n\nUnder DGCA Passenger Charter rules, passengers affected by airline flight cancellations or involuntary rescheduling are legally entitled to a full 100% refund of tickets and ancillary charges without cancellation fees within 7 days for credit/debit card transactions.\n\nDEMANDED RESOLUTION:\nProcess complete refund of INR {{amount}} immediately.\n\nRegards,\n{{consumer_name}}`,
    variables: ["consumer_name", "merchant", "order_id", "amount", "issue"],
    createdAt: "2026-08-25T10:00:00.000Z",
  },
  {
    id: "tmpl-quick-commerce",
    name: "Quick Commerce Undelivered Item Reversal",
    category: "Quick Commerce",
    statutoryRef: "Consumer Rights SLA for On-Demand Instant Delivery",
    subject: "GRIEVANCE: Missing / Spoiled Items Refund Request | Order #{{order_id}}",
    body: `To,\nCustomer Grievance Desk,\n{{merchant}}\n\nSubject: Immediate UPI / Wallet Refund for Incomplete Delivery under Order #{{order_id}}\n\nHi Support Team,\n\nOrder #{{order_id}} was delivered with missing or damaged items. Total disputed amount is INR {{amount}}.\n\nDetails:\n{{issue}}\n\nDemanded Action: {{requested_resolution}}.\n\nRegards,\n{{consumer_name}}`,
    variables: ["consumer_name", "merchant", "order_id", "amount", "issue", "requested_resolution"],
    createdAt: "2026-08-25T10:00:00.000Z",
  },
];

let inMemoryCustomTemplates: GrievanceTemplate[] = [];

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

    let userCustomTemplates: GrievanceTemplate[] = [];

    if (rawUserId) {
      const uuid = toValidUuid(rawUserId);
      try {
        const { data } = await supabase
          .from("templates")
          .select("*")
          .eq("user_id", uuid)
          .order("created_at", { ascending: false });

        if (data && Array.isArray(data)) {
          userCustomTemplates = data.map((t: any) => ({
            id: t.id,
            name: t.name || t.template_name || t.title || "Custom Template",
            category: t.category || "Custom",
            statutoryRef: t.statutory_ref || "Custom Consumer Grievance",
            subject: t.subject || "Grievance Notice",
            body: t.body || t.content || "",
            variables: t.variables || ["consumer_name", "merchant", "order_id", "amount", "issue"],
            isCustom: true,
            createdAt: t.created_at,
          }));
        }
      } catch {}
    }

    const memTemplates = inMemoryCustomTemplates;
    const combinedCustom = [
      ...userCustomTemplates,
      ...memTemplates.filter((m) => !userCustomTemplates.some((u) => u.id === m.id)),
    ];

    return NextResponse.json({
      success: true,
      templates: [...combinedCustom, ...STATUTORY_TEMPLATES],
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      templates: STATUTORY_TEMPLATES,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "Missing payload" }, { status: 400 });
    }

    const name = body.name || body.title;
    const category = body.category || "Custom";
    const statutoryRef = body.statutoryRef || body.statutory_ref;
    const subject = body.subject || body.title || "Statutory Grievance Notice";
    const templateBody = body.templateBody || body.body || body.content;
    const variables = body.variables;

    if (!name || !templateBody) {
      return NextResponse.json({ success: false, error: "Name and body are required." }, { status: 400 });
    }

    const templateId = `tmpl-${Date.now()}`;
    const newTemplate: GrievanceTemplate = {
      id: templateId,
      name: name.trim(),
      category: category || "Custom",
      statutoryRef: statutoryRef?.trim() || "Statutory Consumer Notice",
      subject: subject.trim(),
      body: templateBody.trim(),
      variables: Array.isArray(variables) && variables.length > 0 ? variables : ["consumer_name", "merchant", "order_id", "amount", "issue"],
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    const supabase = await createClient();
    let { data: { user } } = await supabase.auth.getUser();

    let rawUserId = user?.id;
    if (!rawUserId) {
      const activeProfile = await getDbProfile();
      if (activeProfile && activeProfile.id && activeProfile.id !== "guest-user-evaluator") {
        rawUserId = activeProfile.id;
      }
    }

    if (rawUserId) {
      const uuid = toValidUuid(rawUserId);
      try {
        await supabase.from("templates").insert({
          user_id: uuid,
          template_name: newTemplate.name,
          category: newTemplate.category,
          content: newTemplate.body,
          variables: newTemplate.variables,
          is_system_template: false,
          created_at: newTemplate.createdAt,
        });
      } catch {}
    }

    inMemoryCustomTemplates = [newTemplate, ...inMemoryCustomTemplates];

    return NextResponse.json({
      success: true,
      template: newTemplate,
      message: "Template persisted successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to create template." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Template ID is required." }, { status: 400 });
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

    if (rawUserId) {
      const uuid = toValidUuid(rawUserId);
      try {
        await supabase.from("templates").delete().eq("id", id).eq("user_id", uuid);
      } catch {}
    }

    inMemoryCustomTemplates = inMemoryCustomTemplates.filter((t) => t.id !== id);

    return NextResponse.json({ success: true, message: "Template deleted." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to delete template." }, { status: 500 });
  }
}
