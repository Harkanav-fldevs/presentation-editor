"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePresentationStore } from "@/stores/presentation-store";
import { SlideEditor } from "./SlideEditor";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { Slide } from "@/lib/presentation-types";

export function SlideManager() {
  const { slides, currentSlide, setCurrentSlide, deleteSlide, addSlide } =
    usePresentationStore();
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);

  const handleAddSlide = () => {
    const newSlide: Omit<Slide, "id" | "order"> = {
      title: "New Slide",
      content: "<p>Enter your content here...</p>",
      type: "content",
      layout: "centered",
      overflowDetected: false,
      splitSlides: [],
    };
    addSlide(newSlide);
  };

  const handleDeleteSlide = (slideId: string) => {
    if (confirm("Are you sure you want to delete this slide?")) {
      deleteSlide(slideId);
    }
  };

  const getSlideTypeIcon = (type: string) => {
    switch (type) {
      case "title":
        return "📄";
      case "content":
        return "📝";
      case "list":
        return "📋";
      case "quote":
        return "💬";
      case "image":
        return "🖼️";
      case "chart":
        return "📊";
      case "conclusion":
        return "🏁";
      default:
        return "📄";
    }
  };

  const getLayoutBadge = (layout: string) => {
    const colors = {
      centered: "bg-blue-100 text-blue-800",
      "two-column": "bg-green-100 text-green-800",
      "full-width": "bg-purple-100 text-purple-800",
      "image-left": "bg-orange-100 text-orange-800",
      "image-right": "bg-pink-100 text-pink-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[layout as keyof typeof colors] || colors.centered
        }`}
      >
        {layout ? layout.replace("-", " ") : "centered"}
      </span>
    );
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden max-h-screen">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Slides</h2>
          <Button onClick={handleAddSlide} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Slide
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          {slides.length} slide{slides.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {slides.map((slide, index) => (
          <Card
            key={slide.id}
            className={`cursor-pointer transition-all ${
              currentSlide === index
                ? "ring-2 ring-blue-500 bg-blue-50"
                : "hover:shadow-md"
            }`}
            onClick={() => setCurrentSlide(index)}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {getSlideTypeIcon(slide.type)}
                    </span>
                    <span className="text-sm font-medium truncate">
                      {slide.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {getLayoutBadge(slide.layout || "centered")}
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>

                  <div
                    className="text-xs text-gray-600 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html:
                        slide.content
                          .replace(/<[^>]*>/g, "")
                          .substring(0, 100) + "...",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSlide(slide);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSlide(slide.id);
                    }}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {slides.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📄</div>
            <p>No slides yet</p>
            <p className="text-sm">
              Click &quot;Add Slide&quot; to get started
            </p>
          </div>
        )}
      </div>

      {/* Slide Editor Modal */}
      {editingSlide && (
        <SlideEditor
          slide={editingSlide}
          onClose={() => setEditingSlide(null)}
        />
      )}
    </div>
  );
}
