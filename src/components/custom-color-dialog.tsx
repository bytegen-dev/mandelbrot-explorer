"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomColorScheme {
  name: string;
  colors: string[];
}

interface CustomColorDialogProps {
  onAddScheme: (scheme: CustomColorScheme) => void;
  onRemoveScheme: (name: string) => void;
  customSchemes: CustomColorScheme[];
}

export function CustomColorDialog({
  onAddScheme,
  onRemoveScheme,
  customSchemes,
}: CustomColorDialogProps) {
  const [open, setOpen] = useState(false);
  const [schemeName, setSchemeName] = useState("");
  const [colors, setColors] = useState(["#ff0000", "#00ff00", "#0000ff"]);

  const addColor = () => {
    setColors([...colors, "#000000"]);
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const handleSubmit = () => {
    if (schemeName.trim() && colors.length > 0) {
      onAddScheme({
        name: schemeName.trim(),
        colors: colors,
      });
      setSchemeName("");
      setColors(["#ff0000", "#00ff00", "#0000ff"]);
      setOpen(false);
    }
  };

  const handleRemove = (name: string) => {
    onRemoveScheme(name);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Custom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Custom Color Scheme</DialogTitle>
          <DialogDescription>
            Create a custom color scheme for the Mandelbrot set. Colors will be
            interpolated between the values you provide.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scheme-name">Scheme Name</Label>
            <Input
              id="scheme-name"
              value={schemeName}
              onChange={(e) => setSchemeName(e.target.value)}
              placeholder="Enter scheme name..."
            />
          </div>

          <div className="space-y-2">
            <Label>Colors</Label>
            <div className="space-y-2">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="w-8 h-8 rounded border border-border"
                  />
                  <Input
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="flex-1"
                  />
                  {colors.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeColor(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={addColor}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Color
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              Create Scheme
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
