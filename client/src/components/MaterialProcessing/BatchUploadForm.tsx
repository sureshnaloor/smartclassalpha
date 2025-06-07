import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { AISettings, MaterialProcessingResponse } from '@/types';
import { Loader2, UploadCloud, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BatchUploadFormProps {
  aiSettings?: AISettings;
  onProcessingComplete: (result: MaterialProcessingResponse) => void;
  isLoadingSettings: boolean;
}

export function BatchUploadForm({ aiSettings, onProcessingComplete, isLoadingSettings }: BatchUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    total: number;
    successful: number;
    failed: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Validate file type (only CSV allowed)
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type",
          description: "Only CSV files are supported",
          variant: "destructive",
        });
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!aiSettings) {
      toast({
        title: "Error",
        description: "AI settings not loaded. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Create a progress simulation (since we can't directly track server-side progress)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add AI settings to the formData
      formData.append('temperature', aiSettings.temperature);
      formData.append('topP', aiSettings.topP);
      formData.append('topK', aiSettings.topK);
      formData.append('learningMode', aiSettings.learningMode);
      formData.append('additionalContext', aiSettings.additionalContext || '');
      formData.append('erpSystem', aiSettings.erpSystem);
      formData.append('shortDescLimit', aiSettings.shortDescLimit.toString());
      formData.append('longDescLimit', aiSettings.longDescLimit.toString());
      formData.append('enableAdvancedML', (aiSettings.enableAdvancedML || false).toString());

      if (aiSettings.examples && aiSettings.examples.length > 0) {
        formData.append('examples', JSON.stringify(aiSettings.examples));
      }

      const response = await fetch('/api/process-batch', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      
      setUploadResult({
        success: true,
        total: result.total,
        successful: result.successful,
        failed: result.failed,
      });

      toast({
        title: "Upload complete",
        description: `Successfully processed ${result.successful} out of ${result.total} materials`,
      });

      // If there's at least one successful result, show the first one
      if (result.results && result.results.length > 0) {
        onProcessingComplete(result.results[0]);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      
      setUploadResult({
        success: false,
        total: 0,
        successful: 0,
        failed: 0,
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Batch Material Upload</h3>
        <p className="text-gray-500 text-sm">Upload a CSV file with multiple materials to process in batch</p>
      </div>
      
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="mb-4">
            <UploadCloud className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900">Upload CSV File</h4>
            <p className="text-xs text-gray-500 mt-1">CSV file must include columns for material name, type, description, and classification</p>
          </div>
          
          <Input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            id="csv-upload"
          />
          
          <div className="flex flex-col items-center justify-center gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById('csv-upload')?.click()}
              disabled={isUploading}
              className="w-full md:w-auto"
            >
              <FileText className="mr-2 h-4 w-4" />
              Select CSV File
            </Button>
            
            {file && (
              <div className="text-sm text-gray-700 mt-2">
                Selected file: <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>
        </div>
        
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Uploading and processing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        {uploadResult && (
          <Alert variant={uploadResult.success ? "default" : "destructive"}>
            <div className="flex items-start">
              {uploadResult.success ? (
                <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              )}
              <div>
                <AlertTitle>
                  {uploadResult.success ? "Upload Successful" : "Upload Failed"}
                </AlertTitle>
                <AlertDescription>
                  {uploadResult.success ? (
                    <>
                      Processed {uploadResult.total} materials:
                      <ul className="list-disc list-inside mt-1 ml-1">
                        <li>{uploadResult.successful} successful</li>
                        {uploadResult.failed > 0 && (
                          <li className="text-red-500">{uploadResult.failed} failed</li>
                        )}
                      </ul>
                    </>
                  ) : (
                    "Failed to process the CSV file. Please check the file format and try again."
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}
        
        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setFile(null);
              setUploadResult(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            disabled={isUploading}
          >
            Clear
          </Button>
          <Button 
            type="button" 
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Process Batch'
            )}
          </Button>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-md font-medium text-gray-900 mb-4">CSV Template Format</h3>
        <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">materialName*</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">materialType*</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">materialId</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">basicDescription*</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">technicalSpecs</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">manufacturer</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">modelNumber</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">primaryGroup*</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">secondaryGroup</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">tertiaryGroup</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="px-3 py-2 border-b border-gray-200">AC Motor</td>
                <td className="px-3 py-2 border-b border-gray-200">spare</td>
                <td className="px-3 py-2 border-b border-gray-200">10001</td>
                <td className="px-3 py-2 border-b border-gray-200">3-phase, 15kW, 400V, IP55, foot-mounted</td>
                <td className="px-3 py-2 border-b border-gray-200">50Hz, Class F insulation</td>
                <td className="px-3 py-2 border-b border-gray-200">ABB</td>
                <td className="px-3 py-2 border-b border-gray-200">M3BP160MLA4</td>
                <td className="px-3 py-2 border-b border-gray-200">electrical</td>
                <td className="px-3 py-2 border-b border-gray-200">motor</td>
                <td className="px-3 py-2 border-b border-gray-200">ac_motor</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">* Required fields</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => {
            // Create a CSV template string
            const templateHeader = "materialName,materialType,materialId,basicDescription,technicalSpecs,manufacturer,modelNumber,primaryGroup,secondaryGroup,tertiaryGroup";
            const templateRow = "AC Motor,spare,10001,\"3-phase, 15kW, 400V, IP55, foot-mounted\",\"50Hz, Class F insulation\",ABB,M3BP160MLA4,electrical,motor,ac_motor";
            const csvContent = `${templateHeader}\n${templateRow}`;
            
            // Create a blob and download link
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'material_template.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        >
          Download Template
        </Button>
      </div>
    </div>
  );
}
