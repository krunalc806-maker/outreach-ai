import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: true, leads: [] });
    }

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, leads: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to fetch leads." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.company_name) {
      return NextResponse.json({ success: false, error: "Company name is required." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const newLead = {
      user_id: user.id,
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

    const { data, error } = await supabase.from("leads").insert(newLead).select().single();
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: data });
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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase.from("leads").delete().eq("id", id).eq("user_id", user.id);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Lead deleted." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to delete lead." }, { status: 500 });
  }
}

