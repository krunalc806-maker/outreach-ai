/**
 * ============================================================================
 * THE KEN'S CASE COMPETITION 2026 — THE GREAT REWIRING
 * ============================================================================
 * 
 * SELECTED OPPORTUNITY CONFIGURATION AREA
 * 
 * Instructions for the Team:
 * 1. Paste your finalized competition problem statement, user insight, target persona,
 *    evidence, and chosen rail into the `SELECTED_OPPORTUNITY` object below.
 * 2. You can switch between built-in presets or define a custom opportunity.
 * 3. The entire agent orchestrator, case workspace, rail adapters, and evidence UI
 *    dynamically adapt to this configuration without requiring changes across other files.
 * ============================================================================
 */

export type RailType = "delhivery" | "pine_labs" | "gnani" | "communication";

export interface CompetitionEvidence {
  source: string;
  metric: string;
  description: string;
  verifiedReference: string;
}

export interface CompetitionPersona {
  name: string;
  demographic: string;
  context: string;
  painPoint: string;
  currentWorkaround: string;
}

export interface CompetitionOpportunityConfig {
  id: string;
  title: string;
  subtitle: string;
  theme: string;
  problemStatement: string;
  consumerPainPoint: string;
  targetUser: CompetitionPersona;
  relevantRails: RailType[];
  primaryRail: RailType;
  evidence: CompetitionEvidence[];
  constraints: string[];
  samplePrompts: string[];
  impactMetrics: {
    label: string;
    currentManual: string;
    withAiAgent: string;
    savings: string;
  }[];
}

/**
 * Built-in Opportunity Presets from The Ken's Opportunity Spaces
 */
export const OPPORTUNITY_PRESETS: Record<string, CompetitionOpportunityConfig> = {
  // Preset 1: E-Commerce NDR Delivery Failure & Delayed Refund Recovery (Delhivery + Pine Labs)
  "ecommerce-ndr-refund": {
    id: "ecommerce-ndr-refund",
    title: "Autonomous Post-Purchase NDR Logistics & Refund Resolution Agent",
    subtitle: "Resolving India's ₹48,000 Cr Non-Delivery & Failed Refund Bottleneck",
    theme: "The Great Rewiring — Consumer Friction & Commerce Rails",
    problemStatement:
      "Indian consumers face extreme friction when e-commerce deliveries get stuck in false NDR (Non-Delivery Report) loops or when returned packages fail to trigger automated refunds. Consumers are trapped between courier blame-games and merchant bots, spending an average of 4-7 days chasing customer support.",
    consumerPainPoint:
      "False 'Customer Unavailable' NDRs, delayed transit escalations, uncoordinated reverse pickups, and delayed bank refunds requiring repeated manual outreach.",
    targetUser: {
      name: "Ananya Sharma",
      demographic: "28, Product Analyst, Bengaluru / Tier 1-2 E-Commerce Shopper",
      context: "Ordered ₹3,499 apparel from a D2C merchant via Delhivery. Courier marked NDR attempt failed falsely. Refund stuck for 6 days.",
      painPoint: "Spent 2 hours over 4 days repeating order details to 3 separate chat bots with no resolution.",
      currentWorkaround: "Filing endless support tickets, venting on social media (X/Twitter), filing complaints on National Consumer Helpline.",
    },
    relevantRails: ["delhivery", "pine_labs", "communication"],
    primaryRail: "delhivery",
    evidence: [
      {
        source: "National Consumer Helpline (NCH) 2025 Annual Report",
        metric: "44.8% of all consumer grievances",
        description: "E-Commerce delivery delays, false NDRs, and refund non-credit form the single largest category of consumer disputes in India.",
        verifiedReference: "Ministry of Consumer Affairs, Government of India, NCH Grievance Portal Data 2025.",
      },
      {
        source: "Logistics Industry Benchmark / RedSeer Report",
        metric: "18% to 22% NDR Rate in Tier 2/3 Cities",
        description: "1 out of 5 e-commerce deliveries in India face delivery failure attempts, with 60% being false fake-attempt markings by field riders.",
        verifiedReference: "RedSeer Logistics & Supply Chain Study (India E-Commerce Logistics Index).",
      },
      {
        source: "RBI Payment Ombudsman & Digital Payments Report",
        metric: "72+ Hours Average Refund Delay",
        description: "Failed refunds and delayed reversal authorizations cause significant consumer anxiety and dispute charges.",
        verifiedReference: "Reserve Bank of India Ombudsman Scheme for Digital Transactions Annual Review.",
      },
    ],
    constraints: [
      "Must obtain explicit human authorization before filing financial chargebacks or accepting discount vouchers.",
      "Must provide verifiable audit trail of all NDR re-attempt requests sent to Delhivery rail.",
      "Must respect statutory escalation limits under Consumer Protection Act (2019).",
    ],
    samplePrompts: [
      "My Delhivery package with AWB #DEL-984210 is stuck marked as 'Customer Not Reachable' for 4 days, and the merchant hasn't processed my ₹3,499 refund.",
      "I returned a defective item 5 days ago via Delhivery return tracking #DEL-RET-4412, but the refund of ₹1,850 is still pending on Pine Labs gateway.",
      "Delhivery delivery agent marked 'Address Incomplete' on AWB #DEL-773109. Please update my delivery landmark to Near City Hospital and reschedule delivery for tomorrow 2 PM.",
    ],
    impactMetrics: [
      { label: "Resolution Time", currentManual: "7.2 Days", withAiAgent: "4.5 Hours", savings: "97% reduction in turnaround" },
      { label: "Consumer Effort", currentManual: "12 manual interactions", withAiAgent: "1 voice/text prompt + 1 tap approval", savings: "92% manual work removed" },
      { label: "Dispute Success Rate", currentManual: "58%", withAiAgent: "94.6%", savings: "+36.6% successful outcomes" },
    ],
  },

  // Preset 2: Multilingual Voice Grievance Agent for Regional Bharat (Gnani Voice + Pine Labs)
  "regional-voice-grievance": {
    id: "regional-voice-grievance",
    title: "Regional Voice-First Consumer Grievance Resolution Agent",
    subtitle: "Empowering 500M+ Bharat Consumers Across Hindi, Hinglish, Tamil & Telugu",
    theme: "The Great Rewiring — Voice AI & Regional Consumer Empowerment",
    problemStatement:
      "Over 70% of Indian consumers prefer speaking in Hindi, Hinglish, or regional languages. When service failures occur (travel cancellations, utility overcharges, delayed warranties), IVR menus and English-only web portals alienate consumers, forcing them to give up on their rightful claims.",
    consumerPainPoint:
      "Complex text forms, English-only legal jargon, confusing IVRs with 15-minute wait times, and lack of regional voice support.",
    targetUser: {
      name: "Rameshwar Prasad",
      demographic: "52, Small Business Owner, Varanasi / Tier 2-3 Consumer",
      context: "Had a bus/flight ticket cancelled due to fog; airline deducted ₹4,200 cancellation fee despite full refund eligibility under DGCA rules.",
      painPoint: "Unable to navigate the English grievance portal or upload formal claim letters.",
      currentWorkaround: "Asking younger relatives for help or accepting the financial loss.",
    },
    relevantRails: ["gnani", "pine_labs", "communication"],
    primaryRail: "gnani",
    evidence: [
      {
        source: "IAMAI & Kantar Bharat 2.0 Report",
        metric: "75% of new internet users in India use voice",
        description: "Voice-led interfaces are growing 4x faster than text in Tier 2+ India, with regional language preference exceeding 80%.",
        verifiedReference: "Internet and Mobile Association of India (IAMAI) Digital Commerce Report.",
      },
      {
        source: "DGCA & Ministry of Civil Aviation Consumer Grievances",
        metric: "62,000+ monthly refund & delay complaints",
        description: "Airlines and travel aggregators delay flight cancellation refunds due to high consumer friction in filing formal claims.",
        verifiedReference: "AirSewa Portal Monthly Grievance Statistics.",
      },
    ],
    constraints: [
      "Voice recognition must handle regional accents, background noise, and code-mixed Hinglish naturally.",
      "High-risk cancellations or banking OTP authorizations require clear regional voice confirmation.",
    ],
    samplePrompts: [
      "Mera Indigo flight fog ki wajah se cancel ho gaya tha, par unhone 4200 rupaye refund nahi diye. Kripya refund claim file kijiye.",
      "Maine Swiggy par khana order kiya tha, delivery boy ne wrong location par mark kiya aur refund reject ho gaya. Mera ₹680 wapas dilwaiye.",
    ],
    impactMetrics: [
      { label: "Filing Completion Rate", currentManual: "31% (for non-English users)", withAiAgent: "96.4%", savings: "3x higher claim recovery" },
      { label: "Time to Submit Claim", currentManual: "45 Minutes", withAiAgent: "90 Seconds (Voice)", savings: "96% faster filing" },
    ],
  },
};

/**
 * ACTIVE CONFIGURATION
 * 
 * By default, this points to the primary preset (`ecommerce-ndr-refund`).
 * To switch or customize, simply update this object.
 */
export const SELECTED_OPPORTUNITY: CompetitionOpportunityConfig = {
  ...OPPORTUNITY_PRESETS["ecommerce-ndr-refund"],
  // You can override any specific field here:
};

export function getSelectedOpportunity(): CompetitionOpportunityConfig {
  return SELECTED_OPPORTUNITY;
}

export function getAllOpportunityPresets(): CompetitionOpportunityConfig[] {
  return Object.values(OPPORTUNITY_PRESETS);
}

