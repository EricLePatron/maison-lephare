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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with layout */}
          <Route element={<Layout><Index /></Layout>} path="/" />
          <Route element={<Layout><LeLieu /></Layout>} path="/le-lieu" />
          <Route element={<Layout><Association /></Layout>} path="/association" />
          <Route element={<Layout><Professionnels /></Layout>} path="/professionnels" />
          <Route element={<Layout><Ateliers /></Layout>} path="/ateliers" />
          <Route element={<Layout><Contact /></Layout>} path="/contact" />
          
          {/* Admin routes without layout */}
          <Route path="/admin/professionnels" element={<AdminProfessionnels />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
