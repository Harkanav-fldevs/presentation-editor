"use client";

import React from "react";
import { AccentLayoutData } from "@/mastra/types/slide-templates";
import { PresentationTheme } from "@/lib/presentation-types";
import {
  getContrastTextColor,
  getContrastPrimaryColor,
} from "@/lib/theme-contrast-utils";

interface AccentLayoutSlideProps {
  title?: string;
  accentData: AccentLayoutData;
  theme?: PresentationTheme;
}

export function AccentLayoutSlide({
  title,
  accentData,
  theme,
}: AccentLayoutSlideProps) {
  const getAccentStyles = () => {
    const baseColor = accentData.accentColor || "#3b82f6";

    switch (accentData.accentPosition) {
      case "left":
        return {
          container: "flex",
          accent: `w-2 bg-[${baseColor}] mr-6`,
          content: "flex-1",
        };
      case "right":
        return {
          container: "flex flex-row-reverse",
          accent: `w-2 bg-[${baseColor}] ml-6`,
          content: "flex-1",
        };
      case "top":
        return {
          container: "flex flex-col",
          accent: `h-2 bg-[${baseColor}] mb-6`,
          content: "w-full",
        };
      case "background":
        return {
          container: "relative",
          accent: `absolute inset-0 bg-gradient-to-r from-[${baseColor}] to-transparent opacity-10`,
          content: "relative z-10",
        };
      default:
        return {
          container: "flex",
          accent: `w-2 bg-[${baseColor}] mr-6`,
          content: "flex-1",
        };
    }
  };

  const styles = getAccentStyles();

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      {title && (
        <h2
          className="text-xl font-bold mb-8"
          style={{
            color: theme ? getContrastPrimaryColor(theme) : "#1f2937",
            fontFamily: theme?.fonts.heading || "inherit",
          }}
        >
          {title}
        </h2>
      )}

      <div className={`w-full max-w-4xl ${styles.container}`}>
        <div className={styles.accent}></div>
        <div className={styles.content}>
          {accentData.image && (
            <img
              src={accentData.image}
              alt="Accent layout image"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <div
            className="text-lg"
            style={{
              color: theme ? getContrastTextColor(theme) : "inherit",
              fontFamily: theme?.fonts.body || "inherit",
            }}
            dangerouslySetInnerHTML={{ __html: accentData.content }}
          />
        </div>
      </div>
    </div>
  );
}
