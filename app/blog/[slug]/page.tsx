     1	"use client";
     2	
     3	import { useEffect, useState } from "react";
     4	import Link from "next/link";
     5	import { useParams } from "next/navigation";
     6	
     7	interface Post {
     8	  _id: string;
     9	  slug: string;
    10	  title: string;
    11	  excerpt: string;
    12	  content: string;
    13	  category: string;
    14	  categoryColor: string;
    15	  createdAt: string;
    16	}
    17	
    18	interface Comment {
    19	  _id: string;
    20	  author: string;
    21	  content: string;
    22	  createdAt: string;
    23	}
    24	
    25	export default function BlogPostPage() {
    26	  const params = useParams();
    27	  const slug = params.slug as string;
    28	  const [post, setPost] = useState<Post | null>(null);
    29	  const [comments, setComments] = useState<Comment[]>([]);
    30	  const [loading, setLoading] = useState(true);
    31	  const [notFound, setNotFound] = useState(false);
    32	  const [commentForm, setCommentForm] = useState({ author: "", email: "", content: "" });
    33	  const [submitting, setSubmitting] = useState(false);
    34	  const [submitted, setSubmitted] = useState(false);
    35	
    36	  useEffect(() => {
    37	    if (!slug) return;
    38	    fetch(`/api/posts/${slug}`)
    39	      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
    40	      .then((data) => { setPost(data); setLoading(false); })
    41	      .catch(() => { setNotFound(true); setLoading(false); });
    42	
    43	    fetch(`/api/comments?post_slug=${slug}`)
    44	      .then((r) => r.json())
    45	      .then((data) => setComments(Array.isArray(data) ? data : []))
    46	      .catch(() => {});
    47	  }, [slug]);
    48	
    49	  const handleSubmitComment = async (e: React.FormEvent) => {
    50	    e.preventDefault();
    51	    if (!commentForm.content.trim()) return;
    52	    setSubmitting(true);
    53	    try {
    54	      await fetch("/api/comments", {
    55	        method: "POST",
    56	        headers: { "Content-Type": "application/json" },
    57	        body: JSON.stringify({ ...commentForm, postSlug: slug }),
    58	      });
    59	      setSubmitted(true);
    60	      setCommentForm({ author: "", email: "", content: "" });
    61	    } catch { /* ignore */ }
    62	    setSubmitting(false);
    63	  };
    64	
    65	  if (loading) {
    66	    return (
    67	      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, position: "relative" }}>
    68	        <div style={{ fontSize: "1rem", color: "var(--muted-custom)" }}>Loading...</div>
    69	      </div>
    70	    );
    71	  }
    72	
    73	  if (notFound || !post) {
    74	    return (
    75	      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, position: "relative", gap: 16 }}>
    76	        <div style={{ fontSize: "3rem" }}>404</div>
    77	        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.3rem", color: "var(--text)" }}>Post not found</div>
    78	        <Link href="/blog" style={{ color: "#e8ff47", textDecoration: "underline", fontSize: "0.85rem" }}>← Back to blog</Link>
    79	      </div>
    80	    );
    81	  }
    82	
    83	  const inputStyle: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border-custom)", padding: "12px 16px", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.85rem", outline: "none", marginBottom: 12 };
    84	
    85	  return (
    86	    <div style={{ position: "relative", zIndex: 10, minHeight: "100vh" }}>
    87	      {/* NAV */}
    88	      <nav style={{ position: "fixed", top: 0, width: "100%", padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100, background: "rgba(10,10,15,0.92)", borderBottom: "1px solid var(--border-custom)", backdropFilter: "blur(12px)" }}>
    89	        <Link href="/" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.15rem", color: "var(--text)", textDecoration: "none" }}>
    90	          data<span style={{ color: "#e8ff47" }}>Bit</span>Bytes
    91	        </Link>
    92	        <Link href="/blog" style={{ color: "var(--muted-custom)", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>← All Posts</Link>
    93	      </nav>
    94	
    95	      {/* POST CONTENT */}
    96	      <article style={{ maxWidth: 780, margin: "0 auto", padding: "140px 24px 60px" }}>
    97	        <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12, color: post.categoryColor }}>{post.category}</div>
    98	        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 16 }}>{post.title}</h1>
    99	        <div style={{ fontSize: "0.78rem", color: "var(--muted-custom)", marginBottom: 48, display: "flex", alignItems: "center", gap: 12 }}>
   100	          <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
   101	          <span style={{ color: "var(--muted2)" }}>·</span>
   102	          <span>{Math.ceil(post.content.replace(/<[^>]+>/g, "").split(/\s+/).length / 200)} min read</span>
   103	        </div>
   104	        <div className="blog-content" style={{ lineHeight: 1.8, fontSize: "0.9rem" }} dangerouslySetInnerHTML={{ __html: post.content }} />
   105	      </article>
   106	
   107	      {/* COMMENTS SECTION */}
   108	      <section style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 100px" }}>
   109	        <div style={{ borderTop: "1px solid var(--border-custom)", paddingTop: 48 }}>
   110	          <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.3rem", color: "var(--text)", marginBottom: 32 }}>
   111	            Comments ({comments.length})
   112	          </h3>
   113	
   114	          {/* Comment list */}
   115	          {comments.length > 0 && (
   116	            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
   117	              {comments.map((c) => (
   118	                <div key={c._id} style={{ background: "var(--surface)", border: "1px solid var(--border-custom)", padding: "20px 24px" }}>
   119	                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
   120	                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface2)", border: "1px solid var(--border-custom)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#e8ff47", fontFamily: "var(--font-heading)", fontWeight: 700 }}>
   121	                      {c.author.substring(0, 2).toUpperCase()}
   122	                    </div>
   123	                    <div>
   124	                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.82rem", color: "var(--text)" }}>{c.author}</div>
   125	                      <div style={{ fontSize: "0.65rem", color: "var(--muted-custom)" }}>{new Date(c.createdAt).toLocaleDateString()}</div>
   126	                    </div>
   127	                  </div>
   128	                  <div style={{ fontSize: "0.83rem", color: "var(--muted-custom)", lineHeight: 1.7 }}>{c.content}</div>
   129	                </div>
   130	              ))}
   131	            </div>
   132	          )}
   133	
   134	          {/* Comment form */}
   135	          {submitted ? (
   136	            <div style={{ background: "var(--surface)", border: "1px solid #e8ff47", padding: "24px 28px", textAlign: "center" }}>
   137	              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>✅</div>
   138	              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.95rem", color: "var(--text)", marginBottom: 4 }}>Comment submitted!</div>
   139	              <div style={{ fontSize: "0.78rem", color: "var(--muted-custom)" }}>It will appear once approved by the author.</div>
   140	            </div>
   141	          ) : (
   142	            <form onSubmit={handleSubmitComment}>
   143	              <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1rem", color: "var(--text)", marginBottom: 16 }}>Leave a comment</h4>
   144	              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
   145	                <input placeholder="Your name" value={commentForm.author} onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })} style={inputStyle} />
   146	                <input placeholder="Email (optional)" type="email" value={commentForm.email} onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })} style={inputStyle} />
   147	              </div>
   148	              <textarea placeholder="Write your comment..." rows={4} value={commentForm.content} onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
   149	              <button type="submit" disabled={submitting || !commentForm.content.trim()} style={{ background: "#e8ff47", color: "var(--bg)", border: "1px solid #e8ff47", padding: "12px 28px", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", opacity: submitting ? 0.5 : 1 }}>
   150	                {submitting ? "Submitting..." : "Post Comment"}
   151	              </button>
   152	            </form>
   153	          )}
   154	        </div>
   155	      </section>
   156	
   157	      {/* FOOTER */}
   158	      <footer style={{ borderTop: "1px solid var(--border-custom)", padding: 48, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
   159	        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>
   160	          data<span style={{ color: "#e8ff47" }}>Bit</span>Bytes
   161	        </div>
   162	        <div style={{ fontSize: "0.7rem", color: "var(--muted2)" }}>© 2025 dataBitBytes. All rights reserved.</div>
   163	      </footer>
   164	    </div>
   165	  );
   166	}
   167	
