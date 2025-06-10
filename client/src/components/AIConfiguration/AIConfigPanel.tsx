import { useState } from 'react';
import { ModelSettings } from './ModelSettings';
import { ParameterSliders } from './ParameterSliders';
import { OutputFormat } from './OutputFormat';
import { LearningContext } from './LearningContext';
import { MLEnhancement } from './MLEnhancement';
import { AISettings } from '@/types';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, Loader2, Save } from 'lucide-react';

interface AIConfigPanelProps {
  aiSettings?: AISettings;
  isLoading: boolean;
}

export function AIConfigPanel({ aiSettings, isLoading }: AIConfigPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formValues, setFormValues] = useState<Partial<AISettings>>({});
  const { toast } = useToast();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    if (!aiSettings) return;
    
    try {
      setIsSaving(true);
      
      // Only include changed values
      const updatedSettings = { ...formValues };
      
      await apiRequest('PUT', `/api/ai-settings/${aiSettings.id}`, updatedSettings);
      
      toast({
        title: "Settings saved",
        description: "AI configuration has been updated successfully",
      });
    } catch (error) {
      console.error('Error saving AI settings:', error);
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-slate-800">AI Processing Configuration</h3>
        </div>
        <div className="p-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-slate-600">Loading AI configuration...</span>
        </div>
      </div>
    );
  }

  if (!aiSettings) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
        <h3 className="text-lg font-medium text-slate-800">AI Processing Configuration</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={toggleExpanded}
          className="text-slate-500 hover:text-slate-700"
        >
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-slate-50/80 p-4 rounded-lg border border-slate-200">
                <ModelSettings 
                  aiSettings={aiSettings} 
                  onChange={handleFormChange} 
                />
              </div>
              
              <div className="bg-slate-50/80 p-4 rounded-lg border border-slate-200">
                <ParameterSliders 
                  aiSettings={aiSettings} 
                  onChange={handleFormChange} 
                />
              </div>
              
              <div className="bg-slate-50/80 p-4 rounded-lg border border-slate-200">
                <MLEnhancement
                  aiSettings={aiSettings}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-slate-50/80 p-4 rounded-lg border border-slate-200">
                <OutputFormat 
                  aiSettings={aiSettings} 
                  onChange={handleFormChange} 
                />
              </div>
              
              <div className="bg-slate-50/80 p-4 rounded-lg border border-slate-200">
                <LearningContext 
                  aiSettings={aiSettings} 
                  onChange={handleFormChange} 
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <Button 
              onClick={handleSaveSettings}
              disabled={isSaving || Object.keys(formValues).length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
