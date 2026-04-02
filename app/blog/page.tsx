"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
interface Post {
    _id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    categoryColor: string;
    createdAt: string;
    published: boolean;
}
export default function BlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("/api/posts")
            .then((r) => r.json())
            .then((data) => {
                setPosts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);
    return (
        <div style={{ position: "relative", zIndex: 10, minHeight: "100vh" }}>
            {/* NAV */}
            <nav style={{ position: "fixed", top: 0, width: "100%", padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100, background: "rgba(10,10,15,0.92)", borderBottom: "1px solid var(--border-custom)", backdropFilter: "blur(12px)" }}>
                <Link href="/" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em", color: "var(--text)", textDecoration: "none" }}>
                    data<span style={{ color: "#e8ff47" }}>Bit</span>Bytes
                </Link>
                <ul style={{ display: "flex", gap: 32, listStyle: "none" }} className="hidden md:flex">
                    <li><Link href="/" style={{ color: "var(--muted-custom)", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Home</Link></li>
                    <li><Link href="/blog" style={{ color: "#e8ff47", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Blog</Link></li>
                </ul>
                <Link href="/" style={{ background: "#e8ff47", color: "var(--bg)", border: "none", padding: "10px 22px", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
                    Subscribe →
                </Link>
            </nav>
            {/* HEADER */}
            <section style={{ paddingTop: 140, paddingBottom: 60, paddingLeft: 48, paddingRight: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <span style={{ display: "block", width: 32, height: 1, background: "#e8ff47" }} />
                    <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#e8ff47" }}>All Posts</span>
                </div>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: 16 }}>
                    The <em style={{ fontStyle: "italic", color: "#e8ff47" }}>Blog</em>
                </h1>
                <p style={{ fontSize: "0.9rem", color: "var(--muted-custom)", maxWidth: 540, lineHeight: 1.7 }}>
                    Deep-dives into ML, statistics, RAG, and generative AI. No fluff.
                </p>
            </section>
            {/* POSTS LIST */}
            <section style={{ padding: "0 48px 100px" }}>
                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-custom)", border: "1px solid var(--border-custom)" }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{ background: "var(--bg)", padding: "36px 32px", display: "flex", alignItems: "center", gap: 32 }}>
                                <div style={{ width: 60, height: 40, background: "var(--surface2)", borderRadius: 4, animation: "pulse 2s infinite" }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ width: "40%", height: 12, background: "var(--surface2)", borderRadius: 4, marginBottom: 8 }} />
                                    <div style={{ width: "70%", height: 16, background: "var(--surface2)", borderRadius: 4 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{ border: "1px solid var(--border-custom)", background: "var(--surface)", padding: "80px 48px", textAlign: "center" }}>
                        <div style={{ fontSize: "3rem", marginBottom: 16 }}>✍️</div>
                        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.3rem", color: "var(--text)", marginBottom: 8 }}>No posts yet</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--muted-custom)" }}>The first article is coming soon. Check back shortly!</div>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-custom)", border: "1px solid var(--border-custom)" }}>
                        {posts.map((post, idx) => (
                            <Link
                                key={post._id}
                                href={`/blog/${post.slug}`}
                                style={{ background: "var(--bg)", display: "grid", gridTemplateColumns: "80px 1fr auto auto", alignItems: "center", gap: 32, padding: "28px 32px", textDecoration: "none", transition: "background 0.2s", borderLeft: "3px solid transparent" }}
                            >
                                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "var(--muted2)" }}>
                                    {String(posts.length - idx).padStart(3, "0")}
                                </div>
                                <div>
                                    <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6, color: post.categoryColor }}>
                                        {post.category}
                                    </div>
                                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1rem", color: "var(--text)" }}>
                                        {post.title}
                                    </div>
                                    {post.excerpt && (
                                        <div style={{ fontSize: "0.78rem", color: "var(--muted-custom)", marginTop: 6, lineHeight: 1.5 }}>
                                            {post.excerpt.substring(0, 120)}{post.excerpt.length > 120 ? "..." : ""}
                                        </div>
                                    )}
                                </div>
                                <div className="hidden md:block" style={{ fontSize: "0.72rem", color: "var(--muted-custom)" }}>
                                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </div>
                                <div className="hidden md:block" style={{ fontSize: "1.2rem", color: "var(--muted2)" }}>→</div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
            {/* FOOTER */}
            <footer style={{ borderTop: "1px solid var(--border-custom)", padding: 48, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>
                    data<span style={{ color: "#e8ff47" }}>Bit</span>Bytes
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted2)" }}>© 2025 dataBitBytes. All rights reserved.</div>
            </footer>
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
        </div>
    );
}
