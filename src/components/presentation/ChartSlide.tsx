"use client";

import React, { useEffect, useRef } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartData } from "@/mastra/types/slide-templates";
import { PresentationTheme } from "@/lib/presentation-types";
import {
  getContrastTextColor,
  getContrastPrimaryColor,
} from "@/lib/theme-contrast-utils";
import { usePresentationStore } from "@/stores/presentation-store";

interface ChartSlideProps {
  title: string;
  chartData: ChartData;
  theme?: PresentationTheme;
  slideId?: string;
}

const DEFAULT_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

// Generate theme-aware colors that work well in both light and dark modes
const getThemeAwareColors = (theme?: PresentationTheme) => {
  if (!theme) return DEFAULT_COLORS;

  const isDark = theme.colors.background === "#1f2937";

  if (isDark) {
    // Brighter, more vibrant colors for dark mode
    return [
      "#60a5fa", // Lighter blue
      "#34d399", // Lighter green
      "#fbbf24", // Lighter yellow
      "#f87171", // Lighter red
      "#a78bfa", // Lighter purple
      "#f472b6", // Lighter pink
      "#22d3ee", // Lighter cyan
      "#fb923c", // Lighter orange
    ];
  }

  // Original colors work well for light mode
  return DEFAULT_COLORS;
};

export function ChartSlide({
  title,
  chartData,
  theme,
  slideId,
}: ChartSlideProps) {
  const colors = chartData?.colors || getThemeAwareColors(theme);
  const data = chartData?.data || [];
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Debug logging (commented out to prevent console spam)
  // console.log("ChartSlide props:", { title, chartData, data });

  // If no data, show a message with more helpful information
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h2
          className="text-xl font-bold mb-4"
          style={{
            color: theme?.colors.primary || "#1f2937",
            fontFamily: theme?.fonts.heading || "inherit",
          }}
        >
          {title}
        </h2>
        <div className="text-center">
          <p
            className="text-lg mb-2"
            style={{
              color: theme?.colors.text || "#6b7280",
              fontFamily: theme?.fonts.body || "inherit",
            }}
          >
            No chart data available
          </p>
          <p
            className="text-sm"
            style={{
              color: theme?.colors.text || "#9ca3af",
              fontFamily: theme?.fonts.body || "inherit",
            }}
          >
            This slide was configured for a chart template but no data was
            provided.
          </p>
          <p
            className="text-sm mt-1"
            style={{
              color: theme?.colors.text || "#9ca3af",
              fontFamily: theme?.fonts.body || "inherit",
            }}
          >
            Try selecting a different template or check the slide content.
          </p>
        </div>
      </div>
    );
  }

  // Don't show chart if there's only one data point
  if (data.length === 1) {
    // console.log(
    //   "📊 Single data point in ChartSlide, falling back to content display"
    // );
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h2
          className="text-xl font-bold mb-4"
          style={{
            color: theme?.colors.primary || "#1f2937",
            fontFamily: theme?.fonts.heading || "inherit",
          }}
        >
          {title}
        </h2>
        <div className="text-center">
          <p
            className="text-lg mb-2"
            style={{
              color: theme?.colors.text || "#6b7280",
              fontFamily: theme?.fonts.body || "inherit",
            }}
          >
            Single data point detected
          </p>
          <p
            className="text-sm"
            style={{
              color: theme?.colors.text || "#9ca3af",
              fontFamily: theme?.fonts.body || "inherit",
            }}
          >
            Charts are not displayed when there's only one data point.
          </p>
          <div
            className="mt-4 p-4 rounded-lg"
            style={{ backgroundColor: theme?.colors.background || "#f9fafb" }}
          >
            <p
              className="text-sm font-medium"
              style={{
                color: theme?.colors.text || "#374151",
                fontFamily: theme?.fonts.body || "inherit",
              }}
            >
              {data[0].name}: {data[0].value}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

  // Create details panel component
  const renderDetailsPanel = () => (
    <div className="flex flex-col space-y-2 h-full">
      <h3
        className="text-sm font-semibold mb-2"
        style={{
          color: theme ? getContrastTextColor(theme) : "#374151",
          fontFamily: theme?.fonts.heading || "inherit",
        }}
      >
        Data Breakdown
      </h3>
      <div className="space-y-1 max-h-48">
        {data.map((item, index) => {
          const percentage =
            total > 0 ? (((item.value || 0) / total) * 100).toFixed(1) : 0;
          return (
            <div
              key={index}
              className="flex items-center space-x-2 p-1.5 rounded"
              style={{
                backgroundColor: theme
                  ? theme.colors.background === "#1f2937"
                    ? "#374151"
                    : "#f9fafb"
                  : "#f9fafb",
              }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <div className="flex-1 min-w-0 flex flex-row">
                <div
                  className="font-medium text-xs truncate"
                  style={{
                    color: theme ? getContrastTextColor(theme) : "#111827",
                    fontFamily: theme?.fonts.body || "inherit",
                  }}
                >
                  {item.name}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: theme ? getContrastTextColor(theme) : "#6b7280",
                    fontFamily: theme?.fonts.body || "inherit",
                  }}
                >
                  {item.value} ({percentage}%)
                </div>
              </div>
            </div>
          );
        })}
        <div
          className="mt-2 p-1.5 rounded flex flex-row justify-between items-center"
          style={{
            backgroundColor: theme?.colors.primary + "20" || "#dbeafe",
            border:
              theme?.colors.background === "#1f2937"
                ? "1px solid #374151"
                : "none",
          }}
        >
          <div
            className="text-xs font-medium"
            style={{
              color: theme ? getContrastPrimaryColor(theme) : "#1e40af",
              fontFamily: theme?.fonts.body || "inherit",
            }}
          >
            Total
          </div>
          <div
            className="text-sm font-bold"
            style={{
              color: theme ? getContrastPrimaryColor(theme) : "#1d4ed8",
              fontFamily: theme?.fonts.heading || "inherit",
            }}
          >
            {total}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChart = () => {
    // console.log("Rendering chart with data:", data, "type:", chartData?.type);

    switch (chartData?.type) {
      case "pie":
        return (
          <div
            ref={chartContainerRef}
            className="w-full h-96 flex items-center justify-center"
            data-chart-container
            style={{
              backgroundColor:
                theme?.colors.background === "#1f2937" ? "#374151" : "#f3f4f6",
            }}
          >
            <div
              className="p-4 w-full h-full rounded-lg"
              style={{
                backgroundColor: theme?.colors.background || "#ffffff",
              }}
            >
              <ResponsiveContainer width="100%" height={380}>
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={data}
                    dataKey={chartData.dataKey || "value"}
                    nameKey={chartData.nameKey || "name"}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={15}
                    label={({ name, percent }) => {
                      const shortName =
                        name.length > 15 ? name.substring(0, 12) + "..." : name;
                      return `${shortName}: ${(percent * 100).toFixed(0)}%`;
                    }}
                    labelLine={false}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => `Category: ${label}`}
                    contentStyle={{
                      backgroundColor:
                        theme?.colors.background === "#1f2937"
                          ? "#1f2937"
                          : "#ffffff",
                      border:
                        theme?.colors.background === "#1f2937"
                          ? "1px solid #374151"
                          : "1px solid #e5e7eb",
                      color: theme ? getContrastTextColor(theme) : "#1f2937",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      color: theme ? getContrastTextColor(theme) : "#1f2937",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "bar":
        return (
          <div
            ref={chartContainerRef}
            className="w-full h-96 flex items-center justify-center"
            data-chart-container
            style={{
              backgroundColor:
                theme?.colors.background === "#1f2937" ? "#374151" : "#f3f4f6",
            }}
          >
            <div
              className="rounded-lg p-4 w-full h-full"
              style={{
                backgroundColor: theme?.colors.background || "#ffffff",
              }}
            >
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={
                      theme?.colors.background === "#1f2937"
                        ? "#4b5563"
                        : "#e5e7eb"
                    }
                  />
                  <XAxis
                    dataKey={chartData?.xKey || "name"}
                    tick={{
                      fill: theme ? getContrastTextColor(theme) : "#1f2937",
                    }}
                    axisLine={{
                      stroke:
                        theme?.colors.background === "#1f2937"
                          ? "#4b5563"
                          : "#e5e7eb",
                    }}
                  />
                  <YAxis
                    tick={{
                      fill: theme ? getContrastTextColor(theme) : "#1f2937",
                    }}
                    axisLine={{
                      stroke:
                        theme?.colors.background === "#1f2937"
                          ? "#4b5563"
                          : "#e5e7eb",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        theme?.colors.background === "#1f2937"
                          ? "#1f2937"
                          : "#ffffff",
                      border:
                        theme?.colors.background === "#1f2937"
                          ? "1px solid #374151"
                          : "1px solid #e5e7eb",
                      color: theme ? getContrastTextColor(theme) : "#1f2937",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      color: theme ? getContrastTextColor(theme) : "#1f2937",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey={chartData?.yKey || "value"} fill={colors[0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "line":
        return (
          <div
            ref={chartContainerRef}
            className="w-full h-96 flex items-center justify-center"
            data-chart-container
            style={{
              backgroundColor:
                theme?.colors.background === "#1f2937" ? "#374151" : "#f3f4f6",
            }}
          >
            <div
              className="rounded-lg p-4 w-full h-full"
              style={{
                backgroundColor: theme?.colors.background || "#ffffff",
              }}
            >
              <ResponsiveContainer width="100%" height={380}>
                <LineChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={
                      theme?.colors.background === "#1f2937"
                        ? "#4b5563"
                        : "#e5e7eb"
                    }
                  />
                  <XAxis
                    dataKey={chartData?.xKey || "name"}
                    tick={{
                      fill: theme ? getContrastTextColor(theme) : "#1f2937",
                    }}
                    axisLine={{
                      stroke:
                        theme?.colors.background === "#1f2937"
                          ? "#4b5563"
                          : "#e5e7eb",
                    }}
                  />
                  <YAxis
                    tick={{
                      fill: theme ? getContrastTextColor(theme) : "#1f2937",
                    }}
                    axisLine={{
                      stroke:
                        theme?.colors.background === "#1f2937"
                          ? "#4b5563"
                          : "#e5e7eb",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        theme?.colors.background === "#1f2937"
                          ? "#1f2937"
                          : "#ffffff",
                      border:
                        theme?.colors.background === "#1f2937"
                          ? "1px solid #374151"
                          : "1px solid #e5e7eb",
                      color: theme ? getContrastTextColor(theme) : "#1f2937",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      color: theme ? getContrastTextColor(theme) : "#1f2937",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={chartData?.yKey || "value"}
                    stroke={colors[0]}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "area":
        return (
          <div
            ref={chartContainerRef}
            className="w-full h-96 flex items-center justify-center"
            data-chart-container
            style={{
              backgroundColor:
                theme?.colors.background === "#1f2937" ? "#374151" : "#f3f4f6",
            }}
          >
            <div
              className="rounded-lg p-4 w-full h-full"
              style={{
                backgroundColor: theme?.colors.background || "#ffffff",
              }}
            >
              <ResponsiveContainer width="100%" height={380}>
                <AreaChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={
                      theme?.colors.background === "#1f2937"
                        ? "#4b5563"
                        : "#e5e7eb"
                    }
                  />
                  <XAxis
                    dataKey={chartData?.xKey || "name"}
                    tick={{
                      fill: theme ? getContrastTextColor(theme) : "#1f2937",
                    }}
                    axisLine={{
                      stroke:
                        theme?.colors.background === "#1f2937"
                          ? "#4b5563"
                          : "#e5e7eb",
                    }}
                  />
                  <YAxis
                    tick={{
                      fill: theme ? getContrastTextColor(theme) : "#1f2937",
                    }}
                    axisLine={{
                      stroke:
                        theme?.colors.background === "#1f2937"
                          ? "#4b5563"
                          : "#e5e7eb",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        theme?.colors.background === "#1f2937"
                          ? "#1f2937"
                          : "#ffffff",
                      border:
                        theme?.colors.background === "#1f2937"
                          ? "1px solid #374151"
                          : "1px solid #e5e7eb",
                      color: theme ? getContrastTextColor(theme) : "#1f2937",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      color: theme ? getContrastTextColor(theme) : "#1f2937",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={chartData?.yKey || "value"}
                    stroke={colors[0]}
                    fill={colors[0]}
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "radar":
        return (
          <div
            ref={chartContainerRef}
            className="w-full h-96 flex items-center justify-center"
            data-chart-container
            style={{
              backgroundColor:
                theme?.colors.background === "#1f2937" ? "#374151" : "#f3f4f6",
            }}
          >
            <div
              className="rounded-lg p-4 w-full h-full"
              style={{
                backgroundColor: theme?.colors.background || "#ffffff",
              }}
            >
              <ResponsiveContainer width="100%" height={380}>
                <RadarChart data={data}>
                  <PolarGrid
                    stroke={
                      theme?.colors.background === "#1f2937"
                        ? "#4b5563"
                        : "#e5e7eb"
                    }
                  />
                  <PolarAngleAxis
                    dataKey={chartData?.xKey || "name"}
                    tick={{
                      fill: theme ? getContrastTextColor(theme) : "#1f2937",
                    }}
                  />
                  <PolarRadiusAxis
                    tick={{
                      fill: theme ? getContrastTextColor(theme) : "#1f2937",
                    }}
                  />
                  <Radar
                    name="Values"
                    dataKey={chartData?.yKey || "value"}
                    stroke={colors[0]}
                    fill={colors[0]}
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        theme?.colors.background === "#1f2937"
                          ? "#1f2937"
                          : "#ffffff",
                      border:
                        theme?.colors.background === "#1f2937"
                          ? "1px solid #374151"
                          : "1px solid #e5e7eb",
                      color: theme ? getContrastTextColor(theme) : "#1f2937",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      color: theme ? getContrastTextColor(theme) : "#1f2937",
                      fontSize: "12px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h2
        className="text-xl font-bold mb-4 text-center"
        style={{
          color: theme?.colors.primary || "#1f2937",
          fontFamily: theme?.fonts.heading || "inherit",
        }}
      >
        {title}
      </h2>
      <div className="flex-1 flex flex-row gap-4">
        {/* Chart on the left */}
        <div className="flex-1 flex flex-col">
          {false ? (
            <div className="w-full h-96 flex items-center justify-center relative">
              <img
                src=""
                alt={`${title} Chart`}
                className="w-full h-full object-contain"
              />
            </div>
          ) : false ? (
            <div className="w-full h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p
                  style={{
                    color: theme?.colors.text || "#6b7280",
                    fontFamily: theme?.fonts.body || "inherit",
                  }}
                >
                  Converting chart to image...
                </p>
                <p
                  className="text-sm mt-1"
                  style={{
                    color: theme?.colors.text || "#9ca3af",
                    fontFamily: theme?.fonts.body || "inherit",
                  }}
                >
                  This may take a moment
                </p>
              </div>
            </div>
          ) : false ? (
            <div className="w-full h-96 flex items-center justify-center">
              <div className="text-center">
                <p
                  className="mb-2"
                  style={{
                    color: "#dc2626",
                    fontFamily: theme?.fonts.body || "inherit",
                  }}
                >
                  Error: Chart conversion failed
                </p>
                <button
                  onClick={() => {}}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Retry
                </button>
                <div className="mt-4">
                  <p
                    className="text-sm mb-2"
                    style={{
                      color: theme?.colors.text || "#9ca3af",
                      fontFamily: theme?.fonts.body || "inherit",
                    }}
                  >
                    Fallback: Showing original chart
                  </p>
                  <div className="w-full h-96">{renderChart()}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-96 flex items-center justify-center">
              <div
                className="text-center"
                style={{
                  color: theme?.colors.text || "#6b7280",
                  fontFamily: theme?.fonts.body || "inherit",
                }}
              >
                <p>Preparing chart...</p>
              </div>
            </div>
          )}
        </div>

        {/* Details panel on the right */}
        <div className="w-80 flex-shrink-0">{renderDetailsPanel()}</div>
      </div>
    </div>
  );
}
