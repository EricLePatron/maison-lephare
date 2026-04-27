import { Link } from "react-router-dom";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import { trackNavClick } from "@/lib/analytics";

const navigationLinks = [
  { href: "/", label: "Page d'accueil" },
  { href: "/le-lieu", label: "Le lieu" },
  { href: "/professionnels", label: "Les professionnels" },
  { href: "/ateliers", label: "Les ateliers" },
  { href: "/contact", label: "Contactez-nous" },
];

export function Footer() {
  return (
    <footer className="bg-sky-100 text-foreground">
      <div className="container-wide section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand + tagline */}
          <div>
            <Link
              to="/"
              onClick={() => trackNavClick("Logo", "/", "footer")}
              className="font-script text-4xl text-primary font-bold mb-4 block leading-none"
            >
              lePhare
            </Link>
            <p className="font-serif italic text-foreground/70 text-sm leading-relaxed max-w-xs">
              Une maison entièrement dédiée à notre Santé Mentale.
            </p>

            {/* Newsletter input (visual only, matches mockup) */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex items-center gap-2 bg-background rounded-full pl-4 pr-1 py-1 max-w-xs border border-primary/20 shadow-soft"
            >
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Adresse email"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/40 outline-none py-2"
              />
              <button
                type="submit"
                aria-label="S'inscrire"
                className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-primary mb-4">LePhare</h4>
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
            <h4 className="font-serif text-lg font-semibold text-primary mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-foreground/75">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <span>12 rue Jean-Jacques Rousseau<br />33700 Mérignac</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground/75">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <a
                  href="mailto:contact@maison-lephare.com"
                  onClick={() => trackNavClick("Email", "mailto:contact@maison-lephare.com", "footer")}
                  className="hover:text-primary transition-colors"
                >
                  contact@maison-lephare.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-primary/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground/60">
              © {new Date().getFullYear()} Le Phare. Tous droits réservés.
            </p>
            <p className="text-sm text-foreground/60">
              Maison dédiée à la Santé Mentale
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
