import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrganization } from '@/contexts/OrganizationContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FolderKanban, Plus, Settings2, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AppProject {
  id: string;
  name: string;
  description: string;
  status: string;
  cover_image_url: string | null;
}

export function Projects() {
  const { currentOrganization } = useOrganization();
  const [projects, setProjects] = useState<AppProject[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCover, setNewCover] = useState<File | null>(null);
  const [error, setError] = useState('');

  const loadProjects = async () => {
    if (!currentOrganization) return;
    try {
      const res = await api.get('/api/v1/projects/', {
        headers: { 'x-organization-id': currentOrganization.id }
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [currentOrganization]);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/v1/projects/', {
        name: newName,
        description: newDesc
      }, {
        headers: { 'x-organization-id': currentOrganization?.id }
      });
      
      const newProject = res.data;

      if (newCover) {
        const formData = new FormData();
        formData.append('file', newCover);
        await api.post(`/api/v1/projects/${newProject.id}/cover`, formData, {
          headers: { 
            'x-organization-id': currentOrganization?.id,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setIsAddOpen(false);
      setNewName('');
      setNewDesc('');
      setNewCover(null);
      loadProjects();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create project');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product lines and authentication batches for {currentOrganization?.name || 'your organization'}
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Setup a new project to start creating authenticated packaging.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProject} className="space-y-4 pt-4">
              {error && <div className="text-destructive text-sm font-medium">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" value={newName} onChange={e => setNewName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Input id="desc" value={newDesc} onChange={e => setNewDesc(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image (Optional)</Label>
                <Input id="cover" type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setNewCover(e.target.files?.[0] || null)} />
              </div>
              <DialogFooter>
                <Button type="submit">Create Project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FolderKanban className="w-5 h-5 mr-2 text-primary" />
            Active Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6 w-20">Cover</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="pl-6">
                    {project.cover_image_url ? (
                      <img src={`http://localhost:8000${project.cover_image_url}`} alt={project.name} className="w-10 h-10 object-cover rounded-md border border-border" />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center border border-border">
                        <FolderKanban className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {project.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.description}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center text-sm">
                      {project.status === 'active' ? (
                        <ShieldCheck className="w-4 h-4 mr-1 text-green-500" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-1 text-blue-500" />
                      )}
                      <span className="capitalize">{project.status}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6 space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/dashboard/projects/${project.id}/products`}>Products</Link>
                    </Button>
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
