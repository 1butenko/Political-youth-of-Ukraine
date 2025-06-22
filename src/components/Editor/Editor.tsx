import React from "react";
import "./editor.css";
import { useEditor, EditorContent as TiptapEditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { slugify } from "transliteration";

interface User {
  fname: string;
  sname: string;
  bio: string;
}

interface EditorProps {
  userData: User;
}

const extensions = [StarterKit, Markdown];
const initialContent = "# Hello **World**";

const Toolbar: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 p-2 mb-4 bg-light-ash rounded-2xl">
      {/* <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded ${
          editor.isActive("bold") ? "bg-black text-white" : "bg-gray-200"
        }`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1 rounded ${
          editor.isActive("italic") ? "bg-black text-white" : "bg-gray-200"
        }`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-1 rounded ${
          editor.isActive("bulletList") ? "bg-black text-white" : "bg-gray-200"
        }`}
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`px-3 py-1 rounded ${
          editor.isActive("paragraph") ? "bg-black text-white" : "bg-gray-200"
        }`}
      >
        Paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-1 rounded ${
          editor.isActive("heading", { level: 1 })
            ? "bg-black text-white"
            : "bg-gray-200"
        }`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-3 py-1 rounded ${
          editor.isActive("codeBlock") ? "bg-black text-white" : "bg-gray-200"
        }`}
      >
        Code
      </button>
      <button
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
        className="px-3 py-1 rounded bg-red-200 hover:bg-red-300"
      >
        Clear
      </button> */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="flex items-center gap-1"
      >
        Розмір
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="w-4 h-4"
          fill="currentColor"
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
        </svg>
      </button>
    </div>
  );
};

const EditorContent: React.FC<{ editor: any; userData: User }> = ({
  editor,
  userData,
}) => {
  const handleGetMarkdown = async () => {
    if (!editor) return;

    const md = editor.storage.markdown.getMarkdown();
    const json = editor.getJSON();

    const firstNode = json.content?.[0];
    let title = "Untitled";

    if (
      firstNode &&
      (firstNode.type === "heading" || firstNode.type === "paragraph")
    ) {
      title =
        firstNode.content
          ?.map((c: any) => c.text)
          .join("")
          ?.trim() || "Untitled";
    }

    const payload = {
      title,
      slug: slugify(title),
      markdown: md,
      publisher: `${userData.fname} ${userData.sname}`,
      publishDate: Date.now(),
    };

    const res = await fetch("api/save/article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Server error:", err);
    }

    alert("Saved!");
  };

  return (
    <div className="space-y-4">
      <Toolbar editor={editor} />

      <div className="editor-content">
        <TiptapEditorContent editor={editor} />
      </div>

      <button
        onClick={handleGetMarkdown}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get Markdown
      </button>
    </div>
  );
};

const MarkdownEditor: React.FC<EditorProps> = ({ userData }) => {
  const editor = useEditor({
    extensions,
    content: initialContent,
  });

  return <EditorContent editor={editor} userData={userData} />;
};

export default MarkdownEditor;
