import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="le-lieu" element={<LeLieu />} />
            <Route path="association" element={<Association />} />
            <Route path="professionnels" element={<Professionnels />} />
            <Route path="professionnels/:id" element={<ProfessionnelProfile />} />
            <Route path="ateliers" element={<Ateliers />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/professionnels" element={
            <RequireAdmin><AdminProfessionnels /></RequireAdmin>
          } />
          <Route path="/admin/ateliers" element={
            <RequireAdmin><AdminAteliers /></RequireAdmin>
          } />
          <Route path="/admin/contenu" element={
            <RequireAdmin><AdminContenu /></RequireAdmin>
          } />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
