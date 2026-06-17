import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';
import ChatbotWidget from './components/chat/ChatbotWidget';

// Lazy loading pages for performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ConflictsPage = lazy(() => import('./pages/ConflictsPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const WorkflowPage = lazy(() => import('./pages/WorkflowPage'));
const KanbanPage = lazy(() => import('./pages/KanbanPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background text-foreground">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<Navigate to="analytics" replace />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="conflicts" element={<ConflictsPage />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="workflow" element={<WorkflowPage />} />
            <Route path="kanban" element={<KanbanPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Suspense>
      <ChatbotWidget />
    </Router>
  );
}

export default App;
