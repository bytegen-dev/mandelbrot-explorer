// Preset color schemes for the Mandelbrot Explorer
export const PRESET_COLOR_SCHEMES: Record<string, string[]> = {
  rainbow: ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff"],
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

// Helper function to get preset colors by name
export const getPresetColors = (schemeName: string): string[] => {
  return PRESET_COLOR_SCHEMES[schemeName] || PRESET_COLOR_SCHEMES.rainbow;
};

// Default configuration for the Mandelbrot Explorer
export const DEFAULT_CONFIG = {
  viewport: {
    x: -2.5,
    y: -2.0,
    width: 4.0,
    height: 4.0,
  },
  iterations: 50,
  colorScheme: getPresetColors("rainbow"),
  initialCondition: { real: 0, imag: 0 },
  escapeThreshold: 2,
};

// Default JSON string for format examples
export const DEFAULT_JSON_STRING = JSON.stringify(DEFAULT_CONFIG, null, 2);

// Default examples for the load dialog
export const DEFAULT_EXAMPLES = [
  {
    name: "Classic Mandelbrot",
    description: "The traditional view of the famous fractal",
    config: {
      viewport: { x: -2.5, y: -2.0, width: 4.0, height: 4.0 },
      iterations: 50,
      colorScheme: [
        "#ff0000",
        "#ffff00",
        "#00ff00",
        "#00ffff",
        "#0000ff",
        "#ff00ff",
      ],
      initialCondition: { real: 0, imag: 0 },
      escapeThreshold: 2.0,
    },
  },
  {
    name: "Seahorse Valley",
    description: "Famous zoom location with intricate details",
    config: {
      viewport: { x: -0.75, y: 0.1, width: 0.5, height: 0.5 },
      iterations: 200,
      colorScheme: [
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
      initialCondition: { real: 0, imag: 0 },
      escapeThreshold: 2.0,
    },
  },
  {
    name: "Julia Set Explorer",
    description: "Modified initial condition creates Julia-like patterns",
    config: {
      viewport: { x: -2.0, y: -2.0, width: 4.0, height: 4.0 },
      iterations: 150,
      colorScheme: [
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
      initialCondition: { real: -0.7, imag: 0.27015 },
      escapeThreshold: 2.0,
    },
  },
];
