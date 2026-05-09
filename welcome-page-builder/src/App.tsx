import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import StudentProfile from "./pages/StudentProfile";
import Index from "./pages/Index";
import Assignment from "./pages/Assignment.tsx";
import Listpersons from "./pages/Listpersons.tsx"; // added import
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Student Profile Route */}
          <Route
            path="/studentprofile"
            element={<StudentProfile />}
          />

          {/* Assignment Route */}
          <Route
            path="/assignment"
            element={<Assignment />}
          />

          {/* Listpersons Route */}
          <Route
            path="/listpersons"
            element={<Listpersons />}
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;