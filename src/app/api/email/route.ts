import { NextRequest, NextResponse } from "next/server";
import { communicationRail } from "@/lib/rails/CommunicationRailProvider";

export async function GET() {
  return NextResponse.json({
    success: true,
    status: "HEALTHY",
    rail: "Communication & Notice Generation Rail",
    statutoryFramework: "CPA 2019 Section 2(47)",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "Missing notice payload" }, { status: 400 });
    }

    const notice = communicationRail.generateFormalGrievanceNotice({
      consumerName: body.consumerName || "Consumer",
      consumerPhone: body.consumerPhone || "+91 98765 43210",
      merchantName: body.merchantName || "Merchant",
      orderId: body.orderId || "ORD-000",
      awbNumber: body.awbNumber || "AWB-000",
      amount: typeof body.amount === "number" ? body.amount : parseInt(body.amount, 10) || 3499,
      issueDescription: body.issueDescription || "Delivery exception and delayed refund beyond statutory SLA.",
      demandedResolution: body.demandedResolution || "Immediate bank refund credit under CPA 2019.",
    });

    return NextResponse.json({
      success: true,
      notice: {
        subject: notice.subject,
        body: notice.body,
        statutoryReference: "Section 2(47) Consumer Protection Act 2019 & E-Commerce Rules 2020",
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

