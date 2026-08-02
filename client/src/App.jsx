import { Suspense, Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin      from './pages/AdminLogin.jsx';
import AdminDashboard  from './pages/AdminDashboard.jsx';
import AdminReport     from './pages/AdminReport.jsx';
import CandidateAssess from './pages/CandidateAssess.jsx';
import CandidateDone   from './pages/CandidateDone.jsx';
import NotFound        from './pages/NotFound.jsx';
import { BASE }        from './basePath.js';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) { console.error('[ErrorBoundary]', e, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#c0392b' }}>Something went wrong</h2>
          <pre style={{ background: '#f8f8f8', padding: 16, borderRadius: 8, fontSize: 13, overflowX: 'auto' }}>
            {this.state.error?.message}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: '8px 20px', cursor: 'pointer' }}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Loader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f8fc', color: '#888', fontSize: 15 }}>
    Loading…
  </div>
);

function RequireAdmin({ children }) {
  const token = localStorage.getItem('rdc_admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={BASE}>
        <Suspense fallback={<Loader />}>
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
            <Route path="/" element={<Navigate to="/admin/login" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
