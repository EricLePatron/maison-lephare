import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackNavClick } from "@/lib/analytics";
import { usePageContent } from "@/hooks/useSiteContent";
import { useSiteImage } from "@/hooks/useTheme";
import logoLePhare from "@/assets/logo-lephare.png";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { getContent } = usePageContent("global");
  const logoSrc = useSiteImage("logo-main", logoLePhare);

  const navLinks = [
    { href: "/", label: getContent("nav", "accueil", "Accueil") },
    { href: "/le-lieu", label: getContent("nav", "le_lieu", "Le lieu") },
    { href: "/professionnels", label: getContent("nav", "professionnels", "Les professionnels") },
    { href: "/ateliers", label: getContent("nav", "ateliers", "Les ateliers") },
  ];
  const ctaLabel = getContent("nav", "cta", "Contactez-nous !");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-sky-100/95 backdrop-blur-md">
      <div className="container-wide">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => trackNavClick("Logo", "/", "header_desktop")}
            className="block leading-none"
            aria-label="lePhare — Maison dédiée à la Santé Mentale"
          >
            <img
              src={logoSrc}
              alt="lePhare — Maison dédiée à la Santé Mentale"
              className="h-12 sm:h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => trackNavClick(link.label, link.href, "header_desktop")}
                className={cn(
                  "text-sm font-medium transition-colors relative",
                  location.pathname === link.href
                    ? "text-primary underline underline-offset-8 decoration-2"
                    : "text-foreground/80 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <Link
              to="/contact"
              onClick={() => trackNavClick(ctaLabel, "/contact", "header_desktop")}
              className="inline-flex items-center gap-2 px-5 py-2 bg-background border-2 border-primary text-primary rounded-2xl text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {ctaLabel}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-background/40 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 bg-sky-100 border-b border-border/40",
          isOpen ? "max-h-96" : "max-h-0 border-b-0"
        )}
      >
        <nav className="container-wide py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => {
                trackNavClick(link.label, link.href, "header_mobile");
                setIsOpen(false);
              }}
              className={cn(
                "px-4 py-3 text-base font-medium rounded-lg transition-colors",
                location.pathname === link.href
                  ? "text-primary bg-primary/5"
                  : "text-foreground/80 hover:text-primary hover:bg-background/40"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 px-4">
            <Link
              to="/contact"
              onClick={() => {
                trackNavClick(ctaLabel, "/contact", "header_mobile");
                setIsOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-background border-2 border-primary text-primary rounded-2xl text-sm font-medium"
            >
              {ctaLabel}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
