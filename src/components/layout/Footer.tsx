import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { trackNavClick } from "@/lib/analytics";

const footerLinks = {
  navigation: [
    { href: "/le-lieu", label: "Le Lieu" },
    { href: "/association", label: "L'Association" },
    { href: "/professionnels", label: "Professionnels" },
    { href: "/ateliers", label: "Ateliers" },
  ],
  legal: [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/confidentialite", label: "Politique de confidentialité" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-wide section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              onClick={() => trackNavClick("Logo", "/", "footer")}
              className="font-script text-3xl font-bold mb-4 block"
            >
              LePhare
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Une maison dédiée à la santé mentale, au Château du Tenet à Mérignac.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Navigation</h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={() => trackNavClick(link.label, link.href, "footer")}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>12 rue Jean-Jacques Rousseau<br />33700 Mérignac</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a
                  href="mailto:contact@maison-lephare.com"
                  onClick={() => trackNavClick("Email", "mailto:contact@maison-lephare.com", "footer")}
                  className="hover:text-primary-foreground transition-colors"
                >
                  contact@maison-lephare.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Informations</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={() => trackNavClick(link.label, link.href, "footer")}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} Le Phare. Tous droits réservés.
            </p>
            <p className="text-sm text-primary-foreground/60">
              Maison dédiée à la Santé Mentale
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
