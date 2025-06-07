import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AISettings } from '@/types';
import { Label } from '@/components/ui/label';

interface OutputFormatProps {
  aiSettings: AISettings;
  onChange: (field: string, value: any) => void;
}

const erpSystems = [
  { value: 'sap', label: 'SAP ERP' },
  { value: 'oracle', label: 'Oracle ERP' },
  { value: 'ms_dynamics', label: 'Microsoft Dynamics' },
  { value: 'infor', label: 'Infor ERP' },
  { value: 'epicor', label: 'Epicor' },
];

export function OutputFormat({ aiSettings, onChange }: OutputFormatProps) {
  const [shortDescLimit, setShortDescLimit] = useState(aiSettings.shortDescLimit);
  const [longDescLimit, setLongDescLimit] = useState(aiSettings.longDescLimit);

  const handleShortDescLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setShortDescLimit(value);
      onChange('shortDescLimit', value);
    }
  };

  const handleLongDescLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setLongDescLimit(value);
      onChange('longDescLimit', value);
    }
  };

  return (
    <div className="mb-4">
      <h4 className="text-md font-medium text-gray-900 mb-2">ERP Output Format</h4>
      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-900 mb-1">ERP System</Label>
          <Select 
            defaultValue={aiSettings.erpSystem}
            onValueChange={(value) => onChange('erpSystem', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select ERP system" />
            </SelectTrigger>
            <SelectContent>
              {erpSystems.map(system => (
                <SelectItem key={system.value} value={system.value}>
                  {system.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-900 mb-1">Character Limits</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs text-gray-500 mb-1">Short Description</Label>
              <Input 
                type="number" 
                value={shortDescLimit} 
                onChange={handleShortDescLimitChange}
                min={1}
                max={255}
              />
            </div>
            <div>
              <Label className="block text-xs text-gray-500 mb-1">Long Description</Label>
              <Input 
                type="number" 
                value={longDescLimit} 
                onChange={handleLongDescLimitChange}
                min={1}
                max={5000}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
