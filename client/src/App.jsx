import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin      from './pages/AdminLogin.jsx';
import AdminDashboard  from './pages/AdminDashboard.jsx';
import AdminReport     from './pages/AdminReport.jsx';
import CandidateAssess from './pages/CandidateAssess.jsx';
import CandidateDone   from './pages/CandidateDone.jsx';
import NotFound        from './pages/NotFound.jsx';

function RequireAdmin({ children }) {
  const token = localStorage.getItem('rdc_admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin (JWT protected) */}
        <Route path="/admin" element={
          <RequireAdmin><AdminDashboard /></RequireAdmin>
        } />
        <Route path="/admin/report/:id" element={
          <RequireAdmin><AdminReport /></RequireAdmin>
        } />

        {/* Candidate (token URL) */}
        <Route path="/assess/:token"      element={<CandidateAssess />} />
        <Route path="/assess/:token/done" element={<CandidateDone />} />

        {/* Redirects */}
        <Route path="/"       element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/" element={<Navigate to="/admin" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
