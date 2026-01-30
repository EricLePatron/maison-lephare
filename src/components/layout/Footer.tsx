import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

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
    <footer className="bg-sage-700 text-primary-foreground">
      <div className="container-wide section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-primary-foreground font-serif text-lg font-semibold">P</span>
              </div>
              <span className="font-serif text-xl font-semibold">Le Phare</span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Une maison dédiée à la santé mentale, dans un lieu chargé d'histoire à Bordeaux.
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
                <span>Château Le Phare<br />Bordeaux, France</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:contact@lephare.fr" className="hover:text-primary-foreground transition-colors">
                  contact@lephare.fr
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>05 00 00 00 00</span>
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
              Un lieu dédié à la santé mentale
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
