
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import SoldiersPage from "./pages/SoldiersPage";
import { useAppStore } from "./store/useAppStore";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useAppStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/soldiers" replace /> : <LoginForm />
              } 
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/soldiers" replace />} />
              <Route path="soldiers" element={<SoldiersPage />} />
              <Route path="requests" element={<div className="text-center py-12">דף הבקשות - בפיתוח</div>} />
              <Route path="new-request" element={<div className="text-center py-12">יצירת בקשה חדשה - בפיתוח</div>} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
