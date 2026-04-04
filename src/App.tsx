import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import LeLieu from "./pages/LeLieu";
import Association from "./pages/Association";
import Professionnels from "./pages/Professionnels";
import ProfessionnelProfile from "./pages/ProfessionnelProfile";
import Ateliers from "./pages/Ateliers";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/Login";
import AdminProfessionnels from "./pages/admin/Professionnels";
import AdminAteliers from "./pages/admin/Ateliers";
import AdminContenu from "./pages/admin/Contenu";
import AdminApparence from "./pages/admin/Apparence";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* All routes redirect to maintenance */}
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="*" element={<Navigate to="/maintenance" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
