"use client";

import React from "react";
import { ColumnData } from "@/mastra/types/slide-templates";
import { PresentationTheme } from "@/lib/presentation-types";
import {
  getContrastTextColor,
  getContrastPrimaryColor,
} from "@/lib/theme-contrast-utils";

interface ColumnSlideProps {
  title?: string;
  columnData: ColumnData;
  theme?: PresentationTheme;
}

export function ColumnSlide({ title, columnData, theme }: ColumnSlideProps) {
  const getColumnClass = (columnCount: number) => {
    switch (columnCount) {
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
      default:
        return "grid-cols-2";
    }
  };

  // Handle missing or invalid columnData
  if (
    !columnData ||
    !columnData.columns ||
    !Array.isArray(columnData.columns)
  ) {
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
        <div
          className="text-center"
          style={{
            color: theme?.colors.text || "#6b7280",
            fontFamily: theme?.fonts.body || "inherit",
          }}
        >
          <p>No column data available</p>
        </div>
      </div>
    );
  }

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

      <div
        className={`w-full max-w-6xl grid ${getColumnClass(
          columnData.columns.length
        )} gap-8`}
      >
        {columnData.columns.map((column, index) => (
          <div key={index} className="flex flex-col">
            {column.title && (
              <h3
                className="text-2xl font-semibold mb-4"
                style={{
                  color: theme ? getContrastPrimaryColor(theme) : "#1f2937",
                  fontFamily: theme?.fonts.heading || "inherit",
                }}
              >
                {column.title}
              </h3>
            )}
            {column.image && (
              <img
                src={column.image}
                alt={column.title || `Column ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            {column.content && (
              <div
                className="text-lg"
                style={{
                  color: theme ? getContrastTextColor(theme) : "inherit",
                  fontFamily: theme?.fonts.body || "inherit",
                }}
                dangerouslySetInnerHTML={{ __html: column.content }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
