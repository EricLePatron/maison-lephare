import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/le-lieu", label: "Le lieu" },
  { href: "/professionnels", label: "Les professionnels" },
  { href: "/ateliers", label: "Les Ateliers" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/40">
      <div className="container-wide">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-script text-2xl sm:text-3xl text-primary font-bold tracking-wide">
            LePhare
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
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
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Contactez-nous !
              <Sun className="h-4 w-4" />
            </Link>
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
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium"
            >
              Contactez-nous !
              <Sun className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
