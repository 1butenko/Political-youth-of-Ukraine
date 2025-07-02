import React, { useRef, useCallback, useMemo } from "react";
import { useEditor, EditorContent as TiptapEditorContent, Editor } from "@tiptap/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeading } from '@fortawesome/free-solid-svg-icons';
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Image } from "@tiptap/extension-image";
import { slugify } from "transliteration";
import "./editor.css";
import { Markdown } from "tiptap-markdown";

const extensions = [StarterKit, Image, Underline, Markdown];

const initialContent = "# Hello **World**";

interface User {
  fname: string;
  sname: string;
  bio: string;
}

interface EditorProps {
  userData: User;
}

const Toolbar = React.memo(({ editor }: { editor: Editor | null }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertImage = useCallback((url: string) => {
    if (!editor) return;

    const doc = editor.state.doc;
    let insertPos = 0;

    doc.descendants((node, pos) => {
      if (node.isBlock) {
        insertPos = pos + node.nodeSize;
        return false;
      }
      return true;
    });

    editor.chain().focus().insertContentAt(insertPos, {
      type: "image",
      attrs: { src: url },
    }).run();
  }, [editor]);

  const onUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        insertImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [insertImage]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 mb-4 bg-light-ash rounded-2xl">
      {[
        { label: `${<FontAwesomeIcon icon={faHeading} />}`, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
        { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
        { label: "P", action: () => editor.chain().focus().setParagraph().run() },
        { label: "B", action: () => editor.chain().focus().toggleBold().run() },
        { label: "I", action: () => editor.chain().focus().toggleItalic().run() },
        { label: "U", action: () => editor.chain().focus().toggleUnderline().run() },
      ].map(({ label, action }) => (
        <button key={label} onClick={action} className="px-2 py-1 font-semibold">
          {label}
        </button>
      ))}

      <button onClick={() => fileInputRef.current?.click()} className="px-2 py-1 font-semibold">
        IMG
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
    </div>
  );
});

const EditorContent = ({ editor, userData }: { editor: Editor | null; userData: User }) => {
  const handleSave = useCallback(async () => {
    if (!editor) return;

    const markdownExtension = await import("tiptap-markdown");
    const markdown = editor?.storage.markdown?.getMarkdown?.();
    const json = editor.getJSON();

    const firstNode = json.content?.[0];
    const title = firstNode?.content?.map((c: any) => c.text).join("")?.trim() || "Untitled";

    const payload = {
      title,
      slug: slugify(title),
      markdown,
      publisher: `${userData.fname} ${userData.sname}`,
      publishDate: Date.now(),
    };

    const res = await fetch("/api/save/article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Save failed.");
    } else {
      alert("Saved.");
    }
  }, [editor, userData]);

  return (
    <div className="space-y-4">
      <Toolbar editor={editor} />
      <div className="editor-content" role="textbox">
        <TiptapEditorContent editor={editor} />
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save
      </button>
    </div>
  );
};

const MarkdownEditor: React.FC<EditorProps> = ({ userData }) => {
  const editor = useEditor({ extensions, content: initialContent });

  return <EditorContent editor={editor} userData={userData} />;
};

export default MarkdownEditor;