"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
interface TipTapEditorProps {
content: string;
onChange: (html: string) => void;
}
const btnStyle = (active: boolean): React.CSSProperties => ({
background: active ? "#e8ff47" : "var(--surface2)",
color: active ? "var(--bg)" : "var(--text)",
border: "1px solid var(--border-custom)",
padding: "6px 12px",
fontFamily: "var(--font-sans)",
fontSize: "0.72rem",
cursor: "pointer",
transition: "all 0.15s",
fontWeight: active ? 600 : 400,
});
export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
const editor = useEditor({
extensions: [
StarterKit.configure({
heading: { levels: [1, 2, 3] },
}),
Link.configure({ openOnClick: false }),
Image.configure({ inline: false }),
Placeholder.configure({ placeholder: "Start writing your post..." }),
],
content,
onUpdate: ({ editor }) => {
onChange(editor.getHTML());
},
editorProps: {
attributes: {
class: "focus:outline-none",
},
},
});
useEffect(() => {
if (editor && content && editor.getHTML() !== content) {
editor.commands.setContent(content);
}
}, [content, editor]);
if (!editor) return null;
const addImage = () => {
const url = window.prompt("Image URL");
if (url) editor.chain().focus().setImage({ src: url }).run();
};
const addLink = () => {
const url = window.prompt("Link URL");
if (url) editor.chain().focus().setLink({ href: url }).run();
};
return (
<div className="tiptap-editor" style={{ border: "1px solid var(--border-custom)", background: "var(--surface)" }}>
{/* Toolbar */}
<div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "10px 12px", borderBottom: "1px solid var(--border-custom)", background: "var(--surface2)" }}>
<button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} style={btnStyle(editor.isActive("heading", { level: 1 }))}>H1</button>
<button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btnStyle(editor.isActive("heading", { level: 2 }))}>H2</button>
<button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={btnStyle(editor.isActive("heading", { level: 3 }))}>H3</button>
<div style={{ width: 1, background: "var(--border-custom)", margin: "0 4px" }} />
<button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={btnStyle(editor.isActive("bold"))}>B</button>
<button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={btnStyle(editor.isActive("italic"))}>I</button>
<button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} style={btnStyle(editor.isActive("strike"))}>S</button>
<button type="button" onClick={() => editor.chain().focus().toggleCode().run()} style={btnStyle(editor.isActive("code"))}>&lt;/&gt;</button>
<div style={{ width: 1, background: "var(--border-custom)", margin: "0 4px" }} />
<button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={btnStyle(editor.isActive("bulletList"))}>• List</button>
<button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btnStyle(editor.isActive("orderedList"))}>1. List</button>
<button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btnStyle(editor.isActive("blockquote"))}>“ Quote</button>
<button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} style={btnStyle(editor.isActive("codeBlock"))}>Code Block</button>
<div style={{ width: 1, background: "var(--border-custom)", margin: "0 4px" }} />
<button type="button" onClick={addLink} style={btnStyle(editor.isActive("link"))}>🔗 Link</button>
<button type="button" onClick={addImage} style={btnStyle(false)}>🖼 Image</button>
<div style={{ width: 1, background: "var(--border-custom)", margin: "0 4px" }} />
<button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} style={btnStyle(false)}>— HR</button>
<button type="button" onClick={() => editor.chain().focus().undo().run()} style={btnStyle(false)}>↩ Undo</button>
<button type="button" onClick={() => editor.chain().focus().redo().run()} style={btnStyle(false)}>↪ Redo</button>
</div>
{/* Editor area */}
<EditorContent editor={editor} />
</div>
);
}
