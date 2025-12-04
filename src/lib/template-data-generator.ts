import { SlideTemplate } from "@/mastra/types/slide-templates";
import { Slide } from "@/lib/presentation-types";
import { ContentRestructurer } from "./content-restructurer";

// Template data generator for different slide templates
export class TemplateDataGenerator {
  static generateTemplateData(template: SlideTemplate, slide: Slide) {
    // First, restructure the content for the template
    const restructuredContent =
      ContentRestructurer.restructureContentForTemplate(
        template,
        slide.content,
        slide.title
      );

    switch (template) {
      // Chart templates
      case SlideTemplate.PIE_CHART:
        return this.generateChartData("pie", slide);
      case SlideTemplate.BAR_CHART:
        return this.generateChartData("bar", slide);
      case SlideTemplate.LINE_CHART:
        return this.generateChartData("line", slide);
      case SlideTemplate.AREA_CHART:
        return this.generateChartData("area", slide);
      case SlideTemplate.RADAR_CHART:
        return this.generateChartData("radar", slide);

      // Business templates
      case SlideTemplate.SWOT_MATRIX:
        return this.generateSwotData(slide);
      case SlideTemplate.METRICS_DASHBOARD:
        return this.generateMetricsData(slide);
      case SlideTemplate.PERSONA_CARD:
        return this.generatePersonaData(slide);
      case SlideTemplate.COMPARISON_TABLE:
        return this.generateComparisonData(slide);
      case SlideTemplate.TIMELINE:
        return this.generateTimelineData(slide);

      // Content templates
      case SlideTemplate.BULLET_LIST:
        return this.generateBulletListData(slide);
      case SlideTemplate.NUMBERED_LIST:
        return this.generateNumberedListData(slide);
      case SlideTemplate.QUOTE:
        return this.generateQuoteData(slide);
      case SlideTemplate.IMAGE_WITH_CAPTION:
        return this.generateImageCaptionData(slide);
      case SlideTemplate.CONCLUSION:
        return this.generateConclusionData(slide);

      // Column layouts
      case SlideTemplate.TWO_COLUMN:
      case SlideTemplate.TWO_COLUMNS:
        return this.generateColumnData(2, slide);
      case SlideTemplate.TWO_COLUMNS_WITH_HEADER:
        return this.generateColumnData(2, slide, true);
      case SlideTemplate.THREE_COLUMNS:
        return this.generateColumnData(3, slide);
      case SlideTemplate.THREE_COLUMNS_WITH_HEADER:
        return this.generateColumnData(3, slide, true);
      case SlideTemplate.FOUR_COLUMNS:
        return this.generateColumnData(4, slide);

      // Accent layouts
      case SlideTemplate.ACCENT_LEFT:
        return this.generateAccentData("left", slide);
      case SlideTemplate.ACCENT_RIGHT:
        return this.generateAccentData("right", slide);
      case SlideTemplate.ACCENT_TOP:
        return this.generateAccentData("top", slide);
      case SlideTemplate.ACCENT_RIGHT_FIT:
        return this.generateAccentData("right-fit", slide);
      case SlideTemplate.ACCENT_LEFT_FIT:
        return this.generateAccentData("left-fit", slide);
      case SlideTemplate.ACCENT_BACKGROUND:
        return this.generateAccentData("background", slide);

      // Image templates
      case SlideTemplate.IMAGE_GALLERY:
        return this.generateImageGalleryData(slide);
      case SlideTemplate.TEAM_PHOTOS:
        return this.generateTeamPhotosData(slide);
      case SlideTemplate.TWO_IMAGE_COLUMNS:
        return this.generateImageColumnsData(2, slide);
      case SlideTemplate.THREE_IMAGE_COLUMNS:
        return this.generateImageColumnsData(3, slide);
      case SlideTemplate.FOUR_IMAGE_COLUMNS:
        return this.generateImageColumnsData(4, slide);
      case SlideTemplate.IMAGES_WITH_TEXT:
        return this.generateImagesWithTextData(slide);

      // Basic card templates
      case SlideTemplate.BLANK_CARD:
        return this.generateBlankCardData(slide);
      case SlideTemplate.IMAGE_AND_TEXT:
        return this.generateImageAndTextData(slide);
      case SlideTemplate.TEXT_AND_IMAGE:
        return this.generateTextAndImageData(slide);
      case SlideTemplate.TITLE_WITH_BULLETS:
        return this.generateTitleWithBulletsData(slide);
      case SlideTemplate.TITLE_WITH_BULLETS_AND_IMAGE:
        return this.generateTitleWithBulletsAndImageData(slide);

      // Default fallback
      default:
        return this.generateDefaultData(slide);
    }
  }

  // Chart data generation
  private static generateChartData(
    type: "pie" | "bar" | "line" | "area" | "radar",
    slide: Slide
  ) {
    // Extract data from slide content or create sample data
    const content = slide.content;

    // Try to extract data from existing content
    const data =
      this.extractDataFromContent(content) ||
      this.generateSampleChartData(type);

    return {
      type,
      data,
      dataKey: "value",
      nameKey: "name",
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
    };
  }

  // SWOT matrix data generation
  private static generateSwotData(slide: Slide) {
    const content = slide.content;
    const extractedData = this.extractSwotFromContent(content);

    return {
      strengths: extractedData.strengths || [
        "Strong brand recognition",
        "Experienced team",
      ],
      weaknesses: extractedData.weaknesses || [
        "Limited market reach",
        "High costs",
      ],
      opportunities: extractedData.opportunities || [
        "Market expansion",
        "New partnerships",
      ],
      threats: extractedData.threats || ["Competition", "Economic changes"],
    };
  }

  // Metrics dashboard data generation
  private static generateMetricsData(slide: Slide) {
    const content = slide.content;
    const extractedData = this.extractMetricsFromContent(content);

    return {
      metrics: extractedData.metrics || [
        { label: "Revenue", value: "$2.4M", change: "+12%", trend: "up" },
        { label: "Users", value: "15.2K", change: "+8%", trend: "up" },
        { label: "Conversion", value: "3.2%", change: "-2%", trend: "down" },
        { label: "Retention", value: "87%", change: "+5%", trend: "up" },
      ],
    };
  }

  // Persona card data generation
  private static generatePersonaData(slide: Slide) {
    const content = slide.content;
    const extractedData = this.extractPersonaFromContent(content);

    return {
      name: extractedData.name || "Sarah Johnson",
      role: extractedData.role || "Marketing Manager",
      demographics: extractedData.demographics || {
        age: "28-35",
        location: "Urban",
        income: "$60K-$80K",
      },
      psychographics: extractedData.psychographics || {
        interests: "Technology, Innovation",
        values: "Efficiency, Growth",
      },
      painPoints: extractedData.painPoints || [
        "Limited time for research",
        "Need for quick insights",
      ],
      goals: extractedData.goals || [
        "Increase team productivity",
        "Make data-driven decisions",
      ],
    };
  }

  // Comparison table data generation
  private static generateComparisonData(slide: Slide) {
    const content = slide.content;
    const extractedData = this.extractComparisonFromContent(content);

    return {
      headers: extractedData.headers || [
        "Feature",
        "Our Product",
        "Competitor A",
        "Competitor B",
      ],
      rows: extractedData.rows || [
        ["Price", "$99/month", "$149/month", "$79/month"],
        ["Support", "24/7", "Business hours", "Email only"],
        ["Integration", "Yes", "Limited", "Yes"],
      ],
    };
  }

  // Timeline data generation
  private static generateTimelineData(slide: Slide) {
    const content = slide.content;
    const extractedData = this.extractTimelineFromContent(content);

    return {
      events: extractedData.events || [
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
    };
  }

  // Bullet list data generation
  private static generateBulletListData(slide: Slide) {
    const content = slide.content;
    const bullets = this.extractBulletsFromContent(content);

    return {
      title: slide.title,
      bullets:
        bullets.length > 0
          ? bullets
          : ["Key point 1", "Key point 2", "Key point 3"],
      image: this.extractImageFromContent(content),
    };
  }

  // Column data generation
  private static generateColumnData(
    columnCount: number,
    slide: Slide,
    withHeaders = false
  ) {
    const content = slide.content;
    const sections = this.splitContentIntoColumns(content, columnCount);

    return {
      columns: sections.map((section, index) => ({
        title: withHeaders ? `Section ${index + 1}` : undefined,
        content: section,
        image: this.extractImageFromContent(section),
      })),
    };
  }

  // Accent layout data generation
  private static generateAccentData(position: string, slide: Slide) {
    return {
      title: slide.title,
      content: slide.content,
      image: this.extractImageFromContent(slide.content),
      accentPosition: position,
      accentColor: "#3b82f6",
    };
  }

  // Image gallery data generation
  private static generateImageGalleryData(slide: Slide) {
    const content = slide.content;
    const images = this.extractImagesFromContent(content);

    return {
      title: slide.title,
      content: this.removeImagesFromContent(content),
      images:
        images.length > 0
          ? images
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
    };
  }

  // Team photos data generation
  private static generateTeamPhotosData(slide: Slide) {
    const content = slide.content;
    const teamMembers = this.extractTeamMembersFromContent(content);

    return {
      title: slide.title,
      members:
        teamMembers.length > 0
          ? teamMembers
          : [
              {
                name: "John Doe",
                role: "CEO",
                image: "/placeholder-1.jpg",
                bio: "Visionary leader",
              },
              {
                name: "Jane Smith",
                role: "CTO",
                image: "/placeholder-2.jpg",
                bio: "Technical expert",
              },
              {
                name: "Mike Johnson",
                role: "CFO",
                image: "/placeholder-3.jpg",
                bio: "Financial strategist",
              },
            ],
    };
  }

  // Helper methods for content extraction
  private static extractDataFromContent(content: string) {
    // Try to extract structured data from content
    // This is a simplified version - in practice, you'd use more sophisticated parsing
    const lines = content.split("\n").filter((line) => line.trim());
    if (lines.length < 2) return null;

    return lines.slice(0, 5).map((line, index) => ({
      name: line.trim(),
      value: Math.floor(Math.random() * 100) + 10,
    }));
  }

  private static extractSwotFromContent(content: string) {
    const lines = content.split("\n").filter((line) => line.trim());
    const strengths = lines
      .filter(
        (line) =>
          line.toLowerCase().includes("strength") || line.startsWith("•")
      )
      .slice(0, 3);
    const weaknesses = lines
      .filter(
        (line) =>
          line.toLowerCase().includes("weakness") || line.startsWith("-")
      )
      .slice(0, 3);
    const opportunities = lines
      .filter(
        (line) =>
          line.toLowerCase().includes("opportunity") || line.startsWith("+")
      )
      .slice(0, 3);
    const threats = lines
      .filter(
        (line) => line.toLowerCase().includes("threat") || line.startsWith("!")
      )
      .slice(0, 3);

    return {
      strengths: strengths.map((s) => s.replace(/^[•\-+!]\s*/, "").trim()),
      weaknesses: weaknesses.map((w) => w.replace(/^[•\-+!]\s*/, "").trim()),
      opportunities: opportunities.map((o) =>
        o.replace(/^[•\-+!]\s*/, "").trim()
      ),
      threats: threats.map((t) => t.replace(/^[•\-+!]\s*/, "").trim()),
    };
  }

  private static extractMetricsFromContent(content: string) {
    // Extract metrics from content - simplified version
    const lines = content.split("\n").filter((line) => line.trim());
    return {
      metrics: lines.slice(0, 4).map((line, index) => ({
        label: `Metric ${index + 1}`,
        value: line.trim(),
        change: index % 2 === 0 ? "+5%" : "-2%",
        trend: index % 2 === 0 ? "up" : "down",
      })),
    };
  }

  private static extractPersonaFromContent(content: string) {
    // Extract persona data from content
    const lines = content.split("\n").filter((line) => line.trim());
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
      painPoints: lines
        .filter((line) => line.startsWith("•"))
        .slice(0, 3)
        .map((p) => p.replace("•", "").trim()),
      goals: lines
        .filter((line) => line.startsWith("-"))
        .slice(0, 3)
        .map((g) => g.replace("-", "").trim()),
    };
  }

  private static extractComparisonFromContent(content: string) {
    const lines = content.split("\n").filter((line) => line.trim());
    return {
      headers: ["Feature", "Option A", "Option B", "Option C"],
      rows: lines
        .slice(0, 3)
        .map((line) => [line.trim(), "Yes", "No", "Maybe"]),
    };
  }

  private static extractTimelineFromContent(content: string) {
    const lines = content.split("\n").filter((line) => line.trim());
    return {
      events: lines.slice(0, 3).map((line, index) => ({
        date: `Q${index + 1} 2024`,
        title: line.trim(),
        description: `Description for ${line.trim()}`,
      })),
    };
  }

  private static extractBulletsFromContent(content: string) {
    return content
      .split("\n")
      .filter(
        (line) =>
          line.trim().startsWith("•") ||
          line.trim().startsWith("-") ||
          line.trim().startsWith("*")
      )
      .map((line) => line.replace(/^[•\-*]\s*/, "").trim())
      .filter((line) => line.length > 0);
  }

  private static extractImageFromContent(content: string) {
    // Extract image URLs from content
    const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
    return imageMatch ? imageMatch[1] : undefined;
  }

  private static extractImagesFromContent(content: string) {
    const imageMatches = content.matchAll(/!\[.*?\]\((.*?)\)/g);
    return Array.from(imageMatches).map((match) => ({
      src: match[1],
      alt: "Image",
      caption: "Sample caption",
    }));
  }

  private static extractTeamMembersFromContent(content: string) {
    const lines = content.split("\n").filter((line) => line.trim());
    return lines.slice(0, 3).map((line, index) => ({
      name: line.trim(),
      role: `Role ${index + 1}`,
      image: `/placeholder-${index + 1}.jpg`,
      bio: `Bio for ${line.trim()}`,
    }));
  }

  private static splitContentIntoColumns(content: string, columnCount: number) {
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

  private static removeImagesFromContent(content: string) {
    return content.replace(/!\[.*?\]\(.*?\)/g, "").trim();
  }

  // Sample data generators
  private static generateSampleChartData(type: string) {
    const baseData = [
      { name: "Product", value: 40 },
      { name: "Price", value: 25 },
      { name: "Place", value: 20 },
      { name: "Promotion", value: 15 },
    ];

    return baseData;
  }

  private static generateDefaultData(slide: Slide) {
    return {
      title: slide.title,
      content: slide.content,
    };
  }

  // Additional template-specific generators
  private static generateNumberedListData(slide: Slide) {
    const content = slide.content;
    const items = this.extractBulletsFromContent(content);

    return {
      title: slide.title,
      items:
        items.length > 0 ? items : ["First item", "Second item", "Third item"],
      image: this.extractImageFromContent(content),
    };
  }

  private static generateQuoteData(slide: Slide) {
    return {
      title: slide.title,
      quote: slide.content,
      author: "Author Name",
      image: this.extractImageFromContent(slide.content),
    };
  }

  private static generateImageCaptionData(slide: Slide) {
    return {
      title: slide.title,
      content: this.removeImagesFromContent(slide.content),
      image: this.extractImageFromContent(slide.content) || "/placeholder.jpg",
      caption: "Image caption",
    };
  }

  private static generateConclusionData(slide: Slide) {
    return {
      title: slide.title,
      content: slide.content,
      callToAction: "Thank you for your attention",
    };
  }

  private static generateBlankCardData(slide: Slide) {
    return {
      title: slide.title,
      content: slide.content,
    };
  }

  private static generateImageAndTextData(slide: Slide) {
    return {
      title: slide.title,
      content: this.removeImagesFromContent(slide.content),
      image: this.extractImageFromContent(slide.content) || "/placeholder.jpg",
      imagePosition: "left",
    };
  }

  private static generateTextAndImageData(slide: Slide) {
    return {
      title: slide.title,
      content: this.removeImagesFromContent(slide.content),
      image: this.extractImageFromContent(slide.content) || "/placeholder.jpg",
      imagePosition: "right",
    };
  }

  private static generateTitleWithBulletsData(slide: Slide) {
    const bullets = this.extractBulletsFromContent(slide.content);

    return {
      title: slide.title,
      bullets:
        bullets.length > 0
          ? bullets
          : ["Key point 1", "Key point 2", "Key point 3"],
    };
  }

  private static generateTitleWithBulletsAndImageData(slide: Slide) {
    const bullets = this.extractBulletsFromContent(slide.content);

    return {
      title: slide.title,
      bullets:
        bullets.length > 0
          ? bullets
          : ["Key point 1", "Key point 2", "Key point 3"],
      image: this.extractImageFromContent(slide.content) || "/placeholder.jpg",
    };
  }

  private static generateImageColumnsData(columnCount: number, slide: Slide) {
    const content = slide.content;
    const sections = this.splitContentIntoColumns(content, columnCount);

    return {
      columns: sections.map((section, index) => ({
        title: `Image ${index + 1}`,
        content: this.removeImagesFromContent(section),
        image:
          this.extractImageFromContent(section) ||
          `/placeholder-${index + 1}.jpg`,
      })),
    };
  }

  private static generateImagesWithTextData(slide: Slide) {
    const content = slide.content;
    const images = this.extractImagesFromContent(content);

    return {
      title: slide.title,
      content: this.removeImagesFromContent(content),
      images:
        images.length > 0
          ? images
          : [
              { src: "/placeholder-1.jpg", alt: "Image 1" },
              { src: "/placeholder-2.jpg", alt: "Image 2" },
              { src: "/placeholder-3.jpg", alt: "Image 3" },
            ],
    };
  }
}
