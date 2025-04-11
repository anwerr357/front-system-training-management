
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/RouteGuard";
import MainLayout from "./components/layouts/MainLayout";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";

// Employer pages
import EmployerDashboard from "./pages/employer/Dashboard";

// Instructor pages
import InstructorTrainingsPage from "./pages/instructor/TrainingsPage";
import InstructorSchedulePage from "./pages/instructor/SchedulePage";

// User (Participant) pages
import UserTrainingsPage from "./pages/user/TrainingsPage";
import UserProgressPage from "./pages/user/ProgressPage";

// Placeholder page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />

            {/* Protected routes with layout */}
            <Route element={<MainLayout />}>
              {/* Admin routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              {/* Add other admin routes as needed */}
              
              {/* Employer routes */}
              <Route 
                path="/employer/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                } 
              />
              {/* Add other employer routes as needed */}
              
              {/* Instructor routes */}
              <Route 
                path="/instructor/trainings" 
                element={
                  <ProtectedRoute allowedRoles={['instructor']}>
                    <InstructorTrainingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/instructor/schedule" 
                element={
                  <ProtectedRoute allowedRoles={['instructor']}>
                    <InstructorSchedulePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* User (Participant) routes */}
              <Route 
                path="/user/trainings" 
                element={
                  <ProtectedRoute allowedRoles={['participant']}>
                    <UserTrainingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user/progress" 
                element={
                  <ProtectedRoute allowedRoles={['participant']}>
                    <UserProgressPage />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Default route redirects to login */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            
            {/* Catch all not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
