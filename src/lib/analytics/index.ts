export type AnalyticsEvent =
  | "landing_page_view"
  | "cta_click"
  | "demo_started"
  | "signup_started"
  | "signup_completed"
  | "login_completed"
  | "onboarding_completed"
  | "case_created"
  | "template_used"
  | "sequence_created"
  | "lead_created"
  | "demo_request_submitted";

interface EventProperties {
  page?: string;
  source?: string;
  ctaText?: string;
  caseCategory?: string;
  role?: string;
  [key: string]: any;
}

/**
 * Privacy-conscious client and server analytics dispatcher
 */
export function trackEvent(event: AnalyticsEvent, properties: EventProperties = {}) {
  if (typeof window === "undefined") {
    return;
  }

  // Filter out any accidentally passed sensitive keys
  const sanitizedProps: Record<string, any> = {};
  const sensitiveKeys = ["password", "token", "auth", "secret", "cvv", "raw_input", "email_body"];

  for (const [key, value] of Object.entries(properties)) {
    if (!sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      sanitizedProps[key] = value;
    }
  }

  const payload = {
    event,
    properties: sanitizedProps,
    timestamp: new Date().toISOString(),
    url: window.location.pathname,
  };

  // 1. Log in development
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[Analytics Event]: ${event}`, sanitizedProps);
  }

  // 2. Google Analytics (gtag) integration if configured
  if (typeof (window as any).gtag === "function") {
    (window as any).gtag("event", event, sanitizedProps);
  }

  // 3. Custom endpoint / beacon if configured
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    try {
      navigator.sendBeacon(
        process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,
        JSON.stringify(payload)
      );
    } catch {}
  }
}

