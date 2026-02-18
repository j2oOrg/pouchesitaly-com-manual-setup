import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, LogOut, Home, LayoutDashboard, FileText, Menu, FileStack, BookOpen, Users, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/carts', icon: ShoppingCart, label: 'Cart Analytics' },
  { to: '/admin/pages', icon: FileStack, label: 'Pages' },
  { to: '/admin/learn-more', icon: BookOpen, label: 'Learn More' },
  { to: '/admin/menus', icon: Menu, label: 'Menus' },
  { to: '/admin/metadata', icon: FileText, label: 'Page SEO' },
  { to: '/admin/users', icon: Users, label: 'Admin Users' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-lg">N</span>
            </div>
            <div>
              <span className="font-heading font-bold text-foreground">NicoXpress</span>
              <span className="block text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to || 
                (item.to !== '/admin' && location.pathname.startsWith(item.to));
              
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User & Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">View Store</span>
          </Link>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-4 py-3 h-auto text-muted-foreground hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </Button>
          
          {user && (
            <p className="text-xs text-muted-foreground px-4 pt-2 truncate">
              {user.email}
            </p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
