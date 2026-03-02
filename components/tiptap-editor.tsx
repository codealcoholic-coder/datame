     1	"use client";
     2	
     3	import { useEditor, EditorContent } from "@tiptap/react";
     4	import StarterKit from "@tiptap/starter-kit";
     5	import Link from "@tiptap/extension-link";
     6	import Image from "@tiptap/extension-image";
     7	import Placeholder from "@tiptap/extension-placeholder";
     8	import { useEffect } from "react";
     9	
    10	interface TipTapEditorProps {
    11	  content: string;
    12	  onChange: (html: string) => void;
    13	}
    14	
    15	const btnStyle = (active: boolean): React.CSSProperties => ({
    16	  background: active ? "#e8ff47" : "var(--surface2)",
    17	  color: active ? "var(--bg)" : "var(--text)",
    18	  border: "1px solid var(--border-custom)",
    19	  padding: "6px 12px",
    20	  fontFamily: "var(--font-sans)",
    21	  fontSize: "0.72rem",
    22	  cursor: "pointer",
    23	  transition: "all 0.15s",
    24	  fontWeight: active ? 600 : 400,
    25	});
    26	
    27	export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
    28	  const editor = useEditor({
    29	    extensions: [
    30	      StarterKit.configure({
    31	        heading: { levels: [1, 2, 3] },
    32	      }),
    33	      Link.configure({ openOnClick: false }),
    34	      Image.configure({ inline: false }),
    35	      Placeholder.configure({ placeholder: "Start writing your post..." }),
    36	    ],
    37	    content,
    38	    onUpdate: ({ editor }) => {
    39	      onChange(editor.getHTML());
    40	    },
    41	    editorProps: {
    42	      attributes: {
    43	        class: "focus:outline-none",
    44	      },
    45	    },
    46	  });
    47	
    48	  useEffect(() => {
    49	    if (editor && content && editor.getHTML() !== content) {
    50	      editor.commands.setContent(content);
    51	    }
    52	  }, [content, editor]);
    53	
    54	  if (!editor) return null;
    55	
    56	  const addImage = () => {
    57	    const url = window.prompt("Image URL");
    58	    if (url) editor.chain().focus().setImage({ src: url }).run();
    59	  };
    60	
    61	  const addLink = () => {
    62	    const url = window.prompt("Link URL");
    63	    if (url) editor.chain().focus().setLink({ href: url }).run();
    64	  };
    65	
    66	  return (
    67	    <div className="tiptap-editor" style={{ border: "1px solid var(--border-custom)", background: "var(--surface)" }}>
    68	      {/* Toolbar */}
    69	      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "10px 12px", borderBottom: "1px solid var(--border-custom)", background: "var(--surface2)" }}>
    70	        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} style={btnStyle(editor.isActive("heading", { level: 1 }))}>H1</button>
    71	        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btnStyle(editor.isActive("heading", { level: 2 }))}>H2</button>
    72	        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={btnStyle(editor.isActive("heading", { level: 3 }))}>H3</button>
    73	        <div style={{ width: 1, background: "var(--border-custom)", margin: "0 4px" }} />
    74	        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={btnStyle(editor.isActive("bold"))}>B</button>
    75	        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={btnStyle(editor.isActive("italic"))}>I</button>
    76	        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} style={btnStyle(editor.isActive("strike"))}>S</button>
    77	        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} style={btnStyle(editor.isActive("code"))}>&lt;/&gt;</button>
    78	        <div style={{ width: 1, background: "var(--border-custom)", margin: "0 4px" }} />
    79	        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={btnStyle(editor.isActive("bulletList"))}>• List</button>
    80	        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btnStyle(editor.isActive("orderedList"))}>1. List</button>
    81	        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btnStyle(editor.isActive("blockquote"))}>“ Quote</button>
    82	        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} style={btnStyle(editor.isActive("codeBlock"))}>Code Block</button>
    83	        <div style={{ width: 1, background: "var(--border-custom)", margin: "0 4px" }} />
    84	        <button type="button" onClick={addLink} style={btnStyle(editor.isActive("link"))}>🔗 Link</button>
    85	        <button type="button" onClick={addImage} style={btnStyle(false)}>🖼 Image</button>
    86	        <div style={{ width: 1, background: "var(--border-custom)", margin: "0 4px" }} />
    87	        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} style={btnStyle(false)}>— HR</button>
    88	        <button type="button" onClick={() => editor.chain().focus().undo().run()} style={btnStyle(false)}>↩ Undo</button>
    89	        <button type="button" onClick={() => editor.chain().focus().redo().run()} style={btnStyle(false)}>↪ Redo</button>
    90	      </div>
    91	      {/* Editor area */}
    92	      <EditorContent editor={editor} />
    93	    </div>
    94	  );
    95	}
    96	
