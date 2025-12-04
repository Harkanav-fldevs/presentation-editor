"use client";

import React from "react";
import { PresentationTheme } from "@/lib/presentation-types";
import {
  getContrastTextColor,
  getContrastPrimaryColor,
} from "@/lib/theme-contrast-utils";

interface MarkdownRendererProps {
  content: string;
  theme?: PresentationTheme;
}

export function MarkdownRenderer({ content, theme }: MarkdownRendererProps) {
  // Enhanced overflow detection and content limiting
  const limitContent = (text: string) => {
    if (!text) return text;

    // Sanitize content first to prevent encoding issues
    let sanitized = text
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

    const lines = sanitized.split("\n");

    // Check for asterisk titles and handle them specially
    const hasAsteriskTitle =
      lines[0]?.startsWith("*") && lines[0]?.endsWith("*");

    if (hasAsteriskTitle) {
      // For slides with asterisk titles, be more generous with content
      const limitedLines = lines.slice(0, 30); // Allow even more lines for structured content
      return limitedLines.join("\n");
    }

    // For regular content, use more generous limits
    const limitedLines = lines.slice(0, 25);
    return limitedLines.join("\n");
  };

  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string) => {
    const limitedText = limitContent(text);
    // Split content into lines
    const lines = limitedText.split("\n");
    const elements: React.ReactNode[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        elements.push(<br key={key++} />);
        continue;
      }

      // Handle bold text (section headers) - **Section Name**
      if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
        const sectionText = line.substring(2, line.length - 2);
        elements.push(
          <h3
            key={key++}
            className="text-lg font-semibold mb-2 mt-4"
            style={{
              color: theme ? getContrastPrimaryColor(theme) : "#1f2937",
              fontFamily: theme?.fonts.heading || "inherit",
            }}
          >
            {sectionText}
          </h3>
        );
      }
      // Handle asterisk titles (legacy format - should not appear in new content)
      else if (line.startsWith("*") && line.endsWith("*") && line.length > 2) {
        const titleText = line.substring(1, line.length - 1);
        elements.push(
          <h1
            key={key++}
            className="text-2xl font-bold mb-4 text-center"
            style={{
              color: theme ? getContrastPrimaryColor(theme) : "#1f2937",
              fontFamily: theme?.fonts.heading || "inherit",
            }}
          >
            {titleText}
          </h1>
        );
      }
      // Handle headers
      else if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={key++}
            className="text-2xl font-bold mb-3 text-center"
            style={{
              color: theme ? getContrastPrimaryColor(theme) : "#1f2937",
              fontFamily: theme?.fonts.heading || "inherit",
            }}
          >
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={key++}
            className="text-xl font-bold mb-2"
            style={{
              color: theme ? getContrastPrimaryColor(theme) : "#1f2937",
              fontFamily: theme?.fonts.heading || "inherit",
            }}
          >
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={key++}
            className="text-lg font-semibold mb-2"
            style={{
              color: theme ? getContrastPrimaryColor(theme) : "#1f2937",
              fontFamily: theme?.fonts.heading || "inherit",
            }}
          >
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith("#### ")) {
        elements.push(
          <h4
            key={key++}
            className="text-base font-semibold mb-1"
            style={{
              color: theme ? getContrastPrimaryColor(theme) : "#1f2937",
              fontFamily: theme?.fonts.heading || "inherit",
            }}
          >
            {line.substring(5)}
          </h4>
        );
      } else if (line.startsWith("- ")) {
        // Handle bullet points
        const listItems: React.ReactNode[] = [];
        let j = i;

        while (j < lines.length && lines[j].trim().startsWith("- ")) {
          const itemText = lines[j].trim().substring(2);
          listItems.push(
            <li key={j} className="mb-1">
              {parseInlineMarkdown(itemText)}
            </li>
          );
          j++;
        }

        elements.push(
          <ul key={key++} className="list-disc list-inside mb-3 space-y-0.5">
            {listItems}
          </ul>
        );
        i = j - 1; // Skip processed lines
      } else if (
        line.startsWith("*") &&
        line.endsWith("*") &&
        line.length > 2
      ) {
        // Handle italic text
        elements.push(
          <p
            key={key++}
            className="text-sm italic mb-1"
            style={{
              color: theme ? getContrastTextColor(theme) : "inherit",
              fontFamily: theme?.fonts.body || "inherit",
            }}
          >
            {line.substring(1, line.length - 1)}
          </p>
        );
      } else {
        // Regular paragraph
        elements.push(
          <p
            key={key++}
            className="text-sm mb-1"
            style={{
              color: theme ? getContrastTextColor(theme) : "inherit",
              fontFamily: theme?.fonts.body || "inherit",
            }}
          >
            {parseInlineMarkdown(line)}
          </p>
        );
      }
    }

    return elements;
  };

  // Parse inline markdown (bold, italic, etc.)
  const parseInlineMarkdown = (text: string): React.ReactNode => {
    if (!text) return text;

    // Sanitize text before processing to prevent encoding issues
    const sanitizedText = text
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

    const parts: React.ReactNode[] = [];
    let key = 0;

    // Process all formatting patterns
    const patterns = [
      // Bold text **text** or __text__
      {
        regex: /\*\*(.*?)\*\*/g,
        component: (content: string) => (
          <strong key={key++} className="font-bold">
            {content}
          </strong>
        ),
      },
      {
        regex: /__(.*?)__/g,
        component: (content: string) => (
          <strong key={key++} className="font-bold">
            {content}
          </strong>
        ),
      },

      // Italic text *text* or _text_
      {
        regex: /\*(.*?)\*/g,
        component: (content: string) => (
          <em key={key++} className="italic">
            {content}
          </em>
        ),
      },
      {
        regex: /_(.*?)_/g,
        component: (content: string) => (
          <em key={key++} className="italic">
            {content}
          </em>
        ),
      },

      // Strikethrough ~~text~~
      {
        regex: /~~(.*?)~~/g,
        component: (content: string) => (
          <del key={key++} className="line-through">
            {content}
          </del>
        ),
      },

      // Inline code `code`
      {
        regex: /`(.*?)`/g,
        component: (content: string) => (
          <code
            key={key++}
            className="px-1 py-0.5 rounded text-sm font-mono"
            style={{
              backgroundColor: theme?.colors.background || "#f3f4f6",
              color: theme?.colors.text || "inherit",
              fontFamily: theme?.fonts.body || "inherit",
            }}
          >
            {content}
          </code>
        ),
      },

      // Links [text](url)
      {
        regex: /\[([^\]]+)\]\(([^)]+)\)/g,
        component: (content: string, url?: string) => (
          <a
            key={key++}
            href={url || "#"}
            className="underline"
            style={{
              color: theme?.colors.primary || "#3b82f6",
              fontFamily: theme?.fonts.body || "inherit",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        ),
      },

      // Highlighted text ==text==
      {
        regex: /==(.*?)==/g,
        component: (content: string) => (
          <mark key={key++} className="bg-yellow-200 px-1 rounded">
            {content}
          </mark>
        ),
      },

      // Superscript ^text^
      {
        regex: /\^(.*?)\^/g,
        component: (content: string) => (
          <sup
            key={key++}
            className="text-xs"
            style={{
              color: theme ? getContrastTextColor(theme) : "inherit",
              fontFamily: theme?.fonts.body || "inherit",
            }}
          >
            {content}
          </sup>
        ),
      },

      // Subscript ~text~
      {
        regex: /~(.*?)~/g,
        component: (content: string) => (
          <sub
            key={key++}
            className="text-xs"
            style={{
              color: theme ? getContrastTextColor(theme) : "inherit",
              fontFamily: theme?.fonts.body || "inherit",
            }}
          >
            {content}
          </sub>
        ),
      },
    ];

    // Process text with all patterns
    let processedText = text;
    const matches: Array<{
      start: number;
      end: number;
      component: React.ReactNode;
      original: string;
    }> = [];

    patterns.forEach(({ regex, component }) => {
      let match;
      const newRegex = new RegExp(regex.source, regex.flags);

      while ((match = newRegex.exec(sanitizedText)) !== null) {
        const start = match.index;
        const end = match.index + match[0].length;
        const content = match[1];
        const url = match[2]; // For links

        // Create component based on pattern type
        let reactComponent: React.ReactNode;
        if (regex.source.includes("\\[([^\\]]+)\\]\\(([^)]+)\\)")) {
          // Link pattern
          reactComponent = component(content, url || "");
        } else {
          reactComponent = component(content);
        }

        matches.push({
          start,
          end,
          component: reactComponent,
          original: match[0],
        });
      }
    });

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Remove overlapping matches (keep the first one)
    const filteredMatches = [];
    let lastEnd = 0;

    for (const match of matches) {
      if (match.start >= lastEnd) {
        filteredMatches.push(match);
        lastEnd = match.end;
      }
    }

    // Build the result
    let buildIndex = 0;

    filteredMatches.forEach((match) => {
      // Add text before the match
      if (match.start > buildIndex) {
        parts.push(sanitizedText.substring(buildIndex, match.start));
      }

      // Add the formatted component
      parts.push(match.component);

      buildIndex = match.end;
    });

    // Add remaining text
    if (buildIndex < sanitizedText.length) {
      parts.push(sanitizedText.substring(buildIndex));
    }

    return parts.length > 0 ? parts : sanitizedText;
  };

  return (
    <div
      className="prose prose-sm max-w-none h-full overflow-y-auto"
      style={{
        fontFamily: theme?.fonts.body || "inherit",
        color: theme?.colors.text || "inherit",
      }}
    >
      {parseMarkdown(content)}
    </div>
  );
}
