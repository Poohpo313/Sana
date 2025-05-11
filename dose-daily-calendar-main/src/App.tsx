
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MedicineProvider } from "./context/MedicineContext";
import { ProfileProvider, useProfile } from "./context/ProfileContext";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Route guard component
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isProfileComplete } = useProfile();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isProfileComplete) {
    return <Navigate to="/setup" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useProfile();
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/setup" element={<ProfileSetupPage />} />
      <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
      <Route path="/calendar" element={<RequireAuth><CalendarPage /></RequireAuth>} />
      <Route path="/about" element={<RequireAuth><AboutPage /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Fix by updating the order and ensuring React context is properly used
const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ProfileProvider>
            <MedicineProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <AppRoutes />
              </TooltipProvider>
            </MedicineProvider>
          </ProfileProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
