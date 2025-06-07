import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MaterialProcessingResponse, Specification } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Edit, FileDown, Save } from 'lucide-react';
import { MLClassificationResult } from './MLClassificationResult';

interface ResultsViewProps {
  result: MaterialProcessingResponse;
}

export function ResultsView({ result }: ResultsViewProps) {
  const { toast } = useToast();
  const { material, processingResult } = result;

  const handleExport = () => {
    try {
      // Create a JSON string of the result
      const jsonString = JSON.stringify(result, null, 2);
      
      // Create a blob and download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `material_${material.id}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Material data has been exported as JSON",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: "Failed to export material data",
        variant: "destructive",
      });
    }
  };

  const handleSaveToCatalog = () => {
    // This would typically save to a database
    toast({
      title: "Saved to catalog",
      description: "Material has been saved to your catalog",
    });
  };

  // Helper function to format classifications for display
  const formatClassification = (group: string) => {
    return group
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Processing Result</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              Processed successfully
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Material Information</h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Material ID</p>
              <p className="text-sm font-mono">
                {material.materialId || material.id.toString().padStart(10, '0')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Short Description ({processingResult.shortDescription.length} char)</p>
              <p className="text-sm font-mono">
                {processingResult.shortDescription}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Classification</p>
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {formatClassification(processingResult.classificationGroups.primaryGroup)}
                </span>
                {processingResult.classificationGroups.secondaryGroup && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {formatClassification(processingResult.classificationGroups.secondaryGroup)}
                  </span>
                )}
                {processingResult.classificationGroups.tertiaryGroup && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {formatClassification(processingResult.classificationGroups.tertiaryGroup)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Long Description</h4>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm font-mono">
              {processingResult.longDescription}
            </p>
          </div>
        </div>
      </div>
      
      {processingResult.specifications && processingResult.specifications.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Technical Specifications</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Attribute</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {processingResult.specifications.map((spec: Specification, index: number) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-sm">{spec.attribute}</td>
                    <td className="px-3 py-2 text-sm">{spec.value}</td>
                    <td className="px-3 py-2 text-sm">{spec.unit || '-'}</td>
                    <td className="px-3 py-2 text-sm">{spec.standard || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* ML Classification Results (if available) */}
      {processingResult.mlClassification && (
        <MLClassificationResult 
          mlClassification={processingResult.mlClassification}
          currentClassification={processingResult.classificationGroups}
        />
      )}
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="outline" size="sm" className="flex items-center">
          <Edit className="mr-1 h-4 w-4" />
          Edit Result
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center"
          onClick={handleExport}
        >
          <FileDown className="mr-1 h-4 w-4" />
          Export
        </Button>
        <Button 
          className="flex items-center"
          size="sm"
          onClick={handleSaveToCatalog}
        >
          <Save className="mr-1 h-4 w-4" />
          Save to Catalog
        </Button>
      </div>
    </div>
  );
}
