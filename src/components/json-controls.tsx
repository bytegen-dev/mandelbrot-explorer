"use client";

import { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Check, X, RotateCcw } from "lucide-react";
import {
  getPresetColors,
  DEFAULT_CONFIG,
  DEFAULT_JSON_STRING,
} from "@/constants/mandelbrot-config";

interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CustomColorScheme {
  name: string;
  colors: string[];
}

interface JsonControlsProps {
  currentViewport: Viewport;
  currentIterations: number;
  currentColorScheme: string;
  customSchemes: CustomColorScheme[];
  onViewportChange: (viewport: Viewport) => void;
  onIterationsChange: (iterations: number) => void;
  onColorSchemeChange: (colorScheme: string) => void;
  onCustomColorSchemeChange: (colors: string[]) => void;
  onReset: () => void;
  initialCondition?: { real: number; imag: number };
  escapeThreshold?: number;
  onInitialConditionChange?: (condition: {
    real: number;
    imag: number;
  }) => void;
  onEscapeThresholdChange?: (threshold: number) => void;
}

export function JsonControls({
  currentViewport,
  currentIterations,
  currentColorScheme,
  customSchemes,
  onViewportChange,
  onIterationsChange,
  onColorSchemeChange,
  onCustomColorSchemeChange,
  onReset,
  initialCondition = { real: 0, imag: 0 },
  escapeThreshold = 2,
  onInitialConditionChange,
  onEscapeThresholdChange,
}: JsonControlsProps) {
  const [jsonValue, setJsonValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  // Convert preset color schemes to hex arrays
  const getPresetHexColors = (schemeName: string): string[] => {
    return getPresetColors(schemeName);
  };

  // Update JSON when props change
  useEffect(() => {
    // Convert current color scheme to hex array
    const getCurrentColorArray = () => {
      // Check if it's a custom scheme
      const customScheme = customSchemes.find(
        (scheme) => scheme.name === currentColorScheme
      );
      if (customScheme) {
        return customScheme.colors;
      }
      // Otherwise, convert preset to hex array
      return getPresetHexColors(currentColorScheme);
    };

    const jsonData = {
      viewport: currentViewport,
      iterations: currentIterations,
      colorScheme: getCurrentColorArray(),
      initialCondition: initialCondition,
      escapeThreshold: escapeThreshold,
    };
    setJsonValue(JSON.stringify(jsonData, null, 2));
    setHasChanges(false);
    setEditorKey((prev) => prev + 1); // Force editor re-render when props change
  }, [
    currentViewport,
    currentIterations,
    currentColorScheme,
    initialCondition,
    escapeThreshold,
  ]);

  const validateJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);

      // Validate structure
      if (!parsed.viewport || !parsed.iterations || !parsed.colorScheme) {
        throw new Error(
          "Missing required fields: viewport, iterations, and colorScheme"
        );
      }

      if (typeof parsed.iterations !== "number" || parsed.iterations < 1) {
        throw new Error("Iterations must be a positive number");
      }

      if (
        !Array.isArray(parsed.colorScheme) ||
        parsed.colorScheme.length === 0
      ) {
        throw new Error("ColorScheme must be a non-empty array of hex colors");
      }

      // Validate each color is a valid hex color
      for (const color of parsed.colorScheme) {
        if (typeof color !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
          throw new Error(`Invalid hex color: ${color}. Use format #RRGGBB`);
        }
      }

      if (
        !parsed.viewport.x ||
        !parsed.viewport.y ||
        !parsed.viewport.width ||
        !parsed.viewport.height
      ) {
        throw new Error(
          "Viewport must have x, y, width, and height properties"
        );
      }

      if (parsed.viewport.width <= 0 || parsed.viewport.height <= 0) {
        throw new Error("Viewport width and height must be positive");
      }

      return { valid: true, data: parsed };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  };

  const handleJsonChange = (value: string | undefined) => {
    if (value === undefined) return;

    setJsonValue(value);
    const validation = validateJson(value);
    setIsValid(validation.valid);
    setErrorMessage(validation.valid ? "" : validation.error || "Invalid JSON");

    // Check if the JSON is different from current values
    const getCurrentColorArray = () => {
      // Check if it's a custom scheme
      const customScheme = customSchemes.find(
        (scheme) => scheme.name === currentColorScheme
      );
      if (customScheme) {
        return customScheme.colors;
      }
      // Otherwise, convert preset to hex array
      return getPresetHexColors(currentColorScheme);
    };

    const currentJson = JSON.stringify(
      {
        viewport: currentViewport,
        iterations: currentIterations,
        colorScheme: getCurrentColorArray(),
        initialCondition: initialCondition,
        escapeThreshold: escapeThreshold,
      },
      null,
      2
    );
    setHasChanges(value !== currentJson);
  };

  const applyJson = () => {
    const validation = validateJson(jsonValue);
    if (validation.valid && validation.data) {
      onViewportChange(validation.data.viewport);
      onIterationsChange(validation.data.iterations);
      // Apply custom color scheme with hex colors
      onCustomColorSchemeChange(validation.data.colorScheme);
      onInitialConditionChange?.(validation.data.initialCondition);
      onEscapeThresholdChange?.(validation.data.escapeThreshold);
      setIsValid(true);
      setErrorMessage("");
      setHasChanges(false);
    }
  };

  const resetToCurrent = () => {
    // Use the shared reset function
    onReset();

    // Update the JSON editor to reflect the reset values
    setJsonValue(DEFAULT_JSON_STRING);
    setIsValid(true);
    setErrorMessage("");
    setHasChanges(false);
    setEditorKey((prev) => prev + 1); // Force editor re-render
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Configuration</h4>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={resetToCurrent}
            className="h-8"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
          {hasChanges && (
            <Button
              size="sm"
              onClick={applyJson}
              disabled={!isValid}
              className="h-8"
            >
              {isValid ? (
                <Check className="h-3 w-3 mr-1" />
              ) : (
                <X className="h-3 w-3 mr-1" />
              )}
              Apply
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Editor
          key={editorKey}
          height="300px"
          defaultLanguage="json"
          value={jsonValue}
          onChange={handleJsonChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
          }}
        />
      </div>

      {!isValid && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 text-destructive">
            <X className="h-4 w-4" />
            <span className="text-sm font-medium">Invalid JSON</span>
          </div>
          <p className="text-sm text-destructive/80 mt-1">{errorMessage}</p>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        <p>
          <strong>Format:</strong>
        </p>
        <pre className="mt-1 p-2 bg-muted/50 rounded text-xs">
          {DEFAULT_JSON_STRING}
        </pre>
      </div>
    </div>
  );
}
