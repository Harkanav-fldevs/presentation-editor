"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Undo,
  Redo,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { renderContentToHTML, isHTML } from "@/lib/content-renderer";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder,
  className,
  editable = true,
}: TiptapEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const editorRef = useRef<HTMLDivElement>(null);

  // Process content - convert markdown to HTML if needed
  const processedContent = isHTML(content)
    ? content
    : renderContentToHTML(content);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start typing...",
      }),
      Underline,
      Strike,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Color,
      TextStyle,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Superscript,
      Subscript,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: processedContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const isEmpty = from === to;

      if (isEmpty) {
        setShowToolbar(false);
        return;
      }

      // Get selection coordinates
      const { top, left } = editor.view.coordsAtPos(from);
      const editorElement = editorRef.current;

      if (editorElement) {
        const editorRect = editorElement.getBoundingClientRect();
        setToolbarPosition({
          top: top - editorRect.top - 60, // Position above selection
          left: Math.max(
            10,
            Math.min(left - editorRect.left - 100, editorRect.width - 200)
          ), // Keep within bounds
        });
        setShowToolbar(true);
      }
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-editor-content focus:outline-none min-h-[200px] p-4 bg-transparent",
        contenteditable: editable ? "true" : "false",
      },
    },
    editable: editable,
    immediatelyRender: false,
  });

  // Update editor content when content changes
  useEffect(() => {
    if (editor && processedContent !== editor.getHTML()) {
      editor.commands.setContent(processedContent);
    }
  }, [processedContent, editor]);

  if (!isMounted) {
    return (
      <div className={`rounded-lg ${className}`}>
        <div className="p-4 min-h-[200px] flex items-center justify-center text-gray-500">
          Loading editor...
        </div>
      </div>
    );
  }

  if (!editor) {
    return null;
  }

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

  const fontSizes = [
    { value: "8px", label: "8px" },
    { value: "10px", label: "10px" },
    { value: "12px", label: "12px" },
    { value: "14px", label: "14px" },
    { value: "16px", label: "16px" },
    { value: "18px", label: "18px" },
    { value: "20px", label: "20px" },
    { value: "24px", label: "24px" },
    { value: "28px", label: "28px" },
    { value: "32px", label: "32px" },
    { value: "36px", label: "36px" },
    { value: "48px", label: "48px" },
    { value: "64px", label: "64px" },
  ];

  const lineHeights = [
    { value: "1", label: "1.0" },
    { value: "1.1", label: "1.1" },
    { value: "1.2", label: "1.2" },
    { value: "1.3", label: "1.3" },
    { value: "1.4", label: "1.4" },
    { value: "1.5", label: "1.5" },
    { value: "1.6", label: "1.6" },
    { value: "1.7", label: "1.7" },
    { value: "1.8", label: "1.8" },
    { value: "2", label: "2.0" },
  ];

  const letterSpacings = [
    { value: "-0.05em", label: "Tight" },
    { value: "0", label: "Normal" },
    { value: "0.025em", label: "Wide" },
    { value: "0.05em", label: "Wider" },
    { value: "0.1em", label: "Widest" },
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
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className={`relative ${className}`} ref={editorRef}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .tiptap-editor-content {
            font-size: 0.875rem !important;
            line-height: 1.6 !important;
            font-family: inherit !important;
          }
          .tiptap-editor-content h1, .tiptap-editor-content h2, .tiptap-editor-content h3, .tiptap-editor-content h4, .tiptap-editor-content h5, .tiptap-editor-content h6 {
            font-weight: bold;
            margin: 0.5em 0;
          }
          .tiptap-editor-content h1 { font-size: 1.5em; }
          .tiptap-editor-content h2 { font-size: 1.25em; }
          .tiptap-editor-content h3 { font-size: 1.125em; }
          .tiptap-editor-content p {
            margin: 0.5em 0;
          }
          .tiptap-editor-content ul, .tiptap-editor-content ol {
            margin: 0.5em 0;
            padding-left: 1.5em;
          }
          .tiptap-editor-content li {
            margin: 0.25em 0;
          }
          .tiptap-editor-content strong {
            font-weight: bold;
          }
          .tiptap-editor-content em {
            font-style: italic;
          }
        `,
        }}
      />
      {/* Contextual Floating Toolbar - Only shows when text is selected and editable */}
      {showToolbar && editable && (
        <div
          className="absolute z-50 bg-gray-900 text-white rounded-lg shadow-lg p-2 flex items-center gap-1"
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
          }}
        >
          {/* Undo/Redo controls */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700 h-8 w-8 p-0"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700 h-8 w-8 p-0"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-600 mx-1" />

          {/* Essential formatting tools */}
          <Button
            variant={editor.isActive("bold") ? "default" : "ghost"}
            size="sm"
            className="text-white hover:bg-gray-700 h-8 w-8 p-0"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            variant={editor.isActive("italic") ? "default" : "ghost"}
            size="sm"
            className="text-white hover:bg-gray-700 h-8 w-8 p-0"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            variant={editor.isActive("underline") ? "default" : "ghost"}
            size="sm"
            className="text-white hover:bg-gray-700 h-8 w-8 p-0"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-600 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700 h-8 w-8 p-0"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <Palette className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700 h-8 w-8 p-0"
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
          >
            <Highlighter className="h-4 w-4" />
          </Button>

          {/* Color picker dropdown */}
          {showColorPicker && (
            <div className="absolute top-10 left-0 bg-white border rounded-lg shadow-lg p-2 z-10">
              <div className="grid grid-cols-6 gap-1 w-48">
                {colors.slice(0, 12).map((color) => (
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

          {/* Highlight picker dropdown */}
          {showHighlightPicker && (
            <div className="absolute top-10 left-0 bg-white border rounded-lg shadow-lg p-2 z-10">
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
                      editor.chain().focus().setHighlight({ color }).run();
                      setShowHighlightPicker(false);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
