import { z } from "zod";

// Template types for different slide layouts
export enum SlideTemplate {
  // Basic templates
  TITLE_SLIDE = "title-slide",
  CONTENT = "content",
  TWO_COLUMN = "two-column",

  // Chart templates
  PIE_CHART = "pie-chart",
  BAR_CHART = "bar-chart",
  LINE_CHART = "line-chart",
  AREA_CHART = "area-chart",
  RADAR_CHART = "radar-chart",

  // Business templates
  COMPARISON_TABLE = "comparison-table",
  TIMELINE = "timeline",
  METRICS_DASHBOARD = "metrics-dashboard",

  // Content templates
  BULLET_LIST = "bullet-list",
  QUOTE = "quote",

  // Layout templates
  TWO_COLUMNS = "two-columns",
  THREE_COLUMNS = "three-columns",
  FOUR_COLUMNS = "four-columns",

  // Accent layouts
  ACCENT_LEFT = "accent-left",
  ACCENT_RIGHT = "accent-right",
  ACCENT_TOP = "accent-top",

  // Gamma-style Image Templates
  TWO_IMAGE_COLUMNS = "two-image-columns",
  THREE_IMAGE_COLUMNS = "three-image-columns",
  FOUR_IMAGE_COLUMNS = "four-image-columns",
  IMAGES_WITH_TEXT = "images-with-text",
  IMAGE_GALLERY = "image-gallery",
  TEAM_PHOTOS = "team-photos",
}

// Chart data schema
export const ChartDataSchema = z.object({
  type: z.enum(["pie", "bar", "line", "area", "radar"]),
  data: z.array(z.record(z.any())),
  xKey: z.string().optional(),
  yKey: z.string().optional(),
  dataKey: z.string().optional(),
  nameKey: z.string().optional(),
  colors: z.array(z.string()).optional(),
});

// SWOT matrix data schema
export const SwotDataSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  opportunities: z.array(z.string()),
  threats: z.array(z.string()),
});

// Individual SWOT component schemas
export const StrengthsDataSchema = z.object({
  strengths: z.array(z.string()),
});

export const WeaknessesDataSchema = z.object({
  weaknesses: z.array(z.string()),
});

export const OpportunitiesDataSchema = z.object({
  opportunities: z.array(z.string()),
});

export const ThreatsDataSchema = z.object({
  threats: z.array(z.string()),
});

// Comparison table schema
export const ComparisonDataSchema = z.object({
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
});

// Timeline schema
export const TimelineDataSchema = z.object({
  events: z.array(
    z.object({
      date: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
});

// Persona schema
export const PersonaDataSchema = z.object({
  name: z.string(),
  role: z.string(),
  demographics: z.record(z.string()),
  psychographics: z.record(z.string()),
  painPoints: z.array(z.string()),
  goals: z.array(z.string()),
});

// Metrics dashboard schema
export const MetricsDataSchema = z.object({
  metrics: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      change: z.string().optional(),
      trend: z.enum(["up", "down", "neutral"]).optional(),
    })
  ),
});

// Basic card schema
export const BasicCardSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  imagePosition: z.enum(["left", "right", "top", "bottom"]).optional(),
});

// Column data schema
export const ColumnDataSchema = z.object({
  columns: z.array(
    z.object({
      title: z.string().optional(),
      content: z.string(),
      image: z.string().optional(),
    })
  ),
});

// Bullet list schema
export const BulletListSchema = z.object({
  title: z.string().optional(),
  bullets: z.array(z.string()),
  image: z.string().optional(),
});

// Accent layout schema
export const AccentLayoutSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  image: z.string().optional(),
  accentColor: z.string().optional(),
  accentPosition: z.enum(["left", "right", "top", "background"]),
});

// Image gallery schema
export const ImageGallerySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  images: z.array(
    z.object({
      src: z.string(),
      alt: z.string().optional(),
      caption: z.string().optional(),
    })
  ),
  layout: z.enum(["grid", "masonry", "carousel"]).optional(),
});

// Team photos schema
export const TeamPhotosSchema = z.object({
  title: z.string().optional(),
  members: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      image: z.string(),
      bio: z.string().optional(),
    })
  ),
});

// Template data union
export const TemplateDataSchema = z.union([
  ChartDataSchema,
  SwotDataSchema,
  ComparisonDataSchema,
  TimelineDataSchema,
  PersonaDataSchema,
  MetricsDataSchema,
  BasicCardSchema,
  ColumnDataSchema,
  BulletListSchema,
  AccentLayoutSchema,
  ImageGallerySchema,
  TeamPhotosSchema,
  z.record(z.any()), // Fallback for other data
]);

export type ChartData = z.infer<typeof ChartDataSchema>;
export type SwotData = z.infer<typeof SwotDataSchema>;
export type StrengthsData = z.infer<typeof StrengthsDataSchema>;
export type WeaknessesData = z.infer<typeof WeaknessesDataSchema>;
export type OpportunitiesData = z.infer<typeof OpportunitiesDataSchema>;
export type ThreatsData = z.infer<typeof ThreatsDataSchema>;
export type ComparisonData = z.infer<typeof ComparisonDataSchema>;
export type TimelineData = z.infer<typeof TimelineDataSchema>;
export type PersonaData = z.infer<typeof PersonaDataSchema>;
export type MetricsData = z.infer<typeof MetricsDataSchema>;
export type BasicCardData = z.infer<typeof BasicCardSchema>;
export type ColumnData = z.infer<typeof ColumnDataSchema>;
export type BulletListData = z.infer<typeof BulletListSchema>;
export type AccentLayoutData = z.infer<typeof AccentLayoutSchema>;
export type ImageGalleryData = z.infer<typeof ImageGallerySchema>;
export type TeamPhotosData = z.infer<typeof TeamPhotosSchema>;
export type TemplateData = z.infer<typeof TemplateDataSchema>;
