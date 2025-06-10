import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { SingleMaterialForm } from './SingleMaterialForm';
import { BatchUploadForm } from './BatchUploadForm';
import { ResultsView } from './ResultsView';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { AISettings, MaterialProcessingResponse } from '@/types';

export function ProcessingTabs() {
  const [activeTab, setActiveTab] = useState('single');
  const [processingResult, setProcessingResult] = useState<MaterialProcessingResponse | null>(null);
  const queryClient = useQueryClient();

  const { data: aiSettings, isLoading } = useQuery({
    queryKey: ['aiSettings'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/api/ai-settings/default');
      if (!response.ok) {
        throw new Error('Failed to fetch AI settings');
      }
      return response.json();
    },
  });

  const handleTabClick = (value: string) => {
    setActiveTab(value);
  };

  const handleProcessingComplete = (result: MaterialProcessingResponse) => {
    setProcessingResult(result);
    setActiveTab('results');
    // Invalidate materials query to trigger a refetch
    queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
        <Tabs defaultValue="single" value={activeTab} onValueChange={handleTabClick} className="w-full">
          <div className="border-b border-slate-200">
            <TabsList className="w-full justify-start p-0 bg-transparent">
              <TabsTrigger
                value="single"
                className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 px-6 py-3"
              >
                Single Material
              </TabsTrigger>
              <TabsTrigger
                value="batch"
                className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 px-6 py-3"
              >
                Batch Upload
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 px-6 py-3"
                disabled={!processingResult}
              >
                Results
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="p-6">
            <TabsContent value="single" className="mt-0">
              <SingleMaterialForm 
                aiSettings={aiSettings as AISettings}
                onProcessingComplete={handleProcessingComplete}
                isLoadingSettings={isLoading}
              />
            </TabsContent>
            <TabsContent value="batch" className="mt-0">
              <BatchUploadForm 
                aiSettings={aiSettings as AISettings}
                onProcessingComplete={handleProcessingComplete}
                isLoadingSettings={isLoading}
              />
            </TabsContent>
            <TabsContent value="results" className="mt-0">
              {processingResult && <ResultsView result={processingResult} />}
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </motion.div>
  );
}
