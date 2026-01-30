import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import LeLieu from "./pages/LeLieu";
import Association from "./pages/Association";
import Professionnels from "./pages/Professionnels";
import Ateliers from "./pages/Ateliers";
import Contact from "./pages/Contact";
import AdminProfessionnels from "./pages/admin/Professionnels";
import AdminAteliers from "./pages/admin/Ateliers";
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
            <Route path="ateliers" element={<Ateliers />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          
          {/* Admin routes without layout */}
          <Route path="/admin/professionnels" element={<AdminProfessionnels />} />
          <Route path="/admin/ateliers" element={<AdminAteliers />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
