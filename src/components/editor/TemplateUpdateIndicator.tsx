"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, RotateCcw, Eye, X } from "lucide-react";

interface TemplateUpdateIndicatorProps {
  isVisible: boolean;
  onClose: () => void;
  onRevert?: () => void;
  onPreview?: () => void;
  templateName: string;
  changesCount?: number;
}

export function TemplateUpdateIndicator({
  isVisible,
  onClose,
  onRevert,
  onPreview,
  templateName,
  changesCount = 0,
}: TemplateUpdateIndicatorProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isAnimating ? "animate-in slide-in-from-right-5" : ""
      }`}
    >
      <Card className="w-80 shadow-lg border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  Template Updated
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                Slide layout has been updated to <strong>{templateName}</strong>{" "}
                template.
                {changesCount > 0 && (
                  <span className="block text-xs text-blue-600 mt-1">
                    {changesCount} content sections were restructured
                  </span>
                )}
              </p>

              <div className="flex gap-2">
                {onPreview && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPreview}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </Button>
                )}

                {onRevert && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRevert}
                    className="flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Revert
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for managing template update notifications
export function useTemplateUpdateNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [changesCount, setChangesCount] = useState(0);

  const showNotification = (template: string, changes: number = 0) => {
    setTemplateName(template);
    setChangesCount(changes);
    setIsVisible(true);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  const hideNotification = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    templateName,
    changesCount,
    showNotification,
    hideNotification,
  };
}
