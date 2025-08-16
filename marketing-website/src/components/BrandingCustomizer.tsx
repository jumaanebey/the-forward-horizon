'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  Settings,
  Eye,
  Download,
  Upload,
  Zap,
  Save,
  RotateCcw
} from 'lucide-react';
import { BrandingConfig, defaultBranding, brandingPresets } from '@/config/branding';

interface BrandingCustomizerProps {
  onBrandingChange?: (config: BrandingConfig) => void;
}

export default function BrandingCustomizer({ onBrandingChange }: BrandingCustomizerProps) {
  const [currentConfig, setCurrentConfig] = useState<BrandingConfig>(defaultBranding);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const updateConfig = (updates: Partial<BrandingConfig>) => {
    const newConfig = { ...currentConfig, ...updates };
    setCurrentConfig(newConfig);
    onBrandingChange?.(newConfig);
  };

  const updateColors = (colorUpdates: Partial<BrandingConfig['colors']>) => {
    updateConfig({
      colors: { ...currentConfig.colors, ...colorUpdates }
    });
  };

  const updateFeatures = (featureUpdates: Partial<BrandingConfig['features']>) => {
    updateConfig({
      features: { ...currentConfig.features, ...featureUpdates }
    });
  };

  const applyPreset = (presetName: string) => {
    const preset = brandingPresets[presetName as keyof typeof brandingPresets];
    if (preset) {
      setCurrentConfig(preset);
      setActivePreset(presetName);
      onBrandingChange?.(preset);
    }
  };

  const resetToDefault = () => {
    setCurrentConfig(defaultBranding);
    setActivePreset(null);
    onBrandingChange?.(defaultBranding);
  };

  const exportConfig = () => {
    const dataStr = JSON.stringify(currentConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'branding-config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          setCurrentConfig(config);
          setActivePreset(null);
          onBrandingChange?.(config);
        } catch (error) {
          alert('Invalid configuration file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center space-x-2">
            <Palette className="w-6 h-6 text-purple-600" />
            <span>Platform Customization</span>
          </h2>
          <p className="text-gray-600">Customize branding, colors, and features for your organization</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-1"
          >
            <Eye className="w-4 h-4" />
            <span>{previewMode ? 'Edit Mode' : 'Preview'}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportConfig}
            className="flex items-center space-x-1"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
          
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={importConfig}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            className="flex items-center space-x-1"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {/* Quick Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-orange-600" />
            <span>Quick Presets</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(brandingPresets).map(([key, preset]) => (
              <Card 
                key={key}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activePreset === key ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => applyPreset(key)}
              >
                <CardContent className="p-4">
                  <h3 className="font-medium">{preset.companyName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{preset.tagline}</p>
                  <div className="flex items-center space-x-2 mt-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: preset.colors.primary }}
                    ></div>
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: preset.colors.accent }}
                    ></div>
                    <Badge variant="outline" className="text-xs">
                      {Object.values(preset.features).filter(Boolean).length} features
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Customization Tabs */}
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company" className="flex items-center space-x-1">
            <Building className="w-4 h-4" />
            <span>Company</span>
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center space-x-1">
            <Palette className="w-4 h-4" />
            <span>Design</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center space-x-1">
            <Settings className="w-4 h-4" />
            <span>Features</span>
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>Programs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <Input
                    value={currentConfig.companyName}
                    onChange={(e) => updateConfig({ companyName: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tagline</label>
                  <Input
                    value={currentConfig.tagline}
                    onChange={(e) => updateConfig({ tagline: e.target.value })}
                    placeholder="Enter tagline"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  value={currentConfig.description}
                  onChange={(e) => updateConfig({ description: e.target.value })}
                  placeholder="Enter company description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>Phone</span>
                  </label>
                  <Input
                    value={currentConfig.phone}
                    onChange={(e) => updateConfig({ phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </label>
                  <Input
                    value={currentConfig.email}
                    onChange={(e) => updateConfig({ email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Address</span>
                </label>
                <Input
                  value={currentConfig.address}
                  onChange={(e) => updateConfig({ address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(currentConfig.colors).map(([colorName, colorValue]) => (
                  <div key={colorName} className="space-y-2">
                    <label className="block text-sm font-medium capitalize">{colorName}</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={colorValue}
                        onChange={(e) => updateColors({ [colorName]: e.target.value } as any)}
                        className="w-12 h-8 rounded border cursor-pointer"
                      />
                      <Input
                        value={colorValue}
                        onChange={(e) => updateColors({ [colorName]: e.target.value } as any)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg text-white" style={{ backgroundColor: currentConfig.colors.primary }}>
                  <h3 className="font-semibold">Primary Color</h3>
                  <p className="text-sm opacity-90">Main brand color</p>
                </div>
                <div className="p-4 rounded-lg text-white" style={{ backgroundColor: currentConfig.colors.secondary }}>
                  <h3 className="font-semibold">Secondary Color</h3>
                  <p className="text-sm opacity-90">Supporting brand color</p>
                </div>
                <div className="p-4 rounded-lg text-white" style={{ backgroundColor: currentConfig.colors.accent }}>
                  <h3 className="font-semibold">Accent Color</h3>
                  <p className="text-sm opacity-90">Highlight color</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(currentConfig.features).map(([featureName, enabled]) => (
                  <div key={featureName} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium capitalize">{featureName.replace(/([A-Z])/g, ' $1').trim()}</h3>
                      <p className="text-sm text-gray-600">
                        {featureName === 'veteranHousing' && 'Support for military veterans'}
                        {featureName === 'soberLiving' && 'Addiction recovery housing'}
                        {featureName === 'reentryHousing' && 'Post-incarceration support'}
                        {featureName === 'jobTraining' && 'Employment preparation'}
                        {featureName === 'mentalHealthSupport' && 'Mental health services'}
                        {featureName === 'aiInsights' && 'AI-powered predictions'}
                        {featureName === 'advancedAnalytics' && 'Comprehensive analytics'}
                        {featureName === 'automatedWorkflows' && 'Process automation'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => updateFeatures({ [featureName]: e.target.checked } as any)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          {Object.entries(currentConfig.programs).map(([programKey, program]) => (
            <Card key={programKey}>
              <CardHeader>
                <CardTitle className="capitalize">
                  {programKey.replace(/([A-Z])/g, ' $1').trim()} Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Program Name</label>
                  <Input
                    value={program.name}
                    onChange={(e) => updateConfig({
                      programs: {
                        ...currentConfig.programs,
                        [programKey]: { ...program, name: e.target.value }
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={program.description}
                    onChange={(e) => updateConfig({
                      programs: {
                        ...currentConfig.programs,
                        [programKey]: { ...program, description: e.target.value }
                      }
                    })}
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Save Actions */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t">
        <Button variant="outline" onClick={resetToDefault}>
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset to Default
        </Button>
        <Button onClick={() => onBrandingChange?.(currentConfig)}>
          <Save className="w-4 h-4 mr-1" />
          Apply Changes
        </Button>
      </div>
    </div>
  );
}