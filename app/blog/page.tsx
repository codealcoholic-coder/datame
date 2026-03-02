     1	"use client";
     2	
     3	import { useEffect, useState } from "react";
     4	import Link from "next/link";
     5	
     6	interface Post {
     7	  _id: string;
     8	  slug: string;
     9	  title: string;
    10	  excerpt: string;
    11	  category: string;
    12	  categoryColor: string;
    13	  createdAt: string;
    14	  published: boolean;
    15	}
    16	
    17	export default function BlogPage() {
    18	  const [posts, setPosts] = useState<Post[]>([]);
    19	  const [loading, setLoading] = useState(true);
    20	
    21	  useEffect(() => {
    22	    fetch("/api/posts")
    23	      .then((r) => r.json())
    24	      .then((data) => {
    25	        setPosts(Array.isArray(data) ? data : []);
    26	        setLoading(false);
    27	      })
    28	      .catch(() => setLoading(false));
    29	  }, []);
    30	
    31	  return (
    32	    <div style={{ position: "relative", zIndex: 10, minHeight: "100vh" }}>
    33	      {/* NAV */}
    34	      <nav style={{ position: "fixed", top: 0, width: "100%", padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100, background: "rgba(10,10,15,0.92)", borderBottom: "1px solid var(--border-custom)", backdropFilter: "blur(12px)" }}>
    35	        <Link href="/" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em", color: "var(--text)", textDecoration: "none" }}>
    36	          data<span style={{ color: "#e8ff47" }}>Bit</span>Bytes
    37	        </Link>
    38	        <ul style={{ display: "flex", gap: 32, listStyle: "none" }} className="hidden md:flex">
    39	          <li><Link href="/" style={{ color: "var(--muted-custom)", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Home</Link></li>
    40	          <li><Link href="/blog" style={{ color: "#e8ff47", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Blog</Link></li>
    41	        </ul>
    42	        <Link href="/" style={{ background: "#e8ff47", color: "var(--bg)", border: "none", padding: "10px 22px", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
    43	          Subscribe →
    44	        </Link>
    45	      </nav>
    46	
    47	      {/* HEADER */}
    48	      <section style={{ paddingTop: 140, paddingBottom: 60, paddingLeft: 48, paddingRight: 48 }}>
    49	        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
    50	          <span style={{ display: "block", width: 32, height: 1, background: "#e8ff47" }} />
    51	          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#e8ff47" }}>All Posts</span>
    52	        </div>
    53	        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: 16 }}>
    54	          The <em style={{ fontStyle: "italic", color: "#e8ff47" }}>Blog</em>
    55	        </h1>
    56	        <p style={{ fontSize: "0.9rem", color: "var(--muted-custom)", maxWidth: 540, lineHeight: 1.7 }}>
    57	          Deep-dives into ML, statistics, RAG, and generative AI. No fluff.
    58	        </p>
    59	      </section>
    60	
    61	      {/* POSTS LIST */}
    62	      <section style={{ padding: "0 48px 100px" }}>
    63	        {loading ? (
    64	          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-custom)", border: "1px solid var(--border-custom)" }}>
    65	            {[1, 2, 3].map((i) => (
    66	              <div key={i} style={{ background: "var(--bg)", padding: "36px 32px", display: "flex", alignItems: "center", gap: 32 }}>
    67	                <div style={{ width: 60, height: 40, background: "var(--surface2)", borderRadius: 4, animation: "pulse 2s infinite" }} />
    68	                <div style={{ flex: 1 }}>
    69	                  <div style={{ width: "40%", height: 12, background: "var(--surface2)", borderRadius: 4, marginBottom: 8 }} />
    70	                  <div style={{ width: "70%", height: 16, background: "var(--surface2)", borderRadius: 4 }} />
    71	                </div>
    72	              </div>
    73	            ))}
    74	          </div>
    75	        ) : posts.length === 0 ? (
    76	          <div style={{ border: "1px solid var(--border-custom)", background: "var(--surface)", padding: "80px 48px", textAlign: "center" }}>
    77	            <div style={{ fontSize: "3rem", marginBottom: 16 }}>✍️</div>
    78	            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.3rem", color: "var(--text)", marginBottom: 8 }}>No posts yet</div>
    79	            <div style={{ fontSize: "0.85rem", color: "var(--muted-custom)" }}>The first article is coming soon. Check back shortly!</div>
    80	          </div>
    81	        ) : (
    82	          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-custom)", border: "1px solid var(--border-custom)" }}>
    83	            {posts.map((post, idx) => (
    84	              <Link
    85	                key={post._id}
    86	                href={`/blog/${post.slug}`}
    87	                style={{ background: "var(--bg)", display: "grid", gridTemplateColumns: "80px 1fr auto auto", alignItems: "center", gap: 32, padding: "28px 32px", textDecoration: "none", transition: "background 0.2s", borderLeft: "3px solid transparent" }}
    88	              >
    89	                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "var(--muted2)" }}>
    90	                  {String(posts.length - idx).padStart(3, "0")}
    91	                </div>
    92	                <div>
    93	                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6, color: post.categoryColor }}>
    94	                    {post.category}
    95	                  </div>
    96	                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1rem", color: "var(--text)" }}>
    97	                    {post.title}
    98	                  </div>
    99	                  {post.excerpt && (
   100	                    <div style={{ fontSize: "0.78rem", color: "var(--muted-custom)", marginTop: 6, lineHeight: 1.5 }}>
   101	                      {post.excerpt.substring(0, 120)}{post.excerpt.length > 120 ? "..." : ""}
   102	                    </div>
   103	                  )}
   104	                </div>
   105	                <div className="hidden md:block" style={{ fontSize: "0.72rem", color: "var(--muted-custom)" }}>
   106	                  {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
   107	                </div>
   108	                <div className="hidden md:block" style={{ fontSize: "1.2rem", color: "var(--muted2)" }}>→</div>
   109	              </Link>
   110	            ))}
   111	          </div>
   112	        )}
   113	      </section>
   114	
   115	      {/* FOOTER */}
   116	      <footer style={{ borderTop: "1px solid var(--border-custom)", padding: 48, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
   117	        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>
   118	          data<span style={{ color: "#e8ff47" }}>Bit</span>Bytes
   119	        </div>
   120	        <div style={{ fontSize: "0.7rem", color: "var(--muted2)" }}>© 2025 dataBitBytes. All rights reserved.</div>
   121	      </footer>
   122	
   123	      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
   124	    </div>
   125	  );
   126	}
   127	
