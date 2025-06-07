import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { AISettings } from '@/types';
import { Label } from '@/components/ui/label';

interface ParameterSlidersProps {
  aiSettings: AISettings;
  onChange: (field: string, value: string) => void;
}

export function ParameterSliders({ aiSettings, onChange }: ParameterSlidersProps) {
  const [temperature, setTemperature] = useState(parseFloat(aiSettings.temperature));
  const [topP, setTopP] = useState(parseFloat(aiSettings.topP));
  const [topK, setTopK] = useState(parseFloat(aiSettings.topK));

  const handleTemperatureChange = (value: number[]) => {
    const newValue = value[0];
    setTemperature(newValue);
    onChange('temperature', newValue.toString());
  };

  const handleTopPChange = (value: number[]) => {
    const newValue = value[0];
    setTopP(newValue);
    onChange('topP', newValue.toString());
  };

  const handleTopKChange = (value: number[]) => {
    const newValue = value[0];
    setTopK(newValue);
    onChange('topK', newValue.toString());
  };

  return (
    <div>
      <h4 className="text-md font-medium text-gray-900 mb-2">Model Parameters</h4>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <Label className="text-sm font-medium text-gray-900">Temperature</Label>
            <span className="text-sm text-gray-500">{temperature}</span>
          </div>
          <Slider
            value={[temperature]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={handleTemperatureChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Precise (0)</span>
            <span>Creative (1)</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <Label className="text-sm font-medium text-gray-900">Top-P</Label>
            <span className="text-sm text-gray-500">{topP}</span>
          </div>
          <Slider
            value={[topP]}
            min={0.1}
            max={1}
            step={0.1}
            onValueChange={handleTopPChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Focused</span>
            <span>Diverse</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <Label className="text-sm font-medium text-gray-900">Top-K</Label>
            <span className="text-sm text-gray-500">{topK}</span>
          </div>
          <Slider
            value={[topK]}
            min={1}
            max={100}
            step={1}
            onValueChange={handleTopKChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Limited options</span>
            <span>More options</span>
          </div>
        </div>
      </div>
    </div>
  );
}
