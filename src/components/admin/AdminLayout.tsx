import { Outlet, useLocation, Link } from "react-router-dom";
import { FileText, Palette, Users, BookOpen, LogOut, Home, BarChart2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const navItems = [
  { title: "Métriques", path: "/admin/metrics", icon: BarChart2 },
  { title: "Contenu", path: "/admin/contenu", icon: FileText },
  { title: "Apparence", path: "/admin/apparence", icon: Palette },
  { title: "Professionnels", path: "/admin/professionnels", icon: Users },
  { title: "Ateliers", path: "/admin/ateliers", icon: BookOpen },
  { title: "Visibilité", path: "/admin/visibilite", icon: Eye },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-60 border-r bg-background flex flex-col shrink-0">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg text-foreground">Administration</h2>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="p-2 border-t space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            Voir le site
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
