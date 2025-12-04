"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
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
import { useEffect, useState } from "react";
import { renderContentToHTML, isHTML } from "@/lib/content-renderer";

interface TiptapEditorNoToolbarProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  onEditorReady?: (editor: Editor) => void;
}

export function TiptapEditorNoToolbar({
  content,
  onChange,
  placeholder,
  className,
  onEditorReady,
}: TiptapEditorNoToolbarProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Process content like TiptapRenderer does - compute directly to avoid state loops
  const processedContent = isHTML(content)
    ? content
    : renderContentToHTML(content);

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
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Superscript,
      Subscript,
      Table.configure({
        resizable: false, // Disable resizing in read-only mode
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: processedContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && processedContent !== editor.getHTML()) {
      editor.commands.setContent(processedContent);
    }
  }, [content, editor]);

  if (!isMounted) {
    return (
      <div className={`border rounded-lg ${className}`}>
        <div className="p-4 min-h-[200px] flex items-center justify-center text-gray-500">
          Loading editor...
        </div>
      </div>
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* Editor Content Only - No Toolbar */}
      <EditorContent editor={editor} />
    </div>
  );
}
