import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AISettings, LearningExample } from '@/types';
import { Label } from '@/components/ui/label';
import { Plus, Trash } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface LearningContextProps {
  aiSettings: AISettings;
  onChange: (field: string, value: any) => void;
}

export function LearningContext({ aiSettings, onChange }: LearningContextProps) {
  const [learningMode, setLearningMode] = useState(aiSettings.learningMode);
  const [additionalContext, setAdditionalContext] = useState(aiSettings.additionalContext || '');
  const [examples, setExamples] = useState<LearningExample[]>(aiSettings.examples || []);
  const [newExample, setNewExample] = useState<{ input: string; output: string }>({ input: '', output: '' });
  const [showAddExample, setShowAddExample] = useState(false);
  const { toast } = useToast();

  // Fetch all learning examples
  const { data: fetchedExamples } = useQuery<LearningExample[]>({
    queryKey: ['/api/learning-examples'],
    enabled: learningMode !== 'none',
    initialData: [] // Provide initial data to avoid undefined
  });

  useEffect(() => {
    if (fetchedExamples && fetchedExamples.length > 0 && learningMode !== 'none' && examples.length === 0) {
      setExamples(fetchedExamples);
      onChange('examples', fetchedExamples);
    }
  }, [fetchedExamples, learningMode]);

  const handleLearningModeChange = (value: string) => {
    setLearningMode(value as "none" | "one-shot" | "multi-shot");
    onChange('learningMode', value);
    
    if (value === 'none') {
      setExamples([]);
      onChange('examples', []);
    }
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalContext(e.target.value);
    onChange('additionalContext', e.target.value);
  };

  const handleAddExample = async () => {
    if (!newExample.input || !newExample.output) {
      toast({
        title: "Validation error",
        description: "Both input and output are required",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save to API
      const response = await apiRequest('POST', '/api/learning-examples', newExample);
      const savedExample = await response.json();
      
      // Update local state
      const updatedExamples = [...examples, savedExample];
      setExamples(updatedExamples);
      onChange('examples', updatedExamples);
      
      // Reset form
      setNewExample({ input: '', output: '' });
      setShowAddExample(false);
      
      toast({
        title: "Example added",
        description: "Learning example has been added successfully",
      });
    } catch (error) {
      console.error('Error adding example:', error);
      toast({
        title: "Failed to add example",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExample = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/learning-examples/${id}`);
      
      // Update local state
      const updatedExamples = examples.filter(example => example.id !== id);
      setExamples(updatedExamples);
      onChange('examples', updatedExamples);
      
      toast({
        title: "Example deleted",
        description: "Learning example has been removed",
      });
    } catch (error) {
      console.error('Error deleting example:', error);
      toast({
        title: "Failed to delete example",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h4 className="text-md font-medium text-gray-900 mb-2">Learning Context</h4>
      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-900 mb-1">Learning Mode</Label>
          <Select 
            value={learningMode}
            onValueChange={handleLearningModeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select learning mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Standard Processing</SelectItem>
              <SelectItem value="one-shot">One-Shot Learning</SelectItem>
              <SelectItem value="multi-shot">Multi-Shot Learning</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {learningMode !== 'none' && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="block text-sm font-medium text-gray-900">Example(s)</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-primary"
                onClick={() => setShowAddExample(!showAddExample)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Example
              </Button>
            </div>
            
            {showAddExample && (
              <div className="border border-gray-200 rounded-md p-3 mb-3">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">Input</Label>
                    <Textarea 
                      value={newExample.input} 
                      onChange={(e) => setNewExample(prev => ({ ...prev, input: e.target.value }))}
                      placeholder="E.g. AC Motor, 3-phase, 15kW" 
                      className="h-20"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">Output</Label>
                    <Textarea 
                      value={newExample.output} 
                      onChange={(e) => setNewExample(prev => ({ ...prev, output: e.target.value }))}
                      placeholder="E.g. MOTOR,AC,3-PH,15KW" 
                      className="h-20"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={handleAddExample}
                  >
                    Add Example
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {examples.length === 0 ? (
                <div className="text-sm text-gray-500 italic p-2 text-center border border-dashed border-gray-200 rounded-md">
                  No examples added yet
                </div>
              ) : (
                examples.map((example, index) => (
                  <div key={example.id || index} className="border border-gray-200 rounded-md p-2">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900">Example #{index + 1}</p>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <p className="text-xs text-gray-500">Input</p>
                            <p className="text-xs">{example.input}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Output</p>
                            <p className="text-xs">{example.output}</p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500 hover:text-red-500"
                        onClick={() => example.id && handleDeleteExample(example.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        <div>
          <Label className="block text-sm font-medium text-gray-900 mb-1">Additional Context</Label>
          <Textarea 
            rows={2} 
            placeholder="Add industry-specific or company-specific context"
            value={additionalContext}
            onChange={handleContextChange}
          />
        </div>
      </div>
    </div>
  );
}
