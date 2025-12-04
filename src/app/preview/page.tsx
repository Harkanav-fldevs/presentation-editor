"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePresentationStore } from "@/stores/presentation-store";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import type { Slide, PresentationTheme } from "@/lib/presentation-types";
import { SlideTemplate } from "@/mastra/types/slide-templates";
import { ThemeSelector } from "@/components/editor/ThemeSelector";
import { TemplateDialog } from "@/components/editor/TemplateDialog";
import { Button } from "@/components/ui/button";
import { ChartSlide } from "@/components/presentation/ChartSlide";
import { BulletListSlide } from "@/components/presentation/BulletListSlide";
import { ColumnSlide } from "@/components/presentation/ColumnSlide";
import { AccentLayoutSlide } from "@/components/presentation/AccentLayoutSlide";
import { ImageGallerySlide } from "@/components/presentation/ImageGallerySlide";
import { TeamPhotosSlide } from "@/components/presentation/TeamPhotosSlide";
import { MetricsDashboardSlide } from "@/components/presentation/MetricsDashboardSlide";
import { parseChartDataFromSlide } from "@/lib/chart-utils";
import { ArrowLeft, Download, Edit, Layout, FileText, X } from "lucide-react";
import { getContrastTextColor } from "@/lib/theme-contrast-utils";

// Component for changing slide layout using TemplateDialog
function SlideLayoutChanger({ slide }: { slide: Slide }) {
  const { updateSlideTemplate, revertSlideTemplate } = usePresentationStore();

  const handleTemplateSelect = (template: SlideTemplate) => {
    // Update the slide template
    updateSlideTemplate(slide.id, template);
    // console.log(`Template changed to: ${template}`);
  };

  const handleRevert = () => {
    // Revert to original template
    revertSlideTemplate(slide.id);
    // console.log(`Template reverted for slide: ${slide.id}`);
  };

  return (
    <TemplateDialog
      currentTemplate={slide.template}
      onTemplateSelect={handleTemplateSelect}
      onRevert={handleRevert}
      isPreviewMode={true}
      slideId={slide.id}
    >
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white"
      >
        <Layout className="h-4 w-4 mr-1" />
        Template
      </Button>
    </TemplateDialog>
  );
}

// Component for editable slide content
function EditableSlideContent({
  slide,
  isEditMode,
  onContentChange,
  theme,
  updateSlide,
}: {
  slide: Slide;
  isEditMode: boolean;
  onContentChange: (content: string) => void;
  theme: PresentationTheme;
  updateSlide: (slideId: string, updates: Partial<Slide>) => void;
}) {
  const handleContentChange = (html: string) => {
    // Since we're only editing the content (not the title), pass the content directly
    onContentChange(html);
  };

  // Function to render specialized slide components
  const renderSpecializedSlide = () => {
    const template = slide.template as SlideTemplate;

    // Check if this slide should display a chart (even if not selected as chart template)
    const chartData = parseChartDataFromSlide(slide);
    if (chartData) {
      return (
        <ChartSlide
          title={slide.title}
          chartData={chartData}
          theme={theme}
          slideId={slide.id}
        />
      );
    }

    // Chart templates - check template first, then fallback to content parsing
    if (
      template === SlideTemplate.PIE_CHART ||
      template === SlideTemplate.BAR_CHART ||
      template === SlideTemplate.LINE_CHART ||
      template === SlideTemplate.AREA_CHART ||
      template === SlideTemplate.RADAR_CHART
    ) {
      // First, try to use templateData from agent
      if (slide.templateData && Object.keys(slide.templateData).length > 0) {
        return (
          <ChartSlide
            title={slide.title}
            chartData={slide.templateData as any}
            theme={theme}
            slideId={slide.id}
          />
        );
      }

      // If no templateData, try to parse chart data from content
      const chartData = parseChartDataFromSlide(slide);
      if (chartData) {
        return (
          <ChartSlide
            title={slide.title}
            chartData={chartData}
            theme={theme}
            slideId={slide.id}
          />
        );
      }
    }

    // Bullet list templates
    if (template === SlideTemplate.BULLET_LIST) {
      return (
        <BulletListSlide
          title={slide.title}
          bulletData={slide.templateData as any}
          theme={theme}
        />
      );
    }

    // Column templates
    if (
      template === SlideTemplate.TWO_COLUMNS ||
      template === SlideTemplate.THREE_COLUMNS ||
      template === SlideTemplate.FOUR_COLUMNS
    ) {
      return (
        <ColumnSlide
          title={slide.title}
          columnData={slide.templateData as any}
          theme={theme}
        />
      );
    }

    // Image gallery
    if (template === SlideTemplate.IMAGE_GALLERY) {
      return (
        <ImageGallerySlide
          title={slide.title}
          galleryData={slide.templateData as any}
        />
      );
    }

    // Team photos
    if (template === SlideTemplate.TEAM_PHOTOS) {
      return (
        <TeamPhotosSlide
          title={slide.title}
          teamData={slide.templateData as any}
        />
      );
    }

    // Metrics dashboard
    if (template === SlideTemplate.METRICS_DASHBOARD) {
      return (
        <MetricsDashboardSlide
          title={slide.title || ""}
          metricsData={slide.templateData as any}
          theme={theme}
        />
      );
    }

    // Default to TipTap editor for other templates
    return null;
  };

  // In edit mode, show TipTap editor for all slides except charts
  // Charts should remain non-editable and show their visual components
  if (isEditMode) {
    const template = slide.template as SlideTemplate;

    // Check if this is a chart slide - keep it non-editable
    const isChartSlide =
      template === SlideTemplate.PIE_CHART ||
      template === SlideTemplate.BAR_CHART ||
      template === SlideTemplate.LINE_CHART ||
      template === SlideTemplate.AREA_CHART ||
      template === SlideTemplate.RADAR_CHART ||
      parseChartDataFromSlide(slide); // Also check if content contains chart data

    if (isChartSlide) {
      // For chart slides, show the visual component even in edit mode
      const specializedSlide = renderSpecializedSlide();
      if (specializedSlide) {
        return specializedSlide;
      }
    }

    // For all other slides, show TipTap editor for editing
    return (
      <div className="relative w-full h-full">
        <div
          className="w-full h-full p-6 flex flex-col rounded-lg"
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
          }}
        >
          {/* Title section - matches DefaultContentRenderer */}
          {slide.title && (
            <div className="flex-shrink-0 mb-4">
              <input
                type="text"
                value={slide.title}
                onChange={(e) => {
                  updateSlide(slide.id, {
                    title: e.target.value,
                  });
                }}
                className="w-full text-xl font-bold text-center bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1"
                style={{
                  color: theme.colors.primary,
                  fontFamily: theme.fonts.heading,
                  lineHeight: "1.2",
                }}
              />
            </div>
          )}

          {/* Content section - matches DefaultContentRenderer */}
          <div
            className="w-full flex-1 overflow-y-auto"
            style={{
              maxHeight: "calc(100% - 5rem)",
              lineHeight: "1.6",
              fontSize: "0.875rem",
            }}
          >
            <TiptapEditor
              content={slide.content}
              onChange={handleContentChange}
              placeholder="Click here to start editing your slide..."
              className="w-full h-full"
              editable={true}
            />
          </div>
        </div>
      </div>
    );
  }

  // In preview mode, try to render specialized slide first
  const specializedSlide = renderSpecializedSlide();
  if (specializedSlide) {
    return specializedSlide;
  }

  // Default TipTap editor for preview mode when no specialized component matches
  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full p-6 flex flex-col rounded-lg"
        style={{
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          fontFamily: theme.fonts.body,
        }}
      >
        {/* Title section - matches DefaultContentRenderer */}
        {slide.title && (
          <div className="flex-shrink-0 mb-4">
            <h1
              className="w-full text-xl font-bold text-center"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.fonts.heading,
                lineHeight: "1.2",
              }}
            >
              {slide.title}
            </h1>
          </div>
        )}

        {/* Content section - matches DefaultContentRenderer */}
        <div
          className="w-full flex-1 overflow-y-auto"
          style={{
            maxHeight: "calc(100% - 5rem)",
            lineHeight: "1.6",
            fontSize: "0.875rem",
          }}
        >
          <TiptapEditor
            content={slide.content}
            onChange={() => {}} // No-op in preview mode
            placeholder=""
            className="w-full h-full"
            editable={false}
          />
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  const { presentation, slides, theme, setTheme, updateSlide } =
    usePresentationStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // console.log("🔍 Preview page useEffect - checking presentation data:");
    // console.log("📊 Presentation:", presentation);
    // console.log("📊 Slides:", slides);
    // console.log("📊 Slides length:", slides?.length);

    if (!presentation || !slides || slides.length === 0) {
      // console.log("❌ No presentation data found, redirecting to home");
      router.push("/");
    } else {
      // console.log("✅ Presentation data found, staying on preview page");
    }
  }, [presentation, slides, router]);

  // Intersection Observer to track which slide is in view
  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slideIndex = parseInt(entry.target.id.split("-")[1]);
            setActiveSlideIndex(slideIndex);
          }
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -20% 0px", // Only trigger when slide is in center 60% of viewport
        threshold: 0.5,
      }
    );

    // Observe all slide elements
    slideRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      slideRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [slides]);

  // Initialize refs arrays
  useEffect(() => {
    if (slides) {
      slideRefs.current = new Array(slides.length).fill(null);
      thumbnailRefs.current = new Array(slides.length).fill(null);
    }
  }, [slides]);

  const scrollToSlide = useCallback((index: number) => {
    const slideElement = slideRefs.current[index];
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const scrollToThumbnail = useCallback((index: number) => {
    const thumbnailElement = thumbnailRefs.current[index];
    if (thumbnailElement) {
      thumbnailElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  const handleContentChange = (slideId: string, content: string) => {
    // Update only the content, keep the title unchanged
    updateSlide(slideId, {
      content: content,
    });
  };

  const handleExport = async (format: "pdf" | "html" | "ppt" | "gslides") => {
    try {
      setIsExporting(true);

      const response = await fetch("/api/presentations/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          presentation,
          theme,
          format,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        // Set appropriate filename extension
        let fileExtension: string = format;
        if (format === "gslides") {
          fileExtension = "pptx"; // Google Slides is exported as PPTX
        }

        a.download = `${presentation?.title}.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("Export failed:", errorData);
        alert(`Export failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert(
        `Export error: ${error instanceof Error ? error.message : "An unexpected error occurred"}`
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (!presentation || !slides || slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Presentation Found</h2>
          <p className="text-gray-600 mb-4">
            Please generate a presentation first.
          </p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Slide Thumbnails - Left Side */}
      <div className="w-56 bg-white border-r border-gray-200 p-4 overflow-y-auto h-full min-h-full max-h-full">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Slides</h3>
        <div className="space-y-3 pr-4 border-t py-2">
          {slides?.map((slide, index) => (
            <div
              key={slide.id + index}
              ref={(el) => {
                thumbnailRefs.current[index] = el;
              }}
              className="cursor-pointer"
              onClick={() => {
                scrollToSlide(index);
                scrollToThumbnail(index);
              }}
            >
              <div
                className={`w-full h-24 rounded-lg border-2 transition-all duration-200 ${
                  activeSlideIndex === index
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="p-2 h-full flex flex-col justify-center">
                  <h3 className="text-xs font-medium truncate">
                    {slide.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {slide.type}
                  </p>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-1.5 py-0.5 text-xs rounded ${
                        activeSlideIndex === index
                          ? "bg-blue-200 text-blue-800"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {slide.template
                        ? slide.template.replace(/_/g, " ").toLowerCase()
                        : "Default"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )) || []}
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {presentation.title}
              </h1>
              <p className="text-sm text-gray-600">
                {slides?.length || 0} slides - Continuous Preview Mode
              </p>
              <p className="text-xs text-gray-500">
                All slides displayed continuously below. Click thumbnails to
                navigate.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {/* Theme Selector */}
              <ThemeSelector currentTheme={theme} onThemeSelect={setTheme} />

              {/* Edit Mode Toggle */}
              <Button
                variant={isEditMode ? "default" : "outline"}
                onClick={() => {
                  setIsEditMode(!isEditMode);
                }}
              >
                {isEditMode ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Exit Edit
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => handleExport("html")}
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                HTML
              </Button>

              <Button
                variant="outline"
                onClick={() => handleExport("pdf")}
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>

              <Button
                variant="outline"
                onClick={() => handleExport("gslides")}
                disabled={isExporting}
              >
                <FileText className="h-4 w-4 mr-2" />
                PowerPoint
              </Button>
            </div>
          </div>
        </div>

        {/* Continuous Slides Display */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {slides?.map((slide, index) => (
            <div
              key={slide.id + index}
              id={`slide-${index}`}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className="w-full flex justify-center"
            >
              <div className="w-full max-w-4xl">
                {/* Slide container with consistent styling */}
                <div
                  className="rounded-lg shadow-lg border relative group"
                  style={{
                    width: "100%",
                    maxWidth: "1024px",
                    minHeight: "400px",
                    maxHeight: "1500px",
                    height: "auto",
                    backgroundColor: theme.colors.background,
                    color: getContrastTextColor(theme),
                    fontFamily: theme.fonts.body,
                  }}
                >
                  {/* Layout changer button - appears on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <SlideLayoutChanger slide={slide} />
                  </div>

                  <div className="w-full h-full">
                    <EditableSlideContent
                      slide={slide}
                      isEditMode={isEditMode}
                      onContentChange={(content) => {
                        if (isEditMode) {
                          handleContentChange(slide.id, content);
                        }
                      }}
                      theme={theme}
                      updateSlide={updateSlide}
                    />
                  </div>
                </div>

                {/* Slide number and template indicator */}
                <div className="text-center mt-4 text-sm text-gray-500 flex items-center justify-center gap-4">
                  <span>
                    Slide {index + 1} of {slides?.length || 0}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {slide.template
                      ? slide.template.replace(/_/g, " ").toLowerCase()
                      : "Default"}
                  </span>
                </div>
              </div>
            </div>
          )) || []}
        </div>
      </div>
    </div>
  );
}
