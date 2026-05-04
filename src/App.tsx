import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import LeLieu from "./pages/LeLieu";
import Ateliers from "./pages/Ateliers";
import Professionnels from "./pages/Professionnels";
import ProfessionnelProfile from "./pages/ProfessionnelProfile";
import Association from "./pages/Association";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Maintenance from "./pages/Maintenance";

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
            <Route path="/professionnels" element={<Professionnels />} />
            <Route path="/professionnels/:id" element={<ProfessionnelProfile />} />
            <Route path="/association" element={<Association />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
