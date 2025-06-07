import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { AISettings, MaterialProcessingResponse } from '@/types';
import { Loader2 } from 'lucide-react';

// Form schema for material input
const materialFormSchema = z.object({
  materialName: z.string().min(1, 'Material name is required'),
  materialType: z.string().min(1, 'Material type is required'),
  materialId: z.string().optional(),
  basicDescription: z.string().min(1, 'Basic description is required'),
  technicalSpecs: z.string().optional(),
  manufacturer: z.string().optional(),
  modelNumber: z.string().optional(),
  primaryGroup: z.string().min(1, 'Primary group is required'),
  secondaryGroup: z.string().optional(),
  tertiaryGroup: z.string().optional(),
});

type MaterialFormValues = z.infer<typeof materialFormSchema>;

const materialTypes = [
  { value: 'raw', label: 'Raw Material' },
  { value: 'spare', label: 'Spare Part' },
  { value: 'consumable', label: 'Consumable' },
  { value: 'service', label: 'Service Item' },
];

const primaryGroups = [
  { value: 'electrical', label: 'Electrical' },
  { value: 'mechanical', label: 'Mechanical' },
  { value: 'chemical', label: 'Chemical' },
  { value: 'consumable', label: 'Consumable' },
  { value: 'service', label: 'Service' },
];

const secondaryGroups = {
  electrical: [
    { value: 'motor', label: 'Motors & Drives' },
    { value: 'cable', label: 'Cables & Wiring' },
    { value: 'sensor', label: 'Sensors & Controls' },
  ],
  mechanical: [
    { value: 'fastener', label: 'Fasteners' },
    { value: 'bearing', label: 'Bearings' },
    { value: 'pump', label: 'Pumps' },
  ],
  chemical: [
    { value: 'adhesive', label: 'Adhesives' },
    { value: 'lubricant', label: 'Lubricants' },
    { value: 'solvent', label: 'Solvents' },
  ],
  consumable: [
    { value: 'safety', label: 'Safety' },
    { value: 'office', label: 'Office' },
    { value: 'cleaning', label: 'Cleaning' },
  ],
  service: [
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'training', label: 'Training' },
  ],
};

const tertiaryGroups = {
  motor: [
    { value: 'ac_motor', label: 'AC Motors' },
    { value: 'dc_motor', label: 'DC Motors' },
    { value: 'servo', label: 'Servo Motors' },
  ],
  cable: [
    { value: 'power_cable', label: 'Power Cables' },
    { value: 'control_cable', label: 'Control Cables' },
    { value: 'network_cable', label: 'Network Cables' },
  ],
};

interface SingleMaterialFormProps {
  aiSettings?: AISettings;
  onProcessingComplete: (result: MaterialProcessingResponse) => void;
  isLoadingSettings: boolean;
}

export function SingleMaterialForm({ aiSettings, onProcessingComplete, isLoadingSettings }: SingleMaterialFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialFormSchema),
    defaultValues: {
      materialName: '',
      materialType: '',
      materialId: '',
      basicDescription: '',
      technicalSpecs: '',
      manufacturer: '',
      modelNumber: '',
      primaryGroup: '',
      secondaryGroup: '',
      tertiaryGroup: '',
    },
  });
  
  const primaryGroup = form.watch('primaryGroup');
  const secondaryGroup = form.watch('secondaryGroup');

  const getSecondaryGroups = (primary: string | undefined) => {
    if (!primary) return [];
    return secondaryGroups[primary as keyof typeof secondaryGroups] || [];
  };

  const getTertiaryGroups = (secondary: string | undefined) => {
    if (!secondary) return [];
    return tertiaryGroups[secondary as keyof typeof tertiaryGroups] || [];
  };

  const onSubmit = async (data: MaterialFormValues) => {
    if (!aiSettings) {
      toast({
        title: "Error",
        description: "AI settings not loaded. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Combine form data with AI settings
      const requestData = {
        ...data,
        temperature: aiSettings.temperature,
        topP: aiSettings.topP,
        topK: aiSettings.topK,
        learningMode: aiSettings.learningMode,
        examples: aiSettings.examples || [],
        additionalContext: aiSettings.additionalContext || '',
        erpSystem: aiSettings.erpSystem,
        shortDescLimit: aiSettings.shortDescLimit,
        longDescLimit: aiSettings.longDescLimit,
        enableAdvancedML: aiSettings.enableAdvancedML || false,
      };

      const response = await apiRequest('POST', '/api/process-material', requestData);
      const result = await response.json();

      toast({
        title: "Processing complete",
        description: "Material has been successfully processed.",
      });

      onProcessingComplete(result);
    } catch (error) {
      console.error('Error processing material:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearForm = () => {
    form.reset();
  };

  if (isLoadingSettings) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Material Entry</h3>
        <p className="text-gray-500 text-sm">Enter material details to generate ERP-compatible descriptions</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="materialName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter material name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="materialType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Type <span className="text-red-500">*</span></FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select material type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {materialTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="materialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material ID (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter existing ID if any" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="basicDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Basic Description <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter basic description of the material"
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <p className="text-xs text-gray-500 mt-1">
                  Include key attributes, specifications, and use cases
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="primaryGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Group <span className="text-red-500">*</span></FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('secondaryGroup', '');
                      form.setValue('tertiaryGroup', '');
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {primaryGroups.map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="secondaryGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Group</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('tertiaryGroup', '');
                    }} 
                    defaultValue={field.value}
                    disabled={!primaryGroup}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select secondary group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getSecondaryGroups(primaryGroup).map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tertiaryGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tertiary Group</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!secondaryGroup}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tertiary group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getTertiaryGroups(secondaryGroup).map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="technicalSpecs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Specifications (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter technical specifications (dimensions, capacity, material, etc.)"
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Manufacturer (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter manufacturer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="modelNumber"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Model/Part Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter model or part number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={handleClearForm}>
              Clear Form
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process Material'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
