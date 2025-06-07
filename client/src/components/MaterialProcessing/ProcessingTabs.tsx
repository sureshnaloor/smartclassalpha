import { useState } from 'react';
import { SingleMaterialForm } from './SingleMaterialForm';
import { BatchUploadForm } from './BatchUploadForm';
import { ResultsView } from './ResultsView';
import { AIConfigPanel } from '../AIConfiguration/AIConfigPanel';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AISettings, MaterialProcessingResponse } from '@/types';

export function ProcessingTabs() {
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'results'>('single');
  const [processingResult, setProcessingResult] = useState<MaterialProcessingResponse | null>(null);
  const queryClient = useQueryClient();

  // Fetch default AI settings
  const { data: aiSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['/api/ai-settings/default'],
  });

  const handleTabClick = (tab: 'single' | 'batch' | 'results') => {
    setActiveTab(tab);
  };

  const handleProcessingComplete = (result: MaterialProcessingResponse) => {
    setProcessingResult(result);
    setActiveTab('results');
    // Invalidate materials query to trigger a refetch
    queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button 
              className={`px-6 py-3 border-b-2 ${activeTab === 'single' ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              onClick={() => handleTabClick('single')}
            >
              Single Material
            </button>
            <button 
              className={`px-6 py-3 border-b-2 ${activeTab === 'batch' ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              onClick={() => handleTabClick('batch')}
            >
              Batch Upload (CSV)
            </button>
            <button 
              className={`px-6 py-3 border-b-2 ${activeTab === 'results' ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              onClick={() => handleTabClick('results')}
              disabled={!processingResult}
            >
              Results
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'single' && (
            <SingleMaterialForm 
              aiSettings={aiSettings as AISettings} 
              onProcessingComplete={handleProcessingComplete}
              isLoadingSettings={isLoadingSettings}
            />
          )}
          
          {activeTab === 'batch' && (
            <BatchUploadForm 
              aiSettings={aiSettings as AISettings}
              onProcessingComplete={handleProcessingComplete}
              isLoadingSettings={isLoadingSettings}
            />
          )}
          
          {activeTab === 'results' && processingResult && (
            <ResultsView result={processingResult} />
          )}
        </div>
      </div>
      
      {(activeTab === 'single' || activeTab === 'batch') && (
        <AIConfigPanel aiSettings={aiSettings as AISettings} isLoading={isLoadingSettings} />
      )}
    </>
  );
}
