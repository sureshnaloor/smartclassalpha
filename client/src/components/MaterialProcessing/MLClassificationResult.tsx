import { MLClassification, AlternativeClassification } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Sparkles, ArrowRight, AlertCircle, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface MLClassificationResultProps {
  mlClassification?: MLClassification;
  currentClassification: {
    primaryGroup: string;
    secondaryGroup?: string;
    tertiaryGroup?: string;
  };
}

export function MLClassificationResult({ mlClassification, currentClassification }: MLClassificationResultProps) {
  if (!mlClassification) return null;

  // Format confidence as a percentage
  const confidencePercent = mlClassification.confidence 
    ? Math.round(mlClassification.confidence * 100) 
    : null;

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-lg">ML-Enhanced Classification</CardTitle>
          </div>
          {confidencePercent !== null && (
            <Badge variant={confidencePercent > 75 ? "default" : "outline"} className="ml-2">
              {confidencePercent}% Confidence
            </Badge>
          )}
        </div>
        <CardDescription>
          Machine learning enhanced analysis of material classification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Classification with Confidence */}
        {confidencePercent !== null && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Classification Confidence</span>
              <span>{confidencePercent}%</span>
            </div>
            <Progress 
              value={confidencePercent} 
              className="h-2"
              style={{
                // Gradient color based on confidence
                background: 'linear-gradient(to right, #f87171, #fbbf24, #34d399)',
                opacity: 0.3,
              }}
            />
            <Progress 
              value={confidencePercent} 
              className="h-2 -mt-2"
              style={{
                background: confidencePercent > 75 
                  ? '#10b981' // green for high confidence
                  : confidencePercent > 50 
                    ? '#f59e0b' // amber for medium confidence
                    : '#ef4444', // red for low confidence
              }}
            />
          </div>
        )}

        {/* Alternative Classifications */}
        {mlClassification.alternativeClassifications && mlClassification.alternativeClassifications.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-gray-500" /> 
              Alternative Classifications
            </h4>
            <div className="space-y-3 pl-2">
              {mlClassification.alternativeClassifications.map((alt, index) => (
                <AlternativeClassificationItem 
                  key={index} 
                  classification={alt} 
                  isCurrentClassification={
                    alt.primaryGroup === currentClassification.primaryGroup &&
                    alt.secondaryGroup === currentClassification.secondaryGroup &&
                    alt.tertiaryGroup === currentClassification.tertiaryGroup
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Key Attributes */}
        {mlClassification.keyAttributes && mlClassification.keyAttributes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Key Material Attributes</h4>
            <div className="flex flex-wrap gap-2">
              {mlClassification.keyAttributes.map((attribute, index) => (
                <Badge key={index} variant="outline" className="bg-gray-50">
                  {attribute}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Similar Materials */}
        {mlClassification.similarMaterials && mlClassification.similarMaterials.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Similar Materials</h4>
            <div className="flex flex-wrap gap-1">
              {mlClassification.similarMaterials.map((material, index) => (
                <Badge key={index} variant="secondary" className="mr-1 mb-1">
                  {material}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AlternativeClassificationItem({ 
  classification, 
  isCurrentClassification 
}: { 
  classification: AlternativeClassification;
  isCurrentClassification: boolean;
}) {
  const confidencePercent = Math.round(classification.confidence * 100);
  
  return (
    <div className={`p-2 rounded-md ${isCurrentClassification ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          {isCurrentClassification ? (
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
          ) : (
            <ArrowRight className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
          )}
          <div>
            <div className="font-medium text-sm">
              {classification.primaryGroup}
              {classification.secondaryGroup && (
                <span className="text-gray-500"> / {classification.secondaryGroup}</span>
              )}
              {classification.tertiaryGroup && (
                <span className="text-gray-500"> / {classification.tertiaryGroup}</span>
              )}
              {isCurrentClassification && (
                <span className="ml-2 text-xs text-green-600 font-normal">(Current)</span>
              )}
            </div>
            {classification.reasoning && (
              <p className="text-xs text-gray-500 mt-1">{classification.reasoning}</p>
            )}
          </div>
        </div>
        <Badge 
          variant={isCurrentClassification ? "default" : "outline"} 
          className={`ml-2 flex-shrink-0 ${
            confidencePercent > 75 
              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
              : confidencePercent > 50 
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' 
                : 'bg-red-100 text-red-800 hover:bg-red-100'
          }`}
        >
          {confidencePercent}%
        </Badge>
      </div>
    </div>
  );
}