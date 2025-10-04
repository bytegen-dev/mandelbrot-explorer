"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderOpen, FileText, Sparkles } from "lucide-react";
import { DEFAULT_EXAMPLES } from "@/constants/mandelbrot-config";

interface LoadImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadConfiguration: (config: {
    viewport: { x: number; y: number; width: number; height: number };
    iterations: number;
    colorScheme: string[];
    initialCondition: { real: number; imag: number };
    escapeThreshold: number;
  }) => void;
}

export function LoadImportDialog({
  isOpen,
  onClose,
  onLoadConfiguration,
}: LoadImportDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  const handleFileLoad = async () => {
    if (!selectedFile) return;

    try {
      const text = await selectedFile.text();
      const config = JSON.parse(text);

      // Validate the configuration
      if (
        !config.viewport ||
        !config.iterations ||
        !config.colorScheme ||
        !config.initialCondition ||
        !config.escapeThreshold
      ) {
        throw new Error("Invalid configuration format");
      }

      onLoadConfiguration(config);
      onClose();
      setSelectedFile(null);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load file");
    }
  };

  const handleExampleLoad = (config: (typeof defaultExamples)[0]["config"]) => {
    onLoadConfiguration(config);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Load Configuration
          </DialogTitle>
          <DialogDescription>
            Import a JSON configuration file or select from default examples
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <h3 className="text-sm font-medium">Import from File</h3>
            </div>

            <div className="space-y-3">
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />

              {selectedFile && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-foreground">
                    {selectedFile.name}
                  </span>
                  <Button size="sm" onClick={handleFileLoad} disabled={!!error}>
                    Load File
                  </Button>
                </div>
              )}

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Examples Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-sm font-medium">Default Examples</h3>
            </div>

            <div className="grid gap-3">
              {DEFAULT_EXAMPLES.map((example, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleExampleLoad(example.config)}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">
                      {example.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {example.description}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Iterations: {example.config.iterations}</span>
                      <span>Escape: {example.config.escapeThreshold}</span>
                      <span>Colors: {example.config.colorScheme.length}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Load
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
