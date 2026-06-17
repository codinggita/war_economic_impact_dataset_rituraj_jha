import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';

const DashboardPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navLinkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive 
        ? 'bg-primary text-primary-foreground shadow-sm' 
        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
      isActive 
        ? 'bg-primary text-primary-foreground shadow-sm' 
        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-16">
      <Helmet>
        <title>Dashboard | War Economic Impact</title>
      </Helmet>
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border hidden md:block py-6 px-4">
          <nav className="space-y-1">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-4">Analytics</div>
            <NavLink to="/dashboard/analytics" className={navLinkClass}>Overview</NavLink>
            <NavLink to="/dashboard/conflicts" className={navLinkClass}>Conflicts Explorer</NavLink>
            <NavLink to="/dashboard/compare" className={navLinkClass}>Compare</NavLink>
            
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 mt-8 px-4">Workspace</div>
            <NavLink to="/dashboard/workflow" className={navLinkClass}>Workflow Builder</NavLink>
            <NavLink to="/dashboard/kanban" className={navLinkClass}>Kanban Board</NavLink>
            
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 mt-8 px-4">Tools</div>
            <NavLink to="/dashboard/upload" className={navLinkClass}>File Upload</NavLink>
            <NavLink to="/dashboard/contact" className={navLinkClass}>Contact</NavLink>
            
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 mt-8 px-4">Account</div>
            <NavLink to="/dashboard/profile" className={navLinkClass}>Profile Settings</NavLink>
          </nav>
        </aside>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
          {/* Mobile sub-nav (horizontal scroll) */}
          <div className="md:hidden bg-card border-b border-border overflow-x-auto shadow-sm">
            <nav className="flex items-center p-3 space-x-2">
              <NavLink to="/dashboard/analytics" className={mobileNavLinkClass}>Overview</NavLink>
              <NavLink to="/dashboard/conflicts" className={mobileNavLinkClass}>Explorer</NavLink>
              <NavLink to="/dashboard/compare" className={mobileNavLinkClass}>Compare</NavLink>
              <NavLink to="/dashboard/workflow" className={mobileNavLinkClass}>Workflow</NavLink>
              <NavLink to="/dashboard/kanban" className={mobileNavLinkClass}>Kanban</NavLink>
              <NavLink to="/dashboard/upload" className={mobileNavLinkClass}>Upload</NavLink>
              <NavLink to="/dashboard/contact" className={mobileNavLinkClass}>Contact</NavLink>
              <NavLink to="/dashboard/profile" className={mobileNavLinkClass}>Profile</NavLink>
            </nav>
          </div>

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
