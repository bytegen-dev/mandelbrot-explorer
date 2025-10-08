"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { MandelbrotCanvas } from "@/components/mandelbrot-canvas";
import { MandelbrotControls } from "@/components/mandelbrot-controls";
import { LoadImportDialog } from "@/components/load-import-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Lightbulb,
  Download,
  Github,
  Globe,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  FileImage,
  FileText,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Dither from "@/components/custom/Dither";
import { DEFAULT_CONFIG } from "@/constants/mandelbrot-config";

interface CustomColorScheme {
  name: string;
  colors: string[];
}

export default function Home() {
  const [viewport, setViewport] = useState({
    x: -2.5,
    y: -2,
    width: 4,
    height: 4,
  });
  const [maxIterations, setMaxIterations] = useState(50);
  const [colorScheme, setColorScheme] = useState("rainbow");
  const [customSchemes, setCustomSchemes] = useState<CustomColorScheme[]>([]);
  const [directColors, setDirectColors] = useState<string[] | undefined>(
    undefined
  );

  // Canvas ref for export functionality
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll state for header padding
  const [isScrolled, setIsScrolled] = useState(false);

  // Mandelbrot equation parameters
  const [initialCondition, setInitialCondition] = useState({
    real: 0,
    imag: 0,
  });
  const [escapeThreshold, setEscapeThreshold] = useState(2);

  // How to Use section state
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);

  // Load dialog state
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);

  // Export canvas as PNG
  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a link element to trigger download
    const link = document.createElement("a");
    link.download = `mandelbrot-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Export configuration as JSON
  const exportConfiguration = () => {
    const config = {
      viewport,
      iterations: maxIterations,
      colorScheme:
        directColors ||
        (() => {
          const customScheme = customSchemes.find(
            (scheme) => scheme.name === colorScheme
          );
          if (customScheme) return customScheme.colors;
          // Return preset colors based on scheme name
          const presetColors: Record<string, string[]> = {
            rainbow: [
              "#ff0000",
              "#ffff00",
              "#00ff00",
              "#00ffff",
              "#0000ff",
              "#ff00ff",
            ],
            blood: [
              "#000000",
              "#2C0000",
              "#4B0000",
              "#8B0000",
              "#B22222",
              "#DC143C",
              "#FF4500",
              "#FF6347",
              "#FFD700",
              "#FFE4B5",
              "#FFFFFF",
            ],
            ocean: [
              "#000011",
              "#000033",
              "#000080",
              "#191970",
              "#4169E1",
              "#6495ED",
              "#87CEEB",
              "#B0E0E6",
              "#E0F6FF",
              "#F0F8FF",
              "#FFFFFF",
            ],
            sunset: [
              "#000000",
              "#2F1B14",
              "#4A2C2A",
              "#8B0000",
              "#FF4500",
              "#FF6347",
              "#FF69B4",
              "#FF1493",
              "#FFB6C1",
              "#FFC0CB",
              "#FFFFFF",
            ],
            neon: [
              "#000000",
              "#001100",
              "#003300",
              "#00FF00",
              "#00FFFF",
              "#0080FF",
              "#FF00FF",
              "#FF0080",
              "#FFFF00",
              "#FFFF80",
              "#FFFFFF",
            ],
            monochrome: [
              "#000000",
              "#1A1A1A",
              "#333333",
              "#4D4D4D",
              "#666666",
              "#808080",
              "#999999",
              "#B3B3B3",
              "#CCCCCC",
              "#E6E6E6",
              "#FFFFFF",
            ],
          };
          return presetColors[colorScheme] || presetColors.rainbow;
        })(),
      initialCondition,
      escapeThreshold,
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.download = `mandelbrot-config-${Date.now()}.json`;
    link.href = URL.createObjectURL(dataBlob);
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  };

  // Load configuration from file or examples
  const handleLoadConfiguration = (config: {
    viewport: { x: number; y: number; width: number; height: number };
    iterations: number;
    colorScheme: string[];
    initialCondition: { real: number; imag: number };
    escapeThreshold: number;
  }) => {
    setViewport(config.viewport);
    setMaxIterations(config.iterations);
    setDirectColors(config.colorScheme);
    setInitialCondition(config.initialCondition);
    setEscapeThreshold(config.escapeThreshold);
    setColorScheme("JSON-scheme"); // This will show the loaded colors
  };

  // Shared reset function for both UI and JSON controls
  const handleReset = () => {
    setViewport(DEFAULT_CONFIG.viewport);
    setMaxIterations(DEFAULT_CONFIG.iterations);
    setColorScheme("rainbow");
    setDirectColors(undefined);
    setInitialCondition(DEFAULT_CONFIG.initialCondition);
    setEscapeThreshold(DEFAULT_CONFIG.escapeThreshold);
  };

  // Load custom schemes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mandelbrot-custom-schemes");
    if (saved) {
      try {
        setCustomSchemes(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load custom schemes:", error);
      }
    }
  }, []);

  // Save custom schemes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "mandelbrot-custom-schemes",
      JSON.stringify(customSchemes)
    );
  }, [customSchemes]);

  // Handle scroll for header padding
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddCustomScheme = (scheme: CustomColorScheme) => {
    setCustomSchemes((prev) => [...prev, scheme]);
  };

  const handleColorSchemeChange = (scheme: string) => {
    setColorScheme(scheme);
    // Only clear direct colors if switching to a preset scheme (not JSON-scheme)
    if (scheme !== "JSON-scheme") {
      setDirectColors(undefined);
    }
  };

  const handleRemoveCustomScheme = (name: string) => {
    // Handle JSON-scheme deletion specially
    if (name === "JSON-scheme") {
      setDirectColors(undefined);
      setColorScheme("rainbow");
      return;
    }

    setCustomSchemes((prev) => prev.filter((scheme) => scheme.name !== name));
    // If the removed scheme was selected, switch to rainbow
    if (colorScheme === name) {
      setColorScheme("rainbow");
      setDirectColors(undefined); // Clear direct colors when switching
    }
  };

  const handleCustomColorSchemeChange = (colors: string[]) => {
    // Apply colors directly and set colorScheme to "JSON-scheme"
    setDirectColors(colors);
    setColorScheme("JSON-scheme");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 pt-4">
        <div
          className={`w-full max-w-[1200px] mx-auto transition-all duration-300 px-4`}
        >
          <div
            className={`container flex h-14 items-center justify-between p-2 w-full mx-auto border rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300`}
          >
            <div className="flex items-center">
              <div className="relative">
        <Image
                  src="/logo.png"
                  alt="Mandelbrot Explorer"
                  width={32}
                  height={32}
                  className="h-8 w-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLoadDialogOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted/50 transition-colors"
                title="Load configuration from file or examples"
              >
                <FolderOpen className="h-4 w-4" />
                Load
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted/50 transition-colors"
                    title="Export options"
                  >
                    <Download className="h-4 w-4" />
                    Export
                    <ChevronDownIcon className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportCanvas}>
                    <FileImage className="h-4 w-4 mr-2" />
                    Export as PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportConfiguration}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto p-4 max-w-[1200px]">
          <div className="space-y-8">
            {/* Project Description */}
            <div className="bg-card border rounded-lg shadow-sm relative overflow-hidden">
              <div className="w-full h-full absolute inset-0 top-0 left-0">
                <Dither
                  waveColor={[0.5, 0.5, 0.5]}
                  disableAnimation={false}
                  enableMouseInteraction={true}
                  mouseRadius={0.3}
                  colorNum={4}
                  waveAmplitude={0.3}
                  waveFrequency={3}
                  waveSpeed={0.05}
                />
              </div>
              <div className="text-center space-y-3 relative z-10 pointer-events-none bg-black/50 p-10">
                <h1 className="text-3xl font-bold text-foreground font-mono text-white">
                  Mandelbrot Explorer
                </h1>
                {/* <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  An interactive exploration of the famous Mandelbrot fractal.
                  Zoom, pan, and customize colors to discover the infinite
                  complexity of this mathematical wonder.
                </p>
                <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                  <span>• Interactive zoom & pan</span>
                  <span>• Custom color schemes</span>
                  <span>• Export as PNG</span>
                </div> */}
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
              {/* Controls */}
              <div className="xl:col-span-1">
                <div className="bg-card border rounded-lg p-6 shadow-sm">
                  <MandelbrotControls
                    onViewportChange={setViewport}
                    onIterationsChange={setMaxIterations}
                    onColorSchemeChange={handleColorSchemeChange}
                    onAddCustomScheme={handleAddCustomScheme}
                    onRemoveCustomScheme={handleRemoveCustomScheme}
                    onCustomColorSchemeChange={handleCustomColorSchemeChange}
                    onReset={handleReset}
                    currentViewport={viewport}
                    currentIterations={maxIterations}
                    currentColorScheme={colorScheme}
                    customSchemes={customSchemes}
                    directColors={directColors}
                    initialCondition={initialCondition}
                    escapeThreshold={escapeThreshold}
                    onInitialConditionChange={setInitialCondition}
                    onEscapeThresholdChange={setEscapeThreshold}
                  />
                </div>

                {/* Social Links */}
                <div className="bg-card border rounded-lg p-4 shadow-sm mt-6 xl:block hidden">
                  <div className="text-center space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground w-full py-2 border-b border-border">
                      Connect with me
                    </h3>
                    <div className="flex justify-center gap-4">
                      <a
                        href="https://github.com/bytegen_dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground bg-background border border-border rounded-md hover:bg-muted/50 transition-colors"
                        title="View on GitHub"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                      <a
                        href="https://x.com/bytegen_dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground bg-background border border-border rounded-md hover:bg-muted/50 transition-colors"
                        title="Follow on X"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        X/Twitter
          </a>
          <a
                        href="https://bytegen.dev"
            target="_blank"
            rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground bg-background border border-border rounded-md hover:bg-muted/50 transition-colors"
                        title="Visit Portfolio"
          >
                        <Globe className="h-4 w-4" />
                        Website
          </a>
        </div>
                  </div>
                </div>
              </div>

              {/* Canvas and How to Use */}
              <div className="xl:col-span-2 space-y-6">
                {/* Canvas */}
                <div className="flex justify-center">
                  <div className="bg-card border rounded-lg p-4 shadow-sm">
                    <MandelbrotCanvas
                      viewport={viewport}
                      maxIterations={maxIterations}
                      colorScheme={colorScheme}
                      customSchemes={customSchemes}
                      directColors={directColors}
                      onViewportChange={setViewport}
                      canvasRef={canvasRef}
                      initialCondition={initialCondition}
                      escapeThreshold={escapeThreshold}
                    />
                  </div>
                </div>

                {/* How to Use Section */}
                <div className="border rounded-lg p-6 shadow-sm">
                  <button
                    onClick={() => setIsHowToUseOpen(!isHowToUseOpen)}
                    className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent bg-transparent border-none outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          How to Use -{" "}
                          <small className="text-muted-foreground">
                            Interactive controls guide
                          </small>
                        </h3>
                      </div>
                    </div>
                    {isHowToUseOpen ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>

                  {isHowToUseOpen && (
                    <div className="mt-6 space-y-4">
                      <div className="grid gap-3">
                        <div className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-border/50">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              1
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-1">
                              Mouse Controls
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              <strong>Click & drag:</strong> Pan around the
                              fractal • <strong>Double-click:</strong> Reset to
                              default view
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-border/50">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              2
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-1">
                              UI Controls
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Use sliders and buttons for zoom, pan, iterations,
                              color schemes, viewport editing, and equation
                              parameters (initial condition & escape threshold)
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-border/50">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              3
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-1">
                              JSON Controls
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Advanced configuration via Monaco Editor with
                              syntax highlighting, validation, and smart apply
                              button that only appears when changes are detected
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-border/50">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              4
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-1">
                              Color Schemes
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              <strong>Presets:</strong> Rainbow, Blood, Ocean,
                              Sunset, Neon, Monochrome •{" "}
                              <strong>Custom:</strong> Create and save your own
                              color palettes • <strong>Hex Colors:</strong>{" "}
                              Direct color specification in JSON
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-border/50">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              5
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-1">
                              Load Examples
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              <strong>Famous Locations:</strong> Seahorse
                              Valley, Elephant Valley, Julia Set Explorer •{" "}
                              <strong>Extreme Zooms:</strong> Microscopic views
                              with 1000+ iterations •{" "}
                              <strong>File Import:</strong> Load custom JSON
                              configurations
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-border/50">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              6
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-1">
                              Export & Theme
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              <strong>Export:</strong> Save canvas as PNG •{" "}
                              <strong>Theme:</strong> Light/Dark/System modes •{" "}
                              <strong>Reset:</strong> Return to default
                              configuration
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-border/50">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              7
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-1">
                              Mathematical Parameters
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              <strong>Initial Condition (z₀):</strong> Modify
                              for Julia-like behavior •{" "}
                              <strong>Escape Threshold:</strong> Adjust for
                              different patterns •{" "}
                              <strong>Max Iterations:</strong> Control detail
                              level and performance
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-card border rounded-lg p-4 shadow-sm mt-6 xl:hidden block">
                  <div className="text-center space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground w-full py-2 border-b border-border">
                      Connect with me
                    </h3>
                    <div className="flex justify-center gap-4">
                      <a
                        href="https://github.com/bytegen_dev"
          target="_blank"
          rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground bg-background border border-border rounded-md hover:bg-muted/50 transition-colors"
                        title="View on GitHub"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                      <a
                        href="https://x.com/bytegen_dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground bg-background border border-border rounded-md hover:bg-muted/50 transition-colors"
                        title="Follow on X"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        X/Twitter
        </a>
        <a
                        href="https://bytegen.dev"
          target="_blank"
          rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground bg-background border border-border rounded-md hover:bg-muted/50 transition-colors"
                        title="Visit Portfolio"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Load Import Dialog */}
      <LoadImportDialog
        isOpen={isLoadDialogOpen}
        onClose={() => setIsLoadDialogOpen(false)}
        onLoadConfiguration={handleLoadConfiguration}
      />
    </div>
  );
}
