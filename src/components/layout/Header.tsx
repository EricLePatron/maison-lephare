import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/le-lieu", label: "Le Lieu" },
  { href: "/association", label: "L'Association" },
  { href: "/professionnels", label: "Professionnels" },
  { href: "/ateliers", label: "Ateliers" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container-wide">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-primary-foreground font-serif text-lg font-semibold">P</span>
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">
              Le Phare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  location.pathname === link.href
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <Button asChild variant="hero" size="default">
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 bg-background border-b border-border",
          isOpen ? "max-h-96" : "max-h-0 border-b-0"
        )}
      >
        <nav className="container-wide py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "px-4 py-3 text-base font-medium rounded-lg transition-colors",
                location.pathname === link.href
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 px-4">
            <Button asChild variant="hero" size="lg" className="w-full">
              <Link to="/contact" onClick={() => setIsOpen(false)}>
                Nous contacter
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
