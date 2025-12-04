import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  PresentationOutput,
  Slide,
  EditorState,
  PresentationTheme,
} from "@/lib/presentation-types";
import { SlideTemplate } from "@/mastra/types/slide-templates";
import { TemplateDataGenerator } from "@/lib/template-data-generator";
import { ContentRestructurer } from "@/lib/content-restructurer";
import { ContentPreservation } from "@/lib/content-preservation";

interface PresentationStore extends EditorState {
  presentation: PresentationOutput | null;
  theme: PresentationTheme;
  isPreviewMode: boolean;

  // Actions
  setPresentation: (presentation: PresentationOutput) => void;
  setCurrentSlide: (index: number) => void;
  updateSlide: (slideId: string, updates: Partial<Slide>) => void;
  updateSlideTemplate: (slideId: string, template: SlideTemplate) => void;
  revertSlideTemplate: (slideId: string) => void;
  addSlide: (slide: Omit<Slide, "id" | "order">) => void;
  deleteSlide: (slideId: string) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  setTheme: (theme: PresentationTheme) => void;
  setEditing: (editing: boolean) => void;
  setPreviewMode: (preview: boolean) => void;
  setUnsavedChanges: (hasChanges: boolean) => void;

  reset: () => void;
}

export const usePresentationStore = create<PresentationStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      presentation: null,
      currentSlide: 0,
      slides: [],
      isEditing: false,
      isPreviewMode: false,
      hasUnsavedChanges: false,
      theme: {
        id: "modern",
        name: "Modern",
        colors: {
          primary: "#3b82f6",
          secondary: "#1e40af",
          background: "#ffffff",
          text: "#1f2937",
        },
        fonts: {
          heading: "Inter",
          body: "Inter",
        },
      },

      // Actions
      setPresentation: (presentation) => {
        // console.log("🔍 setPresentation called with:", presentation);
        // console.log("📊 Number of slides:", presentation.slides?.length);
        // console.log(
        //   "📊 Slide titles:",
        //   presentation.slides?.map((s) => s.title)
        // );
        set({
          presentation,
          slides: presentation.slides,
          currentSlide: 0,
          isPreviewMode: true, // Default to preview mode when presentation is created
          hasUnsavedChanges: false,
        });
      },

      setCurrentSlide: (index) => {
        const { slides } = get();
        if (index >= 0 && index < slides.length) {
          set({ currentSlide: index });
        }
      },

      updateSlide: (slideId, updates) => {
        const { slides } = get();
        const updatedSlides = slides.map((slide) =>
          slide.id === slideId ? { ...slide, ...updates } : slide
        );

        // Clear original content when slide is manually edited
        // This ensures template changes always use the original content
        if (updates.title || updates.content) {
          ContentPreservation.clearOriginalContent(slideId);
        }

        set({
          slides: updatedSlides,
          hasUnsavedChanges: true,
        });
      },

      updateSlideTemplate: (slideId, template) => {
        const { slides } = get();
        const updatedSlides = slides.map((slide) => {
          if (slide.id === slideId) {
            // Check if we have original content preserved
            let originalContent =
              ContentPreservation.getOriginalContent(slideId);

            // If no original content exists, preserve the current slide content
            if (!originalContent) {
              ContentPreservation.forcePreserveOriginalContent(slideId, slide);
              originalContent = ContentPreservation.getOriginalContent(slideId);
            }

            // Always use the original content for extraction
            const titleToUse = originalContent?.title || slide.title;
            const contentToExtract = originalContent?.content || slide.content;

            // Extract all content data from ORIGINAL content only
            const extractedData = ContentPreservation.extractAllContentData(
              contentToExtract,
              titleToUse
            );

            // Create template-specific content while preserving all original data
            const templateContent = ContentPreservation.createTemplateContent(
              template,
              extractedData,
              {
                originalTitle: titleToUse,
                originalContent: contentToExtract,
              }
            );

            return {
              ...slide,
              template,
              templateData: templateContent.templateData || null,
              // Keep original content intact, only update template data
              content: contentToExtract, // Always use original content
              title: titleToUse, // Always use original title
            };
          }
          return slide;
        });
        set({
          slides: updatedSlides,
          hasUnsavedChanges: true,
        });
      },

      revertSlideTemplate: (slideId) => {
        const { slides } = get();
        const originalContent =
          ContentPreservation.restoreOriginalContent(slideId);

        if (originalContent) {
          const updatedSlides = slides.map((slide) => {
            if (slide.id === slideId) {
              return {
                ...slide,
                title: originalContent.title,
                content: originalContent.content,
                template: originalContent.template,
                templateData: originalContent.templateData || null,
              };
            }
            return slide;
          });

          set({
            slides: updatedSlides,
            hasUnsavedChanges: true,
          });
        }
      },

      addSlide: (newSlide) => {
        const { slides } = get();
        const slide: Slide = {
          ...newSlide,
          id: `slide-${Date.now()}`,
          order: slides.length + 1,
        };
        set({
          slides: [...slides, slide],
          hasUnsavedChanges: true,
        });
      },

      deleteSlide: (slideId) => {
        const { slides, currentSlide } = get();
        const slideIndex = slides.findIndex((slide) => slide.id === slideId);
        if (slideIndex === -1) return;

        const updatedSlides = slides.filter((slide) => slide.id !== slideId);
        const newCurrentSlide =
          currentSlide >= updatedSlides.length
            ? Math.max(0, updatedSlides.length - 1)
            : currentSlide;

        set({
          slides: updatedSlides,
          currentSlide: newCurrentSlide,
          hasUnsavedChanges: true,
        });
      },

      reorderSlides: (fromIndex, toIndex) => {
        const { slides } = get();
        const updatedSlides = [...slides];
        const [movedSlide] = updatedSlides.splice(fromIndex, 1);
        updatedSlides.splice(toIndex, 0, movedSlide);

        // Update order numbers
        const reorderedSlides = updatedSlides.map((slide, index) => ({
          ...slide,
          order: index + 1,
        }));

        set({
          slides: reorderedSlides,
          hasUnsavedChanges: true,
        });
      },

      setTheme: (theme) => {
        set({ theme });
      },

      setEditing: (editing) => {
        set({ isEditing: editing });
      },

      setPreviewMode: (preview) => {
        set({ isPreviewMode: preview });
      },

      setUnsavedChanges: (hasChanges) => {
        set({ hasUnsavedChanges: hasChanges });
      },

      reset: () => {
        set({
          presentation: null,
          currentSlide: 0,
          slides: [],
          isEditing: false,
          isPreviewMode: false,
          hasUnsavedChanges: false,
        });
      },
    }),
    {
      name: "presentation-store",
    }
  )
);
