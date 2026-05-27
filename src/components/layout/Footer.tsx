import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { trackNavClick } from "@/lib/analytics";
import { usePageContent } from "@/hooks/useSiteContent";
import { useSiteImage } from "@/hooks/useTheme";
import logoLePhare from "@/assets/logo-lephare.png";

export function Footer() {
  const { getContent } = usePageContent("global");
  const logoSrc = useSiteImage("logo-main", logoLePhare);

  const navigationLinks = [
    { href: "/", label: getContent("footer", "nav_accueil", "Page d'accueil") },
    { href: "/le-lieu", label: getContent("footer", "nav_le_lieu", "Le lieu") },
    { href: "/professionnels", label: getContent("footer", "nav_professionnels", "Les professionnels") },
    { href: "/ateliers", label: getContent("footer", "nav_ateliers", "Les ateliers") },
    { href: "/contact", label: getContent("footer", "nav_contact", "Contactez-nous") },
  ];

  return (
    <footer className="bg-sky-100 text-foreground">
      <div className="container-wide section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand + tagline */}
          <div>
            <Link
              to="/"
              onClick={() => trackNavClick("Logo", "/", "footer")}
              className="mb-4 block leading-none"
              aria-label="lePhare — Maison dédiée à la Santé Mentale"
            >
              <img
                src={logoSrc}
                alt="lePhare — Maison dédiée à la Santé Mentale"
                className="h-16 w-auto"
              />
            </Link>
            <p className="font-sans text-foreground/75 text-sm leading-relaxed max-w-xs mt-2">
              {getContent("footer", "tagline", "Une maison entièrement dédiée à notre Santé Mentale.")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-sans text-base font-bold text-foreground mb-4">
              {getContent("footer", "nav_title", "LePhare")}
            </h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={() => trackNavClick(link.label, link.href, "footer")}
                    className="text-foreground/75 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-sans text-base font-bold text-foreground mb-4">
              {getContent("footer", "contact_title", "Contact")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-foreground/75">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <span style={{ whiteSpace: "pre-line" }}>
                  {getContent("footer", "address", "12 rue Jean-Jacques Rousseau\n33700 Mérignac")}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground/75">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <a
                  href={`mailto:${getContent("footer", "email", "contact@maison-lephare.com")}`}
                  onClick={() => trackNavClick("Email", `mailto:${getContent("footer", "email", "contact@maison-lephare.com")}`, "footer")}
                  className="hover:text-primary transition-colors"
                >
                  {getContent("footer", "email", "contact@maison-lephare.com")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-primary/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground/60">
              © {new Date().getFullYear()} {getContent("footer", "copyright", "Le Phare. Tous droits réservés.")}
            </p>
            <p className="text-sm text-foreground/60">
              {getContent("footer", "subtitle", "Maison dédiée à la Santé Mentale")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
