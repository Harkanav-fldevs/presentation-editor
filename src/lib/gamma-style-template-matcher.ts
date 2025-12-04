import { SlideTemplate } from "@/mastra/types/slide-templates";
import { Slide } from "./presentation-types";

/**
 * Gamma-style intelligent template matcher
 *
 * This utility provides enhanced content-to-template matching similar to gamma.app
 * by analyzing slide content structure and semantics rather than just keywords.
 */
export class GammaStyleTemplateMatcher {
  /**
   * Main method to analyze content and recommend the best template
   *
   * @param slide The slide to analyze
   * @returns The recommended template and confidence score
   */
  public static recommendTemplate(slide: Slide): {
    template: SlideTemplate;
    confidence: number;
    reason: string;
  } {
    const { title, content } = slide;

    // First slide is always a title slide
    if (slide.order === 0 || slide.order === 1) {
      return {
        template: SlideTemplate.TITLE_SLIDE,
        confidence: 0.95,
        reason: "First slide in presentation",
      };
    }

    // Check for continuation slides - maintain template consistency
    if (
      title.toLowerCase().includes("(continued)") ||
      title.toLowerCase().includes("(part ")
    ) {
      return this.handleContinuationSlide(slide);
    }

    // Analyze content structure
    const contentStructure = this.analyzeContentStructure(content);

    // Use content structure to determine best template
    return this.selectTemplateByStructure(contentStructure, title, content);
  }

  /**
   * Handle continuation slides by matching template with previous slide
   */
  private static handleContinuationSlide(slide: Slide): {
    template: SlideTemplate;
    confidence: number;
    reason: string;
  } {
    // Try to extract the base title (without the continuation marker)
    const baseTitle = slide.title
      .replace(/\s*\(continued\)/i, "")
      .replace(/\s*\(part\s*\d+\)/i, "")
      .trim();

    // For continuation slides, the content structure is more important than the title
    const contentStructure = this.analyzeContentStructure(slide.content);

    return this.selectTemplateByStructure(
      contentStructure,
      baseTitle,
      slide.content
    );
  }

  /**
   * Analyze the structure and characteristics of slide content
   */
  private static analyzeContentStructure(content: string): ContentStructure {
    const structure: ContentStructure = {
      bulletPoints: this.countBulletPoints(content),
      numberedItems: this.countNumberedItems(content),
      sections: this.countSections(content),
      paragraphs: this.countParagraphs(content),
      images: this.countImageReferences(content),
      charts: this.detectChartReferences(content),
      tables: this.detectTableReferences(content),
      quotes: this.detectQuotes(content),
      metrics: this.detectMetrics(content),
      percentages: this.countPercentages(content),
      comparison: this.detectComparison(content),
      timeline: this.detectTimeline(content),
      people: this.detectPeople(content),
      dataStructure: this.detectDataStructure(content),
      formality: this.detectFormality(content),
      density: this.calculateDensity(content),
    };

    return structure;
  }

  /**
   * Select the best template based on content structure
   */
  private static selectTemplateByStructure(
    structure: ContentStructure,
    title: string,
    content: string
  ): { template: SlideTemplate; confidence: number; reason: string } {
    // Use a series of specialized detectors for specific content types

    // Check for SWOT components
    const swotResult = this.detectSwot(title, content);
    if (swotResult) return swotResult;

    // Check for data visualizations
    const chartResult = this.detectChartType(structure, title, content);
    if (chartResult) return chartResult;

    // Check for people-related content
    const peopleResult = this.detectPeopleContent(structure, title, content);
    if (peopleResult) return peopleResult;

    // Check for comparison content
    const comparisonResult = this.detectComparisonContent(
      structure,
      title,
      content
    );
    if (comparisonResult) return comparisonResult;

    // Check for timeline content
    const timelineResult = this.detectTimelineContent(
      structure,
      title,
      content
    );
    if (timelineResult) return timelineResult;

    // Check for metrics/dashboard content
    const metricsResult = this.detectMetricsContent(structure, title, content);
    if (metricsResult) return metricsResult;

    // Check for list-oriented content
    const listResult = this.detectListContent(structure, title, content);
    if (listResult) return listResult;

    // Check for image-oriented content
    const imageResult = this.detectImageContent(structure, title, content);
    if (imageResult) return imageResult;

    // Check for quote content
    const quoteResult = this.detectQuoteContent(structure, title, content);
    if (quoteResult) return quoteResult;

    // Check for column-based layouts
    const columnResult = this.detectColumnLayout(structure, title, content);
    if (columnResult) return columnResult;

    // Default to content slide with accent based on content formality and density
    return this.selectDefaultTemplate(structure, title, content);
  }

  /**
   * Select a default template based on content characteristics
   */
  private static selectDefaultTemplate(
    structure: ContentStructure,
    title: string,
    content: string
  ): { template: SlideTemplate; confidence: number; reason: string } {
    // High density formal content looks best in an accent layout
    if (structure.density > 0.7 && structure.formality > 0.6) {
      return {
        template: SlideTemplate.ACCENT_LEFT,
        confidence: 0.65,
        reason: "Dense formal content suitable for accent layout",
      };
    }

    // Paragraph-heavy content with minimal structure
    if (structure.paragraphs > 1 && structure.sections < 2) {
      return {
        template: SlideTemplate.CONTENT,
        confidence: 0.7,
        reason: "Paragraph-based content suitable for standard layout",
      };
    }

    // Lower density content with some structuring
    if (structure.density < 0.5 && structure.sections > 0) {
      return {
        template: SlideTemplate.TWO_COLUMN,
        confidence: 0.65,
        reason: "Structured content suitable for column layout",
      };
    }

    // Generic fallback
    return {
      template: SlideTemplate.CONTENT,
      confidence: 0.6,
      reason: "Default content layout for general information",
    };
  }

  /**
   * Detect SWOT analysis components
   */
  private static detectSwot(
    title: string,
    content: string
  ): {
    template: SlideTemplate;
    confidence: number;
    reason: string;
  } | null {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();

    // Check for complete SWOT
    if (
      (lowerTitle.includes("swot") || lowerTitle.includes("analysis")) &&
      lowerContent.includes("strength") &&
      lowerContent.includes("weakness") &&
      lowerContent.includes("opportunit") &&
      lowerContent.includes("threat")
    ) {
      return {
        template: SlideTemplate.CONTENT,
        confidence: 0.95,
        reason: "Complete SWOT analysis with all four components",
      };
    }

    // Check for individual SWOT components
    if (
      lowerTitle.includes("strength") ||
      (lowerContent.includes("strength") && !lowerContent.includes("weakness"))
    ) {
      return {
        template: SlideTemplate.CONTENT,
        confidence: 0.9,
        reason: "Content focused on strengths component",
      };
    }

    if (
      lowerTitle.includes("weakness") ||
      (lowerContent.includes("weakness") && !lowerContent.includes("strength"))
    ) {
      return {
        template: SlideTemplate.CONTENT,
        confidence: 0.9,
        reason: "Content focused on weaknesses component",
      };
    }

    if (
      lowerTitle.includes("opportunit") ||
      (lowerContent.includes("opportunit") && !lowerContent.includes("threat"))
    ) {
      return {
        template: SlideTemplate.CONTENT,
        confidence: 0.9,
        reason: "Content focused on opportunities component",
      };
    }

    if (
      lowerTitle.includes("threat") ||
      (lowerContent.includes("threat") && !lowerContent.includes("opportunit"))
    ) {
      return {
        template: SlideTemplate.CONTENT,
        confidence: 0.9,
        reason: "Content focused on threats component",
      };
    }

    return null;
  }

  /**
   * Detect chart type based on content
   */
  private static detectChartType(
    structure: ContentStructure,
    title: string,
    content: string
  ): { template: SlideTemplate; confidence: number; reason: string } | null {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();

    // Distribution data is best shown in pie charts
    if (
      structure.percentages > 3 ||
      lowerContent.includes("distribution") ||
      lowerContent.includes("allocation") ||
      lowerContent.includes("breakdown") ||
      lowerTitle.includes("marketing mix")
    ) {
      return {
        template: SlideTemplate.PIE_CHART,
        confidence: 0.85,
        reason: "Distribution or percentage data suitable for pie chart",
      };
    }

    // Time-based data is best shown in line charts
    if (
      lowerContent.includes("trend") ||
      lowerContent.includes("over time") ||
      lowerContent.includes("growth") ||
      lowerContent.includes("forecast") ||
      lowerContent.includes("projection") ||
      lowerContent.match(
        /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|q1|q2|q3|q4|quarter)/i
      )
    ) {
      return {
        template: SlideTemplate.LINE_CHART,
        confidence: 0.85,
        reason: "Time-series or trend data suitable for line chart",
      };
    }

    // Comparison data is best shown in bar charts
    if (
      lowerContent.includes("compare") ||
      lowerContent.includes(" vs ") ||
      lowerContent.includes("versus") ||
      lowerContent.includes("ranking") ||
      structure.comparison
    ) {
      return {
        template: SlideTemplate.BAR_CHART,
        confidence: 0.8,
        reason: "Comparison data suitable for bar chart",
      };
    }

    // Multi-dimensional comparisons work well with radar charts
    if (
      (lowerContent.includes("dimension") ||
        lowerContent.includes("attribute") ||
        lowerContent.includes("factor")) &&
      structure.dataStructure === "multi-dimensional"
    ) {
      return {
        template: SlideTemplate.RADAR_CHART,
        confidence: 0.75,
        reason: "Multi-dimensional data suitable for radar chart",
      };
    }

    // Cumulative data or stacked trends work well with area charts
    if (
      lowerContent.includes("cumulative") ||
      lowerContent.includes("accumulated") ||
      lowerContent.includes("stacked")
    ) {
      return {
        template: SlideTemplate.AREA_CHART,
        confidence: 0.75,
        reason: "Cumulative or stacked data suitable for area chart",
      };
    }

    return null;
  }

  /**
   * Detect people-focused content
   */
  private static detectPeopleContent(
    structure: ContentStructure,
    title: string,
    content: string
  ): { template: SlideTemplate; confidence: number; reason: string } | null {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();

    // Team or organization members
    if (
      lowerTitle.includes("team") ||
      lowerTitle.includes("staff") ||
      lowerTitle.includes("employee") ||
      lowerTitle.includes("our people") ||
      structure.people > 2
    ) {
      return {
        template: SlideTemplate.TEAM_PHOTOS,
        confidence: 0.85,
        reason:
          "Team or people-focused content suitable for team photos layout",
      };
    }

    // Persona profiles
    if (
      lowerTitle.includes("persona") ||
      lowerTitle.includes("customer profile") ||
      lowerTitle.includes("user profile") ||
      lowerTitle.includes("buyer") ||
      (lowerContent.includes("persona") &&
        (lowerContent.includes("demographic") ||
          lowerContent.includes("psychographic") ||
          lowerContent.includes("pain point") ||
          lowerContent.includes("goal")))
    ) {
      return {
        template: SlideTemplate.CONTENT,
        confidence: 0.9,
        reason: "User or customer persona content suitable for content layout",
      };
    }

    return null;
  }

  /**
   * Detect comparison-oriented content
   */
  private static detectComparisonContent(
    structure: ContentStructure,
    title: string,
    content: string
  ): { template: SlideTemplate; confidence: number; reason: string } | null {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();

    if (
      lowerTitle.includes("comparison") ||
      lowerTitle.includes("competitor") ||
      lowerTitle.includes(" vs ") ||
      lowerTitle.includes("versus") ||
      structure.comparison ||
      structure.tables ||
      (lowerContent.includes("compare") &&
        (lowerContent.includes("feature") || lowerContent.includes("benefit")))
    ) {
      return {
        template: SlideTemplate.COMPARISON_TABLE,
        confidence: 0.85,
        reason: "Comparison data suitable for structured comparison table",
      };
    }

    return null;
  }

  /**
   * Detect timeline content
   */
  private static detectTimelineContent(
    structure: ContentStructure,
    title: string,
    content: string
  ): { template: SlideTemplate; confidence: number; reason: string } | null {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();

    if (
      lowerTitle.includes("timeline") ||
      lowerTitle.includes("roadmap") ||
      lowerTitle.includes("schedule") ||
      lowerTitle.includes("milestone") ||
      structure.timeline ||
      lowerContent.includes("timeline") ||
      lowerContent.includes("roadmap") ||
      lowerContent.includes("schedule") ||
      lowerContent.includes("milestone") ||
      lowerContent.includes("phase")
    ) {
      return {
        template: SlideTemplate.TIMELINE,
        confidence: 0.85,
        reason: "Time-ordered content suitable for timeline layout",
      };
    }

    return null;
  }

  /**
   * Detect metrics/dashboard content
   */
  private static detectMetricsContent(
    structure: ContentStructure,
    title: string,
    content: string
  ): { template: SlideTemplate; confidence: number; reason: string } | null {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();

    if (
      lowerTitle.includes("metric") ||
      lowerTitle.includes("kpi") ||
      lowerTitle.includes("performance") ||
      lowerTitle.includes("dashboard") ||
      structure.metrics > 2 ||
      (structure.sections > 1 && structure.percentages > 2) ||
      (lowerContent.includes("metric") && lowerContent.includes("target"))
    ) {
      return {
        template: SlideTemplate.METRICS_DASHBOARD,
        confidence: 0.85,
        reason: "Metrics or KPI content suitable for metrics dashboard layout",
      };
    }

    return null;
  }

  /**
   * Detect list-oriented content
   */
  private static detectListContent(
    structure: ContentStructure,
    title: string,
    content: string
  ): { template: SlideTemplate; confidence: number; reason: string } | null {
    // Slides with many bullet points
    if (structure.bulletPoints > 3) {
      if (structure.images > 0) {
        return {
          template: SlideTemplate.CONTENT,
          confidence: 0.8,
          reason: "Bullet list with image references",
        };
      }

      return {
        template: SlideTemplate.BULLET_LIST,
        confidence: 0.85,
        reason: "Content primarily organized as bullet points",
      };
    }

    // Slides with numbered items or steps
    if (structure.numberedItems > 2) {
      return {
        template: SlideTemplate.CONTENT,
        confidence: 0.85,
        reason: "Content organized as numbered steps or sequence",
      };
    }

    return null;
  }

  /**
   * Detect image-oriented content
   */
  private static detectImageContent(
    structure: ContentStructure,
    title: string,
    content: string
  ): { template: SlideTemplate; confidence: number; reason: string } | null {
    // Multiple images
    if (structure.images > 3) {
      return {
        template: SlideTemplate.IMAGE_GALLERY,
        confidence: 0.85,
        reason: "Multiple image references suitable for gallery layout",
      };
    }

    // Single image with caption
    if (structure.images === 1 && structure.paragraphs < 2) {
      return {
        template: SlideTemplate.CONTENT,
        confidence: 0.8,
        reason: "Single image with minimal text suitable for content layout",
      };
    }

    // Image with substantial text
    if (structure.images === 1 && structure.paragraphs >= 2) {
      return {
        template: SlideTemplate.CONTENT,
        confidence: 0.8,
        reason:
          "Single image with substantial text suitable for content layout",
      };
    }

    // Two images
    if (structure.images === 2) {
      return {
        template: SlideTemplate.TWO_IMAGE_COLUMNS,
        confidence: 0.8,
        reason: "Two image references suitable for two-image column layout",
      };
    }

    // Three images
    if (structure.images === 3) {
      return {
        template: SlideTemplate.THREE_IMAGE_COLUMNS,
        confidence: 0.8,
        reason: "Three image references suitable for three-image column layout",
      };
    }

    return null;
  }

  /**
   * Detect quote content
   */
  private static detectQuoteContent(
    structure: ContentStructure,
    title: string,
    content: string
  ): { template: SlideTemplate; confidence: number; reason: string } | null {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();

    if (
      lowerTitle.includes("quote") ||
      lowerTitle.includes("testimonial") ||
      structure.quotes ||
      (content.includes('"') && content.includes("—"))
    ) {
      return {
        template: SlideTemplate.QUOTE,
        confidence: 0.9,
        reason: "Quote or testimonial content",
      };
    }

    return null;
  }

  /**
   * Detect appropriate column layout based on content structure
   */
  private static detectColumnLayout(
    structure: ContentStructure,
    title: string,
    content: string
  ): { template: SlideTemplate; confidence: number; reason: string } | null {
    // Content with clear sections
    if (structure.sections >= 4) {
      return {
        template: SlideTemplate.FOUR_COLUMNS,
        confidence: 0.75,
        reason: "4 or more distinct sections suitable for four-column layout",
      };
    }

    if (structure.sections === 3) {
      return {
        template: SlideTemplate.THREE_COLUMNS,
        confidence: 0.8,
        reason: "3 distinct sections suitable for three-column layout",
      };
    }

    if (structure.sections === 2) {
      return {
        template: SlideTemplate.TWO_COLUMNS,
        confidence: 0.85,
        reason: "2 distinct sections suitable for two-column layout",
      };
    }

    // Content with high information density but low section count
    // might benefit from accent layouts
    if (structure.density > 0.7 && structure.sections <= 1) {
      return {
        template: SlideTemplate.ACCENT_LEFT,
        confidence: 0.7,
        reason: "Dense content suitable for accent layout for visual interest",
      };
    }

    return null;
  }

  /**
   * Count bullet points in content
   */
  private static countBulletPoints(content: string): number {
    const matches = content.match(/^- .+/gm);
    return matches ? matches.length : 0;
  }

  /**
   * Count numbered items in content
   */
  private static countNumberedItems(content: string): number {
    const matches = content.match(/^\d+\.\s+.+/gm);
    return matches ? matches.length : 0;
  }

  /**
   * Count sections in content
   */
  private static countSections(content: string): number {
    const matches = content.match(/\*\*.*?\*\*/g);
    return matches ? matches.length : 0;
  }

  /**
   * Count paragraphs in content
   */
  private static countParagraphs(content: string): number {
    return content.split("\n\n").filter((p) => p.trim().length > 0).length;
  }

  /**
   * Count image references in content
   */
  private static countImageReferences(content: string): number {
    // Look for markdown image syntax and URL image references
    const markdownImages = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
    const urlImages = (
      content.match(/https?:\/\/.*?\.(jpg|jpeg|png|gif|svg|webp)/gi) || []
    ).length;

    // Don't double count URLs that are inside markdown image syntax
    const total =
      markdownImages +
      (urlImages > markdownImages ? urlImages - markdownImages : 0);
    return total;
  }

  /**
   * Detect chart references in content
   */
  private static detectChartReferences(content: string): boolean {
    const lowerContent = content.toLowerCase();
    return (
      lowerContent.includes("chart") ||
      lowerContent.includes("graph") ||
      lowerContent.includes("plot") ||
      lowerContent.includes("figure")
    );
  }

  /**
   * Detect table references in content
   */
  private static detectTableReferences(content: string): boolean {
    const lowerContent = content.toLowerCase();
    return (
      lowerContent.includes("table") ||
      content.includes("|") ||
      (lowerContent.includes("column") && lowerContent.includes("row"))
    );
  }

  /**
   * Detect quotes in content
   */
  private static detectQuotes(content: string): boolean {
    return (
      content.includes('"') ||
      content.includes('"') ||
      content.includes('"') ||
      content.includes("—") ||
      content.includes("testimonial")
    );
  }

  /**
   * Detect metrics in content
   */
  private static detectMetrics(content: string): number {
    const lowerContent = content.toLowerCase();

    let count = 0;

    // Check for metric indicators
    if (lowerContent.includes("kpi")) count++;
    if (lowerContent.includes("metric")) count++;
    if (lowerContent.includes("target")) count++;
    if (lowerContent.includes("performance")) count++;
    if (lowerContent.includes("measure")) count++;
    if (lowerContent.includes("indicator")) count++;
    if (lowerContent.includes("benchmark")) count++;

    // Check for percentage patterns
    const percentMatches = content.match(/\d+%/g);
    if (percentMatches) {
      count += Math.min(percentMatches.length, 3); // Cap at 3 to avoid over-counting
    }

    // Check for currency patterns
    const currencyMatches = content.match(/[$€£¥]\s*\d+/g);
    if (currencyMatches) {
      count += Math.min(currencyMatches.length, 3); // Cap at 3
    }

    return count;
  }

  /**
   * Count percentage references in content
   */
  private static countPercentages(content: string): number {
    const percentMatches = content.match(/\d+%/g);
    return percentMatches ? percentMatches.length : 0;
  }

  /**
   * Detect comparison structure in content
   */
  private static detectComparison(content: string): boolean {
    const lowerContent = content.toLowerCase();

    return (
      lowerContent.includes(" vs ") ||
      lowerContent.includes("versus") ||
      lowerContent.includes("compare") ||
      lowerContent.includes("comparison") ||
      lowerContent.includes("competitive") ||
      (lowerContent.includes("advantage") &&
        lowerContent.includes("disadvantage")) ||
      (lowerContent.includes("pro") && lowerContent.includes("con"))
    );
  }

  /**
   * Detect timeline structure in content
   */
  private static detectTimeline(content: string): boolean {
    const lowerContent = content.toLowerCase();

    return (
      lowerContent.includes("timeline") ||
      lowerContent.includes("roadmap") ||
      lowerContent.includes("schedule") ||
      lowerContent.includes("milestone") ||
      lowerContent.includes("phase") ||
      (
        lowerContent.match(
          /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|q1|q2|q3|q4|quarter|year)\b/gi
        ) || []
      ).length >= 3
    );
  }

  /**
   * Detect people references in content
   */
  private static detectPeople(content: string): number {
    const lowerContent = content.toLowerCase();

    let count = 0;

    // People-related keywords
    if (lowerContent.includes("team")) count++;
    if (lowerContent.includes("staff")) count++;
    if (lowerContent.includes("employee")) count++;
    if (lowerContent.includes("member")) count++;
    if (lowerContent.includes("person")) count++;
    if (lowerContent.includes("role")) count++;
    if (lowerContent.includes("department")) count++;
    if (lowerContent.includes("manager")) count++;
    if (lowerContent.includes("director")) count++;
    if (lowerContent.includes("lead")) count++;

    // Look for common name patterns (capitalized words not at start of sentence)
    const nameMatches = content.match(/(?<!\.\s+)[A-Z][a-z]+\s+[A-Z][a-z]+/g);
    if (nameMatches) {
      count += Math.min(nameMatches.length, 5); // Cap at 5 to avoid over-counting
    }

    return count;
  }

  /**
   * Detect data structure type in content
   */
  private static detectDataStructure(
    content: string
  ):
    | "tabular"
    | "hierarchical"
    | "multi-dimensional"
    | "time-series"
    | "simple" {
    const lowerContent = content.toLowerCase();

    // Check for tabular data
    if (content.includes("|") || lowerContent.includes("table")) {
      return "tabular";
    }

    // Check for hierarchical data
    if (
      lowerContent.includes("hierarchy") ||
      lowerContent.includes("organization") ||
      lowerContent.includes("structure") ||
      lowerContent.includes("parent") ||
      lowerContent.includes("child") ||
      lowerContent.includes("tree")
    ) {
      return "hierarchical";
    }

    // Check for multi-dimensional data
    if (
      lowerContent.includes("dimension") ||
      lowerContent.includes("attribute") ||
      lowerContent.includes("factor") ||
      lowerContent.includes("aspect") ||
      lowerContent.includes("parameter")
    ) {
      return "multi-dimensional";
    }

    // Check for time-series data
    if (
      lowerContent.includes("time series") ||
      lowerContent.includes("trend") ||
      lowerContent.includes("growth") ||
      lowerContent.includes("over time") ||
      lowerContent.match(
        /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|q1|q2|q3|q4|quarter)\b/i
      )
    ) {
      return "time-series";
    }

    // Default to simple data
    return "simple";
  }

  /**
   * Detect formality level of content
   */
  private static detectFormality(content: string): number {
    const lowerContent = content.toLowerCase();

    let formalityScore = 0.5; // Start at neutral

    // Formal indicators
    if (
      content.match(
        /\b(therefore|however|consequently|furthermore|moreover|thus|hence|accordingly)\b/gi
      )
    ) {
      formalityScore += 0.1;
    }

    if (
      content.match(
        /\b(analyze|analysis|implementation|strategy|methodology|procedure)\b/gi
      )
    ) {
      formalityScore += 0.1;
    }

    if (!content.includes("!") && !content.includes("?")) {
      formalityScore += 0.05;
    }

    if (!lowerContent.includes("you") && !lowerContent.includes("we")) {
      formalityScore += 0.05;
    }

    if (!lowerContent.match(/\b(great|awesome|cool|amazing|wow|nice)\b/g)) {
      formalityScore += 0.05;
    }

    // Informal indicators
    if (
      lowerContent.match(
        /\b(so|like|really|pretty|very|just|kind of|sort of)\b/g
      )
    ) {
      formalityScore -= 0.1;
    }

    if (content.includes("!") && content.match(/!{2,}/g)) {
      formalityScore -= 0.1;
    }

    if (lowerContent.includes("you") && lowerContent.includes("your")) {
      formalityScore -= 0.05;
    }

    if (lowerContent.match(/\b(great|awesome|cool|amazing|wow|nice)\b/g)) {
      formalityScore -= 0.05;
    }

    // Cap at 0-1 range
    return Math.max(0, Math.min(1, formalityScore));
  }

  /**
   * Calculate content density (information per space)
   */
  private static calculateDensity(content: string): number {
    const contentLength = content.length;
    if (contentLength === 0) return 0;

    // Count information indicators
    const words = content.trim().split(/\s+/).length;
    const bulletPoints = this.countBulletPoints(content);
    const sections = this.countSections(content);
    const numbers = (content.match(/\d+/g) || []).length;

    // Calculate raw density score
    const rawDensity =
      words / 100 + bulletPoints * 2 + sections * 3 + numbers * 0.5;

    // Normalize to 0-1 scale with sigmoid-like function
    const normalizedDensity = 1 / (1 + Math.exp(-rawDensity / 50 + 5));

    return normalizedDensity;
  }
}

/**
 * Structure for slide content analysis
 */
interface ContentStructure {
  bulletPoints: number;
  numberedItems: number;
  sections: number;
  paragraphs: number;
  images: number;
  charts: boolean;
  tables: boolean;
  quotes: boolean;
  metrics: number;
  percentages: number;
  comparison: boolean;
  timeline: boolean;
  people: number;
  dataStructure:
    | "tabular"
    | "hierarchical"
    | "multi-dimensional"
    | "time-series"
    | "simple";
  formality: number;
  density: number;
}
