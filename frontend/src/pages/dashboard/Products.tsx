import { useState, useEffect } from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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

export function Products() {
  const { currentOrganization } = useOrganization();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadBatches = async () => {
      if (!currentOrganization) return;
      try {
        const res = await api.get('/api/v1/batches/', {
          headers: { 'x-organization-id': currentOrganization.id }
        });
        setBatches(res.data);
      } catch (err) {
        console.error('Failed to fetch batches', err);
      }
    };
    loadBatches();
  }, [currentOrganization]);

  const filteredBatches = batches.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products Registry</h1>
          <p className="text-muted-foreground mt-1">
            Global view of all generated product batches across your organization
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search batches..." 
            className="pl-8" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Package className="w-5 h-5 mr-2 text-primary" />
            All Batches
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6">Batch Name</TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Prod. Date</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.map((batch) => (
                <TableRow key={batch.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium pl-6">
                    {batch.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {batch.id}
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
                </TableRow>
              ))}
              {filteredBatches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No batches found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
