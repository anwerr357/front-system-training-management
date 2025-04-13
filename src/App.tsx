
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
import TrainingsPage from "./pages/admin/TrainingsPage";
import ParticipantsPage from "./pages/admin/ParticipantsPage";
import InstructorsPage from "./pages/admin/InstructorsPage";
import EmployersPage from "./pages/admin/EmployersPage";
import UsersPage from "./pages/admin/UsersPage";
import StructuresPage from "./pages/admin/StructuresPage";
import ProfilesPage from "./pages/admin/ProfilesPage";
import DomainsPage from "./pages/admin/DomainsPage";

// Employer pages
import EmployerDashboard from "./pages/employer/Dashboard";
import EmployerTrainingsPage from "./pages/employer/TrainingsPage";

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
              <Route 
                path="/admin/trainings" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <TrainingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/participants" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ParticipantsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/instructors" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <InstructorsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/employers" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <EmployersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UsersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/structures" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <StructuresPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/profiles" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ProfilesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/domains" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DomainsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Employer routes */}
              <Route 
                path="/employer/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/employer/trainings" 
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EmployerTrainingsPage />
                  </ProtectedRoute>
                } 
              />
              
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
