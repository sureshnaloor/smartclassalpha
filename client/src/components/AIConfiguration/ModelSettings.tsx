import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AISettings } from '@/types';
import { Label } from '@/components/ui/label';
import { Brain, Sparkles } from 'lucide-react';

interface ModelSettingsProps {
  aiSettings: AISettings;
  onChange: (field: string, value: string) => void;
}

type ProviderOption = {
  value: string;
  label: string;
};

const providers: ProviderOption[] = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'cohere', label: 'Cohere' },
];

type ModelOption = {
  value: string;
  label: string;
  description?: string;
};

const modelsByProvider: Record<string, ModelOption[]> = {
  openai: [
    { 
      value: 'gpt-4-turbo-preview', 
      label: 'GPT-4 Turbo',
      description: 'Most capable model, best for complex tasks'
    },
    { 
      value: 'gpt-4', 
      label: 'GPT-4',
      description: 'Powerful model for advanced tasks'
    },
    { 
      value: 'gpt-3.5-turbo', 
      label: 'GPT-3.5 Turbo',
      description: 'Fast and efficient for most tasks'
    },
  ],
  anthropic: [
    { 
      value: 'claude-3-opus', 
      label: 'Claude 3 Opus',
      description: 'Most capable Claude model'
    },
    { 
      value: 'claude-3-sonnet', 
      label: 'Claude 3 Sonnet',
      description: 'Balanced performance and efficiency'
    },
  ],
  cohere: [
    { 
      value: 'command', 
      label: 'Command',
      description: 'Cohere\'s flagship model'
    },
  ],
};

export function ModelSettings({ aiSettings, onChange }: ModelSettingsProps) {
  const [provider, setProvider] = useState(aiSettings.provider);
  
  const handleProviderChange = (value: string) => {
    setProvider(value);
    onChange('provider', value);
    
    // If selected provider doesn't have the current model, change to first model for provider
    const currentModelExists = modelsByProvider[value].some(
      model => model.value === aiSettings.model
    );
    
    if (!currentModelExists && modelsByProvider[value].length > 0) {
      onChange('model', modelsByProvider[value][0].value);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-blue-600" />
        <h4 className="text-base font-semibold text-slate-800">AI Model Settings</h4>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-1.5">AI Provider</Label>
          <Select 
            defaultValue={provider} 
            onValueChange={handleProviderChange}
          >
            <SelectTrigger className="w-full bg-white border-slate-200">
              <SelectValue placeholder="Select AI provider" />
            </SelectTrigger>
            <SelectContent>
              {providers.map(providerOption => (
                <SelectItem 
                  key={providerOption.value} 
                  value={providerOption.value}
                  className="text-slate-700"
                >
                  {providerOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-1.5">Model</Label>
          <Select 
            defaultValue={aiSettings.model}
            onValueChange={(value) => onChange('model', value)}
          >
            <SelectTrigger className="w-full bg-white border-slate-200">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {modelsByProvider[provider]?.map(modelOption => (
                <SelectItem 
                  key={modelOption.value} 
                  value={modelOption.value}
                  className="text-slate-700"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{modelOption.label}</span>
                    {modelOption.description && (
                      <span className="text-xs text-slate-500">{modelOption.description}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-700">Recommended Model</span>
          </div>
          <div className="bg-amber-50/80 p-3 rounded-md border border-amber-200">
            <p className="text-sm text-amber-800">
              For material processing, we recommend using <strong>GPT-4 Turbo</strong> or <strong>Claude 3 Opus</strong> 
              for the best results in classification and description generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
