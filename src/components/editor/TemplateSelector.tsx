"use client";

import React, { useState } from "react";
import { SlideTemplate } from "@/mastra/types/slide-templates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  ChevronDown,
  Check,
} from "lucide-react";

interface TemplateSelectorProps {
  currentTemplate?: SlideTemplate;
  onTemplateSelect: (template: SlideTemplate) => void;
  isPreviewMode?: boolean;
}

// Template categories for better organization
const TEMPLATE_CATEGORIES = {
  basic: {
    name: "Basic",
    icon: FileText,
    templates: [
      {
        value: SlideTemplate.TITLE_SLIDE,
        label: "Title Slide",
        icon: FileText,
      },
      { value: SlideTemplate.CONTENT, label: "Content", icon: FileText },
      { value: SlideTemplate.TWO_COLUMN, label: "Two Column", icon: Grid3X3 },
      { value: SlideTemplate.BLANK_CARD, label: "Blank Card", icon: FileText },
    ],
  },
  charts: {
    name: "Charts",
    icon: BarChart3,
    templates: [
      { value: SlideTemplate.PIE_CHART, label: "Pie Chart", icon: PieChart },
      { value: SlideTemplate.BAR_CHART, label: "Bar Chart", icon: BarChart3 },
      {
        value: SlideTemplate.LINE_CHART,
        label: "Line Chart",
        icon: TrendingUp,
      },
      {
        value: SlideTemplate.AREA_CHART,
        label: "Area Chart",
        icon: TrendingUp,
      },
      { value: SlideTemplate.RADAR_CHART, label: "Radar Chart", icon: Target },
    ],
  },
  business: {
    name: "Business",
    icon: Target,
    templates: [
      { value: SlideTemplate.SWOT_MATRIX, label: "SWOT Matrix", icon: Grid3X3 },
      {
        value: SlideTemplate.METRICS_DASHBOARD,
        label: "Metrics Dashboard",
        icon: Target,
      },
      { value: SlideTemplate.PERSONA_CARD, label: "Persona Card", icon: Users },
      {
        value: SlideTemplate.COMPARISON_TABLE,
        label: "Comparison Table",
        icon: Grid3X3,
      },
      { value: SlideTemplate.TIMELINE, label: "Timeline", icon: TrendingUp },
    ],
  },
  content: {
    name: "Content",
    icon: FileText,
    templates: [
      {
        value: SlideTemplate.BULLET_LIST,
        label: "Bullet List",
        icon: FileText,
      },
      {
        value: SlideTemplate.NUMBERED_LIST,
        label: "Numbered List",
        icon: FileText,
      },
      { value: SlideTemplate.QUOTE, label: "Quote", icon: FileText },
      {
        value: SlideTemplate.IMAGE_WITH_CAPTION,
        label: "Image with Caption",
        icon: Image,
      },
      { value: SlideTemplate.CONCLUSION, label: "Conclusion", icon: FileText },
    ],
  },
  gamma: {
    name: "Gamma Style",
    icon: Layout,
    templates: [
      {
        value: SlideTemplate.IMAGE_AND_TEXT,
        label: "Image and Text",
        icon: Image,
      },
      {
        value: SlideTemplate.TEXT_AND_IMAGE,
        label: "Text and Image",
        icon: Image,
      },
      { value: SlideTemplate.TWO_COLUMNS, label: "Two Columns", icon: Grid3X3 },
      {
        value: SlideTemplate.THREE_COLUMNS,
        label: "Three Columns",
        icon: Grid3X3,
      },
      {
        value: SlideTemplate.FOUR_COLUMNS,
        label: "Four Columns",
        icon: Grid3X3,
      },
      {
        value: SlideTemplate.TITLE_WITH_BULLETS,
        label: "Title with Bullets",
        icon: FileText,
      },
      { value: SlideTemplate.ACCENT_LEFT, label: "Accent Left", icon: Layout },
      {
        value: SlideTemplate.ACCENT_RIGHT,
        label: "Accent Right",
        icon: Layout,
      },
      { value: SlideTemplate.ACCENT_TOP, label: "Accent Top", icon: Layout },
      {
        value: SlideTemplate.IMAGE_GALLERY,
        label: "Image Gallery",
        icon: Image,
      },
      { value: SlideTemplate.TEAM_PHOTOS, label: "Team Photos", icon: Users },
    ],
  },
};

export function TemplateSelector({
  currentTemplate,
  onTemplateSelect,
  isPreviewMode = false,
}: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof TEMPLATE_CATEGORIES>("basic");

  const handleTemplateSelect = (template: SlideTemplate) => {
    onTemplateSelect(template);
    setIsOpen(false);
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

  const currentInfo = getCurrentTemplateInfo();

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-w-[200px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Layout className="h-4 w-4" />
          <span className="text-sm">
            {isPreviewMode ? "Change Template" : "Template"}
          </span>
          {currentTemplate && (
            <span className="text-xs text-gray-500">
              ({currentInfo.template})
            </span>
          )}
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 mt-2 w-96 max-h-96 overflow-y-auto z-50 bg-white shadow-lg border">
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Select Template
              </h3>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-1 mb-4">
                {Object.entries(TEMPLATE_CATEGORIES).map(([key, category]) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={key}
                      variant={selectedCategory === key ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setSelectedCategory(
                          key as keyof typeof TEMPLATE_CATEGORIES
                        )
                      }
                      className="flex items-center gap-1 text-xs"
                    >
                      <Icon className="h-3 w-3" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATE_CATEGORIES[selectedCategory].templates.map(
                (template) => {
                  const Icon = template.icon;
                  const isSelected = currentTemplate === template.value;

                  return (
                    <Button
                      key={template.value}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTemplateSelect(template.value)}
                      className="flex items-center gap-2 justify-start h-auto p-3 text-left"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">
                          {template.label}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="h-3 w-3 flex-shrink-0" />
                      )}
                    </Button>
                  );
                }
              )}
            </div>

            {/* Current Selection Info */}
            {currentTemplate && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-600">
                  <strong>Current:</strong> {currentInfo.template} (
                  {currentInfo.category})
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
