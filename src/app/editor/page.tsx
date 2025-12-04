"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePresentationStore } from "@/stores/presentation-store";
import { SlideManager } from "@/components/editor/SlideManager";
import { EditableSlide } from "@/components/editor/EditableSlide";
import { ThemeSelector } from "@/components/editor/ThemeSelector";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Eye } from "lucide-react";

export default function EditorPage() {
  const {
    presentation,
    slides,
    currentSlide,
    setCurrentSlide,
    theme,
    setTheme,
  } = usePresentationStore();
  const router = useRouter();

  useEffect(() => {
    if (!presentation || !slides || slides.length === 0) {
      router.push("/");
    }
  }, [presentation, slides, router]);

  if (!presentation || !slides || slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Presentation Found</h2>
          <p className="text-gray-600 mb-4">
            Please generate a presentation first.
          </p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const currentSlideData = slides?.[currentSlide];

  const handleExport = async (format: "pdf" | "html") => {
    try {
      const response = await fetch("/api/presentations/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          presentation,
          format,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${presentation.title}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Slide Manager Sidebar */}
      <SlideManager />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {presentation.title}
              </h1>
              <p className="text-sm text-gray-600">
                Slide {currentSlide + 1} of {slides?.length || 0}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {/* Theme Selector */}
              <ThemeSelector currentTheme={theme} onThemeSelect={setTheme} />

              <Button variant="outline" onClick={() => router.push("/preview")}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>

              <Button variant="outline" onClick={() => handleExport("html")}>
                <Download className="h-4 w-4 mr-2" />
                Export HTML
              </Button>

              <Button variant="outline" onClick={() => handleExport("pdf")}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Slide Navigation */}
        {/* <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {slides?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide
                      ? "bg-blue-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              )) || []}
            </div>

            <Button
              variant="outline"
              onClick={() =>
                setCurrentSlide(
                  Math.min((slides?.length || 1) - 1, currentSlide + 1)
                )
              }
              disabled={currentSlide === (slides?.length || 1) - 1}
            >
              Next
            </Button>
          </div>
        </div> */}

        {/* Slide Editor Area - Full Height */}
        <div className="flex-1">
          {currentSlideData && (
            <EditableSlide slide={currentSlideData} isActive={true} />
          )}
        </div>

        {/* Slide Thumbnails */}
        {/* <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-4 overflow-x-auto">
            {slides?.map((slide, index) => (
              <div
                key={slide.id}
                className="flex-shrink-0 w-32 cursor-pointer"
                onClick={() => setCurrentSlide(index)}
              >
                <SlidePreview slide={slide} isActive={index === currentSlide} />
              </div>
            )) || []}
          </div>
        </div> */}
      </div>
    </div>
  );
}
