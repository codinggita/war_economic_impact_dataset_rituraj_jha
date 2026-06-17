import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../features/ui/uiSlice';
import { logout } from '../../features/auth/authSlice';
import { Moon, Sun, Menu, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-display font-bold">
              War<span className="text-destructive">Impact</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-muted-foreground transition-colors">Home</Link>
            <Link to="/dashboard" className="text-foreground hover:text-muted-foreground transition-colors">Dashboard</Link>
            <Link to="/dashboard/conflicts" className="text-foreground hover:text-muted-foreground transition-colors">Explore</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="hidden md:flex space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="px-4 py-2 text-foreground font-medium hover:bg-muted rounded-radius transition-colors">
                    Log in
                  </Link>
                  <Link to="/register" className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-radius hover:opacity-90 transition-opacity">
                    Sign up
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full border border-border hover:bg-muted transition-colors"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={16} className="text-primary" />
                      </div>
                    )}
                    <span className="text-sm font-medium">{user?.username || 'User'}</span>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 overflow-hidden z-50">
                      <Link 
                        to="/dashboard/profile" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User size={16} /> Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button 
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 py-4 space-y-4 shadow-lg">
          <Link to="/" className="block text-foreground hover:text-muted-foreground transition-colors font-medium">Home</Link>
          <Link to="/dashboard" className="block text-foreground hover:text-muted-foreground transition-colors font-medium">Dashboard</Link>
          <Link to="/dashboard/conflicts" className="block text-foreground hover:text-muted-foreground transition-colors font-medium">Explore</Link>
          <div className="border-t border-border pt-4 mt-2">
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-3">
                <Link to="/login" className="text-center px-4 py-2 border border-border text-foreground font-medium rounded-md hover:bg-muted transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="text-center px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity">
                  Sign up
                </Link>
              </div>
            ) : (
              <Link to="/dashboard" className="block text-center px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
