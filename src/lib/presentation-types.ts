// Re-export types for frontend use
export type {
  PresentationInput,
  PresentationOutput,
  Slide,
  SlideType,
  SlideLayout,
} from "../mastra/types/presentation";

// Additional frontend-specific types
export interface EditorState {
  currentSlide: number;
  slides: import("../mastra/types/presentation").Slide[];
  isEditing: boolean;
  hasUnsavedChanges: boolean;
}

export interface PresentationTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export const PRESENTATION_THEMES: PresentationTheme[] = [
  {
    id: "modern",
    name: "Modern",
    colors: {
      primary: "#3b82f6",
      secondary: "#1e40af",
      background: "#ffffff",
      text: "#1f2937",
    },
    fonts: {
      heading: "var(--font-inter)",
      body: "var(--font-inter)",
    },
  },
  {
    id: "dark",
    name: "Dark",
    colors: {
      primary: "#8b5cf6",
      secondary: "#7c3aed",
      background: "#1f2937",
      text: "#f9fafb",
    },
    fonts: {
      heading: "var(--font-inter)",
      body: "var(--font-inter)",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    colors: {
      primary: "#000000",
      secondary: "#6b7280",
      background: "#ffffff",
      text: "#374151",
    },
    fonts: {
      heading: "Helvetica, sans-serif",
      body: "Helvetica, sans-serif",
    },
  },
  {
    id: "corporate",
    name: "Corporate",
    colors: {
      primary: "#1e40af",
      secondary: "#3b82f6",
      background: "#ffffff",
      text: "#1f2937",
    },
    fonts: {
      heading: "Georgia, serif",
      body: "Georgia, serif",
    },
  },
  {
    id: "creative",
    name: "Creative",
    colors: {
      primary: "#ec4899",
      secondary: "#be185d",
      background: "#fef7ff",
      text: "#1f2937",
    },
    fonts: {
      heading: "var(--font-poppins)",
      body: "var(--font-poppins)",
    },
  },
  {
    id: "professional",
    name: "Professional",
    colors: {
      primary: "#059669",
      secondary: "#047857",
      background: "#ffffff",
      text: "#1f2937",
    },
    fonts: {
      heading: "var(--font-roboto)",
      body: "var(--font-roboto)",
    },
  },
  {
    id: "warm",
    name: "Warm",
    colors: {
      primary: "#f59e0b",
      secondary: "#d97706",
      background: "#fffbeb",
      text: "#1f2937",
    },
    fonts: {
      heading: "var(--font-merriweather)",
      body: "var(--font-merriweather)",
    },
  },
  {
    id: "cool",
    name: "Cool",
    colors: {
      primary: "#06b6d4",
      secondary: "#0891b2",
      background: "#f0f9ff",
      text: "#1f2937",
    },
    fonts: {
      heading: "var(--font-open-sans)",
      body: "var(--font-open-sans)",
    },
  },
  {
    id: "elegant",
    name: "Elegant",
    colors: {
      primary: "#7c3aed",
      secondary: "#5b21b6",
      background: "#faf5ff",
      text: "#1f2937",
    },
    fonts: {
      heading: "var(--font-playfair-display)",
      body: "var(--font-source-sans-3)",
    },
  },
  {
    id: "tech",
    name: "Tech",
    colors: {
      primary: "#10b981",
      secondary: "#059669",
      background: "#f0fdf4",
      text: "#1f2937",
    },
    fonts: {
      heading: "var(--font-jetbrains-mono)",
      body: "var(--font-jetbrains-mono)",
    },
  },
];
