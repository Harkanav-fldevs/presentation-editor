"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SlideLayout } from "@/lib/presentation-types";

// Layout options for slides - shared across the app
export const slideLayouts: { value: SlideLayout; label: string }[] = [
  { value: "centered", label: "Centered" },
  { value: "two-column", label: "Two Column" },
  { value: "full-width", label: "Full Width" },
  { value: "image-left", label: "Image Left" },
  { value: "image-right", label: "Image Right" },
];

interface LayoutSelectorProps {
  value: SlideLayout;
  onValueChange: (value: SlideLayout) => void;
  className?: string;
  triggerClassName?: string;
  showLabel?: boolean;
  label?: string;
}

export function LayoutSelector({
  value,
  onValueChange,
  className,
  triggerClassName,
  showLabel = false,
  label = "Layout",
}: LayoutSelectorProps) {
  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {slideLayouts.map((layout) => (
            <SelectItem key={layout.value} value={layout.value}>
              {layout.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Helper function to get layout label by value
export function getLayoutLabel(layout: SlideLayout): string {
  return slideLayouts.find((l) => l.value === layout)?.label || layout;
}
