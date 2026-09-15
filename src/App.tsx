import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PlaceholderPage title="Log in" phase="Phase 2 (Authentication)" />} />
          <Route path="/signup" element={<PlaceholderPage title="Sign up" phase="Phase 2 (Authentication)" />} />
        </Route>

        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={<PlaceholderPage title="Dashboard" phase="Phase 5 (Performance Dashboard)" />}
          />
          <Route path="dna" element={<PlaceholderPage title="My DNA" phase="Phase 3 (PadelDNA)" />} />
          <Route
            path="assessment"
            element={<PlaceholderPage title="Assessment" phase="Phase 3 (Skill Assessment)" />}
          />
          <Route path="matches" element={<PlaceholderPage title="Matches" phase="Phase 4 (Match Logging)" />} />
          <Route path="analysis" element={<PlaceholderPage title="Analysis" phase="Phase 4 (Match Analysis)" />} />
          <Route
            path="training"
            element={<PlaceholderPage title="Training" phase="Phase 5 (Training Recommendations)" />}
          />
          <Route path="partners" element={<PlaceholderPage title="Partners" phase="Phase 6 (Partner Profile)" />} />
          <Route path="community" element={<PlaceholderPage title="Community" phase="Phase 6 (Community)" />} />
          <Route path="profile" element={<PlaceholderPage title="Profile" phase="Phase 2 (Player Profile)" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
