import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';

export function PasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-3 rounded-2xl backdrop-blur-xl border border-primary/20 mb-4 shadow-sm">
            <Shield className="w-10 h-10 text-primary" />
          </div>
        </div>

        <Card className="shadow-lg relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Reset password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="m@example.com" 
                    required 
                    className="transition-all duration-300"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full transition-all duration-300 shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending link..." : "Send reset link"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-muted-foreground">
                  Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Link to="/login" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
