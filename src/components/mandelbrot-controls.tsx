/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Check,
  Trash2,
  ChevronDown,
  ChevronRight,
  Settings,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CustomColorDialog } from "@/components/custom-color-dialog";
import { JsonControls } from "@/components/json-controls";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CustomColorScheme {
  name: string;
  colors: string[];
}

interface MandelbrotControlsProps {
  onViewportChange: (viewport: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
  onIterationsChange: (iterations: number) => void;
  onColorSchemeChange: (scheme: string) => void;
  onAddCustomScheme: (scheme: CustomColorScheme) => void;
  onRemoveCustomScheme: (name: string) => void;
  onCustomColorSchemeChange: (colors: string[]) => void;
  onReset: () => void;
  currentViewport: { x: number; y: number; width: number; height: number };
  currentIterations: number;
  currentColorScheme: string;
  customSchemes: CustomColorScheme[];
  directColors?: string[];
  initialCondition?: { real: number; imag: number };
  escapeThreshold?: number;
  onInitialConditionChange?: (condition: {
    real: number;
    imag: number;
  }) => void;
  onEscapeThresholdChange?: (threshold: number) => void;
}

export function MandelbrotControls({
  onViewportChange,
  onIterationsChange,
  onColorSchemeChange,
  onAddCustomScheme,
  onRemoveCustomScheme,
  onCustomColorSchemeChange,
  onReset,
  currentViewport,
  currentIterations,
  currentColorScheme,
  customSchemes,
  directColors,
  initialCondition,
  escapeThreshold,
  onInitialConditionChange,
  onEscapeThresholdChange,
}: MandelbrotControlsProps) {
  const [openSections, setOpenSections] = useState({
    zoom: false,
    pan: false,
    iterations: false,
    colorScheme: false,
    viewport: false,
    equation: false,
  });

  const [controlType, setControlType] = useState<"ui" | "json">("ui");

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const resetView = () => {
    onViewportChange({ x: -2.5, y: -2, width: 4, height: 4 });
  };

  const zoomIn = () => {
    const factor = 0.8;
    onViewportChange({
      x: currentViewport.x + (currentViewport.width * (1 - factor)) / 2,
      y: currentViewport.y + (currentViewport.height * (1 - factor)) / 2,
      width: currentViewport.width * factor,
      height: currentViewport.height * factor,
    });
  };

  const zoomOut = () => {
    const factor = 1.25;
    onViewportChange({
      x: currentViewport.x + (currentViewport.width * (1 - factor)) / 2,
      y: currentViewport.y + (currentViewport.height * (1 - factor)) / 2,
      width: currentViewport.width * factor,
      height: currentViewport.height * factor,
    });
  };

  const moveUp = () => {
    onViewportChange({
      ...currentViewport,
      y: currentViewport.y - currentViewport.height * 0.1,
    });
  };

  const moveDown = () => {
    onViewportChange({
      ...currentViewport,
      y: currentViewport.y + currentViewport.height * 0.1,
    });
  };

  const moveLeft = () => {
    onViewportChange({
      ...currentViewport,
      x: currentViewport.x - currentViewport.width * 0.1,
    });
  };

  const moveRight = () => {
    onViewportChange({
      ...currentViewport,
      x: currentViewport.x + currentViewport.width * 0.1,
    });
  };

  return (
    <div className="space-y-6">
      {/* Control Type Tabs */}
      <div className="flex gap-2">
        <Button
          variant={controlType === "ui" ? "default" : "outline"}
          size="sm"
          onClick={() => setControlType("ui")}
          className="flex-1"
        >
          <Settings className="h-4 w-4 mr-2" />
          UI Controls
        </Button>
        <Button
          variant={controlType === "json" ? "default" : "outline"}
          size="sm"
          onClick={() => setControlType("json")}
          className="flex-1"
        >
          <Code className="h-4 w-4 mr-2" />
          JSON Controls
        </Button>
      </div>

      {/* UI Controls */}
      {controlType === "ui" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              Configuration
            </h4>
            <Button
              size="sm"
              variant="outline"
              onClick={onReset}
              className="h-8"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <Collapsible
              open={openSections.zoom}
              onOpenChange={() => toggleSection("zoom")}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={`w-full flex justify-between items-center p-0 h-auto hover:bg-transparent bg-transparent border-none outline-none ${
                    openSections.zoom ? "mb-2" : ""
                  }`}
                >
                  <label className="text-sm font-medium text-foreground">
                    Zoom
                  </label>
                  {openSections.zoom ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex gap-2">
                  <Button
                    onClick={zoomOut}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <ZoomOut className="h-4 w-4 mr-2" />
                    Out
                  </Button>
                  <Button
                    onClick={resetView}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    onClick={zoomIn}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <ZoomIn className="h-4 w-4 mr-2" />
                    In
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Pan Controls */}
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <Collapsible
              open={openSections.pan}
              onOpenChange={() => toggleSection("pan")}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={`w-full flex justify-between items-center p-0 h-auto hover:bg-transparent bg-transparent border-none outline-none ${
                    openSections.pan ? "mb-2" : ""
                  }`}
                >
                  <label className="text-sm font-medium text-foreground">
                    Pan
                  </label>
                  {openSections.pan ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-3 gap-2 max-w-36 mx-auto">
                  <div></div>
                  <Button
                    onClick={moveUp}
                    size="sm"
                    variant="outline"
                    className="aspect-square"
                  >
                    ↑
                  </Button>
                  <div></div>
                  <Button
                    onClick={moveLeft}
                    size="sm"
                    variant="outline"
                    className="aspect-square"
                  >
                    ←
                  </Button>
                  <Button
                    onClick={resetView}
                    size="sm"
                    variant="outline"
                    className="aspect-square"
                  >
                    ⌂
                  </Button>
                  <Button
                    onClick={moveRight}
                    size="sm"
                    variant="outline"
                    className="aspect-square"
                  >
                    →
                  </Button>
                  <div></div>
                  <Button
                    onClick={moveDown}
                    size="sm"
                    variant="outline"
                    className="aspect-square"
                  >
                    ↓
                  </Button>
                  <div></div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Iterations Slider */}
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <Collapsible
              open={openSections.iterations}
              onOpenChange={() => toggleSection("iterations")}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={`w-full flex justify-between items-center p-0 h-auto hover:bg-transparent bg-transparent border-none outline-none ${
                    openSections.iterations ? "mb-3" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Max Iterations
                    </label>
                    <span className="text-sm text-primary font-semibold">
                      {currentIterations}
                    </span>
                  </div>
                  {openSections.iterations ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-3">
                  <Slider
                    value={[currentIterations]}
                    onValueChange={(value) => onIterationsChange(value[0])}
                    min={10}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10</span>
                    <span>500</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Color Scheme */}
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <Collapsible
              open={openSections.colorScheme}
              onOpenChange={() => toggleSection("colorScheme")}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={`w-full flex justify-between items-center p-0 h-auto hover:bg-transparent bg-transparent border-none outline-none ${
                    openSections.colorScheme ? "mb-3" : ""
                  }`}
                >
                  <label className="text-sm font-medium text-foreground">
                    Color Scheme
                  </label>
                  {openSections.colorScheme ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {/* Preset Schemes */}
                <div className="space-y-2 mb-4">
                  <div className="text-xs text-muted-foreground font-medium">
                    Presets
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        key: "rainbow",
                        label: "Rainbow",
                        gradient: "from-red-500 via-yellow-500 to-blue-500",
                      },
                      {
                        key: "blood",
                        label: "Blood",
                        gradient: "from-red-900 via-orange-600 to-yellow-300",
                      },
                      {
                        key: "ocean",
                        label: "Ocean",
                        gradient: "from-blue-300 to-blue-800",
                      },
                      {
                        key: "sunset",
                        label: "Sunset",
                        gradient: "from-orange-400 to-pink-600",
                      },
                      {
                        key: "neon",
                        label: "Neon",
                        gradient: "from-green-400 to-purple-600",
                      },
                      {
                        key: "monochrome",
                        label: "Monochrome",
                        gradient: "from-gray-900 via-gray-500 to-gray-100",
                      },
                      // Add JSON-scheme if directColors are active
                      ...(directColors && directColors.length > 0
                        ? [
                            {
                              key: "JSON-scheme",
                              label: "JSON-scheme",
                              gradient: `linear-gradient(to right, ${directColors.join(
                                ", "
                              )})`,
                              isCustom: true,
                              colors: directColors,
                            },
                          ]
                        : []),
                      // Add custom schemes to the main list
                      ...customSchemes.map((scheme) => ({
                        key: scheme.name,
                        label: scheme.name,
                        gradient: `linear-gradient(to right, ${scheme.colors.join(
                          ", "
                        )})`,
                        isCustom: true,
                        colors: scheme.colors,
                      })),
                    ].map((scheme) => (
                      <div key={scheme.key} className="flex items-center gap-2">
                        <button
                          onClick={() => onColorSchemeChange(scheme.key)}
                          className={`flex-1 p-2 rounded-md border transition-all duration-200 flex items-center gap-3 ${
                            currentColorScheme === scheme.key
                              ? "border-primary bg-primary/10 shadow-sm"
                              : "border-border bg-background hover:bg-muted/50"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full shadow-sm border border-border/20`}
                            style={{
                              background: (scheme as any).isCustom
                                ? `radial-gradient(circle, ${(
                                    scheme as any
                                  ).colors.join(", ")})`
                                : scheme.key === "rainbow"
                                ? "radial-gradient(circle, #ef4444, #eab308, #3b82f6)"
                                : scheme.key === "blood"
                                ? "radial-gradient(circle, #dc2626, #ea580c, #fbbf24)"
                                : scheme.key === "ocean"
                                ? "radial-gradient(circle, #93c5fd, #1e40af)"
                                : scheme.key === "sunset"
                                ? "radial-gradient(circle, #fb923c, #ec4899)"
                                : scheme.key === "neon"
                                ? "radial-gradient(circle, #4ade80, #a855f7)"
                                : scheme.key === "monochrome"
                                ? "radial-gradient(circle, #000000, #666666, #ffffff)"
                                : "radial-gradient(circle, #ef4444, #eab308, #3b82f6)",
                            }}
                          ></div>
                          <span
                            className={`text-sm font-medium ${
                              currentColorScheme === scheme.key
                                ? "text-primary"
                                : "text-foreground"
                            }`}
                          >
                            {scheme.label}
                          </span>
                          {currentColorScheme === scheme.key && (
                            <div className="ml-auto w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                        {(scheme as any).isCustom && (
                          <button
                            onClick={() => onRemoveCustomScheme(scheme.key)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                            title="Delete custom scheme"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Color Dialog */}
                <div className="mt-6">
                  <CustomColorDialog
                    onAddScheme={onAddCustomScheme}
                    onRemoveScheme={onRemoveCustomScheme}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Viewport Controls */}
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <Collapsible
              open={openSections.viewport}
              onOpenChange={() => toggleSection("viewport")}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={`w-full flex justify-between items-center p-0 h-auto hover:bg-transparent bg-transparent border-none outline-none ${
                    openSections.viewport ? "mb-3" : ""
                  }`}
                >
                  <h4 className="text-sm font-medium text-foreground">
                    Viewport Controls
                  </h4>
                  {openSections.viewport ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      X Position
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={currentViewport.x.toFixed(3)}
                      onChange={(e) => {
                        const newX = parseFloat(e.target.value) || 0;
                        onViewportChange({
                          ...currentViewport,
                          x: newX,
                        });
                      }}
                      className="w-full px-2 py-1 text-xs bg-background border border-border rounded font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      Y Position
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={currentViewport.y.toFixed(3)}
                      onChange={(e) => {
                        const newY = parseFloat(e.target.value) || 0;
                        onViewportChange({
                          ...currentViewport,
                          y: newY,
                        });
                      }}
                      className="w-full px-2 py-1 text-xs bg-background border border-border rounded font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      Width
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={currentViewport.width.toFixed(3)}
                      onChange={(e) => {
                        const newWidth = parseFloat(e.target.value) || 0.001;
                        onViewportChange({
                          ...currentViewport,
                          width: newWidth,
                        });
                      }}
                      className="w-full px-2 py-1 text-xs bg-background border border-border rounded font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      Height
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={currentViewport.height.toFixed(3)}
                      onChange={(e) => {
                        const newHeight = parseFloat(e.target.value) || 0.001;
                        onViewportChange({
                          ...currentViewport,
                          height: newHeight,
                        });
                      }}
                      className="w-full px-2 py-1 text-xs bg-background border border-border rounded font-mono"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Equation Controls */}
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <Collapsible
              open={openSections.equation}
              onOpenChange={() => toggleSection("equation")}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={`w-full flex justify-between items-center p-0 h-auto hover:bg-transparent bg-transparent border-none outline-none ${
                    openSections.equation ? "mb-3" : ""
                  }`}
                >
                  <h4 className="text-sm font-medium text-foreground">
                    Equation Parameters
                  </h4>
                  {openSections.equation ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4">
                  {/* Initial Condition */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      Initial Condition (z₀)
                    </label>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs text-muted-foreground">
                            Real
                          </label>
                          <span className="text-xs font-mono text-foreground">
                            {initialCondition?.real?.toFixed(3) || 0}
                          </span>
                        </div>
                        <Slider
                          value={[initialCondition?.real || 0]}
                          onValueChange={(value) =>
                            onInitialConditionChange?.({
                              real: value[0],
                              imag: initialCondition?.imag || 0,
                            })
                          }
                          min={-2}
                          max={2}
                          step={0.001}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs text-muted-foreground">
                            Imaginary
                          </label>
                          <span className="text-xs font-mono text-foreground">
                            {initialCondition?.imag?.toFixed(3) || 0}
                          </span>
                        </div>
                        <Slider
                          value={[initialCondition?.imag || 0]}
                          onValueChange={(value) =>
                            onInitialConditionChange?.({
                              real: initialCondition?.real || 0,
                              imag: value[0],
                            })
                          }
                          min={-2}
                          max={2}
                          step={0.001}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Escape Threshold */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-foreground">
                        Escape Threshold
                      </label>
                      <span className="text-xs font-mono text-foreground">
                        {escapeThreshold?.toFixed(1) || 2}
                      </span>
                    </div>
                    <Slider
                      value={[escapeThreshold || 2]}
                      onValueChange={(value) =>
                        onEscapeThresholdChange?.(value[0])
                      }
                      min={1}
                      max={10}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">
                      |z| &gt; {escapeThreshold?.toFixed(1) || 2}
                    </div>
                  </div>

                  {/* Formula Display */}
                  <div className="p-3 bg-muted/30 border border-border rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      <strong>Formula:</strong> z = z² + c
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Initial: z₀ = {initialCondition?.real || 0} +{" "}
                      {initialCondition?.imag || 0}i
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      )}

      {/* JSON Controls */}
      {controlType === "json" && (
        <div className="space-y-6">
          <JsonControls
            currentViewport={currentViewport}
            currentIterations={currentIterations}
            currentColorScheme={currentColorScheme}
            customSchemes={customSchemes}
            onViewportChange={onViewportChange}
            onIterationsChange={onIterationsChange}
            onCustomColorSchemeChange={onCustomColorSchemeChange}
            onReset={onReset}
            initialCondition={initialCondition}
            escapeThreshold={escapeThreshold}
            onInitialConditionChange={onInitialConditionChange}
            onEscapeThresholdChange={onEscapeThresholdChange}
          />
        </div>
      )}
    </div>
  );
}
