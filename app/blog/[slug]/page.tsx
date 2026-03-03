"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
interface Post {
_id: string;
slug: string;
title: string;
excerpt: string;
content: string;
category: string;
categoryColor: string;
createdAt: string;
}
interface Comment {
_id: string;
author: string;
content: string;
createdAt: string;
}
export default function BlogPostPage() {
const params = useParams();
const slug = params.slug as string;
const [post, setPost] = useState<Post | null>(null);
const [comments, setComments] = useState<Comment[]>([]);
const [loading, setLoading] = useState(true);
const [notFound, setNotFound] = useState(false);
const [commentForm, setCommentForm] = useState({ author: "", email: "", content: "" });
const [submitting, setSubmitting] = useState(false);
const [submitted, setSubmitted] = useState(false);
useEffect(() => {
if (!slug) return;
fetch(`/api/posts/${slug}`)
.then((r) => { if (!r.ok) throw new Error(); return r.json(); })
.then((data) => { setPost(data); setLoading(false); })
.catch(() => { setNotFound(true); setLoading(false); });
fetch(`/api/comments?post_slug=${slug}`)
.then((r) => r.json())
.then((data) => setComments(Array.isArray(data) ? data : []))
.catch(() => {});
}, [slug]);
const handleSubmitComment = async (e: React.FormEvent) => {
e.preventDefault();
if (!commentForm.content.trim()) return;
setSubmitting(true);
try {
await fetch("/api/comments", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ ...commentForm, postSlug: slug }),
});
setSubmitted(true);
setCommentForm({ author: "", email: "", content: "" });
} catch { /* ignore */ }
setSubmitting(false);
};
if (loading) {
return (
<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, position: "relative" }}>
<div style={{ fontSize: "1rem", color: "var(--muted-custom)" }}>Loading...</div>
</div>
);
}
if (notFound || !post) {
return (
<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, position: "relative", gap: 16 }}>
<div style={{ fontSize: "3rem" }}>404</div>
<div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.3rem", color: "var(--text)" }}>Post not found</div>
<Link href="/blog" style={{ color: "#e8ff47", textDecoration: "underline", fontSize: "0.85rem" }}>← Back to blog</Link>
</div>
);
}
const inputStyle: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border-custom)", padding: "12px 16px", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.85rem", outline: "none", marginBottom: 12 };
return (
<div style={{ position: "relative", zIndex: 10, minHeight: "100vh" }}>
{/* NAV */}
<nav style={{ position: "fixed", top: 0, width: "100%", padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100, background: "rgba(10,10,15,0.92)", borderBottom: "1px solid var(--border-custom)", backdropFilter: "blur(12px)" }}>
<Link href="/" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.15rem", color: "var(--text)", textDecoration: "none" }}>
data<span style={{ color: "#e8ff47" }}>Bit</span>Bytes
</Link>
<Link href="/blog" style={{ color: "var(--muted-custom)", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>← All Posts</Link>
</nav>
{/* POST CONTENT */}
<article style={{ maxWidth: 780, margin: "0 auto", padding: "140px 24px 60px" }}>
<div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12, color: post.categoryColor }}>{post.category}</div>
<h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 16 }}>{post.title}</h1>
<div style={{ fontSize: "0.78rem", color: "var(--muted-custom)", marginBottom: 48, display: "flex", alignItems: "center", gap: 12 }}>
<span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
<span style={{ color: "var(--muted2)" }}>·</span>
<span>{Math.ceil(post.content.replace(/<[^>]+>/g, "").split(/\s+/).length / 200)} min read</span>
</div>
<div className="blog-content" style={{ lineHeight: 1.8, fontSize: "0.9rem" }} dangerouslySetInnerHTML={{ __html: post.content }} />
</article>
{/* COMMENTS SECTION */}
<section style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 100px" }}>
<div style={{ borderTop: "1px solid var(--border-custom)", paddingTop: 48 }}>
<h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.3rem", color: "var(--text)", marginBottom: 32 }}>
Comments ({comments.length})
</h3>
{/* Comment list */}
{comments.length > 0 && (
<div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
{comments.map((c) => (
<div key={c._id} style={{ background: "var(--surface)", border: "1px solid var(--border-custom)", padding: "20px 24px" }}>
<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
<div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface2)", border: "1px solid var(--border-custom)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#e8ff47", fontFamily: "var(--font-heading)", fontWeight: 700 }}>
{c.author.substring(0, 2).toUpperCase()}
</div>
<div>
<div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.82rem", color: "var(--text)" }}>{c.author}</div>
<div style={{ fontSize: "0.65rem", color: "var(--muted-custom)" }}>{new Date(c.createdAt).toLocaleDateString()}</div>
</div>
</div>
<div style={{ fontSize: "0.83rem", color: "var(--muted-custom)", lineHeight: 1.7 }}>{c.content}</div>
</div>
))}
</div>
)}
{/* Comment form */}
{submitted ? (
<div style={{ background: "var(--surface)", border: "1px solid #e8ff47", padding: "24px 28px", textAlign: "center" }}>
<div style={{ fontSize: "1.5rem", marginBottom: 8 }}>✅</div>
<div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.95rem", color: "var(--text)", marginBottom: 4 }}>Comment submitted!</div>
<div style={{ fontSize: "0.78rem", color: "var(--muted-custom)" }}>It will appear once approved by the author.</div>
</div>
) : (
<form onSubmit={handleSubmitComment}>
<h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1rem", color: "var(--text)", marginBottom: 16 }}>Leave a comment</h4>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
<input placeholder="Your name" value={commentForm.author} onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })} style={inputStyle} />
<input placeholder="Email (optional)" type="email" value={commentForm.email} onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })} style={inputStyle} />
</div>
<textarea placeholder="Write your comment..." rows={4} value={commentForm.content} onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
<button type="submit" disabled={submitting || !commentForm.content.trim()} style={{ background: "#e8ff47", color: "var(--bg)", border: "1px solid #e8ff47", padding: "12px 28px", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", opacity: submitting ? 0.5 : 1 }}>
{submitting ? "Submitting..." : "Post Comment"}
</button>
</form>
)}
</div>
</section>
{/* FOOTER */}
<footer style={{ borderTop: "1px solid var(--border-custom)", padding: 48, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
<div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>
data<span style={{ color: "#e8ff47" }}>Bit</span>Bytes
</div>
<div style={{ fontSize: "0.7rem", color: "var(--muted2)" }}>© 2025 dataBitBytes. All rights reserved.</div>
</footer>
</div>
);
}
