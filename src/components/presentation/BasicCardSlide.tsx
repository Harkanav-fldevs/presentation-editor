"use client";

import React from "react";
import { BasicCardData } from "@/mastra/types/slide-templates";
import { PresentationTheme } from "@/lib/presentation-types";
import {
  getContrastTextColor,
  getContrastPrimaryColor,
} from "@/lib/theme-contrast-utils";

interface BasicCardSlideProps {
  title?: string;
  cardData: BasicCardData;
  theme?: PresentationTheme;
}

export function BasicCardSlide({
  title,
  cardData,
  theme,
}: BasicCardSlideProps) {
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

      <div className="w-full max-w-4xl">
        {cardData.image && cardData.content ? (
          <div
            className={`flex gap-8 items-center ${
              cardData.imagePosition === "right" ? "flex-row-reverse" : ""
            }`}
          >
            <div className="flex-1">
              <img
                src={cardData.image}
                alt="Card image"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <div
                className="text-lg"
                style={{
                  color: theme ? getContrastTextColor(theme) : "inherit",
                  fontFamily: theme?.fonts.body || "inherit",
                }}
                dangerouslySetInnerHTML={{ __html: cardData.content }}
              />
            </div>
          </div>
        ) : cardData.image ? (
          <div className="text-center">
            <img
              src={cardData.image}
              alt="Card image"
              className="w-full max-w-2xl h-96 object-cover rounded-lg mx-auto"
            />
          </div>
        ) : cardData.content ? (
          <div
            className="text-lg text-center"
            style={{
              color: theme?.colors.text || "inherit",
              fontFamily: theme?.fonts.body || "inherit",
            }}
            dangerouslySetInnerHTML={{ __html: cardData.content }}
          />
        ) : (
          <div className="w-full h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-lg">Blank card</span>
          </div>
        )}
      </div>
    </div>
  );
}
