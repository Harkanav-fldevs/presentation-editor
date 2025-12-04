"use client";

import React, { useState, useMemo } from "react";
import { SlideTemplate } from "@/mastra/types/slide-templates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Layout,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Target,
  FileText,
  Image,
  Grid3X3,
  X,
  Check,
  RotateCcw,
} from "lucide-react";

interface TemplateDialogProps {
  currentTemplate?: SlideTemplate;
  onTemplateSelect: (template: SlideTemplate) => void;
  onRevert?: () => void;
  isPreviewMode?: boolean;
  children?: React.ReactNode;
  slideId?: string;
}

// Template categories with visual representations
const TEMPLATE_CATEGORIES = {
  basic: {
    name: "Basic",
    icon: FileText,
    templates: [
      {
        value: SlideTemplate.CONTENT,
        label: "Content",
        icon: FileText,
        preview: "blank-card",
      },
      {
        value: SlideTemplate.TITLE_SLIDE,
        label: "Title slide",
        icon: FileText,
        preview: "title-bullets",
      },
      {
        value: SlideTemplate.TWO_COLUMN,
        label: "Two column",
        icon: Grid3X3,
        preview: "two-columns",
      },
      {
        value: SlideTemplate.TWO_COLUMNS,
        label: "Two columns",
        icon: Grid3X3,
        preview: "two-columns",
      },
      {
        value: SlideTemplate.THREE_COLUMNS,
        label: "Three columns",
        icon: Grid3X3,
        preview: "three-columns",
      },
      {
        value: SlideTemplate.FOUR_COLUMNS,
        label: "Four columns",
        icon: Grid3X3,
        preview: "four-columns",
      },
    ],
  },
  cardLayouts: {
    name: "Card layouts",
    icon: Layout,
    templates: [
      {
        value: SlideTemplate.ACCENT_LEFT,
        label: "Accent left",
        icon: Layout,
        preview: "accent-left",
      },
      {
        value: SlideTemplate.ACCENT_RIGHT,
        label: "Accent right",
        icon: Layout,
        preview: "accent-right",
      },
      {
        value: SlideTemplate.ACCENT_TOP,
        label: "Accent top",
        icon: Layout,
        preview: "accent-top",
      },
    ],
  },
  images: {
    name: "Images",
    icon: Image,
    templates: [
      {
        value: SlideTemplate.TWO_IMAGE_COLUMNS,
        label: "2 image columns",
        icon: Image,
        preview: "two-image-columns",
      },
      {
        value: SlideTemplate.THREE_IMAGE_COLUMNS,
        label: "3 image columns",
        icon: Image,
        preview: "three-image-columns",
      },
      {
        value: SlideTemplate.FOUR_IMAGE_COLUMNS,
        label: "4 image columns",
        icon: Image,
        preview: "four-image-columns",
      },
      {
        value: SlideTemplate.IMAGES_WITH_TEXT,
        label: "Images with text",
        icon: Image,
        preview: "images-text",
      },
      {
        value: SlideTemplate.IMAGE_GALLERY,
        label: "Image gallery",
        icon: Image,
        preview: "image-gallery",
      },
      {
        value: SlideTemplate.TEAM_PHOTOS,
        label: "Team photos",
        icon: Users,
        preview: "team-photos",
      },
    ],
  },
  collections: {
    name: "Collections and sequences",
    icon: Grid3X3,
    templates: [
      {
        value: SlideTemplate.TIMELINE,
        label: "Timeline",
        icon: TrendingUp,
        preview: "timeline",
      },
      {
        value: SlideTemplate.BULLET_LIST,
        label: "Large bullet list",
        icon: FileText,
        preview: "bullet-list",
      },
      {
        value: SlideTemplate.QUOTE,
        label: "Quote",
        icon: Target,
        preview: "small-icons-text",
      },
    ],
  },
  charts: {
    name: "Charts",
    icon: BarChart3,
    templates: [
      {
        value: SlideTemplate.PIE_CHART,
        label: "Pie Chart",
        icon: PieChart,
        preview: "pie-chart",
      },
      {
        value: SlideTemplate.BAR_CHART,
        label: "Bar Chart",
        icon: BarChart3,
        preview: "bar-chart",
      },
      {
        value: SlideTemplate.LINE_CHART,
        label: "Line Chart",
        icon: TrendingUp,
        preview: "line-chart",
      },
      {
        value: SlideTemplate.AREA_CHART,
        label: "Area Chart",
        icon: TrendingUp,
        preview: "area-chart",
      },
      {
        value: SlideTemplate.RADAR_CHART,
        label: "Radar Chart",
        icon: Target,
        preview: "radar-chart",
      },
    ],
  },
  business: {
    name: "Business",
    icon: Target,
    templates: [
      {
        value: SlideTemplate.METRICS_DASHBOARD,
        label: "Metrics Dashboard",
        icon: Target,
        preview: "metrics-dashboard",
      },
      {
        value: SlideTemplate.COMPARISON_TABLE,
        label: "Comparison Table",
        icon: Grid3X3,
        preview: "comparison-table",
      },
    ],
  },
};

// Template preview component
const TemplatePreview = ({ template }: { template: string }) => {
  const getPreviewContent = () => {
    switch (template) {
      case "blank-card":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded flex items-center justify-center">
            <div className="text-gray-400 text-xs">Blank card</div>
          </div>
        );
      case "image-text":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded flex">
            <div className="w-8 h-8 bg-gray-300 m-1 rounded"></div>
            <div className="flex-1 p-2">
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        );
      case "text-image":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded flex">
            <div className="flex-1 p-2">
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="w-8 h-8 bg-gray-300 m-1 rounded"></div>
          </div>
        );
      case "two-columns":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded flex">
            <div className="flex-1 p-2 border-r">
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="flex-1 p-2">
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        );
      case "two-columns-header":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded flex">
            <div className="flex-1 p-2 border-r">
              <div className="h-3 bg-gray-400 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="flex-1 p-2">
              <div className="h-3 bg-gray-400 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        );
      case "three-columns":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded flex">
            <div className="flex-1 p-1 border-r">
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="flex-1 p-1 border-r">
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="flex-1 p-1">
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        );
      case "four-columns":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded flex">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 p-1 border-r last:border-r-0">
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        );
      case "title-bullets":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2">
            <div className="h-3 bg-gray-400 rounded mb-2"></div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-300 rounded w-3/4"></div>
              <div className="h-1 bg-gray-300 rounded w-2/3"></div>
              <div className="h-1 bg-gray-300 rounded w-4/5"></div>
            </div>
          </div>
        );
      case "title-bullets-image":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded flex">
            <div className="flex-1 p-2">
              <div className="h-3 bg-gray-400 rounded mb-2"></div>
              <div className="space-y-1">
                <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                <div className="h-1 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-300 m-1 rounded"></div>
          </div>
        );
      case "accent-left":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded flex">
            <div className="w-2 bg-blue-500"></div>
            <div className="flex-1 p-2 flex">
              <div className="flex-1">
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        );
      case "accent-right":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded flex">
            <div className="flex-1 p-2 flex">
              <div className="flex-1">
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
            <div className="w-2 bg-blue-500"></div>
          </div>
        );
      case "accent-top":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded">
            <div className="h-2 bg-blue-500 rounded-t"></div>
            <div className="p-2 flex">
              <div className="flex-1">
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        );
      case "two-image-columns":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded flex">
            <div className="flex-1 p-1 border-r">
              <div className="w-6 h-6 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="flex-1 p-1">
              <div className="w-6 h-6 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        );
      case "three-image-columns":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded flex">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 p-1 border-r last:border-r-0">
                <div className="w-4 h-4 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        );
      case "four-image-columns":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded flex">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 p-1 border-r last:border-r-0">
                <div className="w-3 h-3 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        );
      case "images-text":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2">
            <div className="flex gap-1 mb-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="h-2 bg-gray-300 rounded mb-1"></div>
            <div className="h-2 bg-gray-300 rounded w-3/4"></div>
          </div>
        );
      case "image-gallery":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2">
            <div className="flex gap-1 mb-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        );
      case "team-photos":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2">
            <div className="flex gap-1 mb-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-2 bg-gray-300 rounded w-1/3"></div>
              <div className="h-2 bg-gray-300 rounded w-1/3"></div>
              <div className="h-2 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        );
      case "text-boxes":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2">
            <div className="grid grid-cols-2 gap-2 h-full">
              <div className="border border-gray-200 rounded p-1">
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="border border-gray-200 rounded p-1">
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        );
      case "timeline":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2">
            <div className="flex">
              <div className="w-1 h-12 bg-gray-400 mr-2"></div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  <div className="h-2 bg-gray-300 rounded w-1/3"></div>
                </div>
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/5"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case "bullet-list":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2">
            <div className="space-y-1">
              <div className="flex items-center">
                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="flex items-center">
                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                <div className="h-2 bg-gray-300 rounded w-2/3"></div>
              </div>
              <div className="flex items-center">
                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                <div className="h-2 bg-gray-300 rounded w-4/5"></div>
              </div>
              <div className="flex items-center">
                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                <div className="h-2 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        );
      case "icons-text":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2">
            <div className="flex gap-2 mb-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <div className="h-2 bg-gray-300 rounded"></div>
              <div className="h-2 bg-gray-300 rounded"></div>
              <div className="h-2 bg-gray-300 rounded"></div>
              <div className="h-2 bg-gray-300 rounded"></div>
            </div>
          </div>
        );
      case "small-icons-text":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2">
            <div className="flex gap-1 mb-2">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <div className="h-2 bg-gray-300 rounded"></div>
              <div className="h-2 bg-gray-300 rounded"></div>
              <div className="h-2 bg-gray-300 rounded"></div>
              <div className="h-2 bg-gray-300 rounded"></div>
            </div>
          </div>
        );
      case "arrows":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="w-4 h-2 bg-gray-400 rounded"></div>
              <div className="w-4 h-2 bg-gray-400 rounded"></div>
              <div className="w-4 h-2 bg-gray-400 rounded"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-2 bg-gray-300 rounded w-1/4"></div>
              <div className="h-2 bg-gray-300 rounded w-1/4"></div>
              <div className="h-2 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        );
      case "pie-chart":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2 flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="text-xs text-gray-500">Pie</div>
            </div>
          </div>
        );
      case "bar-chart":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2 flex items-end justify-center">
            <div className="flex items-end gap-1">
              <div className="w-2 h-8 bg-gray-300 rounded"></div>
              <div className="w-2 h-6 bg-gray-300 rounded"></div>
              <div className="w-2 h-10 bg-gray-300 rounded"></div>
              <div className="w-2 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        );
      case "line-chart":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2 flex items-center justify-center">
            <div className="w-12 h-8 border border-gray-300 rounded flex items-center justify-center">
              <div className="text-xs text-gray-500">Line</div>
            </div>
          </div>
        );
      case "area-chart":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2 flex items-center justify-center">
            <div className="w-12 h-8 border border-gray-300 rounded flex items-center justify-center">
              <div className="text-xs text-gray-500">Area</div>
            </div>
          </div>
        );
      case "radar-chart":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2 flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="text-xs text-gray-500">Radar</div>
            </div>
          </div>
        );
      case "swot-matrix":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2">
            <div className="grid grid-cols-2 gap-1 h-full">
              <div className="border border-gray-300 rounded p-1">
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="border border-gray-300 rounded p-1">
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="border border-gray-300 rounded p-1">
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="border border-gray-300 rounded p-1">
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        );
      case "metrics-dashboard":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2">
            <div className="grid grid-cols-2 gap-1 h-full">
              <div className="border border-gray-300 rounded p-1">
                <div className="h-3 bg-gray-400 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="border border-gray-300 rounded p-1">
                <div className="h-3 bg-gray-400 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        );
      case "persona-card":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2">
            <div className="flex">
              <div className="w-8 h-8 bg-gray-300 rounded mr-2"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-400 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        );
      case "comparison-table":
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded p-2">
            <div className="grid grid-cols-3 gap-1">
              <div className="h-2 bg-gray-400 rounded"></div>
              <div className="h-2 bg-gray-400 rounded"></div>
              <div className="h-2 bg-gray-400 rounded"></div>
              <div className="h-2 bg-gray-300 rounded"></div>
              <div className="h-2 bg-gray-300 rounded"></div>
              <div className="h-2 bg-gray-300 rounded"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-20 bg-white border border-gray-200 rounded flex items-center justify-center">
            <div className="text-gray-400 text-xs">Template</div>
          </div>
        );
    }
  };

  return getPreviewContent();
};

export function TemplateDialog({
  currentTemplate,
  onTemplateSelect,
  onRevert,
  isPreviewMode = false,
  children,
  slideId,
}: TemplateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof TEMPLATE_CATEGORIES>("basic");

  const handleTemplateSelect = (template: SlideTemplate) => {
    onTemplateSelect(template);
    setIsOpen(false); // Close dialog after selection
  };

  const getCurrentTemplateInfo = () => {
    for (const category of Object.values(TEMPLATE_CATEGORIES)) {
      const template = category.templates.find(
        (t) => t.value === currentTemplate
      );
      if (template) {
        return { category: category.name, template: template.label };
      }
    }
    return { category: "Unknown", template: "Unknown" };
  };

  const currentInfo = useMemo(
    () => getCurrentTemplateInfo(),
    [currentTemplate]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            {isPreviewMode ? "Change Template" : "Template"}
            {currentTemplate && (
              <span className="text-xs text-gray-500">
                ({currentInfo.template})
              </span>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Apply card template</DialogTitle>
        </DialogHeader>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 border-b pb-4 flex-shrink-0">
          {Object.entries(TEMPLATE_CATEGORIES).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSelectedCategory(key as keyof typeof TEMPLATE_CATEGORIES)
                }
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-1">
          <div className="grid grid-cols-3 gap-4">
            {TEMPLATE_CATEGORIES[selectedCategory].templates.map((template) => {
              const isSelected = currentTemplate === template.value;

              return (
                <Card
                  key={template.value}
                  className={`cursor-pointer transition-all hover:shadow-md relative ${
                    isSelected
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => handleTemplateSelect(template.value)}
                >
                  {isSelected && (
                    <Check className="absolute top-2 right-2 h-4 w-4 text-blue-500" />
                  )}
                  <div className="p-3">
                    <div className="mb-2">
                      <TemplatePreview template={template.preview} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {template.label}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Current Selection Info */}
        {currentTemplate && (
          <div className="mt-4 pt-4 border-t flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <strong>Current:</strong> {currentInfo.template} (
                {currentInfo.category})
              </div>
              {onRevert && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onRevert();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Revert
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
