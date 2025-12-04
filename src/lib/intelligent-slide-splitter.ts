import { Slide } from "./presentation-types";
import { parseChartDataFromSlide } from "./chart-utils";

export class IntelligentSlideSplitter {
  /**
   * Configuration for slide size constraints
   */
  private static readonly CONFIG = {
    MAX_WORDS_PER_SLIDE: 150,
    MAX_CHARACTERS_PER_SLIDE: 800,
    MAX_BULLET_POINTS: 6,
    MAX_SECTIONS: 2,
    MAX_TITLE_LENGTH: 60,
  };

  /**
   * Check if slide content needs splitting based on content constraints
   */
  public static needsSplitting(slide: Slide): boolean {
    const { content } = slide;

    // Don't split chart slides - they need to show complete data
    const chartData = parseChartDataFromSlide(slide);
    if (chartData) {
      console.log(
        "📊 Chart slide detected, skipping split to preserve complete data"
      );
      return false;
    }

    // Count words
    const wordCount = this.countWords(content);
    if (wordCount > this.CONFIG.MAX_WORDS_PER_SLIDE) {
      return true;
    }

    // Count characters
    if (content.length > this.CONFIG.MAX_CHARACTERS_PER_SLIDE) {
      return true;
    }

    // Count bullet points
    const bulletCount = this.countBulletPoints(content);
    if (bulletCount > this.CONFIG.MAX_BULLET_POINTS) {
      return true;
    }

    // Count sections
    const sectionCount = this.countSections(content);
    if (sectionCount > this.CONFIG.MAX_SECTIONS) {
      return true;
    }

    return false;
  }

  /**
   * Split slide content into multiple slides
   */
  public static splitSlide(slide: Slide): Slide[] {
    // If no need to split, return the original slide
    if (!this.needsSplitting(slide)) {
      return [slide];
    }

    // Identify the best way to split this slide
    const splitMethod = this.determineSplitMethod(slide.content);

    switch (splitMethod) {
      case "sections":
        return this.splitBySections(slide);
      case "bullets":
        return this.splitByBulletPoints(slide);
      case "paragraphs":
        return this.splitByParagraphs(slide);
      default:
        return this.splitByCharacters(slide);
    }
  }

  /**
   * Determine the best method to split the content
   */
  private static determineSplitMethod(
    content: string
  ): "sections" | "bullets" | "paragraphs" | "characters" {
    // Check for markdown sections
    if (content.match(/\*\*.*?\*\*/g) && this.countSections(content) > 1) {
      return "sections";
    }

    // Check for bullet points
    if (
      content.match(/- .+/g) &&
      this.countBulletPoints(content) > this.CONFIG.MAX_BULLET_POINTS
    ) {
      return "bullets";
    }

    // Check for paragraphs
    if (content.split("\n\n").length > 1) {
      return "paragraphs";
    }

    // Default to character-based split
    return "characters";
  }

  /**
   * Split slide content by sections
   */
  private static splitBySections(slide: Slide): Slide[] {
    const { content, title, id } = slide;
    const sections = this.extractSections(content);

    // If there are no clear sections, fall back to another method
    if (sections.length <= 1) {
      return this.splitByBulletPoints(slide);
    }

    const slides: Slide[] = [];
    let currentSlide: string[] = [];
    let currentSectionCount = 0;
    let slideIndex = 0;

    // Distribute sections across slides
    for (const section of sections) {
      // Check if adding this section would exceed slide constraints
      if (
        currentSectionCount >= this.CONFIG.MAX_SECTIONS ||
        this.countWordsInString(currentSlide.join("\n\n") + section) >
          this.CONFIG.MAX_WORDS_PER_SLIDE
      ) {
        // Create a new slide with the accumulated sections
        slides.push(
          this.createSplitSlide(slide, currentSlide.join("\n\n"), slideIndex)
        );
        currentSlide = [section];
        currentSectionCount = 1;
        slideIndex++;
      } else {
        // Add section to current slide
        currentSlide.push(section);
        currentSectionCount++;
      }
    }

    // Add the last slide if there's content remaining
    if (currentSlide.length > 0) {
      slides.push(
        this.createSplitSlide(slide, currentSlide.join("\n\n"), slideIndex)
      );
    }

    return slides;
  }

  /**
   * Split slide content by bullet points
   */
  private static splitByBulletPoints(slide: Slide): Slide[] {
    const { content, title, id } = slide;

    // Extract sections and bullet points
    const sections = this.extractSections(content);
    if (sections.length <= 1) {
      // No clear sections, extract bullet points directly
      const bullets = this.extractBulletPoints(content);

      // If no bullet points or very few, try another method
      if (bullets.length <= this.CONFIG.MAX_BULLET_POINTS) {
        return this.splitByParagraphs(slide);
      }

      return this.splitBulletArray(slide, bullets);
    }

    // We have sections with bullet points
    const slides: Slide[] = [];
    let currentContent = "";
    let currentBulletCount = 0;
    let slideIndex = 0;

    for (const section of sections) {
      const sectionBullets = this.extractBulletPoints(section);
      const sectionTitle = this.extractSectionTitle(section);

      // If adding this section would exceed bullet limit, create a new slide
      if (
        currentBulletCount + sectionBullets.length >
        this.CONFIG.MAX_BULLET_POINTS
      ) {
        if (currentContent) {
          slides.push(this.createSplitSlide(slide, currentContent, slideIndex));
          slideIndex++;
          currentContent = "";
          currentBulletCount = 0;
        }

        // If this single section has too many bullets, split it further
        if (sectionBullets.length > this.CONFIG.MAX_BULLET_POINTS) {
          const splitBulletSlides = this.splitSectionWithBullets(
            slide,
            sectionTitle,
            sectionBullets,
            slideIndex
          );

          slides.push(...splitBulletSlides);
          slideIndex += splitBulletSlides.length;
        } else {
          currentContent = section;
          currentBulletCount = sectionBullets.length;
        }
      } else {
        // Add section to current content
        if (currentContent) {
          currentContent += "\n\n";
        }
        currentContent += section;
        currentBulletCount += sectionBullets.length;
      }
    }

    // Add any remaining content
    if (currentContent) {
      slides.push(this.createSplitSlide(slide, currentContent, slideIndex));
    }

    return slides;
  }

  /**
   * Split bullet points across multiple slides
   */
  private static splitBulletArray(slide: Slide, bullets: string[]): Slide[] {
    const { title, id } = slide;
    const slides: Slide[] = [];

    // Calculate how many slides we need
    const slideCount = Math.ceil(
      bullets.length / this.CONFIG.MAX_BULLET_POINTS
    );

    for (let i = 0; i < slideCount; i++) {
      const startIndex = i * this.CONFIG.MAX_BULLET_POINTS;
      const endIndex = Math.min(
        startIndex + this.CONFIG.MAX_BULLET_POINTS,
        bullets.length
      );
      const slideBullets = bullets.slice(startIndex, endIndex);

      const content = slideBullets.map((bullet) => `- ${bullet}`).join("\n");
      slides.push(this.createSplitSlide(slide, content, i));
    }

    return slides;
  }

  /**
   * Split a section with too many bullet points
   */
  private static splitSectionWithBullets(
    slide: Slide,
    sectionTitle: string,
    bullets: string[],
    startIndex: number
  ): Slide[] {
    const slides: Slide[] = [];

    // Calculate how many slides we need for this section
    const slideCount = Math.ceil(
      bullets.length / this.CONFIG.MAX_BULLET_POINTS
    );

    for (let i = 0; i < slideCount; i++) {
      const startBulletIndex = i * this.CONFIG.MAX_BULLET_POINTS;
      const endBulletIndex = Math.min(
        startBulletIndex + this.CONFIG.MAX_BULLET_POINTS,
        bullets.length
      );
      const slideBullets = bullets.slice(startBulletIndex, endBulletIndex);

      let content = `**${sectionTitle}**\n`;
      content += slideBullets.map((bullet) => `- ${bullet}`).join("\n");

      slides.push(this.createSplitSlide(slide, content, startIndex + i));
    }

    return slides;
  }

  /**
   * Split slide content by paragraphs
   */
  private static splitByParagraphs(slide: Slide): Slide[] {
    const { content, title, id } = slide;
    const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0);

    // If very few paragraphs, try character-based split
    if (paragraphs.length <= 2) {
      return this.splitByCharacters(slide);
    }

    const slides: Slide[] = [];
    let currentContent = "";
    let currentWordCount = 0;
    let slideIndex = 0;

    for (const paragraph of paragraphs) {
      const paragraphWordCount = this.countWordsInString(paragraph);

      // If adding this paragraph would exceed word count, create new slide
      if (
        currentWordCount + paragraphWordCount >
        this.CONFIG.MAX_WORDS_PER_SLIDE
      ) {
        if (currentContent) {
          slides.push(this.createSplitSlide(slide, currentContent, slideIndex));
          slideIndex++;
          currentContent = "";
          currentWordCount = 0;
        }

        // If this single paragraph is too long, split it further
        if (paragraphWordCount > this.CONFIG.MAX_WORDS_PER_SLIDE) {
          const splitParaSlides = this.splitLongParagraph(
            slide,
            paragraph,
            slideIndex
          );

          slides.push(...splitParaSlides);
          slideIndex += splitParaSlides.length;
        } else {
          currentContent = paragraph;
          currentWordCount = paragraphWordCount;
        }
      } else {
        // Add paragraph to current content
        if (currentContent) {
          currentContent += "\n\n";
        }
        currentContent += paragraph;
        currentWordCount += paragraphWordCount;
      }
    }

    // Add any remaining content
    if (currentContent) {
      slides.push(this.createSplitSlide(slide, currentContent, slideIndex));
    }

    return slides;
  }

  /**
   * Split a long paragraph into multiple slides
   */
  private static splitLongParagraph(
    slide: Slide,
    paragraph: string,
    startIndex: number
  ): Slide[] {
    const { title, id } = slide;
    const slides: Slide[] = [];

    // Split paragraph into sentences for better breaks
    const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
    let currentContent = "";
    let currentWordCount = 0;

    for (const sentence of sentences) {
      const sentenceWordCount = this.countWordsInString(sentence);

      if (
        currentWordCount + sentenceWordCount >
        this.CONFIG.MAX_WORDS_PER_SLIDE
      ) {
        if (currentContent) {
          slides.push(
            this.createSplitSlide(
              slide,
              currentContent,
              startIndex + slides.length
            )
          );
          currentContent = "";
          currentWordCount = 0;
        }

        // If a single sentence is too long, split by words
        if (sentenceWordCount > this.CONFIG.MAX_WORDS_PER_SLIDE) {
          const words = sentence.split(" ");
          let sentenceChunk = "";
          let chunkWordCount = 0;

          for (const word of words) {
            if (chunkWordCount + 1 > this.CONFIG.MAX_WORDS_PER_SLIDE) {
              slides.push(
                this.createSplitSlide(
                  slide,
                  sentenceChunk,
                  startIndex + slides.length
                )
              );
              sentenceChunk = "";
              chunkWordCount = 0;
            }

            if (sentenceChunk) sentenceChunk += " ";
            sentenceChunk += word;
            chunkWordCount++;
          }

          if (sentenceChunk) {
            currentContent = sentenceChunk;
            currentWordCount = chunkWordCount;
          }
        } else {
          currentContent = sentence;
          currentWordCount = sentenceWordCount;
        }
      } else {
        if (currentContent) currentContent += " ";
        currentContent += sentence;
        currentWordCount += sentenceWordCount;
      }
    }

    // Add any remaining content
    if (currentContent) {
      slides.push(
        this.createSplitSlide(slide, currentContent, startIndex + slides.length)
      );
    }

    return slides;
  }

  /**
   * Split by characters (last resort)
   */
  private static splitByCharacters(slide: Slide): Slide[] {
    const { content, title, id } = slide;

    // If content is already within limits, return the original
    if (content.length <= this.CONFIG.MAX_CHARACTERS_PER_SLIDE) {
      return [slide];
    }

    const slides: Slide[] = [];
    const slideCount = Math.ceil(
      content.length / this.CONFIG.MAX_CHARACTERS_PER_SLIDE
    );

    for (let i = 0; i < slideCount; i++) {
      const startChar = i * this.CONFIG.MAX_CHARACTERS_PER_SLIDE;
      // Find a good break point (whitespace) near the character limit
      let endChar = Math.min(
        startChar + this.CONFIG.MAX_CHARACTERS_PER_SLIDE,
        content.length
      );

      // Try to find a natural break point
      if (endChar < content.length) {
        // Look for better break points within a reasonable range
        const searchRange = Math.min(
          100,
          this.CONFIG.MAX_CHARACTERS_PER_SLIDE * 0.1
        );
        const searchStart = Math.max(startChar, endChar - searchRange);

        // Look for paragraph breaks first
        const lastParagraph = content.lastIndexOf("\n\n", endChar);
        if (lastParagraph > searchStart) {
          endChar = lastParagraph;
        } else {
          // Look for sentence breaks
          const lastSentence = content.lastIndexOf(". ", endChar);
          if (lastSentence > searchStart) {
            endChar = lastSentence + 1; // Include the period
          } else {
            // Look for line breaks
            const lastNewline = content.lastIndexOf("\n", endChar);
            if (lastNewline > searchStart) {
              endChar = lastNewline;
            } else {
              // Look for word breaks
              const lastSpace = content.lastIndexOf(" ", endChar);
              if (lastSpace > searchStart) {
                endChar = lastSpace;
              }
            }
          }
        }
      }

      const slideContent = content.substring(startChar, endChar).trim();

      // Only add slide if it has meaningful content
      if (slideContent.length > 0 && slideContent.trim().length > 10) {
        slides.push(this.createSplitSlide(slide, slideContent, i));
      }
    }

    // Safety check: if no slides were created, return the original slide
    if (slides.length === 0) {
      console.warn("⚠️ No slides created from split, returning original slide");
      return [slide];
    }

    return slides;
  }

  /**
   * Create a new slide based on the original with split content
   */
  private static createSplitSlide(
    originalSlide: Slide,
    content: string,
    index: number
  ): Slide {
    const { title, id, type, order } = originalSlide;

    // Check if this is a chart slide - if so, preserve original content and template data
    const chartData = parseChartDataFromSlide(originalSlide);
    if (chartData) {
      console.log("📊 Creating chart slide with complete data preservation");
      // Only add "(continued)" to slides after the first one
      const slideTitle = index === 0 ? title : `${title} (continued)`;

      return {
        id: `${id}-split-${index}`,
        title: slideTitle,
        content: originalSlide.content, // Preserve original content for chart data
        type,
        order: order + index * 0.001, // Fractional ordering to maintain sequence
        template: originalSlide.template,
        templateData: originalSlide.templateData, // Preserve original template data
        overflowDetected: false,
        splitSlides: [],
        layout: "centered",
      };
    }

    // Only add "(continued)" to slides after the first one
    const slideTitle = index === 0 ? title : `${title} (continued)`;

    return {
      id: `${id}-split-${index}`,
      title: slideTitle,
      content,
      type,
      order: order + index * 0.001, // Fractional ordering to maintain sequence
      template: originalSlide.template,
      templateData: originalSlide.templateData,
      overflowDetected: false,
      splitSlides: [],
      layout: "centered",
    };
  }

  /**
   * Count words in a string
   */
  private static countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  /**
   * Count words in a string (alternative method)
   */
  private static countWordsInString(text: string): number {
    return (text.match(/\S+/g) || []).length;
  }

  /**
   * Count bullet points in content
   */
  private static countBulletPoints(content: string): number {
    const matches = content.match(/^- .+/gm);
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
   * Extract bullet points from content
   */
  private static extractBulletPoints(content: string): string[] {
    const bullets: string[] = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^- (.+)$/);
      if (match) {
        bullets.push(match[1].trim());
      }
    }

    return bullets;
  }

  /**
   * Extract sections from content
   */
  private static extractSections(content: string): string[] {
    // Split content by section headers
    const sectionPattern = /\*\*(.*?)\*\*/;
    const parts = content.split(/\n\s*\n/); // Split by paragraph breaks

    const sections: string[] = [];
    let currentSection = "";

    for (const part of parts) {
      if (sectionPattern.test(part)) {
        // This part starts with a section header
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = part;
      } else if (currentSection) {
        // Add to existing section
        currentSection += "\n\n" + part;
      } else {
        // No section header yet, start a new section
        currentSection = part;
      }
    }

    // Add the last section
    if (currentSection) {
      sections.push(currentSection);
    }

    return sections.length ? sections : [content];
  }

  /**
   * Extract section title from a section
   */
  private static extractSectionTitle(section: string): string {
    const match = section.match(/\*\*(.*?)\*\*/);
    return match ? match[1].trim() : "Section";
  }
}
