"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TiptapEditorNoToolbar } from "./TiptapEditorNoToolbar";
import { TemplateRenderer } from "@/components/presentation/TemplateRenderer";
import { TemplateDialog } from "./TemplateDialog";
import { LayoutSelector } from "./LayoutSelector";
import { usePresentationStore } from "@/stores/presentation-store";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  Palette,
  Type,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Highlighter,
} from "lucide-react";
import type { Slide, SlideType, SlideLayout } from "@/lib/presentation-types";

interface EditableSlideProps {
  slide: Slide;
  isActive?: boolean;
}

export function EditableSlide({ slide, isActive }: EditableSlideProps) {
  const { updateSlide, updateSlideTemplate, revertSlideTemplate, theme } =
    usePresentationStore();
  const [title, setTitle] = useState(slide.title);
  const [content, setContent] = useState(slide.content);
  const [type, setType] = useState<SlideType>(slide.type);
  const [layout, setLayout] = useState<SlideLayout>(slide.layout);
  const [editor, setEditor] = useState<any>(null);
  const [currentFontSize, setCurrentFontSize] = useState<string>("default");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  // Sync local state with slide prop changes
  useEffect(() => {
    setTitle(slide.title);
    setContent(slide.content);
    setType(slide.type);
    setLayout(slide.layout);
  }, [slide.id]); // Only depend on slide.id to reset when slide changes

  // Auto-save when content changes
  const handleContentChange = (html: string) => {
    // Extract title and content from the HTML
    const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
    const extractedTitle = titleMatch ? titleMatch[1] : title;
    const extractedContent = html.replace(/<h1[^>]*>.*?<\/h1>/, "").trim();

    setTitle(extractedTitle);
    setContent(extractedContent);

    // Auto-save the changes
    updateSlide(slide.id, {
      title: extractedTitle,
      content: extractedContent,
      type,
      layout,
    });
  };

  // Auto-save when type or layout changes
  useEffect(() => {
    updateSlide(slide.id, {
      title,
      content,
      type,
      layout,
    });
  }, [type, layout, slide.id, title, content, updateSlide]);

  // Update font size state when editor selection changes
  useEffect(() => {
    if (editor) {
      const updateFontSize = () => {
        const fontSize = editor.getAttributes("textStyle").fontSize;
        setCurrentFontSize(fontSize || "default");
      };

      editor.on("selectionUpdate", updateFontSize);
      editor.on("transaction", updateFontSize);

      // Initial update
      updateFontSize();

      return () => {
        editor.off("selectionUpdate", updateFontSize);
        editor.off("transaction", updateFontSize);
      };
    }
  }, [editor]);

  const getSlideStyles = () => {
    const baseStyles = {
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
    };

    switch (layout) {
      case "centered":
        return {
          ...baseStyles,
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center" as const,
        };
      case "two-column":
        return {
          ...baseStyles,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          alignItems: "start",
        };
      case "full-width":
        return {
          ...baseStyles,
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "center",
        };
      case "image-left":
        return {
          ...baseStyles,
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "2rem",
          alignItems: "center",
        };
      case "image-right":
        return {
          ...baseStyles,
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          alignItems: "center",
        };
      default:
        return baseStyles;
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

  const fontFamilies = [
    { value: "Inter", label: "Inter" },
    { value: "Arial", label: "Arial" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Georgia", label: "Georgia" },
    { value: "Verdana", label: "Verdana" },
    { value: "Courier New", label: "Courier New" },
    { value: "Comic Sans MS", label: "Comic Sans MS" },
  ];

  const colors = [
    "#000000",
    "#333333",
    "#666666",
    "#999999",
    "#CCCCCC",
    "#FFFFFF",
    "#FF0000",
    "#FF6600",
    "#FFCC00",
    "#00FF00",
    "#0066FF",
    "#6600FF",
    "#FF0066",
    "#FF3366",
    "#FF6699",
    "#FF99CC",
    "#FFCCFF",
    "#CC99FF",
    "#9966FF",
    "#6633FF",
    "#3300FF",
    "#0066CC",
    "#0099FF",
    "#00CCFF",
  ];

  const insertTable = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    }
  };

  const addLink = () => {
    if (editor) {
      const url = window.prompt("Enter URL:");
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar - Like Keynote/PowerPoint */}
      <div className="bg-white border-b border-gray-200 px-4 divide-y">
        {/* Top Row - Slide Properties and Actions */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            {/* Slide Properties */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Type:</span>
              <Select
                value={type}
                onValueChange={(value: SlideType) => setType(value)}
              >
                <SelectTrigger className="w-32 h-8">
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

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Layout:</span>
              <LayoutSelector
                value={layout}
                onValueChange={(value: SlideLayout) => setLayout(value)}
                triggerClassName="w-32 h-8"
              />
            </div>

            {/* Template Dialog */}
            <TemplateDialog
              currentTemplate={slide.template}
              onTemplateSelect={(template) =>
                updateSlideTemplate(slide.id, template)
              }
              onRevert={() => revertSlideTemplate(slide.id)}
              slideId={slide.id}
            />
          </div>
        </div>

        {/* Bottom Row - Formatting Tools */}
        <div className="flex items-center py-4 gap-2">
          {editor && (
            <>
              {/* Text Formatting */}
              <div className="flex items-center gap-1">
                <Button
                  variant={editor.isActive("bold") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <Bold className="h-4 w-4" />
                </Button>

                <Button
                  variant={editor.isActive("italic") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <Italic className="h-4 w-4" />
                </Button>

                <Button
                  variant={editor.isActive("underline") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant={editor.isActive("strike") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                  <Strikethrough className="h-4 w-4" />
                </Button>

                <Button
                  variant={editor.isActive("superscript") ? "default" : "ghost"}
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().toggleSuperscript().run()
                  }
                >
                  <SuperscriptIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant={editor.isActive("subscript") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleSubscript().run()}
                >
                  <SubscriptIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Font Family */}
              <div className="flex items-center">
                <Select
                  value={
                    editor.getAttributes("textStyle").fontFamily || "Inter"
                  }
                  onValueChange={(value) => {
                    if (value === "Inter") {
                      editor.chain().focus().unsetFontFamily().run();
                    } else {
                      editor.chain().focus().setFontFamily(value).run();
                    }
                  }}
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue placeholder="Font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>
                          {font.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size Dropdown */}
              <div className="flex items-center">
                <Select
                  value={currentFontSize}
                  onValueChange={(value) => {
                    if (value === "default") {
                      editor.chain().focus().unsetMark("textStyle").run();
                    } else {
                      editor
                        .chain()
                        .focus()
                        .setMark("textStyle", { fontSize: value })
                        .run();
                    }
                    setCurrentFontSize(value);
                  }}
                >
                  <SelectTrigger className="w-20 h-8 text-xs">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="8px">8px</SelectItem>
                    <SelectItem value="9px">9px</SelectItem>
                    <SelectItem value="10px">10px</SelectItem>
                    <SelectItem value="11px">11px</SelectItem>
                    <SelectItem value="12px">12px</SelectItem>
                    <SelectItem value="14px">14px</SelectItem>
                    <SelectItem value="16px">16px</SelectItem>
                    <SelectItem value="18px">18px</SelectItem>
                    <SelectItem value="20px">20px</SelectItem>
                    <SelectItem value="22px">22px</SelectItem>
                    <SelectItem value="24px">24px</SelectItem>
                    <SelectItem value="26px">26px</SelectItem>
                    <SelectItem value="28px">28px</SelectItem>
                    <SelectItem value="30px">30px</SelectItem>
                    <SelectItem value="32px">32px</SelectItem>
                    <SelectItem value="36px">36px</SelectItem>
                    <SelectItem value="40px">40px</SelectItem>
                    <SelectItem value="44px">44px</SelectItem>
                    <SelectItem value="48px">48px</SelectItem>
                    <SelectItem value="54px">54px</SelectItem>
                    <SelectItem value="60px">60px</SelectItem>
                    <SelectItem value="66px">66px</SelectItem>
                    <SelectItem value="72px">72px</SelectItem>
                    <SelectItem value="80px">80px</SelectItem>
                    <SelectItem value="88px">88px</SelectItem>
                    <SelectItem value="96px">96px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Text Color */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <Palette className="h-4 w-4" />
                </Button>
                {showColorPicker && (
                  <div className="absolute top-8 left-0 bg-white border rounded-lg shadow-lg p-2 z-10">
                    <div className="grid grid-cols-6 gap-1 w-48">
                      {colors.map((color) => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            editor.chain().focus().setColor(color).run();
                            setShowColorPicker(false);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Highlight Color */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                >
                  <Highlighter className="h-4 w-4" />
                </Button>
                {showHighlightPicker && (
                  <div className="absolute top-8 left-0 bg-white border rounded-lg shadow-lg p-2 z-10">
                    <div className="grid grid-cols-6 gap-1 w-48">
                      <button
                        className="w-6 h-6 rounded border"
                        onClick={() => {
                          editor.chain().focus().unsetHighlight().run();
                          setShowHighlightPicker(false);
                        }}
                      >
                        ×
                      </button>
                      {colors.slice(0, 11).map((color) => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            editor
                              .chain()
                              .focus()
                              .setHighlight({ color })
                              .run();
                            setShowHighlightPicker(false);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Lists */}
              <Button
                variant={editor.isActive("bulletList") ? "default" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <List className="h-4 w-4" />
              </Button>

              <Button
                variant={editor.isActive("orderedList") ? "default" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-gray-300" />

              {/* Alignment */}
              <Button
                variant={
                  editor.isActive({ textAlign: "left" }) ? "default" : "ghost"
                }
                size="sm"
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
              >
                <AlignLeft className="h-4 w-4" />
              </Button>

              <Button
                variant={
                  editor.isActive({ textAlign: "center" }) ? "default" : "ghost"
                }
                size="sm"
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
              >
                <AlignCenter className="h-4 w-4" />
              </Button>

              <Button
                variant={
                  editor.isActive({ textAlign: "right" }) ? "default" : "ghost"
                }
                size="sm"
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
              >
                <AlignRight className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-gray-300" />

              {/* Media and Links */}
              <Button variant="ghost" size="sm" onClick={addLink}>
                <LinkIcon className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const url = window.prompt("Enter image URL:");
                  if (url) {
                    editor.chain().focus().setImage({ src: url }).run();
                  }
                }}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={insertTable}>
                <TableIcon className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Slide Canvas - Like Keynote/PowerPoint */}
      <div className="flex-1 p-8 flex items-center justify-center bg-gray-100">
        <div
          className="w-full max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden"
          style={{
            aspectRatio: "16/9",
            maxHeight: "80vh",
            height: "80vh",
            ...getSlideStyles(),
          }}
        >
          <div className="w-full h-full flex flex-col">
            {/* Use TemplateRenderer for slides with templates, otherwise use TiptapEditor */}
            {slide.template && slide.templateData ? (
              <TemplateRenderer slide={slide} theme={theme} />
            ) : (
              <TiptapEditorNoToolbar
                content={`<h1 style="color: ${theme.colors.primary}; font-family: ${theme.fonts.heading}; font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">${title}</h1>${content}`}
                onChange={handleContentChange}
                onEditorReady={setEditor}
                placeholder="Click here to start editing your slide..."
                className="h-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
