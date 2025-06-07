import { AISettings } from '@/types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface MLEnhancementProps {
  aiSettings: AISettings;
  onChange: (field: string, value: boolean) => void;
}

export function MLEnhancement({ aiSettings, onChange }: MLEnhancementProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-lg font-medium">Advanced ML Enhancement</CardTitle>
        </div>
        <CardDescription>
          Enable advanced machine learning features for improved material classification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableAdvancedML">Enhanced Classification</Label>
              <p className="text-sm text-gray-500">
                Uses AI to analyze material properties and suggest alternative classifications with confidence scores
              </p>
            </div>
            <Switch
              id="enableAdvancedML"
              checked={aiSettings.enableAdvancedML || false}
              onCheckedChange={(checked) => onChange('enableAdvancedML', checked)}
            />
          </div>
          
          {aiSettings.enableAdvancedML && (
            <div className="pt-2">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">
                      Advanced ML features will provide alternative classification suggestions, confidence scores, 
                      and identify key material attributes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}