import { useState, useEffect } from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, MoreHorizontal, UserPlus, Settings2 } from 'lucide-react';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AppInvite {
  id: string;
  email: string;
  role: string;
  status: string;
}

export function OrganizationSettings() {
  const { currentOrganization } = useOrganization();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('site_manager');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [invites, setInvites] = useState<AppInvite[]>([]);
  const [error, setError] = useState('');

  const loadData = async () => {
    if (!currentOrganization) return;
    try {
      const [usersRes, invitesRes] = await Promise.all([
        api.get(`/api/v1/organizations/${currentOrganization.id}/users`, { headers: { 'x-organization-id': currentOrganization.id } }),
        api.get('/api/v1/invitations/', { headers: { 'x-organization-id': currentOrganization.id } })
      ]);
      setUsers(usersRes.data);
      setInvites(invitesRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentOrganization]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/v1/invitations/', {
        email: inviteEmail,
        role: inviteRole
      }, {
        headers: { 'x-organization-id': currentOrganization?.id }
      });
      setIsInviteOpen(false);
      setInviteEmail('');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send invite');
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      await api.delete(`/api/v1/invitations/${inviteId}`, {
        headers: { 'x-organization-id': currentOrganization?.id }
      });
      loadData();
    } catch (err) {
      console.error('Failed to revoke invite', err);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      await api.delete(`/api/v1/organizations/${currentOrganization?.id}/users/${userId}`, {
        headers: { 'x-organization-id': currentOrganization?.id }
      });
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to remove user');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users & Invites</h1>
          <p className="text-muted-foreground mt-1">
            Manage who has access to {currentOrganization?.name || 'your organization'}
          </p>
        </div>
        
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite a new user</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4 pt-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@example.com" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select 
                  id="role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="admin">Administrator</option>
                  <option value="site_manager">Site Manager</option>
                  <option value="auditor">Auditor</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="submit">Send Invitation</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Active Users</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="pl-6 font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-primary/10 text-primary">
                        {user.role.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {invites.length > 0 ? (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="pl-6">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((invite) => (
                    <TableRow key={invite.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="pl-6">{invite.email}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-muted text-muted-foreground border border-border">
                          {invite.role.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => handleRevokeInvite(invite.id)}
                        >
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Mail className="w-12 h-12 mb-4 opacity-20" />
                <p>No pending invitations</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
