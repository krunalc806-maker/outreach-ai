import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface GrievanceTemplate {
  id: string;
  name: string;
  category: "Logistics & NDR" | "Payments & Refunds" | "Consumer Rights (CPA)" | "Aviation & Travel" | "Quick Commerce" | "Custom";
  statutoryRef: string;
  subject: string;
  body: string;
  variables: string[];
  isCustom?: boolean;
  createdAt: string;
}

const defaultTemplates: GrievanceTemplate[] = [
  {
    id: "tmpl-cpa-2019",
    name: "Statutory Notice under CPA 2019",
    category: "Consumer Rights (CPA)",
    statutoryRef: "Consumer Protection Act (2019) & E-Commerce Rules (2020) Sec 2(47)",
    subject: "FORMAL STATUTORY NOTICE: Consumer Grievance regarding Order #{{order_id}} | ₹{{amount}} — [Ref: CPA 2019]",
    body: `To,\nThe Nodal Grievance Officer,\n{{merchant}}\n\nSubject: Formal Demand Notice under Section 2(47) of the Consumer Protection Act, 2019 for Order #{{order_id}}\n\nDear Sir/Madam,\n\nI am writing to formally register a statutory consumer grievance regarding transaction reference #{{order_id}} amounting to INR {{amount}}.\n\nIssue Description:\n{{issue}}\n\nUnder the Consumer Protection (E-Commerce) Rules, 2020, merchants and marketplace entities are mandated to acknowledge grievances within 48 hours and resolve consumer claims within 30 days. Furthermore, delayed reversal of funds beyond 72 hours violates statutory settlement guidelines.\n\nDEMANDED RESOLUTION:\n{{requested_resolution}} within 48 hours of this notice.\n\nFailing resolution within the statutory SLA, this matter will be automatically escalated to the National Consumer Helpline (NCH Docket) and the District Consumer Disputes Redressal Commission (DCDRC).\n\nRegards,\n{{consumer_name}}\nRef Case ID: {{case_id}}`,
    variables: ["consumer_name", "merchant", "order_id", "amount", "issue", "requested_resolution", "case_id"],
    createdAt: "2026-08-25T10:00:00.000Z",
  },
  {
    id: "tmpl-delhivery-ndr",
    name: "Delhivery NDR Logistics Override Notice",
    category: "Logistics & NDR",
    statutoryRef: "Logistics Consumer Service Level Agreement & Carrier Fair Practices",
    subject: "URGENT: False NDR Re-Attempt Override Request | AWB #{{awb_number}}",
    body: `To,\nThe Hub Supervisor / Delivery Escalation Desk,\nDelhivery Logistics & {{merchant}}\n\nSubject: False Non-Delivery Report (NDR) Investigation & Mandatory Re-Attempt for Waybill #{{awb_number}}\n\nDear Logistics Team,\n\nRegarding package with AWB #{{awb_number}} (Order #{{order_id}}):\n\nThe delivery rider has marked this shipment with false NDR attempts ('Customer Not Reachable' / 'Premises Closed') without initiating the mandatory consumer phone verification call.\n\nVerified Customer Details:\nName: {{consumer_name}}\nDelivery Landmark: {{issue}}\n\nDEMANDED RESOLUTION:\n1. Override the false NDR flag in Delhivery Core.\n2. Schedule an immediate priority re-attempt delivery window within 24 hours.\n3. Prohibit unauthorized RTO (Return to Origin) dispatch.\n\nRegards,\n{{consumer_name}}\nOutreachAI Telemetry Log: AWB-{{awb_number}}`,
    variables: ["consumer_name", "merchant", "awb_number", "order_id", "issue"],
    createdAt: "2026-08-25T10:00:00.000Z",
  },
  {
    id: "tmpl-pinelabs-refund",
    name: "Pine Labs / Banking Chargeback Petition",
    category: "Payments & Refunds",
    statutoryRef: "RBI Digital Payment Grievance Directive DPSS.CO.PD No.629/02.01.014/2019-20",
    subject: "DISPUTE FILING: Payment Settlement Failure & Auto-Reversal for TxID #{{order_id}}",
    body: `To,\nThe Nodal Officer & Payment Settlement Desk,\nPine Labs / {{merchant}}\n\nSubject: Formal Chargeback & Failed Transaction Reversal Claim under RBI Turnaround Time (TAT) Framework\n\nDear Banking Team,\n\nTransaction Summary:\nMerchant: {{merchant}}\nDisputed Transaction Ref: {{order_id}}\nDisputed Amount: INR {{amount}}\n\nIssue Details:\n{{issue}}\n\nAs per Reserve Bank of India (RBI) circular on Harmonisation of Turn Around Time (TAT) and customer compensation for failed transactions (TAT SLA of T+1 day), the customer is entitled to immediate credit reversal of INR {{amount}} along with statutory penalty compensation of INR 100/day for delayed settlement exceeding the stipulated timeline.\n\nDEMANDED RESOLUTION:\nImmediate transmission of Bank UTR settlement reference to the originating account.\n\nRegards,\n{{consumer_name}}\nCase Token: {{case_id}}`,
    variables: ["consumer_name", "merchant", "order_id", "amount", "issue", "case_id"],
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
    const { data: { user } } = await supabase.auth.getUser();

    let userCustomTemplates: GrievanceTemplate[] = [];

    if (user) {
      const { data } = await supabase
        .from("templates")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data && Array.isArray(data)) {
        userCustomTemplates = data.map((t: any) => ({
          id: t.id,
          name: t.name,
          category: t.category || "Custom",
          statutoryRef: t.statutory_ref || "Custom Consumer Grievance",
          subject: t.subject,
          body: t.body,
          variables: Array.isArray(t.variables) ? t.variables : ["consumer_name", "merchant", "order_id", "amount"],
          isCustom: true,
          createdAt: t.created_at || new Date().toISOString(),
        }));
      }
    }

    const allTemplates = [...defaultTemplates, ...userCustomTemplates, ...inMemoryCustomTemplates];
    return NextResponse.json({ success: true, templates: allTemplates });
  } catch (err: any) {
    return NextResponse.json({ success: true, templates: [...defaultTemplates, ...inMemoryCustomTemplates] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, statutoryRef, subject, templateBody, variables } = body;

    if (!name || !subject || !templateBody) {
      return NextResponse.json({ success: false, error: "Name, subject, and body are required." }, { status: 400 });
    }

    const newTemplate: GrievanceTemplate = {
      id: `tmpl-${Date.now()}`,
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
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("templates").insert({
        id: newTemplate.id,
        user_id: user.id,
        name: newTemplate.name,
        category: newTemplate.category,
        statutory_ref: newTemplate.statutoryRef,
        subject: newTemplate.subject,
        body: newTemplate.body,
        variables: newTemplate.variables,
        created_at: newTemplate.createdAt,
      });
    }

    inMemoryCustomTemplates = [newTemplate, ...inMemoryCustomTemplates];

    return NextResponse.json({ success: true, template: newTemplate });
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

    inMemoryCustomTemplates = inMemoryCustomTemplates.filter((t) => t.id !== id);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("templates").delete().eq("id", id).eq("user_id", user.id);
    }

    return NextResponse.json({ success: true, message: "Template deleted." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to delete template." }, { status: 500 });
  }
}

