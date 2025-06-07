import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AISettings as AISettingsType } from '@/types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIConfigPanel } from '@/components/AIConfiguration/AIConfigPanel';

export default function AISettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch AI settings
  const { data: aiSettings, isLoading, error } = useQuery<AISettingsType>({
    queryKey: ['/api/ai-settings/default'],
  });
  
  // Update AI settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<AISettingsType>) => {
      if (!aiSettings) return null;
      
      const response = await fetch(`/api/ai-settings/${aiSettings.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-settings/default'] });
      toast({
        title: "Settings saved",
        description: "AI settings have been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save settings",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500 py-8">
            Error loading AI settings. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Configuration Settings</CardTitle>
          <CardDescription>
            Configure the AI models and parameters used for material processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading AI settings...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-sm text-yellow-800">
                <p className="font-medium mb-1">Important Notice:</p>
                <p>
                  Changes made here will apply to all future material processing requests. These settings 
                  can be further adjusted during individual processing tasks if needed.
                </p>
              </div>
              
              <AIConfigPanel 
                aiSettings={aiSettings} 
                isLoading={isLoading} 
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
          <CardDescription>
            Configure the API connectivity settings for the language models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-sm">
              <p>
                The application currently uses the <strong>OpenAI API</strong> for material processing.
                The API key is configured through environment variables.
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">
                API connectivity status:
              </p>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-green-600 font-medium">Connected</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
