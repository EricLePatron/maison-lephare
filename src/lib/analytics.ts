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

/**
 * Tracke un clic sur le bouton "S'inscrire" d'un atelier.
 * Envoie l'événement `atelier_inscription_click` vers GA4.
 *
 * Paramètres GA4 disponibles :
 *   atelier_name     — titre de l'atelier
 *   atelier_category — catégorie (ex. "Groupe de parole")
 *   atelier_index    — position dans la grille (0-based)
 *   atelier_url      — URL AssoConnect cible
 */
export function trackAtelierInscription(
  atelierName: string,
  atelierCategory: string | null | undefined,
  atelierIndex: number,
  atelierUrl: string
) {
  trackEvent("atelier_inscription_click", {
    atelier_name: atelierName,
    atelier_category: atelierCategory ?? "Non renseigné",
    atelier_index: atelierIndex,
    atelier_url: atelierUrl,
  });
}

/**
 * Tracke les clics sur les CTAs de la page Ateliers
 * (bannière "Animer un atelier", etc.).
 * Envoie l'événement `atelier_cta_click` vers GA4.
 */
export function trackAtelierCta(ctaLabel: string, destination: string) {
  trackEvent("atelier_cta_click", {
    cta_label: ctaLabel,
    destination,
  });
}