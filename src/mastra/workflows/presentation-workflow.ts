import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { contentAdjustmentAgent } from "../agents/content-adjustment-agent";
import { slideTemplateSelectionAgent } from "../agents/slide-template-selection-agent";
import { SlideTemplate } from "../types/slide-templates";
import { IntelligentSlideSplitter } from "@/lib/intelligent-slide-splitter";
import { GammaStyleTemplateMatcher } from "@/lib/gamma-style-template-matcher";

// Debug: Test enum import
console.log("🔍 Enum import test - CONTENT:", SlideTemplate.CONTENT);
console.log(
  "🔍 Enum import test - CONTENT type:",
  typeof SlideTemplate.CONTENT
);
console.log("🔍 Entire SlideTemplate enum:", SlideTemplate);

// Helper function to get the string value from enum
function getTemplateValue(template: SlideTemplate): string {
  const value = template as string;
  console.log(
    "🔍 Converting template enum to string:",
    template,
    "->",
    value,
    "type:",
    typeof value
  );
  return value;
}

// Helper function to sanitize content and fix encoding issues
function sanitizeContent(content: string): string {
  if (!content) return content;

  // Remove any non-ASCII characters that might cause rendering issues
  let sanitized = content
    .replace(/[^\x00-\x7F]/g, "") // Remove non-ASCII characters
    .replace(/\u00A0/g, " ") // Replace non-breaking spaces with regular spaces
    .replace(/\u2013/g, "-") // Replace en-dash with regular dash
    .replace(/\u2014/g, "--") // Replace em-dash with double dash
    .replace(/\u2018/g, "'") // Replace left single quote
    .replace(/\u2019/g, "'") // Replace right single quote
    .replace(/\u201C/g, '"') // Replace left double quote
    .replace(/\u201D/g, '"') // Replace right double quote
    .replace(/\u2026/g, "...") // Replace ellipsis
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\r/g, "\n"); // Normalize line endings

  return sanitized;
}

// Helper function to sanitize input data recursively
function sanitizeInputData(data: any): any {
  if (typeof data === "string") {
    return sanitizeContent(data);
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeInputData(item));
  }

  if (data && typeof data === "object") {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInputData(value);
    }
    return sanitized;
  }

  return data;
}

// Helper function to parse JSON from agent responses
function parseAgentResponse(result: any): any {
  if (!result.text) {
    return result;
  }

  try {
    let textToParse = result.text;

    // Remove code block markers if present
    if (textToParse.includes("```json")) {
      textToParse = textToParse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    }

    // Try to parse as JSON
    const parsed = JSON.parse(textToParse);

    // Sanitize content in slides more aggressively
    if (parsed.slides && Array.isArray(parsed.slides)) {
      parsed.slides = parsed.slides.map((slide: any) => ({
        ...slide,
        title: sanitizeContent(slide.title || ""),
        content: sanitizeContent(slide.content || ""),
        // Sanitize any other string fields that might exist
        ...Object.fromEntries(
          Object.entries(slide).map(([key, value]) => [
            key,
            typeof value === "string" ? sanitizeContent(value) : value,
          ])
        ),
      }));
    }

    return parsed;
  } catch (error) {
    console.log("⚠️ Failed to parse agent response as JSON:", error);
    console.log("📊 Raw response text:", result.text);
    // Return the original result if parsing fails
    return result;
  }
}

// Process slides for overflow and intelligently split when needed
function processSlidesForOverflow(slides: any[]): any[] {
  const processedSlides = [];

  for (const slide of slides) {
    const needsSplitting = IntelligentSlideSplitter.needsSplitting(slide);
    if (needsSplitting) {
      const splitSlides = IntelligentSlideSplitter.splitSlide(slide);
      processedSlides.push(...splitSlides);
    } else {
      processedSlides.push(slide);
    }
  }

  return processedSlides;
}

// Apply gamma-style template recommendations to slides
function applyTemplateRecommendations(slides: any[]): any[] {
  // DISABLED: Let the agent's template selection be the final decision
  // The agent has already made careful template selections based on strict rules
  // We should not override these decisions with gamma-style matching

  console.log(
    "🎯 Respecting agent's template selections - no gamma-style overrides"
  );

  return slides.map((slide) => {
    // Ensure templateData is properly structured
    return {
      ...slide,
      templateData: slide.templateData || {},
    };
  });
}

// Standardize the output format for the presentation editor
function standardizePresentationOutput(result: any): any {
  // Ensure we have the expected structure
  const standardized = {
    title: result.title || "Generated Presentation",
    slides: result.slides || [],
    theme: result.theme || "modern",
    estimatedDuration: result.estimatedDuration || 10,
  };

  // Ensure each slide has the required properties
  standardized.slides = standardized.slides.map(
    (slide: any, index: number) => ({
      id: slide.id || `slide-${index + 1}`,
      title: slide.title || `Slide ${index + 1}`,
      content: slide.content || "",
      template: slide.template || "content",
      templateData: slide.templateData || {},
      order: slide.order || index + 1,
    })
  );

  return standardized;
}

// Dynamic input schema that accepts any structure
const DynamicWorkflowInputSchema = z.union([
  // Option 1: Structured data with title and content
  z.object({
    title: z.string().optional(),
    content: z.any(), // Can be string, array, object, etc.
  }),
  // Option 2: Plain text input
  z.string(),
  // Option 3: Any structured object
  z.record(z.any()),
  // Option 4: Array of content items
  z.array(z.any()),
]);

// Output schema for the workflow
const WorkflowOutputSchema = z.object({
  title: z.string(),
  slides: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      template: z.string(),
      templateData: z.any().optional(),
      order: z.number(),
    })
  ),
  theme: z.string(),
  estimatedDuration: z.number(),
});

// Step 1: Content Adjustment Step
const contentAdjustmentStep = createStep({
  id: "content-adjustment-step",
  inputSchema: DynamicWorkflowInputSchema,
  outputSchema: z.any(),
  execute: async ({ inputData }) => {
    console.log("🔄 Starting content adjustment step");

    // Sanitize input data before processing
    const sanitizedInputData = sanitizeInputData(inputData);
    const inputText = JSON.stringify(sanitizedInputData);

    const result = await contentAdjustmentAgent.generate([
      {
        role: "user",
        content: `Please process this input and organize it into presentation slides: ${inputText}`,
      },
    ]);

    const parsedResult = parseAgentResponse(result);
    console.log("✅ Content adjustment completed");

    return parsedResult;
  },
});

// Step 2: Template Selection Step
const templateSelectionStep = createStep({
  id: "template-selection-step",
  inputSchema: z.any(),
  outputSchema: WorkflowOutputSchema,
  execute: async ({ inputData }) => {
    console.log("🔄 Starting template selection step");

    // Process slides for overflow
    const processedSlides = processSlidesForOverflow(inputData.slides || []);

    // Update input with processed slides
    const updatedInputData = {
      ...inputData,
      slides: processedSlides,
    };

    console.log("📊 Processing template selection for slides");

    // Dynamic content processing - no static SWOT handling
    const expandedSlides = updatedInputData.slides;

    // Update inputData with expanded slides
    const finalInputData = {
      ...updatedInputData,
      slides: expandedSlides,
    };

    const inputText = JSON.stringify(finalInputData);

    const result = await slideTemplateSelectionAgent.generate([
      {
        role: "user",
        content: `Please select appropriate templates for these slides: ${inputText}`,
      },
    ]);

    const parsedResult = parseAgentResponse(result);

    console.log(
      `📊 Agent processed ${parsedResult.slides?.length || 0} slides`
    );

    // Debug: Log template selections
    if (parsedResult.slides) {
      parsedResult.slides.forEach((slide: any, index: number) => {
        console.log(`📊 Slide ${index + 1}:`, {
          title: slide.title,
          template: slide.template,
          hasTemplateData: !!slide.templateData,
          templateDataKeys: slide.templateData
            ? Object.keys(slide.templateData)
            : [],
          content: slide.content?.substring(0, 100) + "...",
        });
      });
    }

    // Apply gamma-style template recommendations
    const slidesWithTemplates = applyTemplateRecommendations(
      parsedResult.slides || []
    );

    console.log("✅ Intelligent template selection complete");

    const finalResult = {
      ...inputData,
      slides: slidesWithTemplates,
    };

    // Standardize the output format
    const standardizedResult = standardizePresentationOutput(finalResult);

    console.log("✅ Template selection completed");
    return standardizedResult;
  },
});

// Main Presentation Workflow using Mastra workflow control flow
export const presentationWorkflow = createWorkflow({
  id: "presentation-workflow",
  inputSchema: DynamicWorkflowInputSchema,
  outputSchema: WorkflowOutputSchema,
})
  .then(contentAdjustmentStep)
  .then(templateSelectionStep)
  .commit();

// Main function to generate presentation with multi-agent workflow
export async function generatePresentationWithMultiAgentWorkflow(
  inputData: any
): Promise<any> {
  try {
    console.log("🚀 Starting multi-agent presentation generation workflow");

    const result = await presentationWorkflow.execute(inputData);

    console.log("✅ Multi-agent workflow completed successfully");

    // Ensure the result is properly standardized
    const standardizedData = standardizePresentationOutput(result);

    return {
      success: true,
      data: standardizedData,
      enhanced: true,
      multiAgent: true,
      templateSelection: "intelligent-mastra-workflow",
      workflow: "presentation-workflow",
    };
  } catch (error) {
    console.error("❌ Error in multi-agent workflow:", error);
    throw error;
  }
}
