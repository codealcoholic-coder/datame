"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const TipTapEditor = dynamic(() => import("@/components/tiptap-editor"), { ssr: false });
interface Post {
_id: string;
slug: string;
title: string;
excerpt: string;
content: string;
category: string;
categoryColor: string;
published: boolean;
createdAt: string;
updatedAt: string;
}
interface Comment {
_id: string;
postSlug: string;
author: string;
email: string;
content: string;
approved: boolean;
createdAt: string;
}
const CATEGORIES = [
{ name: "Classical ML", color: "#e8ff47" },
{ name: "Statistics", color: "#47ffe8" },
{ name: "RAG & Retrieval", color: "#ff6b47" },
{ name: "Generative AI", color: "#b847ff" },
{ name: "General", color: "#e8ff47" },
];
export default function AdminPage() {
const params = useParams();
const router = useRouter();
const adminKey = params.key as string;
const [authorized, setAuthorized] = useState<boolean | null>(null);
const [tab, setTab] = useState<"posts" | "comments" | "editor">("posts");
const [posts, setPosts] = useState<Post[]>([]);
const [comments, setComments] = useState<Comment[]>([]);
const [loading, setLoading] = useState(true);
// Editor state
const [editingPost, setEditingPost] = useState<Post | null>(null);
const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", category: "General", categoryColor: "#e8ff47", published: false });
const [saving, setSaving] = useState(false);
// Verify admin key
useEffect(() => {
fetch(`/api/posts?admin_key=${adminKey}`)
.then((r) => { setAuthorized(r.ok); return r.json(); })
.then((data) => { if (Array.isArray(data)) setPosts(data); setLoading(false); })
.catch(() => { setAuthorized(false); setLoading(false); });
fetch(`/api/comments?admin_key=${adminKey}`)
.then((r) => r.json())
.then((data) => { if (Array.isArray(data)) setComments(data); })
.catch(() => {});
}, [adminKey]);
const refreshPosts = async () => {
const r = await fetch(`/api/posts?admin_key=${adminKey}`);
const data = await r.json();
if (Array.isArray(data)) setPosts(data);
};
const refreshComments = async () => {
const r = await fetch(`/api/comments?admin_key=${adminKey}`);
const data = await r.json();
if (Array.isArray(data)) setComments(data);
};
const openEditor = (post?: Post) => {
if (post) {
setEditingPost(post);
setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, category: post.category, categoryColor: post.categoryColor, published: post.published });
} else {
setEditingPost(null);
setForm({ title: "", slug: "", excerpt: "", content: "", category: "General", categoryColor: "#e8ff47", published: false });
}
setTab("editor");
};
const handleSave = async () => {
setSaving(true);
try {
if (editingPost) {
await fetch("/api/posts", {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ admin_key: adminKey, _id: editingPost._id, ...form }),
});
} else {
await fetch("/api/posts", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ admin_key: adminKey, ...form }),
});
}
await refreshPosts();
setTab("posts");
} catch (e) { console.error(e); }
setSaving(false);
};
const handleDelete = async (id: string) => {
if (!confirm("Delete this post permanently?")) return;
await fetch(`/api/posts?id=${id}&admin_key=${adminKey}`, { method: "DELETE" });
await refreshPosts();
};
const togglePublish = async (post: Post) => {
await fetch("/api/posts", {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ admin_key: adminKey, _id: post._id, published: !post.published }),
});
await refreshPosts();
};
const handleCommentAction = async (id: string, action: "approve" | "reject" | "delete") => {
if (action === "delete") {
await fetch(`/api/comments?id=${id}&admin_key=${adminKey}`, { method: "DELETE" });
} else {
await fetch("/api/comments", {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ admin_key: adminKey, _id: id, approved: action === "approve" }),
});
}
await refreshComments();
};
const updateSlug = (title: string) => {
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
setForm((f) => ({ ...f, title, slug }));
};
if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, position: "relative" }}><span style={{ color: "var(--muted-custom)" }}>Loading...</span></div>;
if (authorized === false) return <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, position: "relative", gap: 16 }}><div style={{ fontSize: "3rem" }}>🔒</div><div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.3rem", color: "var(--text)" }}>Unauthorized</div><div style={{ fontSize: "0.85rem", color: "var(--muted-custom)" }}>Invalid admin key.</div></div>;
const inputStyle: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border-custom)", padding: "12px 16px", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.85rem", outline: "none" };
const tabBtnStyle = (active: boolean): React.CSSProperties => ({ background: active ? "#e8ff47" : "transparent", color: active ? "var(--bg)" : "var(--muted-custom)", border: "1px solid var(--border-custom)", padding: "10px 24px", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" });
const actionBtn = (bg: string): React.CSSProperties => ({ background: bg, color: bg === "transparent" ? "var(--muted-custom)" : "var(--bg)", border: `1px solid ${bg === "transparent" ? "var(--border-custom)" : bg}`, padding: "6px 14px", fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" });
const pendingCount = comments.filter((c) => !c.approved).length;
return (
<div style={{ position: "relative", zIndex: 10, minHeight: "100vh" }}>
{/* ADMIN NAV */}
<nav style={{ position: "fixed", top: 0, width: "100%", padding: "16px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100, background: "rgba(10,10,15,0.95)", borderBottom: "1px solid var(--border-custom)", backdropFilter: "blur(12px)" }}>
<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
<span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>data<span style={{ color: "#e8ff47" }}>Bit</span>Bytes</span>
<span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ff6b47", background: "rgba(255,107,71,0.1)", padding: "4px 10px", border: "1px solid rgba(255,107,71,0.3)" }}>Admin</span>
</div>
<div style={{ display: "flex", gap: 8 }}>
<button onClick={() => setTab("posts")} style={tabBtnStyle(tab === "posts")}>Posts ({posts.length})</button>
<button onClick={() => setTab("comments")} style={tabBtnStyle(tab === "comments")}>
Comments {pendingCount > 0 && <span style={{ background: "#ff6b47", color: "#fff", padding: "2px 6px", fontSize: "0.6rem", marginLeft: 6 }}>{pendingCount}</span>}
</button>
<button onClick={() => openEditor()} style={{ ...tabBtnStyle(false), background: "#e8ff47", color: "var(--bg)", borderColor: "#e8ff47" }}>+ New Post</button>
</div>
</nav>
<div style={{ paddingTop: 80, padding: "80px 36px 60px" }}>
{/* POSTS TAB */}
{tab === "posts" && (
<div>
<h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: 32 }}>All Posts</h2>
{posts.length === 0 ? (
<div style={{ border: "1px solid var(--border-custom)", background: "var(--surface)", padding: "60px 36px", textAlign: "center" }}>
<div style={{ fontSize: "2rem", marginBottom: 12 }}>✍️</div>
<div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>No posts yet</div>
<button onClick={() => openEditor()} style={{ background: "#e8ff47", color: "var(--bg)", border: "none", padding: "10px 24px", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", marginTop: 8 }}>Create Your First Post</button>
</div>
) : (
<div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-custom)", border: "1px solid var(--border-custom)" }}>
{posts.map((post) => (
<div key={post._id} style={{ background: "var(--bg)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
<div style={{ flex: 1, minWidth: 200 }}>
<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
<span style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: post.categoryColor }}>{post.category}</span>
<span style={{ fontSize: "0.62rem", padding: "2px 8px", background: post.published ? "rgba(71,255,232,0.12)" : "rgba(255,107,71,0.12)", color: post.published ? "#47ffe8" : "#ff6b47", border: `1px solid ${post.published ? "rgba(71,255,232,0.3)" : "rgba(255,107,71,0.3)"}`, letterSpacing: "0.1em", textTransform: "uppercase" }}>
{post.published ? "Published" : "Draft"}
</span>
</div>
<div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.95rem", color: "var(--text)" }}>{post.title}</div>
<div style={{ fontSize: "0.7rem", color: "var(--muted-custom)", marginTop: 4 }}>{new Date(post.createdAt).toLocaleDateString()}</div>
</div>
<div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
<button onClick={() => togglePublish(post)} style={actionBtn("transparent")}>{post.published ? "Unpublish" : "Publish"}</button>
<button onClick={() => openEditor(post)} style={actionBtn("#47ffe8")}>Edit</button>
<button onClick={() => handleDelete(post._id)} style={actionBtn("#ff6b47")}>Delete</button>
</div>
</div>
))}
</div>
)}
</div>
)}
{/* COMMENTS TAB */}
{tab === "comments" && (
<div>
<h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: 32 }}>Comment Moderation</h2>
{comments.length === 0 ? (
<div style={{ border: "1px solid var(--border-custom)", background: "var(--surface)", padding: "60px 36px", textAlign: "center" }}>
<div style={{ fontSize: "2rem", marginBottom: 12 }}>💬</div>
<div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, color: "var(--text)" }}>No comments yet</div>
</div>
) : (
<div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-custom)", border: "1px solid var(--border-custom)" }}>
{comments.map((c) => (
<div key={c._id} style={{ background: "var(--bg)", padding: "20px 24px" }}>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
<span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.85rem", color: "var(--text)" }}>{c.author}</span>
<span style={{ fontSize: "0.65rem", color: "var(--muted-custom)" }}>{c.email}</span>
<span style={{ fontSize: "0.62rem", padding: "2px 8px", background: c.approved ? "rgba(71,255,232,0.12)" : "rgba(255,199,71,0.12)", color: c.approved ? "#47ffe8" : "#e8ff47", border: `1px solid ${c.approved ? "rgba(71,255,232,0.3)" : "rgba(255,199,71,0.3)"}`, letterSpacing: "0.1em", textTransform: "uppercase" }}>
{c.approved ? "Approved" : "Pending"}
</span>
</div>
<div style={{ fontSize: "0.68rem", color: "var(--muted-custom)" }}>on post: {c.postSlug}</div>
</div>
<div style={{ fontSize: "0.83rem", color: "var(--muted-custom)", lineHeight: 1.6, marginBottom: 12 }}>{c.content}</div>
<div style={{ display: "flex", gap: 8 }}>
{!c.approved && <button onClick={() => handleCommentAction(c._id, "approve")} style={actionBtn("#47ffe8")}>✓ Approve</button>}
{c.approved && <button onClick={() => handleCommentAction(c._id, "reject")} style={actionBtn("transparent")}>✗ Reject</button>}
<button onClick={() => handleCommentAction(c._id, "delete")} style={actionBtn("#ff6b47")}>🗑 Delete</button>
</div>
</div>
))}
</div>
)}
</div>
)}
{/* EDITOR TAB */}
{tab === "editor" && (
<div>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
<h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem" }}>{editingPost ? "Edit Post" : "New Post"}</h2>
<button onClick={() => setTab("posts")} style={actionBtn("transparent")}>← Back to Posts</button>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
{/* Title */}
<div>
<label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 6, display: "block" }}>Title</label>
<input value={form.title} onChange={(e) => updateSlug(e.target.value)} style={inputStyle} placeholder="Post title..." />
</div>
{/* Slug */}
<div>
<label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 6, display: "block" }}>Slug</label>
<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} style={inputStyle} placeholder="post-url-slug" />
</div>
{/* Category & Published */}
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
<div>
<label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 6, display: "block" }}>Category</label>
<select value={form.category} onChange={(e) => { const cat = CATEGORIES.find((c) => c.name === e.target.value); setForm({ ...form, category: e.target.value, categoryColor: cat?.color || "#e8ff47" }); }} style={{ ...inputStyle, cursor: "pointer" }}>
{CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
</select>
</div>
<div>
<label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 6, display: "block" }}>Status</label>
<div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
<button type="button" onClick={() => setForm({ ...form, published: false })} style={tabBtnStyle(!form.published)}>Draft</button>
<button type="button" onClick={() => setForm({ ...form, published: true })} style={tabBtnStyle(form.published)}>Published</button>
</div>
</div>
</div>
{/* Excerpt */}
<div>
<label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 6, display: "block" }}>Excerpt</label>
<textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Short description..." />
</div>
{/* Content - TipTap */}
<div>
<label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 6, display: "block" }}>Content</label>
<TipTapEditor content={form.content} onChange={(html) => setForm({ ...form, content: html })} />
</div>
{/* Actions */}
<div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
<button onClick={handleSave} disabled={saving || !form.title.trim()} style={{ background: "#e8ff47", color: "var(--bg)", border: "1px solid #e8ff47", padding: "14px 32px", fontFamily: "var(--font-sans)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", opacity: saving ? 0.5 : 1 }}>
{saving ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
</button>
<button onClick={() => setTab("posts")} style={actionBtn("transparent")}>Cancel</button>
</div>
</div>
</div>
)}
</div>
</div>
);
}
