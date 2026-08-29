import { createClient } from "@/lib/supabase/server";
import { outreachSeedData } from "@/lib/outreach/data";
import { Campaign, Lead, OutreachSnapshot } from "@/lib/outreach/types";

/**
 * Fetch campaigns and leads from Supabase with graceful fallback
 */
export async function getDbOutreachSnapshot(userId?: string): Promise<OutreachSnapshot> {
  try {
    const supabase = await createClient();
    let currentUserId = userId;

    if (!currentUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      currentUserId = user?.id;
    }

    const campaignQuery = supabase.from("campaigns").select("*").order("created_at", { ascending: false });
    const leadQuery = supabase.from("leads").select("*").order("created_at", { ascending: false });

    if (currentUserId) {
      campaignQuery.or(`user_id.eq.${currentUserId},user_id.is.null`);
      leadQuery.or(`user_id.eq.${currentUserId},user_id.is.null`);
    }

    const [campaignsRes, leadsRes] = await Promise.all([campaignQuery, leadQuery]);

    const campaigns: Campaign[] = (campaignsRes.data && campaignsRes.data.length > 0)
      ? campaignsRes.data.map((c) => ({
          id: c.id,
          name: c.name,
          objective: c.objective || "Consumer Dispute Resolution",
          audience: c.audience || "E-Commerce Brands",
          status: c.status || "Running",
          sent: c.sent || 0,
          replies: c.replies || 0,
          openRate: c.open_rate || 0,
          conversionRate: c.conversion_rate || 0,
          archived: false,
          createdAt: c.created_at,
          templateId: "tmpl-1",
          sequenceSteps: ["Initial Notice", "SLA Follow-up", "Statutory Escalation"],
        }))
      : outreachSeedData.campaigns;

    const leads: Lead[] = (leadsRes.data && leadsRes.data.length > 0)
      ? leadsRes.data.map((l) => ({
          id: l.id,
          name: l.name,
          company: l.company || "",
          email: l.email,
          status: l.status || "Qualified",
          score: l.score || 85,
          tags: l.tags || ["High Priority"],
          notes: l.notes || "",
          lastActivity: l.last_activity || "Just now",
          source: l.source || "Inbound",
        }))
      : outreachSeedData.leads;

    return {
      campaigns,
      leads,
      templates: outreachSeedData.templates,
    };
  } catch {
    return outreachSeedData;
  }
}

/**
 * Create campaign in Supabase
 */
export async function createDbCampaign(data: {
  name: string;
  objective?: string;
  audience?: string;
  userId?: string;
}): Promise<{ success: boolean; campaign?: Campaign; error?: string }> {
  try {
    const supabase = await createClient();
    let currentUserId = data.userId;

    if (!currentUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      currentUserId = user?.id;
    }

    const id = `camp-${Date.now()}`;
    const payload = {
      id,
      user_id: currentUserId || null,
      name: data.name,
      objective: data.objective || "Consumer Dispute Resolution",
      audience: data.audience || "Logistics Hubs & Merchants",
      status: "Running",
      sent: 0,
      replies: 0,
      open_rate: 0,
      conversion_rate: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("campaigns").insert(payload);
    if (error) {
      console.warn("[createDbCampaign Warning]:", error.message);
    }

    const created: Campaign = {
      id,
      name: data.name,
      objective: data.objective || "Consumer Dispute Resolution",
      audience: data.audience || "Logistics Hubs & Merchants",
      status: "Running",
      sent: 0,
      replies: 0,
      openRate: 0,
      conversionRate: 0,
      archived: false,
      createdAt: payload.created_at,
      templateId: "tmpl-1",
      sequenceSteps: ["Initial Notice", "SLA Follow-up", "Statutory Escalation"],
    };

    return { success: true, campaign: created };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to create campaign in DB." };
  }
}

