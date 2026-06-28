import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export function RequireAuth() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Temporarily disabling email verification block until email service is implemented
  /*
  if (user && !user.email_verified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Email Verification Required</h2>
        <p className="text-muted-foreground mb-4">Please verify your email address to access the dashboard.</p>
      </div>
    );
  }
  */

  return <Outlet />;
}
