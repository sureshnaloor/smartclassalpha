import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Upload, FileText, Settings, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { AISettings } from '@/types';

interface TemplateFields {
  primary: string;
  secondary: string;
  tertiary: string;
  other: string;
}

interface Transformation {
  input: string;
  output: string;
}

interface StandardizationResult {
  type: 'standardized' | 'oversized' | 'uncleansed' | 'characteristic_notavailable';
  material: {
    originalDescription: string;
    standardDescription?: string;
    [key: string]: any;
  };
}

export default function MaterialStandardization() {
  const { toast } = useToast();
  
  const [templateFields, setTemplateFields] = useState<TemplateFields>({
    primary: '',
    secondary: '',
    tertiary: '',
    other: ''
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visibleResults, setVisibleResults] = useState<StandardizationResult[]>([]);
  const [results, setResults] = useState({
    standardized: [] as any[],
    oversized: [] as any[],
    uncleansed: [] as any[],
    characteristic_notavailable: [] as any[]
  });

  const [transformations, setTransformations] = useState<Transformation[]>([
    { 
      input: 'spiral wound gasket, 2 inch 300#, ss316',
      output: 'GASKET 2" 300# SW SS316'
    },
    { 
      input: '2 inch class 300 spiral wound ss316 gasket',
      output: 'GASKET 2" 300# SW SS316'
    }
  ]);

  // Fetch AI settings
  const { data: aiSettings, isLoading: aiSettingsLoading } = useQuery<AISettings>({
    queryKey: ['aiSettings'],
    queryFn: async () => {
      const response = await fetch('/api/ai-settings/default');
      if (!response.ok) {
        throw new Error('Failed to fetch AI settings');
      }
      return response.json();
    },
  });

  const addTransformation = () => {
    setTransformations([...transformations, { input: '', output: '' }]);
  };

  const updateTransformation = (index: number, field: keyof Transformation, value: string) => {
    const newTransformations = transformations.map((t, i) => {
      if (i === index) {
        return { ...t, [field]: value };
      }
      return t;
    });
    setTransformations(newTransformations);
  };

  const removeTransformation = (index: number) => {
    if (transformations.length > 2) {
      setTransformations(transformations.filter((_, i) => i !== index));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a valid CSV file",
        variant: "destructive",
      });
    }
  };

  const handleProcess = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a CSV file first",
        variant: "destructive",
      });
      return;
    }

    if (!aiSettings) {
      toast({
        title: "AI settings not available",
        description: "Please wait for AI settings to load",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setVisibleResults([]);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('templateFields', JSON.stringify(templateFields));
      formData.append('transformations', JSON.stringify(transformations));
      formData.append('aiSettings', JSON.stringify(aiSettings));

      const response = await fetch('/api/standardize-materials', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process materials');
      }

      const result = await response.json();
      
      setResults(result.results);
      setVisibleResults(result.visibleResults || []);
      setProgress(100);

      toast({
        title: "Processing complete",
        description: `Processed ${result.total} materials successfully`,
      });

      // Download CSV files
      console.log('Processing results:', result.results);
      console.log('Template fields:', templateFields);
      
      Object.entries(result.results).forEach(([type, data]: [string, any]) => {
        if (data.length > 0) {
          const csv = convertToCSV(data);
          const filename = `${templateFields.primary ? templateFields.primary.slice(0, 6) : 'MATERIAL'}_${type}_materials.csv`;
          console.log(`Downloading ${type} CSV with ${data.length} items:`, filename);
          downloadCSV(csv, filename);
        }
      });

    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An error occurred during processing",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          JSON.stringify(row[header] || '')
        ).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  const downloadCSV = (csv: string, filename: string) => {
    console.log('Downloading CSV:', filename, 'Content length:', csv.length);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    console.log('Download initiated for:', filename);
  };

  if (aiSettingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
            <Settings className="h-8 w-8 text-indigo-600" />
            Material Description Standardization
          </h1>
          <p className="text-slate-500 mt-2">Standardize material descriptions using AI templates</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Configuration */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Template Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary">Primary Characteristic</Label>
                  <Textarea
                    id="primary"
                    value={templateFields.primary}
                    onChange={(e) => setTemplateFields(prev => ({...prev, primary: e.target.value}))}
                    placeholder="e.g., GASKET, SEAL, O-RING"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary">Secondary Characteristic</Label>
                  <Textarea
                    id="secondary"
                    value={templateFields.secondary}
                    onChange={(e) => setTemplateFields(prev => ({...prev, secondary: e.target.value}))}
                    placeholder="e.g., 2 INCH 300#, 3 INCH 600#"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tertiary">Tertiary Characteristic</Label>
                  <Textarea
                    id="tertiary"
                    value={templateFields.tertiary}
                    onChange={(e) => setTemplateFields(prev => ({...prev, tertiary: e.target.value}))}
                    placeholder="e.g., SPIRAL WOUND SS316, SW SS304"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="other">Other Specifications</Label>
                  <Textarea
                    id="other"
                    value={templateFields.other}
                    onChange={(e) => setTemplateFields(prev => ({...prev, other: e.target.value}))}
                    placeholder="e.g., RING JOINT, RTJ"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example Transformations */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-600" />
                Example Transformations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {transformations.map((transformation, index) => (
                <div key={index} className="space-y-2 p-3 border border-slate-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <Label>Input Example</Label>
                      <Textarea
                        value={transformation.input}
                        onChange={(e) => updateTransformation(index, 'input', e.target.value)}
                        placeholder="e.g., spiral wound gasket, 2 inch 300#, ss316"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Output Example</Label>
                      <Textarea
                        value={transformation.output}
                        onChange={(e) => updateTransformation(index, 'output', e.target.value)}
                        placeholder="e.g., GASKET 2&quot; 300# SW SS316"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeTransformation(index)}
                      disabled={transformations.length <= 2}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button onClick={addTransformation} variant="outline" className="w-full">
                Add Example
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* File Upload */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-indigo-600" />
              Upload Materials File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600">Click to upload CSV file</p>
                  <p className="text-sm text-slate-400">or drag and drop</p>
                </label>
                {uploadedFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {uploadedFile.name} uploaded
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Process Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleProcess}
            disabled={isProcessing || !uploadedFile}
            size="lg"
            className="px-8"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Process Materials
              </>
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing materials...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {visibleResults.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Processing Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Original Description</TableHead>
                    <TableHead>Standardized Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant={
                          result.type === 'standardized' ? 'default' :
                          result.type === 'oversized' ? 'secondary' :
                          result.type === 'uncleansed' ? 'destructive' :
                          'outline'
                        }>
                          {result.type === 'characteristic_notavailable' 
                            ? 'Primary Char Not Available'
                            : result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{result.material.originalDescription}</TableCell>
                      <TableCell>{result.material.standardDescription || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {Object.entries(results).some(([_, materials]) => materials.length > 0) && (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Processing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(results).map(([type, materials]) => (
                  materials.length > 0 && (
                    <div key={type} className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">{materials.length}</div>
                      <div className="text-sm text-slate-600">
                        {type === 'characteristic_notavailable' 
                          ? 'Missing Primary Characteristic'
                          : type.charAt(0).toUpperCase() + type.slice(1)}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 