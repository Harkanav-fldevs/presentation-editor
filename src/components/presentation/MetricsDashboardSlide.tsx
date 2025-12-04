"use client";

import React from "react";
import { MetricsData } from "@/mastra/types/slide-templates";
import { PresentationTheme } from "@/lib/presentation-types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  getContrastTextColor,
  getContrastPrimaryColor,
} from "@/lib/theme-contrast-utils";

interface MetricsDashboardSlideProps {
  title: string;
  metricsData: MetricsData;
  theme?: PresentationTheme;
}

export function MetricsDashboardSlide({
  title,
  metricsData,
  theme,
}: MetricsDashboardSlideProps) {
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-5 h-5" style={{ color: "#10b981" }} />;
      case "down":
        return (
          <TrendingDown className="w-5 h-5" style={{ color: "#ef4444" }} />
        );
      default:
        return (
          <Minus
            className="w-5 h-5"
            style={{ color: theme ? getContrastTextColor(theme) : "#6b7280" }}
          />
        );
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case "up":
        return "#10b981";
      case "down":
        return "#ef4444";
      default:
        return theme ? getContrastTextColor(theme) : "#6b7280";
    }
  };

  // Provide default values to prevent undefined errors
  const metrics = metricsData?.metrics || [];

  return (
    <div className="flex flex-col h-full p-8">
      <h2
        className="text-xl font-bold mb-8 text-center"
        style={{
          color: theme ? getContrastPrimaryColor(theme) : "#1f2937",
          fontFamily: theme?.fonts.heading || "inherit",
        }}
      >
        {title}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {metrics.length > 0 ? (
          metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-base font-semibold"
                  style={{
                    color: theme ? getContrastTextColor(theme) : "#374151",
                    fontFamily: theme?.fonts.heading || "inherit",
                  }}
                >
                  {metric.label}
                </h3>
                {/* {getTrendIcon(metric.trend)} */}
              </div>
              <div
                className="text-2xl font-bold mb-2"
                style={{
                  color: theme ? getContrastTextColor(theme) : "#111827",
                  fontFamily: theme?.fonts.heading || "inherit",
                }}
              >
                {metric.value}
              </div>
              {metric.change && (
                <div
                  className="text-sm font-medium"
                  style={{
                    color: getTrendColor(metric.trend),
                    fontFamily: theme?.fonts.body || "inherit",
                  }}
                >
                  {metric.change}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center">
            <p
              className="text-lg"
              style={{
                color: theme ? getContrastTextColor(theme) : "#6b7280",
                fontFamily: theme?.fonts.body || "inherit",
              }}
            >
              No metrics data available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
