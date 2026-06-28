import { useState, useEffect } from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Plus, Settings2, Factory } from 'lucide-react';

interface AppSite {
  id: string;
  name: string;
  description: string;
  status: string;
}

export function Sites() {
  const { currentOrganization } = useOrganization();
  const [sites, setSites] = useState<AppSite[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteDesc, setNewSiteDesc] = useState('');
  const [error, setError] = useState('');

  const loadSites = async () => {
    if (!currentOrganization) return;
    try {
      const res = await api.get('/api/v1/sites/', {
        headers: { 'x-organization-id': currentOrganization.id }
      });
      setSites(res.data);
    } catch (err) {
      console.error('Failed to fetch sites', err);
    }
  };

  useEffect(() => {
    loadSites();
  }, [currentOrganization]);

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/v1/sites/', {
        name: newSiteName,
        description: newSiteDesc
      }, {
        headers: { 'x-organization-id': currentOrganization?.id }
      });
      setIsAddOpen(false);
      setNewSiteName('');
      setNewSiteDesc('');
      loadSites();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create site');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground mt-1">
            Manage physical locations and facilities for {currentOrganization?.name || 'your organization'}
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Site
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Site</DialogTitle>
              <DialogDescription>Create a new physical location for your organization.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSite} className="space-y-4 pt-4">
              {error && <div className="text-destructive text-sm font-medium">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="name">Site Name</Label>
                <Input id="name" value={newSiteName} onChange={e => setNewSiteName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description / Location</Label>
                <Input id="desc" value={newSiteDesc} onChange={e => setNewSiteDesc(e.target.value)} required />
              </div>
              <DialogFooter>
                <Button type="submit">Create Site</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            Registered Sites
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6">Site Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="pl-6 font-medium">
                    <div className="flex items-center">
                      <Factory className="w-4 h-4 mr-2 text-muted-foreground" />
                      {site.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{site.description}</TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">General</span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-muted text-muted-foreground border border-border">
                      <span className="text-green-600 dark:text-green-400 font-medium capitalize">{site.status}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Settings2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
