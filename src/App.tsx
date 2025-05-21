
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Leaderboard from "./pages/Leaderboard";
import Interview from "./pages/Interview";
import Analysis from "./pages/Analysis";
import NotFound from "./pages/NotFound";
import VideoPlayerDemo from "./pages/VideoPlayerDemo";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./components/ThemeProvider";
import MainNavigation from "./components/Navigation/MainNavigation";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <MainNavigation />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/interview" element={<Interview />} />
                <Route path="/analysis/:sessionId" element={<Analysis />} />
                <Route path="/videos" element={<VideoPlayerDemo />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
