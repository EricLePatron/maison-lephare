import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Maintenance from "./pages/Maintenance";
import AdminLogin from "./pages/admin/Login";
import AdminProfessionnels from "./pages/admin/Professionnels";
import AdminAteliers from "./pages/admin/Ateliers";
import AdminContenu from "./pages/admin/Contenu";
import AdminApparence from "./pages/admin/Apparence";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/maintenance" element={<Maintenance />} />

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
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
