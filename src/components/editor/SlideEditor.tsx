"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TiptapEditor } from "./TiptapEditor";
import { LayoutSelector } from "./LayoutSelector";
import { usePresentationStore } from "@/stores/presentation-store";
import { Trash2, Save } from "lucide-react";
import type { Slide, SlideType, SlideLayout } from "@/lib/presentation-types";

interface SlideEditorProps {
  slide: Slide;
  onClose: () => void;
}

export function SlideEditor({ slide, onClose }: SlideEditorProps) {
  const { updateSlide, deleteSlide } = usePresentationStore();
  const [title, setTitle] = useState(slide.title);
  const [content, setContent] = useState(slide.content);
  const [type, setType] = useState<SlideType>(slide.type);
  const [layout, setLayout] = useState<SlideLayout>(slide.layout);

  const handleSave = () => {
    updateSlide(slide.id, {
      title,
      content,
      type,
      layout,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this slide?")) {
      deleteSlide(slide.id);
      onClose();
    }
  };

  const slideTypes: { value: SlideType; label: string }[] = [
    { value: "title", label: "Title Slide" },
    { value: "content", label: "Content" },
    { value: "list", label: "List" },
    { value: "quote", label: "Quote" },
    { value: "image", label: "Image" },
    { value: "chart", label: "Chart" },
    { value: "conclusion", label: "Conclusion" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Edit Slide: {slide.title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Slide Properties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Slide Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter slide title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Slide Type
              </label>
              <Select
                value={type}
                onValueChange={(value: SlideType) => setType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {slideTypes.map((slideType) => (
                    <SelectItem key={slideType.value} value={slideType.value}>
                      {slideType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Layout</label>
              <LayoutSelector
                value={layout}
                onValueChange={(value: SlideLayout) => setLayout(value)}
              />
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Slide Content
            </label>
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Enter your slide content..."
              className="min-h-[300px]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Slide
            </Button>

            <div className="text-sm text-gray-500">
              Slide {slide.order} of{" "}
              {usePresentationStore.getState().slides.length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


