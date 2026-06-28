import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type Role = 'admin' | 'site_manager' | 'auditor';

interface Organization {
  id: string;
  name: string;
  role?: string;
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  userRole: Role | null;
  setCurrentOrganization: (org: Organization | null) => void;
  switchOrganization: (orgId: string) => void;
  isLoading: boolean;
  refreshOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const refreshOrganizations = async () => {
    if (isAuthLoading) return; // Wait for auth to finish loading
    
    if (!isAuthenticated) {
      setCurrentOrganization(null);
      setUserRole(null);
      setOrganizations([]);
      setIsInitialized(false);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await api.get('/api/v1/organizations/');
      const orgs = response.data;
      setOrganizations(orgs);
      
      if (orgs && orgs.length > 0) {
        // Just pick the first one for now if none is set
        setCurrentOrganization({ id: orgs[0].id, name: orgs[0].name });
        setUserRole(orgs[0].role || 'admin');
      } else {
        setCurrentOrganization(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setIsInitialized(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshOrganizations();
  }, [isAuthenticated, isAuthLoading]);

  const switchOrganization = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setCurrentOrganization({ id: org.id, name: org.name });
      setUserRole((org.role as Role) || 'admin');
    }
  };

  const effectiveIsLoading = isLoading || (isAuthenticated && !isInitialized);

  return (
    <OrganizationContext.Provider value={{ currentOrganization, organizations, userRole, setCurrentOrganization, switchOrganization, isLoading: effectiveIsLoading, refreshOrganizations }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}
