import { SlideTemplate } from "@/mastra/types/slide-templates";

export class ContentRestructurer {
  static restructureContentForTemplate(
    template: SlideTemplate,
    content: string,
    title: string
  ) {
    switch (template) {
      // Chart templates - extract data points
      case SlideTemplate.PIE_CHART:
      case SlideTemplate.BAR_CHART:
      case SlideTemplate.LINE_CHART:
      case SlideTemplate.AREA_CHART:
      case SlideTemplate.RADAR_CHART:
        return this.restructureForCharts(content, title);

      // Business templates
      case SlideTemplate.SWOT_MATRIX:
        return this.restructureForSwot(content, title);
      case SlideTemplate.METRICS_DASHBOARD:
        return this.restructureForMetrics(content, title);
      case SlideTemplate.PERSONA_CARD:
        return this.restructureForPersona(content, title);
      case SlideTemplate.COMPARISON_TABLE:
        return this.restructureForComparison(content, title);
      case SlideTemplate.TIMELINE:
        return this.restructureForTimeline(content, title);

      // Content templates
      case SlideTemplate.BULLET_LIST:
        return this.restructureForBulletList(content, title);
      case SlideTemplate.NUMBERED_LIST:
        return this.restructureForNumberedList(content, title);
      case SlideTemplate.QUOTE:
        return this.restructureForQuote(content, title);
      case SlideTemplate.IMAGE_WITH_CAPTION:
        return this.restructureForImageCaption(content, title);
      case SlideTemplate.CONCLUSION:
        return this.restructureForConclusion(content, title);

      // Column layouts
      case SlideTemplate.TWO_COLUMN:
      case SlideTemplate.TWO_COLUMNS:
        return this.restructureForColumns(content, title, 2);
      case SlideTemplate.TWO_COLUMNS_WITH_HEADER:
        return this.restructureForColumns(content, title, 2, true);
      case SlideTemplate.THREE_COLUMNS:
        return this.restructureForColumns(content, title, 3);
      case SlideTemplate.THREE_COLUMNS_WITH_HEADER:
        return this.restructureForColumns(content, title, 3, true);
      case SlideTemplate.FOUR_COLUMNS:
        return this.restructureForColumns(content, title, 4);

      // Accent layouts
      case SlideTemplate.ACCENT_LEFT:
      case SlideTemplate.ACCENT_RIGHT:
      case SlideTemplate.ACCENT_TOP:
      case SlideTemplate.ACCENT_RIGHT_FIT:
      case SlideTemplate.ACCENT_LEFT_FIT:
      case SlideTemplate.ACCENT_BACKGROUND:
        return this.restructureForAccent(content, title);

      // Image templates
      case SlideTemplate.IMAGE_GALLERY:
        return this.restructureForImageGallery(content, title);
      case SlideTemplate.TEAM_PHOTOS:
        return this.restructureForTeamPhotos(content, title);
      case SlideTemplate.TWO_IMAGE_COLUMNS:
        return this.restructureForImageColumns(content, title, 2);
      case SlideTemplate.THREE_IMAGE_COLUMNS:
        return this.restructureForImageColumns(content, title, 3);
      case SlideTemplate.FOUR_IMAGE_COLUMNS:
        return this.restructureForImageColumns(content, title, 4);
      case SlideTemplate.IMAGES_WITH_TEXT:
        return this.restructureForImagesWithText(content, title);

      // Basic card templates
      case SlideTemplate.BLANK_CARD:
        return this.restructureForBlankCard(content, title);
      case SlideTemplate.IMAGE_AND_TEXT:
        return this.restructureForImageAndText(content, title);
      case SlideTemplate.TEXT_AND_IMAGE:
        return this.restructureForTextAndImage(content, title);
      case SlideTemplate.TITLE_WITH_BULLETS:
        return this.restructureForTitleWithBullets(content, title);
      case SlideTemplate.TITLE_WITH_BULLETS_AND_IMAGE:
        return this.restructureForTitleWithBulletsAndImage(content, title);

      // Default fallback
      default:
        return { title, content };
    }
  }

  // Chart restructuring
  private static restructureForCharts(content: string, title: string) {
    const lines = this.cleanContent(content);
    const dataPoints = this.extractDataPoints(lines);

    return {
      title,
      content: `Data visualization for: ${title}`,
      dataPoints,
    };
  }

  // SWOT restructuring
  private static restructureForSwot(content: string, title: string) {
    const lines = this.cleanContent(content);
    const sections = this.categorizeContent(lines, [
      "strength",
      "weakness",
      "opportunity",
      "threat",
    ]);

    return {
      title,
      content: `SWOT Analysis: ${title}`,
      sections,
    };
  }

  // Metrics restructuring
  private static restructureForMetrics(content: string, title: string) {
    const lines = this.cleanContent(content);
    const metrics = this.extractMetrics(lines);

    return {
      title,
      content: `Key Metrics: ${title}`,
      metrics,
    };
  }

  // Persona restructuring
  private static restructureForPersona(content: string, title: string) {
    const lines = this.cleanContent(content);
    const personaData = this.extractPersonaData(lines);

    return {
      title,
      content: `Persona Profile: ${title}`,
      personaData,
    };
  }

  // Comparison restructuring
  private static restructureForComparison(content: string, title: string) {
    const lines = this.cleanContent(content);
    const comparisonData = this.extractComparisonData(lines);

    return {
      title,
      content: `Comparison: ${title}`,
      comparisonData,
    };
  }

  // Timeline restructuring
  private static restructureForTimeline(content: string, title: string) {
    const lines = this.cleanContent(content);
    const timelineEvents = this.extractTimelineEvents(lines);

    return {
      title,
      content: `Timeline: ${title}`,
      timelineEvents,
    };
  }

  // Bullet list restructuring
  private static restructureForBulletList(content: string, title: string) {
    const lines = this.cleanContent(content);
    const bullets = this.extractBullets(lines);

    return {
      title,
      content: bullets.length > 0 ? bullets.join("\n") : content,
      bullets,
    };
  }

  // Numbered list restructuring
  private static restructureForNumberedList(content: string, title: string) {
    const lines = this.cleanContent(content);
    const items = this.extractNumberedItems(lines);

    return {
      title,
      content: items.length > 0 ? items.join("\n") : content,
      items,
    };
  }

  // Quote restructuring
  private static restructureForQuote(content: string, title: string) {
    const lines = this.cleanContent(content);
    const quote = this.extractQuote(lines);

    return {
      title,
      content: quote,
      author: this.extractAuthor(lines),
    };
  }

  // Image caption restructuring
  private static restructureForImageCaption(content: string, title: string) {
    const lines = this.cleanContent(content);
    const imageData = this.extractImageData(lines);

    return {
      title,
      content: this.removeImagesFromContent(content),
      imageData,
    };
  }

  // Conclusion restructuring
  private static restructureForConclusion(content: string, title: string) {
    const lines = this.cleanContent(content);
    const conclusion = this.extractConclusion(lines);

    return {
      title,
      content: conclusion,
      callToAction: this.extractCallToAction(lines),
    };
  }

  // Column restructuring
  private static restructureForColumns(
    content: string,
    title: string,
    columnCount: number,
    withHeaders = false
  ) {
    const lines = this.cleanContent(content);
    const columns = this.splitIntoColumns(lines, columnCount);

    return {
      title,
      content: `Multi-column layout: ${title}`,
      columns: columns.map((column, index) => ({
        title: withHeaders ? `Section ${index + 1}` : undefined,
        content: column.join("\n"),
      })),
    };
  }

  // Accent restructuring
  private static restructureForAccent(content: string, title: string) {
    const lines = this.cleanContent(content);
    const mainContent = this.extractMainContent(lines);

    return {
      title,
      content: mainContent,
      accentContent: this.extractAccentContent(lines),
    };
  }

  // Image gallery restructuring
  private static restructureForImageGallery(content: string, title: string) {
    const lines = this.cleanContent(content);
    const images = this.extractImages(lines);
    const textContent = this.removeImagesFromContent(content);

    return {
      title,
      content: textContent,
      images,
    };
  }

  // Team photos restructuring
  private static restructureForTeamPhotos(content: string, title: string) {
    const lines = this.cleanContent(content);
    const teamMembers = this.extractTeamMembers(lines);

    return {
      title,
      content: `Team: ${title}`,
      teamMembers,
    };
  }

  // Image columns restructuring
  private static restructureForImageColumns(
    content: string,
    title: string,
    columnCount: number
  ) {
    const lines = this.cleanContent(content);
    const columns = this.splitIntoColumns(lines, columnCount);

    return {
      title,
      content: `Image columns: ${title}`,
      columns: columns.map((column, index) => ({
        title: `Image ${index + 1}`,
        content: column.join("\n"),
        image: this.extractImageFromColumn(column),
      })),
    };
  }

  // Images with text restructuring
  private static restructureForImagesWithText(content: string, title: string) {
    const lines = this.cleanContent(content);
    const images = this.extractImages(lines);
    const textContent = this.removeImagesFromContent(content);

    return {
      title,
      content: textContent,
      images,
    };
  }

  // Basic card restructuring
  private static restructureForBlankCard(content: string, title: string) {
    return {
      title,
      content: this.cleanContent(content).join("\n"),
    };
  }

  // Image and text restructuring
  private static restructureForImageAndText(content: string, title: string) {
    const lines = this.cleanContent(content);
    const imageData = this.extractImageData(lines);
    const textContent = this.removeImagesFromContent(content);

    return {
      title,
      content: textContent,
      imageData,
      layout: "image-left",
    };
  }

  // Text and image restructuring
  private static restructureForTextAndImage(content: string, title: string) {
    const lines = this.cleanContent(content);
    const imageData = this.extractImageData(lines);
    const textContent = this.removeImagesFromContent(content);

    return {
      title,
      content: textContent,
      imageData,
      layout: "image-right",
    };
  }

  // Title with bullets restructuring
  private static restructureForTitleWithBullets(
    content: string,
    title: string
  ) {
    const lines = this.cleanContent(content);
    const bullets = this.extractBullets(lines);

    return {
      title,
      content: bullets.length > 0 ? bullets.join("\n") : content,
      bullets,
    };
  }

  // Title with bullets and image restructuring
  private static restructureForTitleWithBulletsAndImage(
    content: string,
    title: string
  ) {
    const lines = this.cleanContent(content);
    const bullets = this.extractBullets(lines);
    const imageData = this.extractImageData(lines);

    return {
      title,
      content: bullets.length > 0 ? bullets.join("\n") : content,
      bullets,
      imageData,
    };
  }

  // Helper methods
  private static cleanContent(content: string): string[] {
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  private static extractDataPoints(lines: string[]) {
    return lines.slice(0, 5).map((line, index) => ({
      name: line,
      value: Math.floor(Math.random() * 100) + 10,
    }));
  }

  private static categorizeContent(lines: string[], categories: string[]) {
    const result: { [key: string]: string[] } = {};
    categories.forEach((category) => {
      result[category] = [];
    });

    lines.forEach((line) => {
      const lowerLine = line.toLowerCase();
      categories.forEach((category) => {
        if (lowerLine.includes(category)) {
          result[category].push(line);
        }
      });
    });

    return result;
  }

  private static extractMetrics(lines: string[]) {
    return lines.slice(0, 4).map((line, index) => ({
      label: line,
      value: `${Math.floor(Math.random() * 100)}%`,
      change: index % 2 === 0 ? "+5%" : "-2%",
      trend: index % 2 === 0 ? "up" : "down",
    }));
  }

  private static extractPersonaData(lines: string[]) {
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

  private static extractComparisonData(lines: string[]) {
    return {
      headers: ["Feature", "Option A", "Option B", "Option C"],
      rows: lines.slice(0, 3).map((line) => [line, "Yes", "No", "Maybe"]),
    };
  }

  private static extractTimelineEvents(lines: string[]) {
    return lines.slice(0, 3).map((line, index) => ({
      date: `Q${index + 1} 2024`,
      title: line,
      description: `Description for ${line}`,
    }));
  }

  private static extractBullets(lines: string[]) {
    return lines
      .filter(
        (line) =>
          line.startsWith("•") || line.startsWith("-") || line.startsWith("*")
      )
      .map((line) => line.replace(/^[•\-*]\s*/, ""));
  }

  private static extractNumberedItems(lines: string[]) {
    return lines
      .filter((line) => /^\d+\./.test(line))
      .map((line) => line.replace(/^\d+\.\s*/, ""));
  }

  private static extractQuote(lines: string[]) {
    const quoteLines = lines.filter(
      (line) => line.startsWith('"') || line.startsWith("'")
    );
    return quoteLines.length > 0 ? quoteLines[0] : lines[0] || "";
  }

  private static extractAuthor(lines: string[]) {
    const authorLine = lines.find(
      (line) =>
        line.toLowerCase().includes("author") ||
        line.toLowerCase().includes("by")
    );
    return authorLine
      ? authorLine.replace(/author:?\s*/i, "")
      : "Unknown Author";
  }

  private static extractImageData(lines: string[]) {
    const imageLines = lines.filter(
      (line) => line.includes("![") || line.includes("http")
    );
    return imageLines.length > 0 ? imageLines[0] : undefined;
  }

  private static extractConclusion(lines: string[]) {
    const conclusionLines = lines.filter(
      (line) =>
        line.toLowerCase().includes("conclusion") ||
        line.toLowerCase().includes("summary") ||
        line.toLowerCase().includes("in conclusion")
    );
    return conclusionLines.length > 0
      ? conclusionLines[0]
      : lines[lines.length - 1] || "";
  }

  private static extractCallToAction(lines: string[]) {
    const ctaLines = lines.filter(
      (line) =>
        line.toLowerCase().includes("call to action") ||
        line.toLowerCase().includes("next steps") ||
        line.toLowerCase().includes("thank you")
    );
    return ctaLines.length > 0 ? ctaLines[0] : "Thank you for your attention";
  }

  private static splitIntoColumns(lines: string[], columnCount: number) {
    const linesPerColumn = Math.ceil(lines.length / columnCount);
    const columns = [];

    for (let i = 0; i < columnCount; i++) {
      const start = i * linesPerColumn;
      const end = Math.min(start + linesPerColumn, lines.length);
      columns.push(lines.slice(start, end));
    }

    return columns;
  }

  private static extractMainContent(lines: string[]) {
    return lines.slice(0, Math.ceil(lines.length / 2)).join("\n");
  }

  private static extractAccentContent(lines: string[]) {
    return lines.slice(Math.ceil(lines.length / 2)).join("\n");
  }

  private static extractImages(lines: string[]) {
    return lines
      .filter((line) => line.includes("![") || line.includes("http"))
      .map((line) => ({
        src: line.match(/!\[.*?\]\((.*?)\)/)?.[1] || line,
        alt: "Image",
        caption: "Sample caption",
      }));
  }

  private static extractTeamMembers(lines: string[]) {
    return lines.slice(0, 3).map((line, index) => ({
      name: line,
      role: `Role ${index + 1}`,
      image: `/placeholder-${index + 1}.jpg`,
      bio: `Bio for ${line}`,
    }));
  }

  private static extractImageFromColumn(column: string[]) {
    const imageLine = column.find(
      (line) => line.includes("![") || line.includes("http")
    );
    return imageLine
      ? imageLine.match(/!\[.*?\]\((.*?)\)/)?.[1] || imageLine
      : undefined;
  }

  private static removeImagesFromContent(content: string) {
    return content.replace(/!\[.*?\]\(.*?\)/g, "").trim();
  }
}
