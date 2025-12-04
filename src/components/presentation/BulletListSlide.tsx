"use client";

import React from "react";
import { BulletListData } from "@/mastra/types/slide-templates";
import { PresentationTheme } from "@/lib/presentation-types";
import {
  getContrastTextColor,
  getContrastPrimaryColor,
} from "@/lib/theme-contrast-utils";

interface BulletListSlideProps {
  title?: string;
  bulletData: BulletListData;
  theme?: PresentationTheme;
}

export function BulletListSlide({
  title,
  bulletData,
  theme,
}: BulletListSlideProps) {
  // Add comprehensive null/undefined checks
  if (
    !bulletData ||
    !bulletData.bullets ||
    !Array.isArray(bulletData.bullets)
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <div
          className="text-center"
          style={{
            color: theme ? getContrastTextColor(theme) : "#6b7280",
            fontFamily: theme?.fonts.body || "inherit",
          }}
        >
          <p>No bullet data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8">
      <div className="flex flex-col items-center justify-center h-full mb-6">
        {title && (
          <h2
            className="text-xl font-bold"
            style={{
              color: theme ? getContrastPrimaryColor(theme) : "#1f2937",
              fontFamily: theme?.fonts.heading || "inherit",
            }}
          >
            {title}
          </h2>
        )}
      </div>

      <div className="w-full">
        {bulletData.image && bulletData.bullets ? (
          <div className="flex gap-8 items-start">
            <div className="flex-1">
              <ul className="space-y-4">
                {bulletData.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start">
                    <span
                      className="text-2xl mr-3"
                      style={{
                        color: theme
                          ? getContrastPrimaryColor(theme)
                          : "#3b82f6",
                      }}
                    >
                      •
                    </span>
                    <span
                      className="text-lg"
                      style={{
                        color: theme?.colors.text || "inherit",
                        fontFamily: theme?.fonts.body || "inherit",
                      }}
                    >
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <img
                src={bulletData.image}
                alt="Bullet list image"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        ) : bulletData.bullets ? (
          <div className="text-center">
            <ul className="space-y-4 text-left max-w-2xl">
              {bulletData.bullets.map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span
                    className="text-2xl mr-3"
                    style={{
                      color: theme ? getContrastPrimaryColor(theme) : "#3b82f6",
                    }}
                  >
                    •
                  </span>
                  <span
                    className="text-lg"
                    style={{
                      color: theme?.colors.text || "inherit",
                      fontFamily: theme?.fonts.body || "inherit",
                    }}
                  >
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center">
            <span
              className="text-lg"
              style={{
                color: theme ? getContrastTextColor(theme) : "#6b7280",
                fontFamily: theme?.fonts.body || "inherit",
              }}
            >
              No bullets to display
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
