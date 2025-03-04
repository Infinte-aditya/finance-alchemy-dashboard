import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import DashboardLayout from "./components/layout/DashboardLayout";
import PageTransition from "./components/layout/PageTransition";
import { GoogleOAuthProvider } from '@react-oauth/google';

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Investments from "./pages/Investments";
import Expenses from "./pages/Expenses";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" />
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'MISSING_GOOGLE_CLIENT_ID'}>
            <Routes>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/signup" element={<PageTransition><SignUp /></PageTransition>} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<PageTransition><Dashboard /></PageTransition>} />
                <Route path="investments" element={<PageTransition><Investments /></PageTransition>} />
                <Route path="expenses" element={<PageTransition><Expenses /></PageTransition>} />
                <Route path="insights" element={<PageTransition><Insights /></PageTransition>} />
                <Route path="profile" element={<PageTransition><Profile /></PageTransition>} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </GoogleOAuthProvider>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;