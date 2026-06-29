import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { API_URL } from '@/lib/api';

interface VerificationHistoryItem {
  id: string;
  session_id: string;
  timestamp: string;
  image_url: string;
  outcome: 'authentic' | 'counterfeit' | 'uncertain';
  confidence_score: number;
  explanation: string;
}

export function VerificationHistory() {
  const [history, setHistory] = useState<VerificationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/verifications/verifications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch verification history', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.outcome === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Verification History</h2>
          <p className="text-muted-foreground">
            View and monitor all product verification events.
          </p>
        </div>
        <a href="/dashboard/verify" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Verify Product
        </a>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Recent Verifications</CardTitle>
            <CardDescription>A list of all verification attempts.</CardDescription>
          </div>
          <div className="w-[180px]">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outcomes</SelectItem>
                <SelectItem value="authentic">Authentic</SelectItem>
                <SelectItem value="counterfeit">Counterfeit</SelectItem>
                <SelectItem value="uncertain">Uncertain</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Session ID</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Explanation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">Loading...</TableCell>
                </TableRow>
              ) : filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">No verification events found.</TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-500">
                      {item.session_id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        item.outcome === 'authentic' ? 'default' : 
                        item.outcome === 'uncertain' ? 'secondary' : 'destructive'
                      } className={item.outcome === 'authentic' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                                   item.outcome === 'uncertain' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : ''}>
                        {item.outcome}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.confidence_score.toFixed(0)}%</TableCell>
                    <TableCell className="text-sm max-w-[300px] truncate" title={item.explanation}>
                      {item.explanation}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
