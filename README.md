# Mandelbrot Explorer

<img width="1264" height="1103" alt="Screenshot 2025-10-04 at 18 55 37" src="https://github.com/user-attachments/assets/f839e776-82fe-4158-b0b0-138c90c24749" />

An interactive web application for exploring the famous Mandelbrot set fractal. Built with Next.js, TypeScript, and modern web technologies.

## Features

### **Interactive Visualization**

- Real-time Mandelbrot set rendering using HTML5 Canvas
- Smooth zoom and pan controls with mouse and keyboard
- High-performance rendering with adaptive resolution
- Export functionality to save images as PNG

### **Dual Control Systems**

- **UI Controls**: Intuitive sliders and buttons for easy interaction
- **JSON Controls**: Advanced configuration via Monaco Editor with syntax highlighting
- Smart apply button that only appears when changes are detected

### **Advanced Color Schemes**

- **Preset Schemes**: Rainbow, Blood, Ocean, Sunset, Neon, Monochrome
- **Custom Schemes**: Create and save your own color palettes
- **Local Storage**: Persist custom schemes across sessions
- **Hex Color Support**: Direct color specification in JSON format

### **Mathematical Parameters**

- **Initial Condition**: Modify z₀ for Julia-like behavior
- **Escape Threshold**: Adjust the escape condition for different patterns
- **Max Iterations**: Control detail level and rendering performance
- **Viewport Control**: Precise coordinate system navigation

### **Configuration Management**

- **Load Examples**: 7 pre-configured examples including famous fractal locations
- **File Import**: Load custom JSON configurations
- **Export**: Save current settings as JSON files
- **Reset**: Return to default configuration

### **Famous Fractal Locations**

- **Seahorse Valley**: Intricate details with 200 iterations
- **Elephant Valley**: Extreme zoom with 500 iterations
- **Julia Set Explorer**: Modified initial conditions
- **Burning Ship**: Different escape thresholds
- **Spiral Galaxy**: High escape threshold patterns

## Performance Optimizations

### **Mouse Wheel Zoom Removal**

Mouse wheel zoom has been intentionally removed to optimize performance and user experience:

- **Scroll Conflict Prevention**: Eliminates interference between page scrolling and canvas zooming
- **Better Performance**: Reduces event handling overhead during scroll operations
- **Cleaner UX**: Prevents accidental zooming when scrolling the page
- **Precise Control**: UI zoom buttons provide more accurate zoom control

### **Rendering Optimizations**

- **Debounced Rendering**: 50ms delay during dragging for smoother performance
- **Adaptive Resolution**: Lower resolution during dragging, full resolution when stationary
- **Scroll Detection**: Prevents canvas dragging during page scroll
- **Lazy Loading**: Examples in load dialog only render when requested

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Editor**: Monaco Editor
- **Theme**: next-themes (Light/Dark/System)
- **Canvas**: HTML5 Canvas with WebGL acceleration

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/bytegen-dev/mandelbrot-explorer.git
cd mandelbrot-explorer
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Mouse Controls

- **Left Click + Drag**: Pan around the fractal
- **Double Click**: Reset to default view

> **Note**: Mouse wheel zoom has been removed for optimal performance. Use the UI controls for zooming instead.

### Keyboard Controls

- **Arrow Keys**: Pan in small increments
- **R Key**: Reset to default view

### Configuration Options

#### UI Controls

- **Zoom**: Use zoom buttons for precise control
- **Pan**: Directional buttons or drag
- **Iterations**: Slider (1-1000)
- **Color Scheme**: Preset or custom schemes
- **Viewport**: Manual coordinate input
- **Equation Parameters**: Initial condition and escape threshold

#### JSON Controls

- **Monaco Editor**: Full JSON configuration
- **Validation**: Real-time error checking
- **Format Example**: Built-in reference
- **Smart Apply**: Only shows when changes detected

### Color Schemes

#### Preset Schemes

- **Rainbow**: Classic red-yellow-green-cyan-blue-magenta
- **Blood**: Deep reds to bright yellows
- **Ocean**: Blues from deep sea to sky
- **Sunset**: Oranges and pinks
- **Neon**: Electric greens and purples
- **Monochrome**: Black and white gradients

#### Custom Schemes

- Create unlimited custom color palettes
- Name your schemes for easy identification
- Automatic local storage persistence
- Delete unwanted schemes

### Examples

The application includes 7 pre-configured examples:

1. **Classic Mandelbrot**: Traditional view
2. **Seahorse Valley**: Famous intricate details
3. **Elephant Valley**: Extreme zoom (0.0001 scale)
4. **Julia Set Explorer**: Modified initial conditions
5. **Burning Ship**: Different escape thresholds
6. **Mandelbrot Zoom**: Microscopic fractal boundary
7. **Spiral Galaxy**: High escape threshold patterns

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   └── page.tsx           # Main application page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── mandelbrot-canvas.tsx    # Canvas rendering component
│   ├── mandelbrot-controls.tsx  # Control interface
│   ├── json-controls.tsx       # JSON configuration
│   ├── custom-color-dialog.tsx # Color scheme management
│   ├── load-import-dialog.tsx  # Configuration loading
│   ├── theme-toggle.tsx        # Theme switching
│   └── theme-provider.tsx      # Theme context
├── constants/
│   └── mandelbrot-config.ts    # Color schemes and defaults
└── components/custom/
    └── Dither.tsx              # Background effects
```

## Development

### Key Components

- **MandelbrotCanvas**: Core rendering with complex number arithmetic
- **MandelbrotControls**: Dual UI/JSON control system
- **LoadImportDialog**: Configuration management
- **Theme System**: Light/dark mode with system preference

### Performance Optimizations

- **Adaptive Resolution**: Lower quality during dragging
- **Debounced Rendering**: Prevents excessive calculations
- **Efficient Algorithms**: Optimized complex number operations
- **Canvas Optimization**: Hardware-accelerated rendering

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **Benoit Mandelbrot**: For discovering the Mandelbrot set
- **Next.js Team**: For the amazing framework
- **shadcn/ui**: For beautiful components
- **Lucide**: For consistent iconography

## Links

- **GitHub**: [bytegen-dev/mandelbrot-explorer](https://github.com/bytegen-dev/mandelbrot-explorer)
- **Portfolio**: [bytegen.dev](https://bytegen.dev)
- **Twitter**: [@bytegen_dev](https://twitter.com/bytegen_dev)

---

Built by [Isaac Adebayo](https://github.com/bytegen-dev)
