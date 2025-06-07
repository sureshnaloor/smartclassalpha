import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AISettings } from '@/types';
import { Label } from '@/components/ui/label';

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
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'mistral', label: 'Mistral AI' },
];

// Models organized by provider
const modelsByProvider: Record<string, ProviderOption[]> = {
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5', label: 'GPT-3.5 Turbo' },
  ],
  deepseek: [
    { value: 'deepseek-coder', label: 'DeepSeek Coder' },
    { value: 'deepseek-llm', label: 'DeepSeek LLM' },
  ],
  anthropic: [
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
  ],
  mistral: [
    { value: 'mistral-large', label: 'Mistral Large' },
    { value: 'mistral-medium', label: 'Mistral Medium' },
    { value: 'mistral-small', label: 'Mistral Small' },
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
    <div className="mb-4">
      <h4 className="text-md font-medium text-gray-900 mb-2">AI Model Settings</h4>
      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-900 mb-1">AI Provider</Label>
          <Select 
            defaultValue={provider} 
            onValueChange={handleProviderChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select AI provider" />
            </SelectTrigger>
            <SelectContent>
              {providers.map(providerOption => (
                <SelectItem 
                  key={providerOption.value} 
                  value={providerOption.value}
                >
                  {providerOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-900 mb-1">Model</Label>
          <Select 
            defaultValue={aiSettings.model}
            onValueChange={(value) => onChange('model', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {modelsByProvider[provider]?.map(modelOption => (
                <SelectItem 
                  key={modelOption.value} 
                  value={modelOption.value}
                >
                  {modelOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
