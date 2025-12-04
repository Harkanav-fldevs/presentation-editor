"use client";

import { Card, CardContent } from "@/components/ui/card";
import { usePresentationStore } from "@/stores/presentation-store";
import type { Slide } from "@/lib/presentation-types";
import {
  getContrastTextColor,
  getContrastPrimaryColor,
} from "@/lib/theme-contrast-utils";

interface SlidePreviewProps {
  slide: Slide;
  isActive?: boolean;
  onClick?: () => void;
}

export function SlidePreview({ slide, isActive, onClick }: SlidePreviewProps) {
  const { theme } = usePresentationStore();

  const getSlideStyles = () => {
    const baseStyles = {
      backgroundColor: theme.colors.background,
      color: getContrastTextColor(theme),
    };

    switch (slide.layout) {
      case "centered":
        return {
          ...baseStyles,
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center" as const,
        };
      case "two-column":
        return {
          ...baseStyles,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          alignItems: "start",
        };
      case "full-width":
        return {
          ...baseStyles,
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "center",
        };
      case "image-left":
        return {
          ...baseStyles,
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "2rem",
          alignItems: "center",
        };
      case "image-right":
        return {
          ...baseStyles,
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          alignItems: "center",
        };
      default:
        return baseStyles;
    }
  };

  const getTitleStyles = () => {
    const baseStyles = {
      color: getContrastPrimaryColor(theme),
      fontFamily: theme.fonts.heading,
    };

    switch (slide.type) {
      case "title":
        return {
          ...baseStyles,
          fontSize: "1.5rem", // Reduced from 3rem
          fontWeight: "bold",
          marginBottom: "0.5rem",
        };
      case "conclusion":
        return {
          ...baseStyles,
          fontSize: "1.25rem", // Reduced from 2.5rem
          fontWeight: "bold",
          marginBottom: "0.5rem",
        };
      default:
        return {
          ...baseStyles,
          fontSize: "1rem", // Reduced from 2rem
          fontWeight: "600",
          marginBottom: "0.5rem",
        };
    }
  };

  const getContentStyles = () => {
    return {
      fontSize: "0.875rem", // Reduced from 1.25rem
      lineHeight: "1.4", // Reduced from 1.6
      fontFamily: theme.fonts.body,
    };
  };

  return (
    <Card
      className={`w-full cursor-pointer transition-all ${
        isActive ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
      }`}
      style={{
        aspectRatio: "16/9",
        maxWidth: "800px",
        maxHeight: "450px",
        width: "100%",
        height: "auto",
      }}
      onClick={onClick}
    >
      <CardContent className="h-full p-6" style={getSlideStyles()}>
        <div className="w-full h-full flex flex-col">
          <h1 style={getTitleStyles()}>{slide.title}</h1>

          <div
            style={{
              ...getContentStyles(),
              maxHeight: "calc(100% - 2rem)",
              overflow: "hidden",
            }}
            dangerouslySetInnerHTML={{ __html: slide.content }}
            className="flex-1 overflow-y-auto"
          />

          {/* Slide type indicator */}
          <div className="absolute top-2 right-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {slide.type}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

