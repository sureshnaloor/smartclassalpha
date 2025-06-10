import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Settings, Cpu, Zap, Shield, Database, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface AISettings {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  apiKey: string;
  apiEndpoint: string;
}

export default function AISettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [settings, setSettings] = useState<AISettings>({
    model: "",
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    apiKey: "",
    apiEndpoint: "",
  });

  const { data, isLoading } = useQuery<AISettings>({
    queryKey: ["aiSettings"],
    queryFn: async () => {
      const response = await fetch("/api/ai/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch AI settings");
      }
      return response.json();
    },
  });

  // Update settings when data is loaded
  if (data && !settings.model) {
    setSettings(data);
  }

  const updateSettings = useMutation({
    mutationFn: async (newSettings: AISettings) => {
      const response = await fetch("/api/ai/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      });
      if (!response.ok) {
        throw new Error("Failed to update AI settings");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiSettings"] });
      toast({
        title: "Success",
        description: "AI settings updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update AI settings",
        variant: "destructive",
      });
      console.error("Error updating AI settings:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(settings);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <Settings className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">AI Settings</h1>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-xl text-slate-800">Model Configuration</CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Configure the AI model parameters for optimal performance
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-slate-700">Model</Label>
                  <Input
                    id="model"
                    value={settings.model}
                    onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                    className="bg-white/80 backdrop-blur-sm border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="gpt-4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-slate-700">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                    className="bg-white/80 backdrop-blur-sm border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTokens" className="text-slate-700">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    min="1"
                    value={settings.maxTokens}
                    onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
                    className="bg-white/80 backdrop-blur-sm border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topP" className="text-slate-700">Top P</Label>
                  <Input
                    id="topP"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.topP}
                    onChange={(e) => setSettings({ ...settings, topP: parseFloat(e.target.value) })}
                    className="bg-white/80 backdrop-blur-sm border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequencyPenalty" className="text-slate-700">Frequency Penalty</Label>
                  <Input
                    id="frequencyPenalty"
                    type="number"
                    min="-2"
                    max="2"
                    step="0.1"
                    value={settings.frequencyPenalty}
                    onChange={(e) => setSettings({ ...settings, frequencyPenalty: parseFloat(e.target.value) })}
                    className="bg-white/80 backdrop-blur-sm border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="presencePenalty" className="text-slate-700">Presence Penalty</Label>
                  <Input
                    id="presencePenalty"
                    type="number"
                    min="-2"
                    max="2"
                    step="0.1"
                    value={settings.presencePenalty}
                    onChange={(e) => setSettings({ ...settings, presencePenalty: parseFloat(e.target.value) })}
                    className="bg-white/80 backdrop-blur-sm border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-xl text-slate-800">API Settings</CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Configure API endpoints and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-slate-700">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  className="bg-white/80 backdrop-blur-sm border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="sk-..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint" className="text-slate-700">API Endpoint</Label>
                <Input
                  id="apiEndpoint"
                  value={settings.apiEndpoint}
                  onChange={(e) => setSettings({ ...settings, apiEndpoint: e.target.value })}
                  className="bg-white/80 backdrop-blur-sm border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="https://api.openai.com/v1"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={updateSettings.isPending}
            >
              {updateSettings.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
