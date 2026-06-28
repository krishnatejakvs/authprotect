import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OrganizationProvider } from './contexts/OrganizationContext';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { RequireAuth } from './components/layout/RequireAuth';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { PasswordReset } from './pages/auth/PasswordReset';
import { CreateOrganization } from './pages/organization/CreateOrganization';
import { OrganizationHome } from './pages/dashboard/OrganizationHome';
import { OrganizationSettings } from './pages/dashboard/OrganizationSettings';
import { Sites } from './pages/dashboard/Sites';
import { Projects } from './pages/dashboard/Projects';

function App() {
  return (
    <Router>
      <AuthProvider>
        <OrganizationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            
            <Route element={<RequireAuth />}>
              <Route path="/onboarding/organization" element={<CreateOrganization />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<OrganizationHome />} />
                <Route path="users" element={<OrganizationSettings />} />
                <Route path="settings" element={<OrganizationSettings />} />
                <Route path="sites" element={<Sites />} />
                <Route path="projects" element={<Projects />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </OrganizationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
