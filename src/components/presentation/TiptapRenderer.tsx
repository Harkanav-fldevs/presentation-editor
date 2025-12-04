"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
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
import { PresentationTheme } from "@/lib/presentation-types";
import { getContrastTextColor } from "@/lib/theme-contrast-utils";
import { renderContentToHTML, isHTML } from "@/lib/content-renderer";

interface TiptapRendererProps {
  content: string;
  theme?: PresentationTheme;
  className?: string;
}

/**
 * Converts markdown to HTML for TipTap
 */
const markdownToHTML = (markdown: string): string => {
  return renderContentToHTML(markdown);
};

export function TiptapRenderer({
  content,
  theme,
  className,
}: TiptapRendererProps) {
  const [isMounted, setIsMounted] = useState(false);
  // Process content initially - do this outside useEffect to avoid hydration issues
  const initialContent = isHTML(content) ? content : markdownToHTML(content);
  const [processedContent, setProcessedContent] = useState(initialContent);

  useEffect(() => {
    setIsMounted(true);

    // Update processed content when content changes
    if (!isHTML(content)) {
      setProcessedContent(markdownToHTML(content));
    } else {
      setProcessedContent(content);
    }
  }, [content]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
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
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Superscript,
      Subscript,
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: processedContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
        contenteditable: "false", // Make it read-only
      },
    },
    editable: false, // Make the editor read-only
    immediatelyRender: false, // Fix for SSR hydration mismatch
  });

  // Update editor content when it changes
  useEffect(() => {
    if (editor && processedContent) {
      editor.commands.setContent(processedContent);
    }
  }, [editor, processedContent]);

  // Server-side rendering or loading state
  if (!isMounted || !editor) {
    // Return a placeholder with the same structure to avoid hydration issues
    return (
      <div
        className={`${className}`}
        style={{
          fontFamily: theme?.fonts.body || "inherit",
          color: theme ? getContrastTextColor(theme) : "inherit",
        }}
      >
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto p-4">
          {/* Simple HTML version of the content for SSR */}
          {isHTML(content) ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: markdownToHTML(content) }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${className}`}
      style={{
        fontFamily: theme?.fonts.body || "inherit",
        color: theme ? getContrastTextColor(theme) : "inherit",
      }}
    >
      <EditorContent editor={editor} />
    </div>
  );
}

/**
 * Export version of TipTap renderer that returns HTML string
 * This is used for export functionality
 */
export function renderTiptapContent(content: string): string {
  // Process content - convert markdown to HTML if needed
  return renderContentToHTML(content);
}
