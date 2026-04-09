import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Maintenance from "./pages/Maintenance";
import AdminLogin from "./pages/admin/Login";
import AdminProfessionnels from "./pages/admin/Professionnels";
import AdminAteliers from "./pages/admin/Ateliers";
import AdminContenu from "./pages/admin/Contenu";
import AdminApparence from "./pages/admin/Apparence";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/maintenance" element={<Maintenance />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/le-lieu" element={<LeLieu />} />
            <Route path="/association" element={<Association />} />
            <Route path="/professionnels" element={<Professionnels />} />
            <Route path="/professionnels/:id" element={<ProfessionnelProfile />} />
            <Route path="/ateliers" element={<Ateliers />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route path="professionnels" element={<AdminProfessionnels />} />
            <Route path="ateliers" element={<AdminAteliers />} />
            <Route path="contenu" element={<AdminContenu />} />
            <Route path="apparence" element={<AdminApparence />} />
          </Route>

          <Route path="*" element={<Navigate to="/maintenance" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
