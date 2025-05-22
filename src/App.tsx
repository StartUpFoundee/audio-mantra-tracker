
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AudioCountPage from "./pages/AudioCountPage";
import ManualCountPage from "./pages/ManualCountPage";
import WelcomePage from "./pages/WelcomePage";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Protected route component that handles auto-login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }
  
  return <>{children}</>;
};

// Auto redirect from welcome to home if already authenticated
const AutoRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/welcome" element={<AutoRedirect><WelcomePage /></AutoRedirect>} />
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/audio" element={<ProtectedRoute><AudioCountPage /></ProtectedRoute>} />
      <Route path="/manual" element={<ProtectedRoute><ManualCountPage /></ProtectedRoute>} />
      <Route path="/legacy" element={<Index />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Root wrapper that handles initial redirect
const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const isWelcomePage = window.location.pathname === "/welcome";
  
  useEffect(() => {
    // If user is authenticated and on any page other than explicit routes, redirect to home
    if (isAuthenticated && !isWelcomePage && window.location.pathname === "/") {
      // Already on home page, no redirect needed
    } else if (isAuthenticated && !isWelcomePage) {
      // Stay on the current page if it's not the welcome page
    } else if (!isAuthenticated && !isWelcomePage) {
      // If not authenticated and not on welcome page, redirect to welcome
      window.location.href = "/welcome";
    }
  }, [isAuthenticated, isWelcomePage]);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppWrapper>
            <AppRoutes />
          </AppWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
