"use client";

import React from "react";
import { Slide, PresentationTheme } from "@/lib/presentation-types";
import { SlideTemplate } from "@/mastra/types/slide-templates";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { TiptapRenderer } from "./TiptapRenderer";
import { ChartSlide } from "./ChartSlide";
import { MetricsDashboardSlide } from "./MetricsDashboardSlide";
import { BulletListSlide } from "./BulletListSlide";
import { ColumnSlide } from "./ColumnSlide";
import { AccentLayoutSlide } from "./AccentLayoutSlide";
import { ImageGallerySlide } from "./ImageGallerySlide";
import { TeamPhotosSlide } from "./TeamPhotosSlide";
import { parseChartDataFromSlide } from "@/lib/chart-utils";
import {
  getContrastStyles,
  getContrastClasses,
  getContrastTextColor,
  getContrastPrimaryColor,
} from "@/lib/theme-contrast-utils";

interface TemplateRendererProps {
  slide: Slide;
  theme?: PresentationTheme;
  onSplitSlides?: (splitSlides: Slide[]) => void;
}

// Helper function to detect if content is HTML
const isHTML = (content: string): boolean => {
  return /<[^>]*>/g.test(content);
};

// Helper function to sanitize HTML content
const sanitizeHTML = (content: string): string => {
  if (!content) return content;

  return content
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
};

// Component to render HTML content with enhanced styling for markdown
const HTMLRenderer = ({
  content,
  theme,
}: {
  content: string;
  theme?: PresentationTheme;
}) => {
  const sanitizedContent = sanitizeHTML(content);

  if (!theme) {
    return (
      <div
        className="prose prose-lg max-w-none h-full overflow-y-auto"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        style={{
          lineHeight: "1.6",
          fontSize: "0.875rem",
          maxHeight: "100%",
          overflow: "hidden",
        }}
      />
    );
  }

  return (
    <div
      className={getContrastClasses(theme)}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      style={{
        ...getContrastStyles(theme),
        lineHeight: "1.6",
        fontSize: "0.875rem",
        fontFamily: theme.fonts.body || "inherit",
        maxHeight: "100%",
        overflow: "hidden",
      }}
    />
  );
};

// Default content renderer for basic templates with enhanced markdown support
const DefaultContentRenderer = ({
  slide,
  theme,
  onSplitSlides,
}: {
  slide: Slide;
  theme?: PresentationTheme;
  onSplitSlides?: (splitSlides: Slide[]) => void;
}) => {
  const contentIsHTML = isHTML(slide.content);

  return (
    <div className="flex flex-col h-full p-6">
      {/* Render title if it exists */}
      {slide.title && (
        <h2
          className="text-xl font-bold mb-4 text-center flex-shrink-0"
          style={{
            color: theme ? getContrastPrimaryColor(theme) : "#1f2937",
            fontFamily: theme?.fonts.heading || "inherit",
            lineHeight: "1.2",
          }}
        >
          {slide.title}
        </h2>
      )}
      <div
        className="w-full flex-1 overflow-y-auto"
        style={{
          maxHeight: "calc(100% - 5rem)",
          lineHeight: "1.6",
          fontSize: "0.875rem",
        }}
      >
        <TiptapRenderer content={slide.content} theme={theme} />
      </div>
    </div>
  );
};

export function TemplateRenderer({
  slide,
  theme,
  onSplitSlides,
}: TemplateRendererProps) {
  // Handle different template types
  const template = slide.template;

  // Debug logging for template selection issues (commented out to prevent console spam)
  // console.log("TemplateRenderer:", {
  //   slideTitle: slide.title,
  //   template,
  //   hasTemplateData: !!slide.templateData,
  //   templateDataKeys: slide.templateData ? Object.keys(slide.templateData) : [],
  //   templateDataContent: slide.templateData,
  // });

  // Check if this slide should display a chart (even if not selected as chart template)
  const chartData = parseChartDataFromSlide(slide);
  if (chartData) {
    // console.log(
    //   "📊 Found chart data in content, rendering as chart:",
    //   chartData
    // );
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

    // If no chart data available, fall back to default content
    return (
      <DefaultContentRenderer
        slide={slide}
        theme={theme}
        onSplitSlides={onSplitSlides}
      />
    );
  }

  // Business templates
  if (template === SlideTemplate.TIMELINE) {
    if (!slide.templateData || Object.keys(slide.templateData).length === 0) {
      return (
        <DefaultContentRenderer
          slide={slide}
          theme={theme}
          onSplitSlides={onSplitSlides}
        />
      );
    }

    // Transform timeline data for better display
    const timelineData = slide.templateData as any;
    const events = timelineData.events || [];

    return (
      <div className="flex flex-col h-full p-6">
        {slide.title && (
          <h2
            className="text-xl font-bold mb-4 text-center"
            style={{
              color: theme?.colors.primary || "#1f2937",
              fontFamily: theme?.fonts.heading || "inherit",
            }}
          >
            {slide.title}
          </h2>
        )}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {events.map((event: any, index: number) => (
              <div key={index} className="mb-6">
                <div
                  className="text-base font-semibold mb-3 p-3 rounded-lg"
                  style={{
                    backgroundColor: theme?.colors.primary + "20" || "#f3f4f6",
                    color: theme?.colors.primary || "#1f2937",
                    fontFamily: theme?.fonts.heading || "inherit",
                  }}
                >
                  {event.phase || event.title || `Phase ${index + 1}`}
                </div>
                {event.tasks && Array.isArray(event.tasks) && (
                  <ul className="ml-4 space-y-2">
                    {event.tasks.map((task: string, taskIndex: number) => (
                      <li
                        key={taskIndex}
                        className="flex items-start"
                        style={{
                          color: theme?.colors.text || "inherit",
                          fontFamily: theme?.fonts.body || "inherit",
                        }}
                      >
                        <span className="mr-2 text-blue-500">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {event.description && (
                  <p
                    className="mt-2 ml-4"
                    style={{
                      color: theme?.colors.text || "inherit",
                      fontFamily: theme?.fonts.body || "inherit",
                    }}
                  >
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (template === SlideTemplate.COMPARISON_TABLE) {
    if (!slide.templateData || Object.keys(slide.templateData).length === 0) {
      return (
        <DefaultContentRenderer
          slide={slide}
          theme={theme}
          onSplitSlides={onSplitSlides}
        />
      );
    }
    // Comparison table template falls back to default content renderer
    return <DefaultContentRenderer slide={slide} theme={theme} />;
  }

  if (template === SlideTemplate.METRICS_DASHBOARD) {
    if (!slide.templateData || Object.keys(slide.templateData).length === 0) {
      return (
        <DefaultContentRenderer
          slide={slide}
          theme={theme}
          onSplitSlides={onSplitSlides}
        />
      );
    }
    return (
      <MetricsDashboardSlide
        title={slide.title}
        metricsData={slide.templateData as any}
        theme={theme}
      />
    );
  }

  // Content templates
  if (template === SlideTemplate.BULLET_LIST) {
    if (!slide.templateData || Object.keys(slide.templateData).length === 0) {
      return (
        <DefaultContentRenderer
          slide={slide}
          theme={theme}
          onSplitSlides={onSplitSlides}
        />
      );
    }

    // Transform agent output format to BulletListSlide expected format
    const transformBulletData = (templateData: any) => {
      // If already in correct format (has bullets array), return as is
      if (templateData.bullets && Array.isArray(templateData.bullets)) {
        return templateData;
      }

      // Transform from agent format (items array) to bullets format
      if (templateData.items && Array.isArray(templateData.items)) {
        return {
          bullets: templateData.items,
          title: templateData.title || slide.title,
        };
      }

      // Fallback: try to extract bullets from content
      return {
        bullets: [slide.content],
        title: slide.title,
      };
    };

    const transformedData = transformBulletData(slide.templateData);

    return (
      <BulletListSlide
        title={slide.title}
        bulletData={transformedData}
        theme={theme}
      />
    );
  }

  // Column layouts
  if (
    template === SlideTemplate.TWO_COLUMN ||
    template === SlideTemplate.TWO_COLUMNS ||
    template === SlideTemplate.THREE_COLUMNS ||
    template === SlideTemplate.FOUR_COLUMNS
  ) {
    if (!slide.templateData || Object.keys(slide.templateData).length === 0) {
      return (
        <DefaultContentRenderer
          slide={slide}
          theme={theme}
          onSplitSlides={onSplitSlides}
        />
      );
    }

    // Transform agent output format to ColumnSlide expected format
    const transformColumnData = (templateData: any) => {
      // If already in correct format (has columns array), return as is
      if (templateData.columns && Array.isArray(templateData.columns)) {
        return templateData;
      }

      // Transform from agent format (leftColumnTitle, rightColumnTitle, etc.) to columns format
      const columns = [];

      // Handle left/right column format
      if (templateData.leftColumnTitle || templateData.leftColumnContent) {
        columns.push({
          title: templateData.leftColumnTitle || "",
          content: templateData.leftColumnContent || "",
        });
      }

      if (templateData.rightColumnTitle || templateData.rightColumnContent) {
        columns.push({
          title: templateData.rightColumnTitle || "",
          content: templateData.rightColumnContent || "",
        });
      }

      // Handle additional columns if they exist
      if (templateData.thirdColumnTitle || templateData.thirdColumnContent) {
        columns.push({
          title: templateData.thirdColumnTitle || "",
          content: templateData.thirdColumnContent || "",
        });
      }

      if (templateData.fourthColumnTitle || templateData.fourthColumnContent) {
        columns.push({
          title: templateData.fourthColumnTitle || "",
          content: templateData.fourthColumnContent || "",
        });
      }

      return { columns };
    };

    const transformedData = transformColumnData(slide.templateData);

    return (
      <ColumnSlide
        title={slide.title}
        columnData={transformedData}
        theme={theme}
      />
    );
  }

  // Accent layouts
  if (
    template === SlideTemplate.ACCENT_LEFT ||
    template === SlideTemplate.ACCENT_RIGHT ||
    template === SlideTemplate.ACCENT_TOP
  ) {
    if (!slide.templateData || Object.keys(slide.templateData).length === 0) {
      return (
        <DefaultContentRenderer
          slide={slide}
          theme={theme}
          onSplitSlides={onSplitSlides}
        />
      );
    }
    return (
      <AccentLayoutSlide
        title={slide.title}
        accentData={slide.templateData as any}
        theme={theme}
      />
    );
  }

  // Image templates
  if (template === SlideTemplate.IMAGE_GALLERY) {
    if (!slide.templateData || Object.keys(slide.templateData).length === 0) {
      return (
        <DefaultContentRenderer
          slide={slide}
          theme={theme}
          onSplitSlides={onSplitSlides}
        />
      );
    }
    return (
      <ImageGallerySlide
        title={slide.title}
        galleryData={slide.templateData as any}
      />
    );
  }

  if (template === SlideTemplate.TEAM_PHOTOS) {
    if (!slide.templateData || Object.keys(slide.templateData).length === 0) {
      return (
        <DefaultContentRenderer
          slide={slide}
          theme={theme}
          onSplitSlides={onSplitSlides}
        />
      );
    }
    return (
      <TeamPhotosSlide
        title={slide.title}
        teamData={slide.templateData as any}
      />
    );
  }

  // Basic card templates - removed static templates

  // Quote template with enhanced formatting
  if (template === SlideTemplate.QUOTE) {
    if (!slide.templateData || Object.keys(slide.templateData).length === 0) {
      return (
        <DefaultContentRenderer
          slide={slide}
          theme={theme}
          onSplitSlides={onSplitSlides}
        />
      );
    }

    // Transform quote data for better display
    const quoteData = slide.templateData as any;
    const quote = quoteData.quote || slide.content;
    const author = quoteData.author || "";

    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        {slide.title && (
          <h2
            className="text-xl font-bold mb-4 text-center"
            style={{
              color: theme?.colors.primary || "#1f2937",
              fontFamily: theme?.fonts.heading || "inherit",
            }}
          >
            {slide.title}
          </h2>
        )}
        <div className="max-w-4xl text-center">
          <blockquote
            className="text-lg italic mb-4 leading-relaxed"
            style={{
              color: theme?.colors.text || "inherit",
              fontFamily: theme?.fonts.body || "inherit",
            }}
          >
            "{quote}"
          </blockquote>
          {author && (
            <cite
              className="text-base font-semibold"
              style={{
                color: theme?.colors.primary || "#1f2937",
                fontFamily: theme?.fonts.heading || "inherit",
              }}
            >
              — {author}
            </cite>
          )}
        </div>
      </div>
    );
  }

  // Dynamic content-based templates that adapt to content structure
  if (
    template === SlideTemplate.CONTENT ||
    template === SlideTemplate.TITLE_SLIDE
  ) {
    return (
      <DefaultContentRenderer
        slide={slide}
        theme={theme}
        onSplitSlides={onSplitSlides}
      />
    );
  }

  // Default content renderer for all other templates
  return (
    <DefaultContentRenderer
      slide={slide}
      theme={theme}
      onSplitSlides={onSplitSlides}
    />
  );
}
