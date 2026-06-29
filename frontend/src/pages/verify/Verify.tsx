import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, HelpCircle, Upload, Loader2 } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ProductDetails {
  serial_number: string;
  product_name: string;
  manufacturing_date: string;
  batch_name: string;
}

interface VerificationResponse {
  session_id: string;
  outcome: 'authentic' | 'counterfeit' | 'uncertain';
  confidence_score: number;
  explanation: string;
  product_details: ProductDetails | null;
}

export function Verify() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError(null);
    }
  };

  const handleVerify = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${API_URL}/api/v1/verifications/verify`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Verification failed. Please try again.');
      }
      
      const data: VerificationResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Verify Product Authenticity</h1>
          <p className="mt-2 text-lg text-gray-600">
            Upload an image of the product's packaging to verify its authenticity.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Select a clear image of the product packaging.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="image">Product Image</Label>
              <div className="flex items-center gap-4">
                <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
                <Button onClick={handleVerify} disabled={!file || loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  Verify
                </Button>
              </div>
            </div>

            {preview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                <img src={preview} alt="Preview" className="max-w-xs rounded-lg shadow-sm border border-gray-200" />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <div className="mt-8 space-y-4">
                <Alert
                  variant={result.outcome === 'authentic' ? 'default' : 'destructive'}
                  className={
                    result.outcome === 'authentic' 
                      ? 'border-green-500 bg-green-50 text-green-900' 
                      : result.outcome === 'uncertain'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-900'
                      : ''
                  }
                >
                  {result.outcome === 'authentic' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                  {result.outcome === 'counterfeit' && <AlertCircle className="h-4 w-4" />}
                  {result.outcome === 'uncertain' && <HelpCircle className="h-4 w-4 text-yellow-600" />}
                  <AlertTitle className="capitalize font-bold text-lg mb-2">
                    {result.outcome} {result.outcome === 'uncertain' && `(Confidence: ${result.confidence_score.toFixed(0)}%)`}
                  </AlertTitle>
                  <AlertDescription className="text-base">{result.explanation}</AlertDescription>
                </Alert>

                {result.product_details && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Product Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Product Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{result.product_details.product_name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Serial Number</dt>
                          <dd className="mt-1 text-sm text-gray-900">{result.product_details.serial_number}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Manufacturing Date</dt>
                          <dd className="mt-1 text-sm text-gray-900">{new Date(result.product_details.manufacturing_date).toLocaleDateString()}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Batch Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{result.product_details.batch_name}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
