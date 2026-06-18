import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import LeLieu from "./pages/LeLieu";
import Ateliers from "./pages/Ateliers";
import Actualites from "./pages/Actualites";
import Professionnels from "./pages/Professionnels";
import ProfessionnelProfile from "./pages/ProfessionnelProfile";
import Association from "./pages/Association";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminProfessionnels from "./pages/admin/Professionnels";
import AdminAteliers from "./pages/admin/Ateliers";
import AdminContenu from "./pages/admin/Contenu";
import AdminApparence from "./pages/admin/Apparence";
import AdminMetrics from "./pages/admin/Metrics";
import AdminVisibilite from "./pages/admin/Visibilite";
import Unsubscribe from "./pages/Unsubscribe";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/le-lieu" element={<LeLieu />} />
            <Route path="/ateliers" element={<Ateliers />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/professionnels" element={<Professionnels />} />
            <Route path="/professionnels/:slug" element={<ProfessionnelProfile />} />
            <Route path="/association" element={<Association />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route path="metrics" element={<AdminMetrics />} />
            <Route path="professionnels" element={<AdminProfessionnels />} />
            <Route path="ateliers" element={<AdminAteliers />} />
            <Route path="contenu" element={<AdminContenu />} />
            <Route path="apparence" element={<AdminApparence />} />
            <Route path="visibilite" element={<AdminVisibilite />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
