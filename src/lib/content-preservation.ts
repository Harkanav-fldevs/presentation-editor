import { SlideTemplate } from "@/mastra/types/slide-templates";
import { Slide } from "@/lib/presentation-types";

export class ContentPreservation {
  // Store original content to prevent data loss
  private static originalContent: Map<
    string,
    {
      title: string;
      content: string;
      template?: SlideTemplate;
      extractedData?: any;
    }
  > = new Map();

  // Preserve original content before template change
  static preserveOriginalContent(slideId: string, slide: Slide) {
    // Only preserve if we don't already have original content for this slide
    if (!this.originalContent.has(slideId)) {
      this.originalContent.set(slideId, {
        title: slide.title,
        content: slide.content,
        template: slide.template,
        extractedData: slide.templateData,
      });
    }
  }

  // Get original content for a slide
  static getOriginalContent(slideId: string) {
    return this.originalContent.get(slideId);
  }

  // Clear original content (used when slide is manually edited)
  static clearOriginalContent(slideId: string) {
    this.originalContent.delete(slideId);
  }

  // Force preserve original content (overwrites existing)
  static forcePreserveOriginalContent(slideId: string, slide: Slide) {
    this.originalContent.set(slideId, {
      title: slide.title,
      content: slide.content,
      template: slide.template,
      extractedData: slide.templateData,
    });
  }

  // Restore original content
  static restoreOriginalContent(slideId: string) {
    const original = this.originalContent.get(slideId);
    if (original) {
      return {
        title: original.title,
        content: original.content,
        template: original.template,
        templateData: original.extractedData,
      };
    }
    return null;
  }

  // Enhanced content extraction that preserves all information
  static extractAllContentData(content: string, title: string) {
    const lines = this.cleanContent(content);

    return {
      // Original content
      originalTitle: title,
      originalContent: content,

      // Text content
      allText: lines,
      paragraphs: this.extractParagraphs(content),
      headings: this.extractHeadings(content),

      // Lists
      bullets: this.extractBullets(lines),
      numberedItems: this.extractNumberedItems(lines),

      // Images
      images: this.extractAllImages(content),
      imageUrls: this.extractImageUrls(content),

      // Data points
      numbers: this.extractNumbers(lines),
      percentages: this.extractPercentages(lines),
      dates: this.extractDates(lines),

      // Structured data
      tables: this.extractTables(content),
      links: this.extractLinks(content),
      quotes: this.extractQuotes(lines),

      // Categories
      strengths: this.extractByKeyword(lines, [
        "strength",
        "strong",
        "advantage",
      ]),
      weaknesses: this.extractByKeyword(lines, [
        "weakness",
        "weak",
        "disadvantage",
        "challenge",
      ]),
      opportunities: this.extractByKeyword(lines, [
        "opportunity",
        "opportunities",
        "potential",
      ]),
      threats: this.extractByKeyword(lines, [
        "threat",
        "threats",
        "risk",
        "risks",
      ]),

      // Metrics
      metrics: this.extractMetrics(lines),

      // Timeline
      timelineItems: this.extractTimelineItems(lines),

      // Persona data
      personaInfo: this.extractPersonaInfo(lines),

      // Comparison data
      comparisonItems: this.extractComparisonItems(lines),
    };
  }

  // Create template-specific content while preserving all original data
  static createTemplateContent(
    template: SlideTemplate,
    extractedData: any,
    originalContent: any
  ) {
    switch (template) {
      case SlideTemplate.PIE_CHART:
      case SlideTemplate.BAR_CHART:
      case SlideTemplate.LINE_CHART:
      case SlideTemplate.AREA_CHART:
      case SlideTemplate.RADAR_CHART:
        return this.createChartContent(extractedData, originalContent);

      case SlideTemplate.SWOT_MATRIX:
        return this.createSwotContent(extractedData, originalContent);

      case SlideTemplate.METRICS_DASHBOARD:
        return this.createMetricsContent(extractedData, originalContent);

      case SlideTemplate.PERSONA_CARD:
        return this.createPersonaContent(extractedData, originalContent);

      case SlideTemplate.COMPARISON_TABLE:
        return this.createComparisonContent(extractedData, originalContent);

      case SlideTemplate.TIMELINE:
        return this.createTimelineContent(extractedData, originalContent);

      case SlideTemplate.BULLET_LIST:
        return this.createBulletListContent(extractedData, originalContent);

      case SlideTemplate.NUMBERED_LIST:
        return this.createNumberedListContent(extractedData, originalContent);

      case SlideTemplate.QUOTE:
        return this.createQuoteContent(extractedData, originalContent);

      case SlideTemplate.IMAGE_WITH_CAPTION:
        return this.createImageCaptionContent(extractedData, originalContent);

      case SlideTemplate.CONCLUSION:
        return this.createConclusionContent(extractedData, originalContent);

      case SlideTemplate.TWO_COLUMN:
      case SlideTemplate.TWO_COLUMNS:
        return this.createColumnContent(extractedData, originalContent, 2);

      case SlideTemplate.TWO_COLUMNS_WITH_HEADER:
        return this.createColumnContent(
          extractedData,
          originalContent,
          2,
          true
        );

      case SlideTemplate.THREE_COLUMNS:
        return this.createColumnContent(extractedData, originalContent, 3);

      case SlideTemplate.THREE_COLUMNS_WITH_HEADER:
        return this.createColumnContent(
          extractedData,
          originalContent,
          3,
          true
        );

      case SlideTemplate.FOUR_COLUMNS:
        return this.createColumnContent(extractedData, originalContent, 4);

      case SlideTemplate.ACCENT_LEFT:
      case SlideTemplate.ACCENT_RIGHT:
      case SlideTemplate.ACCENT_TOP:
      case SlideTemplate.ACCENT_RIGHT_FIT:
      case SlideTemplate.ACCENT_LEFT_FIT:
      case SlideTemplate.ACCENT_BACKGROUND:
        return this.createAccentContent(extractedData, originalContent);

      case SlideTemplate.IMAGE_GALLERY:
        return this.createImageGalleryContent(extractedData, originalContent);

      case SlideTemplate.TEAM_PHOTOS:
        return this.createTeamPhotosContent(extractedData, originalContent);

      case SlideTemplate.TWO_IMAGE_COLUMNS:
        return this.createImageColumnsContent(
          extractedData,
          originalContent,
          2
        );

      case SlideTemplate.THREE_IMAGE_COLUMNS:
        return this.createImageColumnsContent(
          extractedData,
          originalContent,
          3
        );

      case SlideTemplate.FOUR_IMAGE_COLUMNS:
        return this.createImageColumnsContent(
          extractedData,
          originalContent,
          4
        );

      case SlideTemplate.IMAGES_WITH_TEXT:
        return this.createImagesWithTextContent(extractedData, originalContent);

      case SlideTemplate.BLANK_CARD:
        return this.createBlankCardContent(extractedData, originalContent);

      case SlideTemplate.IMAGE_AND_TEXT:
        return this.createImageAndTextContent(extractedData, originalContent);

      case SlideTemplate.TEXT_AND_IMAGE:
        return this.createTextAndImageContent(extractedData, originalContent);

      case SlideTemplate.TITLE_WITH_BULLETS:
        return this.createTitleWithBulletsContent(
          extractedData,
          originalContent
        );

      case SlideTemplate.TITLE_WITH_BULLETS_AND_IMAGE:
        return this.createTitleWithBulletsAndImageContent(
          extractedData,
          originalContent
        );

      default:
        return {
          title: originalContent.originalTitle,
          content: originalContent.originalContent,
          templateData: null,
        };
    }
  }

  // Helper methods for content extraction
  private static cleanContent(content: string): string[] {
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  private static extractParagraphs(content: string): string[] {
    return content.split("\n\n").filter((p) => p.trim().length > 0);
  }

  private static extractHeadings(content: string): string[] {
    return content.split("\n").filter((line) => line.startsWith("#"));
  }

  private static extractBullets(lines: string[]): string[] {
    return lines
      .filter(
        (line) =>
          line.startsWith("•") || line.startsWith("-") || line.startsWith("*")
      )
      .map((line) => line.replace(/^[•\-*]\s*/, ""));
  }

  private static extractNumberedItems(lines: string[]): string[] {
    return lines
      .filter((line) => /^\d+\./.test(line))
      .map((line) => line.replace(/^\d+\.\s*/, ""));
  }

  private static extractAllImages(
    content: string
  ): Array<{ src: string; alt: string; caption?: string }> {
    const imageMatches = content.matchAll(/!\[(.*?)\]\((.*?)\)/g);
    return Array.from(imageMatches).map((match) => ({
      src: match[2],
      alt: match[1],
      caption: "Image",
    }));
  }

  private static extractImageUrls(content: string): string[] {
    const urlMatches = content.matchAll(
      /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi
    );
    return Array.from(urlMatches).map((match) => match[0]);
  }

  private static extractNumbers(lines: string[]): number[] {
    const numbers: number[] = [];
    lines.forEach((line) => {
      const matches = line.match(/\d+/g);
      if (matches) {
        numbers.push(...matches.map(Number));
      }
    });
    return numbers;
  }

  private static extractPercentages(lines: string[]): string[] {
    return lines
      .filter((line) => line.includes("%"))
      .map((line) => line.trim());
  }

  private static extractDates(lines: string[]): string[] {
    return lines.filter((line) =>
      /\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|Q\d\s\d{4}/.test(line)
    );
  }

  private static extractTables(content: string): string[][] {
    const lines = content.split("\n");
    const tables: string[][] = [];
    let currentTable: string[] = [];

    lines.forEach((line) => {
      if (line.includes("|")) {
        currentTable.push(
          ...line
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell) => cell)
        );
      } else if (currentTable.length > 0) {
        tables.push(currentTable);
        currentTable = [];
      }
    });

    if (currentTable.length > 0) {
      tables.push(currentTable);
    }

    return tables;
  }

  private static extractLinks(content: string): string[] {
    const linkMatches = content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
    return Array.from(linkMatches).map((match) => match[2]);
  }

  private static extractQuotes(lines: string[]): string[] {
    return lines.filter(
      (line) =>
        line.startsWith('"') || line.startsWith("'") || line.startsWith(">")
    );
  }

  private static extractByKeyword(
    lines: string[],
    keywords: string[]
  ): string[] {
    return lines.filter((line) =>
      keywords.some((keyword) =>
        line.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }

  private static extractMetrics(
    lines: string[]
  ): Array<{ label: string; value: string; change?: string }> {
    return lines.slice(0, 4).map((line, index) => ({
      label: line.trim(),
      value: `${Math.floor(Math.random() * 100)}%`,
      change: index % 2 === 0 ? "+5%" : "-2%",
    }));
  }

  private static extractTimelineItems(
    lines: string[]
  ): Array<{ date: string; title: string; description: string }> {
    return lines.slice(0, 3).map((line, index) => ({
      date: `Q${index + 1} 2024`,
      title: line.trim(),
      description: `Description for ${line.trim()}`,
    }));
  }

  private static extractPersonaInfo(lines: string[]): any {
    return {
      name: lines[0] || "Sample Persona",
      role: lines[1] || "Target User",
      demographics: {
        age: "25-35",
        location: "Urban",
        income: "$50K-$75K",
      },
      psychographics: {
        interests: "Technology, Innovation",
        values: "Efficiency, Growth",
      },
      painPoints: lines.filter((line) => line.startsWith("•")).slice(0, 3),
      goals: lines.filter((line) => line.startsWith("-")).slice(0, 3),
    };
  }

  private static extractComparisonItems(lines: string[]): string[][] {
    return lines.slice(0, 3).map((line) => [line.trim(), "Yes", "No", "Maybe"]);
  }

  // Template-specific content creation methods
  private static createChartContent(extractedData: any, originalContent: any) {
    const dataPoints = extractedData.numbers
      .slice(0, 5)
      .map((value: number, index: number) => ({
        name: extractedData.allText[index] || `Item ${index + 1}`,
        value: value,
      }));

    return {
      title: originalContent.originalTitle,
      content: `Data visualization for: ${originalContent.originalTitle}`,
      templateData: {
        type: "pie",
        data: dataPoints,
        dataKey: "value",
        nameKey: "name",
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      },
    };
  }

  private static createSwotContent(extractedData: any, originalContent: any) {
    return {
      title: originalContent.originalTitle,
      content: `SWOT Analysis: ${originalContent.originalTitle}`,
      templateData: {
        strengths:
          extractedData.strengths.length > 0
            ? extractedData.strengths
            : ["Strong brand recognition", "Experienced team"],
        weaknesses:
          extractedData.weaknesses.length > 0
            ? extractedData.weaknesses
            : ["Limited market reach", "High costs"],
        opportunities:
          extractedData.opportunities.length > 0
            ? extractedData.opportunities
            : ["Market expansion", "New partnerships"],
        threats:
          extractedData.threats.length > 0
            ? extractedData.threats
            : ["Competition", "Economic changes"],
      },
    };
  }

  private static createMetricsContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content: `Key Metrics: ${originalContent.originalTitle}`,
      templateData: {
        metrics:
          extractedData.metrics.length > 0
            ? extractedData.metrics
            : [
                {
                  label: "Revenue",
                  value: "$2.4M",
                  change: "+12%",
                  trend: "up",
                },
                { label: "Users", value: "15.2K", change: "+8%", trend: "up" },
                {
                  label: "Conversion",
                  value: "3.2%",
                  change: "-2%",
                  trend: "down",
                },
                {
                  label: "Retention",
                  value: "87%",
                  change: "+5%",
                  trend: "up",
                },
              ],
      },
    };
  }

  private static createPersonaContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content: `Persona Profile: ${originalContent.originalTitle}`,
      templateData: {
        ...extractedData.personaInfo,
        name: extractedData.personaInfo.name,
        role: extractedData.personaInfo.role,
      },
    };
  }

  private static createComparisonContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content: `Comparison: ${originalContent.originalTitle}`,
      templateData: {
        headers: ["Feature", "Option A", "Option B", "Option C"],
        rows:
          extractedData.comparisonItems.length > 0
            ? extractedData.comparisonItems
            : [
                ["Price", "$99/month", "$149/month", "$79/month"],
                ["Support", "24/7", "Business hours", "Email only"],
                ["Integration", "Yes", "Limited", "Yes"],
              ],
      },
    };
  }

  private static createTimelineContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content: `Timeline: ${originalContent.originalTitle}`,
      templateData: {
        events:
          extractedData.timelineItems.length > 0
            ? extractedData.timelineItems
            : [
                {
                  date: "Q1 2024",
                  title: "Project Launch",
                  description: "Initial development phase",
                },
                {
                  date: "Q2 2024",
                  title: "Beta Release",
                  description: "Limited user testing",
                },
                {
                  date: "Q3 2024",
                  title: "Full Launch",
                  description: "Public release",
                },
              ],
      },
    };
  }

  private static createBulletListContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content:
        extractedData.bullets.length > 0
          ? extractedData.bullets.join("\n")
          : originalContent.originalContent,
      templateData: {
        title: originalContent.originalTitle,
        bullets:
          extractedData.bullets.length > 0
            ? extractedData.bullets
            : ["Key point 1", "Key point 2", "Key point 3"],
        image:
          extractedData.images.length > 0
            ? extractedData.images[0].src
            : undefined,
      },
    };
  }

  private static createNumberedListContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content:
        extractedData.numberedItems.length > 0
          ? extractedData.numberedItems.join("\n")
          : originalContent.originalContent,
      templateData: {
        title: originalContent.originalTitle,
        items:
          extractedData.numberedItems.length > 0
            ? extractedData.numberedItems
            : ["First item", "Second item", "Third item"],
        image:
          extractedData.images.length > 0
            ? extractedData.images[0].src
            : undefined,
      },
    };
  }

  private static createQuoteContent(extractedData: any, originalContent: any) {
    return {
      title: originalContent.originalTitle,
      content:
        extractedData.quotes.length > 0
          ? extractedData.quotes[0]
          : originalContent.originalContent,
      templateData: {
        title: originalContent.originalTitle,
        quote:
          extractedData.quotes.length > 0
            ? extractedData.quotes[0]
            : originalContent.originalContent,
        author: "Author Name",
        image:
          extractedData.images.length > 0
            ? extractedData.images[0].src
            : undefined,
      },
    };
  }

  private static createImageCaptionContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content: originalContent.originalContent
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .trim(),
      templateData: {
        title: originalContent.originalTitle,
        content: originalContent.originalContent
          .replace(/!\[.*?\]\(.*?\)/g, "")
          .trim(),
        image:
          extractedData.images.length > 0
            ? extractedData.images[0].src
            : "/placeholder.jpg",
        caption: "Image caption",
      },
    };
  }

  private static createConclusionContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content: originalContent.originalContent,
      templateData: {
        title: originalContent.originalTitle,
        content: originalContent.originalContent,
        callToAction: "Thank you for your attention",
      },
    };
  }

  private static createColumnContent(
    extractedData: any,
    originalContent: any,
    columnCount: number,
    withHeaders = false
  ) {
    const sections = this.splitContentIntoColumns(
      originalContent.originalContent,
      columnCount
    );

    return {
      title: originalContent.originalTitle,
      content: `Multi-column layout: ${originalContent.originalTitle}`,
      templateData: {
        columns: sections.map((section, index) => ({
          title: withHeaders ? `Section ${index + 1}` : undefined,
          content: section,
          image: this.extractImageFromContent(section),
        })),
      },
    };
  }

  private static createAccentContent(extractedData: any, originalContent: any) {
    return {
      title: originalContent.originalTitle,
      content: originalContent.originalContent,
      templateData: {
        title: originalContent.originalTitle,
        content: originalContent.originalContent,
        image:
          extractedData.images.length > 0
            ? extractedData.images[0].src
            : undefined,
        accentPosition: "left",
        accentColor: "#3b82f6",
      },
    };
  }

  private static createImageGalleryContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content: originalContent.originalContent
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .trim(),
      templateData: {
        title: originalContent.originalTitle,
        content: originalContent.originalContent
          .replace(/!\[.*?\]\(.*?\)/g, "")
          .trim(),
        images:
          extractedData.images.length > 0
            ? extractedData.images
            : [
                {
                  src: "/placeholder-1.jpg",
                  alt: "Image 1",
                  caption: "Sample image 1",
                },
                {
                  src: "/placeholder-2.jpg",
                  alt: "Image 2",
                  caption: "Sample image 2",
                },
                {
                  src: "/placeholder-3.jpg",
                  alt: "Image 3",
                  caption: "Sample image 3",
                },
              ],
        layout: "grid",
      },
    };
  }

  private static createTeamPhotosContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content: `Team: ${originalContent.originalTitle}`,
      templateData: {
        title: originalContent.originalTitle,
        members: extractedData.allText
          .slice(0, 3)
          .map((name: string, index: number) => ({
            name: name,
            role: `Role ${index + 1}`,
            image: `/placeholder-${index + 1}.jpg`,
            bio: `Bio for ${name}`,
          })),
      },
    };
  }

  private static createImageColumnsContent(
    extractedData: any,
    originalContent: any,
    columnCount: number
  ) {
    const sections = this.splitContentIntoColumns(
      originalContent.originalContent,
      columnCount
    );

    return {
      title: originalContent.originalTitle,
      content: `Image columns: ${originalContent.originalTitle}`,
      templateData: {
        columns: sections.map((section, index) => ({
          title: `Image ${index + 1}`,
          content: section.replace(/!\[.*?\]\(.*?\)/g, "").trim(),
          image:
            this.extractImageFromContent(section) ||
            `/placeholder-${index + 1}.jpg`,
        })),
      },
    };
  }

  private static createImagesWithTextContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content: originalContent.originalContent
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .trim(),
      templateData: {
        title: originalContent.originalTitle,
        content: originalContent.originalContent
          .replace(/!\[.*?\]\(.*?\)/g, "")
          .trim(),
        images:
          extractedData.images.length > 0
            ? extractedData.images
            : [
                { src: "/placeholder-1.jpg", alt: "Image 1" },
                { src: "/placeholder-2.jpg", alt: "Image 2" },
                { src: "/placeholder-3.jpg", alt: "Image 3" },
              ],
      },
    };
  }

  private static createBlankCardContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content: originalContent.originalContent,
      templateData: {
        title: originalContent.originalTitle,
        content: originalContent.originalContent,
      },
    };
  }

  private static createImageAndTextContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content: originalContent.originalContent
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .trim(),
      templateData: {
        title: originalContent.originalTitle,
        content: originalContent.originalContent
          .replace(/!\[.*?\]\(.*?\)/g, "")
          .trim(),
        image:
          extractedData.images.length > 0
            ? extractedData.images[0].src
            : "/placeholder.jpg",
        imagePosition: "left",
      },
    };
  }

  private static createTextAndImageContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content: originalContent.originalContent
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .trim(),
      templateData: {
        title: originalContent.originalTitle,
        content: originalContent.originalContent
          .replace(/!\[.*?\]\(.*?\)/g, "")
          .trim(),
        image:
          extractedData.images.length > 0
            ? extractedData.images[0].src
            : "/placeholder.jpg",
        imagePosition: "right",
      },
    };
  }

  private static createTitleWithBulletsContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content:
        extractedData.bullets.length > 0
          ? extractedData.bullets.join("\n")
          : originalContent.originalContent,
      templateData: {
        title: originalContent.originalTitle,
        bullets:
          extractedData.bullets.length > 0
            ? extractedData.bullets
            : ["Key point 1", "Key point 2", "Key point 3"],
      },
    };
  }

  private static createTitleWithBulletsAndImageContent(
    extractedData: any,
    originalContent: any
  ) {
    return {
      title: originalContent.originalTitle,
      content:
        extractedData.bullets.length > 0
          ? extractedData.bullets.join("\n")
          : originalContent.originalContent,
      templateData: {
        title: originalContent.originalTitle,
        bullets:
          extractedData.bullets.length > 0
            ? extractedData.bullets
            : ["Key point 1", "Key point 2", "Key point 3"],
        image:
          extractedData.images.length > 0
            ? extractedData.images[0].src
            : "/placeholder.jpg",
      },
    };
  }

  // Helper methods
  private static splitContentIntoColumns(
    content: string,
    columnCount: number
  ): string[] {
    const lines = content.split("\n").filter((line) => line.trim());
    const linesPerColumn = Math.ceil(lines.length / columnCount);
    const columns = [];

    for (let i = 0; i < columnCount; i++) {
      const start = i * linesPerColumn;
      const end = Math.min(start + linesPerColumn, lines.length);
      columns.push(lines.slice(start, end).join("\n"));
    }

    return columns;
  }

  private static extractImageFromContent(content: string): string | undefined {
    const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
    return imageMatch ? imageMatch[1] : undefined;
  }
}
