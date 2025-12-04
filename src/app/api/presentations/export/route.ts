import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import PptxGenJS from "pptxgenjs";
import type {
  PresentationOutput,
  PresentationTheme,
} from "@/lib/presentation-types";
import { IntelligentSlideSplitter } from "@/lib/intelligent-slide-splitter";
import { renderContentToHTML } from "@/lib/content-renderer";

export async function POST(request: NextRequest) {
  try {
    const {
      presentation,
      theme,
      format = "pdf",
    }: {
      presentation: PresentationOutput;
      theme?: PresentationTheme;
      format: "pdf" | "html" | "ppt" | "gslides";
    } = await request.json();

    if (format === "html") {
      // Generate HTML presentation
      const html = generateHTMLPresentation(presentation, theme);
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="${presentation.title}.html"`,
        },
      });
    }

    if (format === "pdf") {
      // Generate PDF using Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"], // Added for better compatibility
      });
      const page = await browser.newPage();

      const html = generateHTMLPresentation(presentation, theme);
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "10mm",
          right: "10mm",
          bottom: "10mm",
          left: "10mm",
        },
        preferCSSPageSize: true,
        displayHeaderFooter: false,
      });

      await browser.close();

      return new NextResponse(pdf as BodyInit, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${presentation.title}.pdf"`,
        },
      });
    }

    if (format === "gslides") {
      // Generate Google Slides compatible presentation
      // Since Google Slides can import PPTX files, we'll create a PPTX optimized for Google Slides
      const pptx = await generateGoogleSlidesCompatiblePresentation(
        presentation,
        theme
      );
      const buffer = await pptx.write({ outputType: "nodebuffer" });

      return new NextResponse(buffer as BodyInit, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "Content-Disposition": `attachment; filename="${presentation.title}_for_google_slides.pptx"`,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Unsupported format" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error exporting presentation:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Export failed",
      },
      { status: 500 }
    );
  }
}

function generateHTMLPresentation(
  presentation: PresentationOutput,
  theme?: PresentationTheme
): string {
  const defaultTheme = {
    colors: {
      primary: "#3b82f6",
      secondary: "#1e40af",
      background: "#ffffff",
      text: "#1f2937",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
  };

  const currentTheme = theme || defaultTheme;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${presentation.title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * {
          box-sizing: border-box;
        }
        
        body {
          font-family: ${currentTheme.fonts.body};
          margin: 0;
          padding: 20px;
          background: #f8fafc;
          line-height: 1.6;
        }
        
        .slide {
          background: ${currentTheme.colors.background};
          margin: 20px auto;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          page-break-after: always;
          min-height: 600px;
          max-width: 1024px;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: ${currentTheme.colors.text};
          position: relative;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .slide:last-child {
          page-break-after: avoid;
        }
        
        .slide-title {
          font-family: ${currentTheme.fonts.heading};
          font-size: 2.5rem;
          font-weight: bold;
          color: ${currentTheme.colors.primary};
          margin-bottom: 20px;
          text-align: center;
          line-height: 1.2;
        }
        
        .slide-content {
          font-family: ${currentTheme.fonts.body};
          font-size: 1.25rem;
          line-height: 1.6;
          color: ${currentTheme.colors.text};
        }
        
        .slide-content ul {
          padding-left: 20px;
        }
        
        .slide-content li {
          margin-bottom: 8px;
        }
        
        .slide-content h1, .slide-content h2, .slide-content h3, .slide-content h4, .slide-content h5, .slide-content h6 {
          color: ${currentTheme.colors.primary};
          font-family: ${currentTheme.fonts.heading};
        }
        
        .slide-content strong {
          color: ${currentTheme.colors.primary};
        }
        
        .slide-content a {
          color: ${currentTheme.colors.primary};
          text-decoration: none;
        }
        
        .slide-content a:hover {
          text-decoration: underline;
        }
        
        /* Chart styles */
        .chart-container {
          width: 100%;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .chart-placeholder {
          color: ${currentTheme.colors.primary};
          font-family: ${currentTheme.fonts.heading};
          font-size: 1.2rem;
          text-align: center;
        }
        
        /* Column layouts */
        .two-column, .three-column, .four-column {
          display: grid;
          gap: 20px;
          margin: 20px 0;
        }
        
        .two-column {
          grid-template-columns: 1fr 1fr;
        }
        
        .three-column {
          grid-template-columns: 1fr 1fr 1fr;
        }
        
        .four-column {
          grid-template-columns: 1fr 1fr 1fr 1fr;
        }
        
        .column {
          padding: 20px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
          border-left: 4px solid ${currentTheme.colors.primary};
        }
        
        .column h3 {
          color: ${currentTheme.colors.primary};
          font-family: ${currentTheme.fonts.heading};
          margin-bottom: 10px;
        }
        
        /* Bullet list styles */
        .bullet-list {
          list-style: none;
          padding: 0;
        }
        
        .bullet-list li {
          padding: 8px 0;
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
          position: relative;
          padding-left: 20px;
        }
        
        .bullet-list li:before {
          content: "•";
          color: ${currentTheme.colors.primary};
          font-weight: bold;
          position: absolute;
          left: 0;
        }
        
        /* Quote styles */
        .quote {
          font-style: italic;
          font-size: 1.5rem;
          text-align: center;
          margin: 40px 0;
          padding: 20px;
          border-left: 4px solid ${currentTheme.colors.primary};
          background: rgba(59, 130, 246, 0.05);
        }
        
        .quote-author {
          text-align: right;
          font-weight: bold;
          color: ${currentTheme.colors.primary};
          margin-top: 20px;
        }
        
        /* Timeline styles */
        .timeline {
          position: relative;
          padding-left: 30px;
        }
        
        .timeline:before {
          content: "";
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: ${currentTheme.colors.primary};
        }
        
        .timeline-item {
          position: relative;
          margin-bottom: 30px;
          padding-left: 20px;
        }
        
        .timeline-item:before {
          content: "";
          position: absolute;
          left: -8px;
          top: 8px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${currentTheme.colors.primary};
        }
        
        .timeline-title {
          font-weight: bold;
          color: ${currentTheme.colors.primary};
          font-family: ${currentTheme.fonts.heading};
          margin-bottom: 10px;
        }
        
        /* Metrics dashboard */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        
        .metric-card {
          background: rgba(59, 130, 246, 0.05);
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid rgba(59, 130, 246, 0.1);
        }
        
        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          color: ${currentTheme.colors.primary};
          font-family: ${currentTheme.fonts.heading};
        }
        
        .metric-label {
          color: ${currentTheme.colors.text};
          font-size: 0.9rem;
          margin-top: 5px;
        }
        
        /* Image gallery */
        .image-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }
        
        .gallery-item {
          text-align: center;
          padding: 15px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
        }
        
        .gallery-item img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }
        
        .gallery-caption {
          margin-top: 10px;
          font-size: 0.9rem;
          color: ${currentTheme.colors.text};
        }
        
        /* Team photos */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        
        .team-member {
          text-align: center;
          padding: 15px;
        }
        
        .team-member img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 10px;
        }
        
        .team-name {
          font-weight: bold;
          color: ${currentTheme.colors.primary};
          font-family: ${currentTheme.fonts.heading};
        }
        
        .team-role {
          font-size: 0.9rem;
          color: ${currentTheme.colors.text};
          margin-top: 5px;
        }
        
        @media print {
          body { 
            background: white; 
            padding: 0;
            margin: 0;
          }
          .slide { 
            box-shadow: none; 
            margin: 0 auto;
            padding: 20px;
            max-width: 100%;
            page-break-after: always;
            page-break-inside: avoid;
          }
          .slide:last-child {
            page-break-after: avoid;
          }
          .slide-title {
            font-size: 2rem;
            margin-bottom: 15px;
          }
          .slide-content {
            font-size: 1.1rem;
            line-height: 1.4;
          }
        }
        
        @media screen and (max-width: 768px) {
          .slide {
            margin: 10px;
            padding: 20px;
            min-height: 400px;
          }
          .slide-title {
            font-size: 2rem;
          }
          .slide-content {
            font-size: 1.1rem;
          }
        }
      </style>
    </head>
    <body>
      ${presentation.slides
        .map((slide) => renderSlide(slide, currentTheme))
        .join("")}
    </body>
    </html>
  `;
}

function renderSlide(slide: unknown, theme: unknown): string {
  const slideObj = slide as {
    type?: string;
    template?: string;
    content?: string;
    title?: string;
  };
  const slideType = slideObj.type || slideObj.template;

  // Check if this slide should be rendered as a chart based on content
  const chartData = parseChartDataFromContent(slideObj.content || "");
  const shouldRenderAsChart =
    chartData &&
    chartData.length > 0 &&
    slideType &&
    !slideType.toLowerCase().includes("bullet") &&
    !slideType.toLowerCase().includes("list");

  console.log("🔍 Slide rendering decision:", {
    slideTitle: slideObj.title,
    slideType,
    hasChartData: shouldRenderAsChart,
    chartDataLength: chartData?.length || 0,
  });

  // If content has chart data and it's not a bullet/list type, render as chart
  if (shouldRenderAsChart) {
    console.log("📊 Rendering as chart based on content data");
    return renderChartSlide(slideObj, theme);
  }

  // Handle different slide types with proper rendering
  switch (slideType) {
    case "title":
    case "TITLE_SLIDE":
      return `
        <div class="slide title-slide">
          <h1 class="slide-title">${slideObj.title || ""}</h1>
          <div class="slide-content">${renderContent(slideObj.content || "")}</div>
        </div>
      `;

    case "content":
    case "CONTENT":
      return `
        <div class="slide">
          <h1 class="slide-title">${slideObj.title || ""}</h1>
          <div class="slide-content">${renderContent(slideObj.content || "")}</div>
        </div>
      `;

    case "BULLET_LIST":
      return renderBulletListSlide(slideObj, theme);

    case "TWO_COLUMN":
    case "TWO_COLUMNS":
      return renderColumnSlide(slideObj, theme, 2);

    case "THREE_COLUMNS":
      return renderColumnSlide(slideObj, theme, 3);

    case "FOUR_COLUMNS":
      return renderColumnSlide(slideObj, theme, 4);

    case "QUOTE":
      return renderQuoteSlide(slideObj, theme);

    case "TIMELINE":
      return renderTimelineSlide(slideObj, theme);

    case "METRICS_DASHBOARD":
      return renderMetricsSlide(slideObj, theme);

    case "IMAGE_GALLERY":
      return renderImageGallerySlide(slideObj, theme);

    case "TEAM_PHOTOS":
      return renderTeamPhotosSlide(slideObj, theme);

    case "PIE_CHART":
    case "BAR_CHART":
    case "LINE_CHART":
    case "AREA_CHART":
    case "RADAR_CHART":
      return renderChartSlide(slideObj, theme);

    default:
      return `
        <div class="slide">
          <h1 class="slide-title">${slideObj.title || ""}</h1>
          <div class="slide-content">${renderContent(slideObj.content || "")}</div>
        </div>
      `;
  }
}

function renderContent(content: string): string {
  if (!content) return "";

  // Use server-compatible HTML renderer
  return renderContentToHTML(content);
}

function renderBulletListSlide(slide: unknown, theme: unknown): string {
  const slideObj = slide as {
    templateData?: { bullets?: string[]; items?: string[] };
    title?: string;
  };
  const bullets =
    slideObj.templateData?.bullets || slideObj.templateData?.items || [];

  return `
    <div class="slide">
      <h1 class="slide-title">${slideObj.title || ""}</h1>
      <div class="slide-content">
        <ul class="bullet-list">
          ${bullets.map((bullet: string) => `<li>${bullet}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

function renderColumnSlide(
  slide: unknown,
  theme: unknown,
  columnCount: number
): string {
  const slideObj = slide as {
    templateData?: { columns?: Array<{ title?: string; content?: string }> };
    title?: string;
  };
  const columns = slideObj.templateData?.columns || [];
  const columnClass =
    columnCount === 2
      ? "two-column"
      : columnCount === 3
        ? "three-column"
        : "four-column";

  return `
    <div class="slide">
      <h1 class="slide-title">${slideObj.title || ""}</h1>
      <div class="slide-content">
        <div class="${columnClass}">
          ${columns
            .map(
              (column: { title?: string; content?: string }) => `
            <div class="column">
              <h3>${column.title || ""}</h3>
              <div>${renderContent(column.content || "")}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderQuoteSlide(slide: unknown, theme: unknown): string {
  const slideObj = slide as {
    templateData?: { quote?: string; author?: string };
    content?: string;
    title?: string;
  };
  const quoteData = slideObj.templateData || {};
  const quote = quoteData.quote || slideObj.content;
  const author = quoteData.author || "";

  return `
    <div class="slide">
      <h1 class="slide-title">${slideObj.title || ""}</h1>
      <div class="slide-content">
        <div class="quote">"${quote}"</div>
        ${author ? `<div class="quote-author">— ${author}</div>` : ""}
      </div>
    </div>
  `;
}

function renderTimelineSlide(slide: unknown, theme: unknown): string {
  const slideObj = slide as {
    templateData?: {
      events?: Array<{
        phase?: string;
        title?: string;
        description?: string;
        tasks?: string[];
      }>;
    };
    title?: string;
  };
  const events = slideObj.templateData?.events || [];

  return `
    <div class="slide">
      <h1 class="slide-title">${slideObj.title || ""}</h1>
      <div class="slide-content">
        <div class="timeline">
          ${events
            .map(
              (event: {
                phase?: string;
                title?: string;
                description?: string;
                tasks?: string[];
              }) => `
            <div class="timeline-item">
              <div class="timeline-title">${
                event.phase || event.title || ""
              }</div>
              ${event.description ? `<div>${event.description}</div>` : ""}
              ${
                event.tasks
                  ? `
                <ul>
                  ${event.tasks
                    .map((task: string) => `<li>${task}</li>`)
                    .join("")}
                </ul>
              `
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderMetricsSlide(slide: unknown, theme: unknown): string {
  const slideObj = slide as {
    templateData?: { metrics?: Array<{ value?: string; label?: string }> };
    title?: string;
  };
  const metrics = slideObj.templateData?.metrics || [];

  return `
    <div class="slide">
      <h1 class="slide-title">${slideObj.title || ""}</h1>
      <div class="slide-content">
        <div class="metrics-grid">
          ${metrics
            .map(
              (metric: { value?: string; label?: string }) => `
            <div class="metric-card">
              <div class="metric-value">${metric.value || ""}</div>
              <div class="metric-label">${metric.label || ""}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderImageGallerySlide(slide: unknown, theme: unknown): string {
  const slideObj = slide as {
    templateData?: {
      images?: Array<{
        url?: string;
        src?: string;
        alt?: string;
        caption?: string;
      }>;
    };
    title?: string;
  };
  const images = slideObj.templateData?.images || [];

  return `
    <div class="slide">
      <h1 class="slide-title">${slideObj.title || ""}</h1>
      <div class="slide-content">
        <div class="image-gallery">
          ${images
            .map(
              (image: {
                url?: string;
                src?: string;
                alt?: string;
                caption?: string;
              }) => `
            <div class="gallery-item">
              <img src="${image.url || image.src || ""}" alt="${
                image.alt || ""
              }" />
              <div class="gallery-caption">${image.caption || ""}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderTeamPhotosSlide(slide: unknown, theme: unknown): string {
  const slideObj = slide as {
    templateData?: {
      team?: Array<{
        photo?: string;
        image?: string;
        name?: string;
        role?: string;
        title?: string;
      }>;
    };
    title?: string;
  };
  const team = slideObj.templateData?.team || [];

  return `
    <div class="slide">
      <h1 class="slide-title">${slideObj.title || ""}</h1>
      <div class="slide-content">
        <div class="team-grid">
          ${team
            .map(
              (member: {
                photo?: string;
                image?: string;
                name?: string;
                role?: string;
                title?: string;
              }) => `
            <div class="team-member">
              <img src="${member.photo || member.image || ""}" alt="${
                member.name || ""
              }" />
              <div class="team-name">${member.name || ""}</div>
              <div class="team-role">${member.role || member.title || ""}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderChartSlide(slide: unknown, theme: unknown): string {
  const slideObj = slide as {
    templateData?: { data?: unknown[] };
    template?: string;
    type?: string;
    title?: string;
    content?: string;
  };
  const chartData = slideObj.templateData || {};
  const chartType = slideObj.template || slideObj.type;
  let data = chartData.data || [];

  // Debug logging
  console.log("🔍 Chart slide debug:", {
    slideTitle: slideObj.title,
    template: slideObj.template,
    type: slideObj.type,
    hasTemplateData: !!slideObj.templateData,
    templateDataKeys: slideObj.templateData
      ? Object.keys(slideObj.templateData)
      : [],
    templateDataContent: slideObj.templateData,
    content: slideObj.content?.substring(0, 200) + "...",
  });

  // If no data in templateData, try to parse from content
  if (!data || data.length === 0) {
    console.log("📊 No templateData.data found, parsing from content");
    data = parseChartDataFromContent(slideObj.content || "");
    console.log("📊 Parsed data from content:", data);
  }

  if (!data || data.length === 0) {
    console.log("❌ No chart data available after parsing");
    return `
      <div class="slide">
        <h1 class="slide-title">${slideObj.title || ""}</h1>
        <div class="slide-content">
          <div class="chart-container">
            <div class="chart-placeholder">
              No chart data available
            </div>
          </div>
        </div>
      </div>
    `;
  }

  console.log("✅ Chart data found, generating SVG chart");
  // Generate SVG chart based on type
  const svgChart = generateSVGChart(chartType || "", data, chartData, theme);

  return `
    <div class="slide">
      <h1 class="slide-title">${slideObj.title || ""}</h1>
      <div class="slide-content">
        <div class="chart-container">
          ${svgChart}
        </div>
      </div>
    </div>
  `;
}

function generateSVGChart(
  chartType: string,
  data: unknown[],
  chartData: unknown,
  theme: unknown
): string {
  const chartDataObj = chartData as { colors?: string[] };
  const colors = chartDataObj.colors || [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
  ];
  const width = 600;
  const height = 400;
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // Normalize chart type to handle different naming conventions
  const normalizedType = chartType.toLowerCase().replace(/-/g, "_");

  console.log("🔍 Chart type normalization:", {
    original: chartType,
    normalized: normalizedType,
  });

  switch (normalizedType) {
    case "pie_chart":
    case "pie":
      return generatePieChart(data, colors, width, height, theme);

    case "bar_chart":
    case "bar":
      return generateBarChart(data, colors, width, height, theme);

    case "line_chart":
    case "line":
      return generateLineChart(data, colors, width, height, theme);

    case "area_chart":
    case "area":
      return generateAreaChart(data, colors, width, height, theme);

    case "radar_chart":
    case "radar":
      return generateRadarChart(data, colors, width, height, theme);

    default:
      console.log(
        "❌ Unknown chart type:",
        chartType,
        "normalized:",
        normalizedType
      );
      // For unknown chart types, try to render as a simple data visualization
      return generateDataVisualization(
        chartType,
        data,
        colors,
        width,
        height,
        theme
      );
  }
}

/**
 * Generate a presentation optimized for Google Slides import
 * This function creates a PPTX that is specifically formatted to work well when imported into Google Slides
 */
async function generateGoogleSlidesCompatiblePresentation(
  presentation: PresentationOutput,
  theme?: PresentationTheme
): Promise<PptxGenJS> {
  const pptx = new PptxGenJS();

  // Set presentation properties
  pptx.author = "Presentation Editor";
  pptx.company = "Presentation Editor";
  pptx.title = presentation.title;
  pptx.subject = (presentation as any).description || "";

  // Set default theme with Google-friendly colors and fonts
  const defaultTheme = {
    colors: {
      primary: "#4285F4", // Google Blue
      secondary: "#34A853", // Google Green
      accent: "#FBBC05", // Google Yellow
      background: "#ffffff",
      text: "#202124", // Google gray text
      lightText: "#5F6368", // Google light gray text
      border: "#e8eaed", // Google border color
    },
    fonts: {
      heading: "Arial", // Google Slides default font
      body: "Arial", // Google Slides default font
    },
  };

  const currentTheme = theme || defaultTheme;

  // Set presentation layout for Google Slides (16:9 is standard)
  pptx.layout = "LAYOUT_16x9";

  // Process slides with intelligent splitting
  const processedSlides = [];
  for (const slide of presentation.slides) {
    try {
      // Check if slide needs splitting
      if (IntelligentSlideSplitter.needsSplitting(slide)) {
        const splitSlides = IntelligentSlideSplitter.splitSlide(slide);
        processedSlides.push(...splitSlides);
      } else {
        processedSlides.push(slide);
      }
    } catch (error) {
      console.error("Error processing slide for Google Slides:", error);
      processedSlides.push(slide);
    }
  }

  // Add slides to presentation - using Google Slides compatible approach
  for (let i = 0; i < processedSlides.length; i++) {
    const slide = processedSlides[i];
    try {
      await addGoogleSlidesCompatibleSlide(
        pptx,
        slide,
        currentTheme,
        i + 1,
        processedSlides.length
      );
    } catch (error) {
      console.error(`Error adding slide ${i + 1} for Google Slides:`, error);

      // Add a simple error slide instead of failing completely
      const errorSlide = pptx.addSlide();
      errorSlide.background = { color: currentTheme.colors.background };

      errorSlide.addText(
        `Slide ${i + 1} - Error: Could not render this slide properly`,
        {
          x: 1,
          y: 2,
          w: 8,
          h: 1,
          fontSize: 14,
          fontFace: currentTheme.fonts.body,
          color: "FF0000",
          bold: true,
        }
      );

      if (slide.title) {
        errorSlide.addText(`Title: ${slide.title}`, {
          x: 1,
          y: 3,
          w: 8,
          h: 0.5,
          fontSize: 12,
          fontFace: currentTheme.fonts.body,
        });
      }
    }
  }

  return pptx;
}

/**
 * Add a Google Slides compatible slide to the presentation
 * This function is optimized for maximum compatibility when importing to Google Slides
 */
async function addGoogleSlidesCompatibleSlide(
  pptx: PptxGenJS,
  slide: any,
  theme: any,
  slideNumber?: number,
  totalSlides?: number
): Promise<void> {
  // Create a new slide (no master slide for better Google Slides compatibility)
  const slideObj = pptx.addSlide();

  // Set slide background
  slideObj.background = { color: theme.colors.background };

  // Add slide number (Google Slides compatible format)
  if (slideNumber && totalSlides) {
    slideObj.addText(`Slide ${slideNumber} of ${totalSlides}`, {
      x: 8.5,
      y: 6.8,
      w: 1.5,
      h: 0.3,
      fontSize: 10,
      fontFace: theme.fonts.body,
      color: theme.colors.lightText,
      align: "right",
    });
  }

  const slideType = slide.type || slide.template;

  // Handle different slide types with Google Slides optimized formatting
  switch (slideType) {
    case "title":
    case "TITLE_SLIDE":
      // Google Slides title slide
      slideObj.addText(slide.title || "", {
        x: 0.5,
        y: 2,
        w: 9,
        h: 1.5,
        fontSize: 32,
        fontFace: theme.fonts.heading,
        color: theme.colors.text,
        bold: true,
        align: "center",
        valign: "middle",
      });

      if (slide.content) {
        const cleanContent = cleanHtmlContent(slide.content);
        slideObj.addText(cleanContent, {
          x: 1,
          y: 4,
          w: 8,
          h: 2,
          fontSize: 18,
          fontFace: theme.fonts.body,
          color: theme.colors.lightText,
          align: "center",
          valign: "middle",
        });
      }
      break;

    case "BULLET_LIST":
      // Title
      slideObj.addText(slide.title || "", {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 24,
        fontFace: theme.fonts.heading,
        color: theme.colors.text,
        bold: true,
      });

      // Bullet points - optimized for Google Slides import
      if (slide.content) {
        const bulletPoints = extractBulletPoints(slide.content);

        // Calculate available height for content
        const titleHeight = 1.5; // Title takes up 1.5 inches
        const availableHeight = 7.5 - titleHeight - 0.5; // Total slide height minus title and margin

        // Use Google Slides compatible bullet formatting with better height calculation
        slideObj.addText(bulletPoints.join("\n"), {
          x: 0.8,
          y: titleHeight + 0.2,
          w: 8.4,
          h: availableHeight,
          fontSize: 14,
          fontFace: theme.fonts.body,
          color: theme.colors.text,
          bullet: { type: "bullet" }, // Simple bullet type for Google Slides compatibility
          valign: "top",
          autoFit: true, // Allow text to auto-fit
          breakLine: true, // Allow line breaks
        });
      }
      break;

    case "PIE_CHART":
    case "BAR_CHART":
    case "LINE_CHART":
      // Charts in Google Slides work best as images
      // Title
      slideObj.addText(slide.title || "", {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 24,
        fontFace: theme.fonts.heading,
        color: theme.colors.text,
        bold: true,
      });

      // Check for chart data
      const chartType = slide.type || slide.template || "PIE_CHART";

      // Generate chart data
      {
        // Fallback to data table which works well in Google Slides
        const chartData = slide.templateData || {};
        let data = chartData.data || [];

        if (!data || data.length === 0) {
          try {
            data = parseChartDataFromContent(slide.content);
          } catch (error) {
            console.error("Error parsing chart data from content:", error);
          }
        }

        if (data && data.length > 0) {
          // Create simple text representation instead of table for compatibility
          let textContent = "Chart Data:\n\n";

          data.forEach((item: { name?: string; value?: number }) => {
            textContent += `${item.name || "Item"}: ${item.value?.toString() || "0"}\n`;
          });

          slideObj.addText(textContent, {
            x: 1.5,
            y: 2,
            w: 7,
            h: 4,
            fontSize: 12,
            fontFace: theme.fonts.body,
            color: theme.colors.text,
          });
        }
      }
      break;

    default:
      // Default content slide - simple and compatible format
      slideObj.addText(slide.title || "", {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 24,
        fontFace: theme.fonts.heading,
        color: theme.colors.text,
        bold: true,
      });

      if (slide.content) {
        const cleanContent = cleanHtmlContent(slide.content);

        // Calculate available height for content
        const titleHeight = 1.5; // Title takes up 1.5 inches
        const availableHeight = 7.5 - titleHeight - 0.5; // Total slide height minus title and margin

        slideObj.addText(cleanContent, {
          x: 0.5,
          y: titleHeight + 0.2,
          w: 9,
          h: availableHeight,
          fontSize: 14,
          fontFace: theme.fonts.body,
          color: theme.colors.text,
          valign: "top",
          align: "left",
          breakLine: true,
          autoFit: true, // Allow text to auto-fit
        });
      }
  }
}

function cleanHtmlContent(content: string): string {
  if (!content) return "";

  try {
    // More conservative corruption detection - only flag obvious issues
    const corruptionPatterns = [
      /@\$&@\d+/g, // Pattern like @$&@Q665-94 (specific corruption pattern)
      /\x00/g, // Null bytes
    ];

    let hasCorruption = false;
    for (const pattern of corruptionPatterns) {
      if (pattern.test(content)) {
        hasCorruption = true;
        break;
      }
    }

    // If content appears corrupted, return a safe fallback
    if (hasCorruption) {
      console.warn("Detected corrupted content, using fallback");
      return "Content appears to be corrupted and could not be processed";
    }

    // More gentle sanitization - preserve more content
    let sanitized = content
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

    // Convert to HTML using our server-compatible renderer if it's not already HTML
    const htmlContent = renderContentToHTML(sanitized);

    // Then extract text content from HTML for plain text representation
    let cleaned = htmlContent
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&hellip;/g, "...")
      .replace(/&mdash;/g, "--")
      .replace(/&ndash;/g, "-")
      .trim();

    // More conservative cleaning for PowerPoint compatibility
    cleaned = cleaned
      .replace(/\s+/g, " ") // Normalize multiple spaces to single space
      .replace(/\n\s+/g, "\n") // Remove leading spaces from new lines
      .replace(/\s+\n/g, "\n") // Remove trailing spaces from lines
      .trim(); // Remove leading/trailing whitespace

    // Check for remaining corruption patterns after cleaning
    for (const pattern of corruptionPatterns) {
      if (pattern.test(cleaned)) {
        console.warn(
          "Content still appears corrupted after cleaning, using fallback"
        );
        return "Content could not be processed properly";
      }
    }

    // Remove the aggressive length limit - let PowerPoint handle long content
    // if (cleaned.length > 1000) {
    //   cleaned = cleaned.substring(0, 1000) + "...";
    // }

    // Ensure we have valid content
    if (!cleaned || cleaned.trim().length === 0) {
      return "No content available";
    }

    return cleaned;
  } catch (error) {
    console.error("Error cleaning HTML content:", error);
    // Return a safe fallback
    return "Content could not be processed properly";
  }
}

// Helper function to calculate safe text positioning
function calculateSafeTextPosition(
  titleHeight: number,
  titleY: number,
  contentHeight: number,
  slideHeight: number = 7.5
): { contentY: number; contentHeight: number } {
  const minGap = 0.8; // Increased minimum gap between title and content
  const contentY = titleY + titleHeight + minGap;
  const availableHeight = slideHeight - contentY - 1.0; // Leave more space for footer

  return {
    contentY: Math.max(contentY, 2.5), // Ensure minimum Y position with more buffer
    contentHeight: Math.min(contentHeight, Math.max(availableHeight, 3.0)), // Ensure minimum content height
  };
}

// Helper function to calculate line spacing based on font size
function calculateLineSpacing(fontSize: number): number {
  // Base line spacing calculation: fontSize * 1.2 for good readability
  return Math.max(1.2, fontSize * 0.05);
}

// Helper function to calculate text box height based on content length and font size
function calculateTextHeight(
  content: string,
  fontSize: number,
  maxWidth: number
): number {
  const wordsPerLine = Math.floor(maxWidth / (fontSize * 0.6)); // Rough estimation
  const lines = Math.ceil(content.length / (wordsPerLine * 5)); // Average 5 chars per word
  const lineSpacing = calculateLineSpacing(fontSize);
  return Math.max(1.0, (lines * fontSize * lineSpacing) / 72); // Convert to inches
}

// Helper function to truncate content based on available space
function truncateContentForSpace(
  content: string,
  maxLength: number,
  fontSize: number,
  lineHeight: number = 1.3
): string {
  if (content.length <= maxLength) return content;

  // More intelligent content truncation
  const words = content.split(" ");
  let truncated = "";
  let charCount = 0;

  for (const word of words) {
    if (charCount + word.length + 1 <= maxLength - 3) {
      // Leave space for "..."
      truncated += (truncated ? " " : "") + word;
      charCount += word.length + (truncated ? 1 : 0);
    } else {
      break;
    }
  }

  return truncated + (truncated.length < content.length ? "..." : "");
}

// Parse chart data from slide content (similar to parseBudgetAllocationData)
function parseChartDataFromContent(
  content: string
): Array<{ name: string; value: number }> {
  console.log(
    "🔍 Parsing chart data from content:",
    content?.substring(0, 300) + "..."
  );

  try {
    // Clean the content first to prevent garbled text
    const cleanContent = cleanHtmlContent(content);

    // If content cleaning returned a fallback message, return empty data
    if (
      cleanContent.includes("Content appears to be corrupted") ||
      cleanContent.includes("Content could not be processed") ||
      cleanContent.includes("No content available")
    ) {
      console.log("❌ Content appears corrupted, skipping chart data parsing");
      return [];
    }

    const lines = cleanContent.split("\n");
    const data: Array<{ name: string; value: number }> = [];

    console.log("📝 Content lines:", lines.length);

    for (const line of lines) {
      // Skip empty lines or lines that look like garbled text
      if (!line.trim() || line.length > 500 || /[^\x20-\x7E]/.test(line)) {
        continue;
      }

      // Additional check for corruption patterns
      const corruptionPatterns = [
        /@\$&@\d+/g, // Pattern like @$&@Q665-94
        /\d{10,}/g, // Long sequences of digits
        /[A-Za-z]{1,2}\d{3,}/g, // Mixed letters and long digit sequences
      ];

      let isCorrupted = false;
      for (const pattern of corruptionPatterns) {
        if (pattern.test(line)) {
          isCorrupted = true;
          break;
        }
      }

      if (isCorrupted) {
        console.log(
          "❌ Skipping corrupted line:",
          line.substring(0, 50) + "..."
        );
        continue;
      }

      console.log("🔍 Processing line:", line);

      // Try multiple patterns to match different formats
      // Format 1: **text:** number% (colon inside bold)
      let match = line.match(/\*\*(.*?):\*\*\s*(\d+)%/);
      if (!match) {
        // Format 2: **text**: number% (colon outside bold)
        match = line.match(/\*\*(.*?)\*\*:\s*(\d+)%/);
      }
      if (!match) {
        // Format 3: - text: number% (bullet point format)
        match = line.match(/^-\s*([^:]+):\s*(\d+)%/);
      }
      if (!match) {
        // Format 4: text: number% (no bold, no bullet)
        match = line.match(/([^:]+):\s*(\d+)%/);
      }

      if (match) {
        const name = match[1].trim();
        const value = parseInt(match[2]);

        // Additional validation for name and value
        if (
          !isNaN(value) &&
          value >= 0 &&
          value <= 100 &&
          name.length > 0 &&
          name.length < 100 &&
          !/[^\x20-\x7E]/.test(name) // Ensure name contains only printable ASCII characters
        ) {
          console.log("✅ Found chart data:", { name, value });
          data.push({ name, value });
        }
      } else {
        console.log("❌ No match for line:", line);
      }
    }

    console.log("📊 Final parsed data:", data);
    return data;
  } catch (error) {
    console.error("Error parsing chart data from content:", error);
    return [];
  }
}

function generatePieChart(
  data: any[],
  colors: string[],
  width: number,
  height: number,
  theme: any
): string {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  let currentAngle = 0;

  const slices = data
    .map((item, index) => {
      const value = item.value || 0;
      const percentage = value / total;
      const angle = percentage * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const largeArcFlag = angle > Math.PI ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");

      currentAngle += angle;

      return `
      <g>
        <path d="${pathData}" fill="${
          colors[index % colors.length]
        }" stroke="white" stroke-width="2"/>
        <text x="${centerX + (radius + 20) * Math.cos(startAngle + angle / 2)}" 
              y="${centerY + (radius + 20) * Math.sin(startAngle + angle / 2)}" 
              text-anchor="middle" 
              font-size="12" 
              fill="${theme?.colors.text || "#1f2937"}">
          ${item.name}: ${(percentage * 100).toFixed(1)}%
        </text>
      </g>
    `;
    })
    .join("");

  return `
    <svg width="${width}" height="${height}" style="background: white; border-radius: 8px;">
      ${slices}
      <text x="${centerX}" y="${centerY}" text-anchor="middle" font-size="16" font-weight="bold" fill="${
        theme?.colors.primary || "#1f2937"
      }">
        Total: ${total}
      </text>
    </svg>
  `;
}

function generateBarChart(
  data: any[],
  colors: string[],
  width: number,
  height: number,
  theme: any
): string {
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  const maxValue = Math.max(...data.map((item) => item.value || 0));

  // Calculate available space per bar
  const barSpacing = chartWidth / data.length;
  const barWidth = Math.min(barSpacing * 0.7, 60); // Limit max bar width

  // Function to truncate long labels
  const truncateLabel = (text: string, maxLength: number = 12) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  };

  // Function to wrap long labels into multiple lines
  const wrapLabel = (text: string, maxCharsPerLine: number = 15) => {
    if (text.length <= maxCharsPerLine) return [text];

    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      if ((currentLine + " " + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    return lines;
  };

  const bars = data
    .map((item, index) => {
      const barHeight = ((item.value || 0) / maxValue) * chartHeight;
      const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
      const y = padding + chartHeight - barHeight;

      // Handle label wrapping
      const labelLines = wrapLabel(item.name, 12);
      const labelHeight = labelLines.length * 12; // 12px per line
      const labelY = padding + chartHeight + 15;

      return `
      <g>
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
              fill="${
                colors[index % colors.length]
              }" stroke="white" stroke-width="1"/>
        <text x="${x + barWidth / 2}" y="${
          y - 5
        }" text-anchor="middle" font-size="12" fill="${
          theme?.colors.text || "#1f2937"
        }">
          ${item.value}
        </text>
        ${labelLines
          .map(
            (line, lineIndex) => `
        <text x="${x + barWidth / 2}" y="${
          labelY + lineIndex * 12
        }" text-anchor="middle" font-size="10" fill="${
          theme?.colors.text || "#1f2937"
        }">
            ${line}
        </text>
        `
          )
          .join("")}
      </g>
    `;
    })
    .join("");

  // Calculate total height needed for labels
  const maxLabelLines = Math.max(
    ...data.map((item) => wrapLabel(item.name, 12).length)
  );
  const totalHeight = height + (maxLabelLines - 1) * 12;

  return `
    <svg width="${width}" height="${totalHeight}" style="background: white; border-radius: 8px;">
      ${bars}
    </svg>
  `;
}

function generateLineChart(
  data: any[],
  colors: string[],
  width: number,
  height: number,
  theme: any
): string {
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  const maxValue = Math.max(...data.map((item) => item.value || 0));
  const minValue = Math.min(...data.map((item) => item.value || 0));
  const valueRange = maxValue - minValue;

  const points = data
    .map((item, index) => {
      const x = padding + (index * chartWidth) / (data.length - 1);
      const y =
        padding +
        chartHeight -
        (((item.value || 0) - minValue) / valueRange) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const linePath = `M ${points}`;

  const dots = data
    .map((item, index) => {
      const x = padding + (index * chartWidth) / (data.length - 1);
      const y =
        padding +
        chartHeight -
        (((item.value || 0) - minValue) / valueRange) * chartHeight;
      return `<circle cx="${x}" cy="${y}" r="4" fill="${colors[0]}" stroke="white" stroke-width="2"/>`;
    })
    .join("");

  return `
    <svg width="${width}" height="${height}" style="background: white; border-radius: 8px;">
      <path d="${linePath}" stroke="${colors[0]}" stroke-width="3" fill="none"/>
      ${dots}
    </svg>
  `;
}

function generateAreaChart(
  data: any[],
  colors: string[],
  width: number,
  height: number,
  theme: any
): string {
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  const maxValue = Math.max(...data.map((item) => item.value || 0));
  const minValue = Math.min(...data.map((item) => item.value || 0));
  const valueRange = maxValue - minValue;

  const points = data
    .map((item, index) => {
      const x = padding + (index * chartWidth) / (data.length - 1);
      const y =
        padding +
        chartHeight -
        (((item.value || 0) - minValue) / valueRange) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPath = `M ${padding},${padding + chartHeight} L ${points} L ${
    padding + chartWidth
  },${padding + chartHeight} Z`;

  return `
    <svg width="${width}" height="${height}" style="background: white; border-radius: 8px;">
      <path d="${areaPath}" fill="${colors[0]}" fill-opacity="0.3"/>
      <path d="M ${points}" stroke="${colors[0]}" stroke-width="3" fill="none"/>
    </svg>
  `;
}

function generateRadarChart(
  data: any[],
  colors: string[],
  width: number,
  height: number,
  theme: any
): string {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;
  const maxValue = Math.max(...data.map((item) => item.value || 0));

  const points = data
    .map((item, index) => {
      const angle = (index * 2 * Math.PI) / data.length;
      const value = (item.value || 0) / maxValue;
      const x = centerX + radius * value * Math.cos(angle - Math.PI / 2);
      const y = centerY + radius * value * Math.sin(angle - Math.PI / 2);
      return `${x},${y}`;
    })
    .join(" ");

  const polygonPath = `M ${points} Z`;

  const gridLines = data
    .map((_, index) => {
      const angle = (index * 2 * Math.PI) / data.length;
      const x1 = centerX;
      const y1 = centerY;
      const x2 = centerX + radius * Math.cos(angle - Math.PI / 2);
      const y2 = centerY + radius * Math.sin(angle - Math.PI / 2);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${
        theme?.colors.text || "#1f2937"
      }" stroke-width="1" opacity="0.3"/>`;
    })
    .join("");

  return `
    <svg width="${width}" height="${height}" style="background: white; border-radius: 8px;">
      <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="${
        theme?.colors.text || "#1f2937"
      }" stroke-width="1" opacity="0.3"/>
      ${gridLines}
      <polygon points="${points}" fill="${
        colors[0]
      }" fill-opacity="0.3" stroke="${colors[0]}" stroke-width="2"/>
    </svg>
  `;
}

function generateDataVisualization(
  chartType: string,
  data: any[],
  colors: string[],
  width: number,
  height: number,
  theme: any
): string {
  // For bullet-list or other unknown types, create a simple data table visualization
  const padding = 40;
  const tableY = padding;
  const rowHeight = 30;
  const colWidth = (width - 2 * padding) / 2;

  // Create a simple data table
  const rows = data
    .map((item, index) => {
      const y = tableY + (index + 1) * rowHeight;
      const percentage =
        data.length > 0
          ? (
              ((item.value || 0) /
                data.reduce((sum, d) => sum + (d.value || 0), 0)) *
              100
            ).toFixed(1)
          : 0;

      return `
      <g>
        <!-- Color indicator -->
        <rect x="${padding}" y="${y - 20}" width="20" height="20" fill="${colors[index % colors.length]}" rx="3"/>
        <!-- Name -->
        <text x="${padding + 30}" y="${y - 5}" font-size="14" fill="${theme?.colors.text || "#1f2937"}" font-family="${theme?.fonts.body || "Arial"}">
          ${item.name || `Item ${index + 1}`}
        </text>
        <!-- Value -->
        <text x="${padding + colWidth}" y="${y - 5}" font-size="14" fill="${theme?.colors.text || "#1f2937"}" font-family="${theme?.fonts.body || "Arial"}" text-anchor="end">
          ${item.value || 0} (${percentage}%)
        </text>
      </g>
    `;
    })
    .join("");

  // Headers
  const headers = `
    <g>
      <text x="${padding + 30}" y="${tableY - 5}" font-size="16" font-weight="bold" fill="${theme?.colors.primary || "#1f2937"}" font-family="${theme?.fonts.heading || "Arial"}">
        Category
      </text>
      <text x="${padding + colWidth}" y="${tableY - 5}" font-size="16" font-weight="bold" fill="${theme?.colors.primary || "#1f2937"}" font-family="${theme?.fonts.heading || "Arial"}" text-anchor="end">
        Value
      </text>
    </g>
  `;

  return `
    <svg width="${width}" height="${height}" style="background: white; border-radius: 8px;">
      ${headers}
      ${rows}
    </svg>
  `;
}

function extractBulletPoints(content: string): string[] {
  if (!content) return [];

  // Clean the content first to prevent garbled text
  const cleanContent = cleanHtmlContent(content);

  // If content cleaning returned a fallback message, return empty array
  if (
    cleanContent.includes("Content appears to be corrupted") ||
    cleanContent.includes("Content could not be processed") ||
    cleanContent.includes("No content available")
  ) {
    console.log("❌ Content appears corrupted, skipping bullet extraction");
    return [];
  }

  // Split content into lines and filter for bullet points
  const lines = cleanContent.split("\n");
  const bulletPoints: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) continue;

    // Check for various bullet point formats
    if (
      trimmed.startsWith("•") ||
      trimmed.startsWith("-") ||
      trimmed.startsWith("*") ||
      trimmed.startsWith("1.") ||
      trimmed.startsWith("2.") ||
      trimmed.startsWith("3.") ||
      trimmed.startsWith("4.") ||
      trimmed.startsWith("5.") ||
      trimmed.startsWith("6.") ||
      trimmed.startsWith("7.") ||
      trimmed.startsWith("8.") ||
      trimmed.startsWith("9.") ||
      trimmed.startsWith("10.")
    ) {
      // Remove bullet point markers and clean up
      let cleanPoint = trimmed
        .replace(/^[•\-\*]\s*/, "") // Remove bullet markers
        .replace(/^\d+\.\s*/, "") // Remove numbered markers
        .trim();

      if (cleanPoint.length > 0) {
        bulletPoints.push(cleanPoint);
      }
    }
  }

  // If no bullet points found, try to extract from content structure
  if (bulletPoints.length === 0) {
    // Look for content that might be structured as bullet points
    const sections = cleanContent.split(/\*\*.*?\*\*/);
    for (const section of sections) {
      const sectionLines = section.split("\n");
      for (const line of sectionLines) {
        const trimmed = line.trim();
        if (trimmed && trimmed.length > 10) {
          // Reasonable content length
          bulletPoints.push(trimmed);
        }
      }
    }
  }

  return bulletPoints;
}
