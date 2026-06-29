import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, 
  Users, 
  Settings, 
  Shield, 
  LogOut,
  MapPin,
  FolderKanban,
  Package,
  CheckCircle
} from 'lucide-react';

export function DashboardLayout() {
  const { currentOrganization, organizations, switchOrganization, userRole, isLoading } = useOrganization();
  const { logout, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 flex">
        <div className="w-64 border-r bg-card p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-12 w-1/4 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!currentOrganization) {
    return <Navigate to="/onboarding/organization" replace />;
  }

  const navItems = [
    { name: 'Organization', path: '/dashboard', icon: Building2 },
    { name: 'Sites', path: '/dashboard/sites', icon: MapPin },
    { name: 'Projects', path: '/dashboard/projects', icon: FolderKanban },
    { name: 'Products', path: '/dashboard/products', icon: Package },
    { name: 'Verify Product', path: '/dashboard/verify', icon: Shield },
    { name: 'Verification History', path: '/dashboard/verifications', icon: CheckCircle },
    { name: 'Users & Invites', path: '/dashboard/users', icon: Users, reqAdmin: true },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings, reqAdmin: true },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card/80 backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-border/50">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold font-outfit text-xl tracking-tight">AuthProtect</span>
          </Link>
          <div className="mt-4 px-2 py-1.5 bg-muted rounded-md border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Active Workspace</p>
            {organizations.length > 1 ? (
              <select 
                className="w-full bg-background text-sm font-medium border border-border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                value={currentOrganization?.id || ''}
                onChange={(e) => switchOrganization(e.target.value)}
              >
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm font-medium truncate">{currentOrganization?.name || 'No Organization'}</p>
            )}
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (item.reqAdmin && userRole !== 'admin') return null;
            
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium shadow-sm border border-primary/20' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border/50">
          <div className="mb-4 px-3 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'User Name'}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{userRole}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        <div className="relative z-10 p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
