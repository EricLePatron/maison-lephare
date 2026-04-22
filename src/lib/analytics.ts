// Google Analytics helper - tracks events via gtag (loaded in index.html)
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

export function trackCtaClick(ctaName: string, location: string) {
  trackEvent("cta_click", {
    cta_name: ctaName,
    cta_location: location,
  });
}

export function trackContactFormSubmit(success: boolean, errorMessage?: string) {
  trackEvent("contact_form_submit", {
    success,
    ...(errorMessage ? { error_message: errorMessage } : {}),
  });
}

export function trackNavClick(
  linkLabel: string,
  destination: string,
  location: "header_desktop" | "header_mobile" | "footer" | string
) {
  trackEvent("nav_click", {
    link_label: linkLabel,
    destination,
    nav_location: location,
  });
}