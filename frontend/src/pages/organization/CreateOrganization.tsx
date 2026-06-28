import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, CheckCircle2 } from 'lucide-react';

export function CreateOrganization() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'creating' | 'success'>('form');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { refreshOrganizations } = useOrganization();
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('creating');
    setError('');
    
    try {
      await api.post('/api/v1/organizations/', { name });
      await refreshOrganizations();
      
      setStep('success');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create organization');
      setStep('form');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      
      <div className="w-full max-w-lg relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-4 rounded-2xl backdrop-blur-xl border border-primary/20 mb-4 shadow-sm">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight font-outfit">Set up your workspace</h1>
          <p className="text-muted-foreground mt-2 text-center">
            Create an organization to start protecting your products
          </p>
        </div>

        <Card className="shadow-lg relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
          
          {step === 'form' && (
            <>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>
                  This is your company or team name. You can change this later.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="org-form" onSubmit={onSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input 
                      id="orgName" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Acme Corp" 
                      required 
                      autoFocus
                      className="transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry (Optional)</Label>
                    <Input 
                      id="industry" 
                      placeholder="e.g. Pharmaceuticals, Electronics" 
                      className="transition-all duration-300"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4">
                <Button variant="ghost" type="button" onClick={() => navigate('/login')}>
                  Cancel
                </Button>
                <Button type="submit" form="org-form" className="shadow-sm">
                  Create Organization
                </Button>
              </CardFooter>
            </>
          )}

          {step === 'creating' && (
            <CardContent className="py-12 flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="space-y-4 w-full max-w-xs">
                <div className="space-y-2 text-center">
                  <h3 className="text-lg font-medium text-foreground">Provisioning workspace</h3>
                  <p className="text-sm text-muted-foreground">Setting up your isolated environment...</p>
                </div>
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mx-auto" />
                  <Skeleton className="h-4 w-4/6 mx-auto" />
                </div>
              </div>
            </CardContent>
          )}

          {step === 'success' && (
            <CardContent className="py-12 flex flex-col items-center justify-center space-y-6 text-center animate-in zoom-in duration-500">
              <div className="rounded-full bg-green-500/20 p-4">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Organization Created!</h3>
                <p className="text-muted-foreground mt-2">Redirecting you to your new dashboard...</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
