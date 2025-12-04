"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PresentationTheme,
  PRESENTATION_THEMES,
} from "@/lib/presentation-types";
import { Palette, Check } from "lucide-react";

interface ThemeSelectorProps {
  currentTheme: PresentationTheme;
  onThemeSelect: (theme: PresentationTheme) => void;
}

export function ThemeSelector({
  currentTheme,
  onThemeSelect,
}: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (theme: PresentationTheme) => {
    onThemeSelect(theme);
    // setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Theme
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Choose Presentation Theme
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {PRESENTATION_THEMES.map((theme) => (
            <div
              key={theme.id}
              className={`relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-md ${
                currentTheme.id === theme.id
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleThemeSelect(theme)}
            >
              {/* Theme Preview */}
              <div className="p-4 space-y-3">
                {/* Color Palette Preview */}
                <div className="flex space-x-1">
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title="Secondary"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: theme.colors.background }}
                    title="Background"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: theme.colors.text }}
                    title="Text"
                  />
                </div>

                {/* Theme Name */}
                <div className="text-center">
                  <h3
                    className="font-medium text-sm"
                    style={{ color: theme.colors.text }}
                  >
                    {theme.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {theme.fonts.heading}
                  </p>
                </div>

                {/* Sample Content Preview */}
                <div
                  className="text-xs p-2 rounded border"
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    fontFamily: theme.fonts.body,
                  }}
                >
                  <div
                    className="font-semibold mb-1"
                    style={{
                      color: theme.colors.primary,
                      fontFamily: theme.fonts.heading,
                    }}
                  >
                    Sample Title
                  </div>
                  <div>Sample content text</div>
                </div>
              </div>

              {/* Selected Indicator */}
              {currentTheme.id === theme.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Theme Details */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">
            Current Theme: {currentTheme.name}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Primary:</span>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                />
                <span>{currentTheme.colors.primary}</span>
              </div>
            </div>
            <div>
              <span className="font-medium">Secondary:</span>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: currentTheme.colors.secondary }}
                />
                <span>{currentTheme.colors.secondary}</span>
              </div>
            </div>
            <div>
              <span className="font-medium">Heading Font:</span>
              <span className="ml-2">{currentTheme.fonts.heading}</span>
            </div>
            <div>
              <span className="font-medium">Body Font:</span>
              <span className="ml-2">{currentTheme.fonts.body}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
