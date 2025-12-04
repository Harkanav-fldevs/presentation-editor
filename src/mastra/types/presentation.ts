import { z } from "zod";
import { SlideTemplate, TemplateDataSchema } from "./slide-templates";

// Input schema for JSON presentation data
export const PresentationInputSchema = z.object({
  title: z.string().describe("Presentation title"),
  description: z.string().optional().describe("Presentation description"),
  content: z
    .array(
      z.object({
        section: z.string().describe("Section title or heading"),
        content: z.string().describe("Section content"),
        type: z
          .enum(["text", "list", "image", "chart", "quote"])
          .optional()
          .describe("Content type"),
      })
    )
    .describe("Array of content sections"),
});

// Output schema for generated presentation
export const PresentationOutputSchema = z.object({
  title: z.string(),
  slides: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      type: z.enum([
        "title",
        "content",
        "list",
        "image",
        "chart",
        "quote",
        "conclusion",
      ]),
      layout: z.enum([
        "centered",
        "two-column",
        "full-width",
        "image-left",
        "image-right",
      ]),
      template: z.nativeEnum(SlideTemplate).optional(),
      templateData: TemplateDataSchema.optional(),
      order: z.number(),
      overflowDetected: z.boolean().optional().default(false),
      overflowDetails: z.array(z.string()).optional(),
      splitSlides: z.array(z.string()).optional().default([]),
    })
  ),
  theme: z.string(),
  estimatedDuration: z
    .number()
    .describe("Estimated presentation duration in minutes"),
});

// TypeScript types
export type PresentationInput = z.infer<typeof PresentationInputSchema>;
export type PresentationOutput = z.infer<typeof PresentationOutputSchema>;
export type Slide = PresentationOutput["slides"][0];
export type SlideType = Slide["type"];
export type SlideLayout = Slide["layout"];


