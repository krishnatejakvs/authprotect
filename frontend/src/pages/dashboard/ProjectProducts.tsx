import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useOrganization } from '@/contexts/OrganizationContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, RefreshCw, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Batch {
  id: string;
  name: string;
  project_id: string;
  site_id: string;
  quantity: number;
  status: string;
  created_at: string;
  production_date?: string;
}

interface Site {
  id: string;
  name: string;
}

export function ProjectProducts() {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentOrganization } = useOrganization();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSiteId, setNewSiteId] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newProductionDate, setNewProductionDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [batchDetails, setBatchDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const loadData = async () => {
    if (!currentOrganization || !projectId) return;
    try {
      setIsRefreshing(true);
      const [batchesRes, sitesRes] = await Promise.all([
        api.get(`/api/v1/batches/project/${projectId}`, {
          headers: { 'x-organization-id': currentOrganization.id }
        }),
        api.get(`/api/v1/sites/`, {
          headers: { 'x-organization-id': currentOrganization.id }
        })
      ]);
      setBatches(batchesRes.data);
      setSites(sitesRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!selectedBatchId) {
      setBatchDetails(null);
      return;
    }
    const loadDetails = async () => {
      setIsLoadingDetails(true);
      try {
        const res = await api.get(`/api/v1/batches/${selectedBatchId}`, {
          headers: { 'x-organization-id': currentOrganization?.id }
        });
        setBatchDetails(res.data);
      } catch (err) {
        console.error('Failed to fetch batch details', err);
      } finally {
        setIsLoadingDetails(false);
      }
    };
    loadDetails();
  }, [selectedBatchId, currentOrganization]);

  useEffect(() => {
    loadData();
    // Poll every 10 seconds for updates
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [currentOrganization, projectId]);

  const handleGenerateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/api/v1/batches/', {
        name: newName,
        project_id: projectId,
        site_id: newSiteId,
        quantity: parseInt(newQuantity),
        production_date: newProductionDate ? new Date(newProductionDate).toISOString() : null
      }, {
        headers: { 'x-organization-id': currentOrganization?.id }
      });
      
      setIsAddOpen(false);
      setNewName('');
      setNewSiteId('');
      setNewProductionDate('');
      setNewQuantity('');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage product batches and generate authenticated identities
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={loadData} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Generate Batch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Product Batch</DialogTitle>
                <DialogDescription>Create a new batch of authenticated products for this project.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGenerateBatch} className="space-y-4 pt-4">
                {error && <div className="text-destructive text-sm font-medium">{error}</div>}
                <div className="space-y-2">
                  <Label htmlFor="name">Batch Name</Label>
                  <Input id="name" value={newName} onChange={e => setNewName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site">Linked Site</Label>
                  <Select value={newSiteId} onValueChange={setNewSiteId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map(site => (
                        <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="production_date">Production Date</Label>
                  <Input id="production_date" type="date" value={newProductionDate} onChange={e => setNewProductionDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" min="1" max="100000" value={newQuantity} onChange={e => setNewQuantity(e.target.value)} required />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Generate
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Package className="w-5 h-5 mr-2 text-primary" />
            Generated Batches
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6">Batch Name</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Prod. Date</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium pl-6">
                    {batch.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {sites.find(s => s.id === batch.site_id)?.name || batch.site_id}
                  </TableCell>
                  <TableCell>
                    {batch.quantity}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {batch.production_date ? new Date(batch.production_date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(batch.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center text-sm ${
                      batch.status === 'COMPLETED' ? 'text-green-500' :
                      batch.status === 'FAILED' ? 'text-red-500' :
                      'text-blue-500'
                    }`}>
                      <span className="capitalize">{batch.status.toLowerCase()}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedBatchId(batch.id)}>
                      View Products
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {batches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No batches generated yet. Click "Generate Batch" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedBatchId} onOpenChange={(open) => !open && setSelectedBatchId(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Batch Products</DialogTitle>
            <DialogDescription>
              View generated product identities and authentication images for this batch.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {isLoadingDetails ? (
              <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
            ) : batchDetails ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial</TableHead>
                    <TableHead>Identity ID</TableHead>
                    <TableHead>Token Hash (Embedded)</TableHead>
                    <TableHead>Image</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchDetails.identities?.map((identity: any) => (
                    <TableRow key={identity.id}>
                      <TableCell className="font-medium">{identity.serial_number}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">{identity.id}</TableCell>
                      <TableCell className="font-mono text-xs text-primary">
                        {identity.authentication_token?.token_hash || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {identity.authentication_token?.image_url ? (
                          <a href={`http://localhost:8000${identity.authentication_token.image_url}`} target="_blank" rel="noreferrer">
                            <img 
                              src={`http://localhost:8000${identity.authentication_token.image_url}`} 
                              alt={`Product ${identity.serial_number}`} 
                              className="w-12 h-12 object-cover rounded border hover:scale-150 transition-transform cursor-pointer"
                            />
                          </a>
                        ) : 'Processing...'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!batchDetails.identities || batchDetails.identities.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No products generated yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-8 text-muted-foreground">Failed to load details</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
