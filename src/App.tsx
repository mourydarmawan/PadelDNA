import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RedirectIfAuthenticated } from '@/components/auth/RedirectIfAuthenticated';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DnaPage } from '@/pages/DnaPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AssessmentPage } from '@/pages/AssessmentPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RedirectIfAuthenticated>
                <PublicLayout />
              </RedirectIfAuthenticated>
            }
          >
            <Route index element={<LandingPage />} />
          </Route>

          <Route
            element={
              <RedirectIfAuthenticated>
                <AuthLayout />
              </RedirectIfAuthenticated>
            }
          >
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dna" element={<DnaPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/matches" element={<PlaceholderPage title="Matches" phase="Phase 4 (Match Logging)" />} />
            <Route path="/analysis" element={<PlaceholderPage title="Analysis" phase="Phase 4 (Match Analysis)" />} />
            <Route
              path="/training"
              element={<PlaceholderPage title="Training" phase="Phase 5 (Training Recommendations)" />}
            />
            <Route path="/partners" element={<PlaceholderPage title="Partners" phase="Phase 6 (Partner Profile)" />} />
            <Route path="/community" element={<PlaceholderPage title="Community" phase="Phase 6 (Community)" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
