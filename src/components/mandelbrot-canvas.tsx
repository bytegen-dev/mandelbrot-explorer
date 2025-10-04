"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PRESET_COLOR_SCHEMES } from "@/constants/mandelbrot-config";

interface Complex {
  real: number;
  imag: number;
}

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

interface MandelbrotCanvasProps {
  viewport: Viewport;
  maxIterations: number;
  colorScheme: string;
  customSchemes: CustomColorScheme[];
  directColors?: string[]; // For JSON colors without creating a scheme
  onViewportChange: (viewport: Viewport) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>; // For export functionality
  initialCondition?: { real: number; imag: number };
  escapeThreshold?: number;
}

export function MandelbrotCanvas({
  viewport,
  maxIterations,
  colorScheme,
  customSchemes,
  directColors,
  onViewportChange,
  canvasRef: externalCanvasRef,
  initialCondition = { real: 0, imag: 0 },
  escapeThreshold = 2,
}: MandelbrotCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastViewport, setLastViewport] = useState(viewport);
  const [isScrolling, setIsScrolling] = useState(false);

  // Complex number operations
  const add = (a: Complex, b: Complex): Complex => ({
    real: a.real + b.real,
    imag: a.imag + b.imag,
  });

  const multiply = (a: Complex, b: Complex): Complex => ({
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real,
  });

  const magnitude = (z: Complex): number =>
    Math.sqrt(z.real * z.real + z.imag * z.imag);

  // Mandelbrot iteration
  const mandelbrotIteration = useCallback(
    (c: Complex, iterations: number = maxIterations): number => {
      let z: Complex = {
        real: initialCondition.real,
        imag: initialCondition.imag,
      };

      for (let i = 0; i < iterations; i++) {
        if (magnitude(z) > escapeThreshold) {
          return i;
        }
        z = add(multiply(z, z), c);
      }

      return iterations;
    },
    [maxIterations, initialCondition, escapeThreshold]
  );

  // Color schemes
  // Use preset color schemes from constants
  const presetColorSchemes = PRESET_COLOR_SCHEMES;

  // Helper function to interpolate between colors
  const interpolateColor = (
    color1: string,
    color2: string,
    factor: number
  ): string => {
    const hex1 = color1.replace("#", "");
    const hex2 = color2.replace("#", "");

    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);

    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Custom color scheme function
  const getCustomColor = (t: number, colors: string[]): string => {
    if (colors.length === 1) return colors[0];

    const scaledT = t * (colors.length - 1);
    const index = Math.floor(scaledT);
    const factor = scaledT - index;

    if (index >= colors.length - 1) return colors[colors.length - 1];

    return interpolateColor(colors[index], colors[index + 1], factor);
  };

  // Color mapping
  const getColor = useCallback(
    (iterations: number, maxIterations: number): string => {
      if (iterations === maxIterations) {
        return "#000000"; // Black for points in the set
      }

      const t = iterations / maxIterations;

      // Use direct colors if provided (from JSON)
      if (directColors && directColors.length > 0) {
        return getCustomColor(t, directColors);
      }

      // Check if it's a custom scheme
      const customScheme = customSchemes.find(
        (scheme) => scheme.name === colorScheme
      );
      if (customScheme) {
        return getCustomColor(t, customScheme.colors);
      }

      // Use preset color scheme
      const presetColors = presetColorSchemes[colorScheme];
      if (presetColors) {
        return getCustomColor(t, presetColors);
      }

      // Fallback to rainbow
      return getCustomColor(t, presetColorSchemes.rainbow);
    },
    [
      directColors,
      customSchemes,
      colorScheme,
      presetColorSchemes,
      getCustomColor,
    ]
  );

  // Render the Mandelbrot set
  const renderMandelbrot = useCallback(() => {
    const canvas = (externalCanvasRef || canvasRef).current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsRendering(true);

    const width = canvas.width;
    const height = canvas.height;

    // Use lower resolution during dragging for better performance
    const step = isDragging ? 2 : 1; // Skip every other pixel during dragging
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const iterations = isDragging ? Math.min(maxIterations, 30) : maxIterations; // Lower iterations during dragging

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        // Convert pixel coordinates to complex plane
        const real = viewport.x + (x / width) * viewport.width;
        const imag = viewport.y + (y / height) * viewport.height;

        const c: Complex = { real, imag };
        const iterationCount = mandelbrotIteration(c, iterations);
        const color = getColor(iterationCount, iterations);

        // Parse color and set pixel
        const rgb = color.match(/\d+/g);
        if (rgb) {
          const pixelIndex = (y * width + x) * 4;
          data[pixelIndex] = parseInt(rgb[0]); // Red
          data[pixelIndex + 1] = parseInt(rgb[1]); // Green
          data[pixelIndex + 2] = parseInt(rgb[2]); // Blue
          data[pixelIndex + 3] = 255; // Alpha
        }
      }
    }

    // Fill in skipped pixels during dragging for smoother appearance
    if (isDragging && step > 1) {
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const pixelIndex = (y * width + x) * 4;
          const r = data[pixelIndex];
          const g = data[pixelIndex + 1];
          const b = data[pixelIndex + 2];

          // Fill surrounding pixels with the same color
          for (let dy = 0; dy < step && y + dy < height; dy++) {
            for (let dx = 0; dx < step && x + dx < width; dx++) {
              const fillIndex = ((y + dy) * width + (x + dx)) * 4;
              data[fillIndex] = r;
              data[fillIndex + 1] = g;
              data[fillIndex + 2] = b;
              data[fillIndex + 3] = 255;
            }
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setIsRendering(false);
  }, [
    viewport,
    maxIterations,
    externalCanvasRef,
    canvasRef,
    getColor,
    isDragging,
    mandelbrotIteration,
  ]);

  // Mouse controls

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left click
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setLastViewport(viewport);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && !isScrolling) {
      const canvas = (externalCanvasRef || canvasRef).current;
      if (!canvas) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const canvasRect = canvas.getBoundingClientRect();
      const scaleX = viewport.width / canvasRect.width;
      const scaleY = viewport.height / canvasRect.height;

      const newX = lastViewport.x - deltaX * scaleX;
      const newY = lastViewport.y - deltaY * scaleY;

      onViewportChange({
        x: newX,
        y: newY,
        width: viewport.width,
        height: viewport.height,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    // Reset to default view
    onViewportChange({
      x: -2.5,
      y: -2,
      width: 4,
      height: 4,
    });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // Right-click zoom functionality
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaleX = viewport.width / canvas.width;
    const scaleY = viewport.height / canvas.height;

    const centerX = viewport.x + x * scaleX;
    const centerY = viewport.y + y * scaleY;

    const zoomFactor = 0.5;
    const newWidth = viewport.width * zoomFactor;
    const newHeight = viewport.height * zoomFactor;

    onViewportChange({
      x: centerX - newWidth / 2,
      y: centerY - newHeight / 2,
      width: newWidth,
      height: newHeight,
    });
  };

  // Debounced rendering to improve performance during dragging
  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        renderMandelbrot();
      },
      isDragging ? 50 : 0
    ); // 50ms delay during dragging, immediate otherwise

    return () => clearTimeout(timeoutId);
  }, [
    viewport,
    maxIterations,
    colorScheme,
    isDragging,
    initialCondition,
    escapeThreshold,
    renderMandelbrot,
  ]);

  // Detect page scrolling to prevent canvas dragging during scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      // Reset scrolling state after scroll ends
      const timeoutId = setTimeout(() => setIsScrolling(false), 150);
      return () => clearTimeout(timeoutId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full">
      <canvas
        ref={externalCanvasRef || canvasRef}
        width={800}
        height={600}
        className={`w-full max-w-full h-auto border-2 border-border rounded-lg shadow-lg bg-background ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ aspectRatio: "4/3" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      />
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="flex items-center gap-2 text-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">
              {isDragging ? "Updating..." : "Rendering..."}
            </span>
          </div>
        </div>
      )}
      {isDragging && !isRendering && (
        <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
          Dragging...
        </div>
      )}
    </div>
  );
}
