     1	"use client";
     2	
     3	import { useEffect, useState } from "react";
     4	import { useParams, useRouter } from "next/navigation";
     5	import dynamic from "next/dynamic";
     6	
     7	const TipTapEditor = dynamic(() => import("@/components/tiptap-editor"), { ssr: false });
     8	
     9	interface Post {
    10	  _id: string;
    11	  slug: string;
    12	  title: string;
    13	  excerpt: string;
    14	  content: string;
    15	  category: string;
    16	  categoryColor: string;
    17	  published: boolean;
    18	  createdAt: string;
    19	  updatedAt: string;
    20	}
    21	
    22	interface Comment {
    23	  _id: string;
    24	  postSlug: string;
    25	  author: string;
    26	  email: string;
    27	  content: string;
    28	  approved: boolean;
    29	  createdAt: string;
    30	}
    31	
    32	const CATEGORIES = [
    33	  { name: "Classical ML", color: "#e8ff47" },
    34	  { name: "Statistics", color: "#47ffe8" },
    35	  { name: "RAG & Retrieval", color: "#ff6b47" },
    36	  { name: "Generative AI", color: "#b847ff" },
    37	  { name: "General", color: "#e8ff47" },
    38	];
    39	
    40	export default function AdminPage() {
    41	  const params = useParams();
    42	  const router = useRouter();
    43	  const adminKey = params.key as string;
    44	
    45	  const [authorized, setAuthorized] = useState<boolean | null>(null);
    46	  const [tab, setTab] = useState<"posts" | "comments" | "editor">("posts");
    47	  const [posts, setPosts] = useState<Post[]>([]);
    48	  const [comments, setComments] = useState<Comment[]>([]);
    49	  const [loading, setLoading] = useState(true);
    50	
    51	  // Editor state
    52	  const [editingPost, setEditingPost] = useState<Post | null>(null);
    53	  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", category: "General", categoryColor: "#e8ff47", published: false });
    54	  const [saving, setSaving] = useState(false);
    55	
    56	  // Verify admin key
    57	  useEffect(() => {
    58	    fetch(`/api/posts?admin_key=${adminKey}`)
    59	      .then((r) => { setAuthorized(r.ok); return r.json(); })
    60	      .then((data) => { if (Array.isArray(data)) setPosts(data); setLoading(false); })
    61	      .catch(() => { setAuthorized(false); setLoading(false); });
    62	
    63	    fetch(`/api/comments?admin_key=${adminKey}`)
    64	      .then((r) => r.json())
    65	      .then((data) => { if (Array.isArray(data)) setComments(data); })
    66	      .catch(() => {});
    67	  }, [adminKey]);
    68	
    69	  const refreshPosts = async () => {
    70	    const r = await fetch(`/api/posts?admin_key=${adminKey}`);
    71	    const data = await r.json();
    72	    if (Array.isArray(data)) setPosts(data);
    73	  };
    74	
    75	  const refreshComments = async () => {
    76	    const r = await fetch(`/api/comments?admin_key=${adminKey}`);
    77	    const data = await r.json();
    78	    if (Array.isArray(data)) setComments(data);
    79	  };
    80	
    81	  const openEditor = (post?: Post) => {
    82	    if (post) {
    83	      setEditingPost(post);
    84	      setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, category: post.category, categoryColor: post.categoryColor, published: post.published });
    85	    } else {
    86	      setEditingPost(null);
    87	      setForm({ title: "", slug: "", excerpt: "", content: "", category: "General", categoryColor: "#e8ff47", published: false });
    88	    }
    89	    setTab("editor");
    90	  };
    91	
    92	  const handleSave = async () => {
    93	    setSaving(true);
    94	    try {
    95	      if (editingPost) {
    96	        await fetch("/api/posts", {
    97	          method: "PUT",
    98	          headers: { "Content-Type": "application/json" },
    99	          body: JSON.stringify({ admin_key: adminKey, _id: editingPost._id, ...form }),
   100	        });
   101	      } else {
   102	        await fetch("/api/posts", {
   103	          method: "POST",
   104	          headers: { "Content-Type": "application/json" },
   105	          body: JSON.stringify({ admin_key: adminKey, ...form }),
   106	        });
   107	      }
   108	      await refreshPosts();
   109	      setTab("posts");
   110	    } catch (e) { console.error(e); }
   111	    setSaving(false);
   112	  };
   113	
   114	  const handleDelete = async (id: string) => {
   115	    if (!confirm("Delete this post permanently?")) return;
   116	    await fetch(`/api/posts?id=${id}&admin_key=${adminKey}`, { method: "DELETE" });
   117	    await refreshPosts();
   118	  };
   119	
   120	  const togglePublish = async (post: Post) => {
   121	    await fetch("/api/posts", {
   122	      method: "PUT",
   123	      headers: { "Content-Type": "application/json" },
   124	      body: JSON.stringify({ admin_key: adminKey, _id: post._id, published: !post.published }),
   125	    });
   126	    await refreshPosts();
   127	  };
   128	
   129	  const handleCommentAction = async (id: string, action: "approve" | "reject" | "delete") => {
   130	    if (action === "delete") {
   131	      await fetch(`/api/comments?id=${id}&admin_key=${adminKey}`, { method: "DELETE" });
   132	    } else {
   133	      await fetch("/api/comments", {
   134	        method: "PUT",
   135	        headers: { "Content-Type": "application/json" },
   136	        body: JSON.stringify({ admin_key: adminKey, _id: id, approved: action === "approve" }),
   137	      });
   138	    }
   139	    await refreshComments();
   140	  };
   141	
   142	  const updateSlug = (title: string) => {
   143	    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
   144	    setForm((f) => ({ ...f, title, slug }));
   145	  };
   146	
   147	  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, position: "relative" }}><span style={{ color: "var(--muted-custom)" }}>Loading...</span></div>;
   148	  if (authorized === false) return <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, position: "relative", gap: 16 }}><div style={{ fontSize: "3rem" }}>🔒</div><div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.3rem", color: "var(--text)" }}>Unauthorized</div><div style={{ fontSize: "0.85rem", color: "var(--muted-custom)" }}>Invalid admin key.</div></div>;
   149	
   150	  const inputStyle: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border-custom)", padding: "12px 16px", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.85rem", outline: "none" };
   151	  const tabBtnStyle = (active: boolean): React.CSSProperties => ({ background: active ? "#e8ff47" : "transparent", color: active ? "var(--bg)" : "var(--muted-custom)", border: "1px solid var(--border-custom)", padding: "10px 24px", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" });
   152	  const actionBtn = (bg: string): React.CSSProperties => ({ background: bg, color: bg === "transparent" ? "var(--muted-custom)" : "var(--bg)", border: `1px solid ${bg === "transparent" ? "var(--border-custom)" : bg}`, padding: "6px 14px", fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" });
   153	
   154	  const pendingCount = comments.filter((c) => !c.approved).length;
   155	
   156	  return (
   157	    <div style={{ position: "relative", zIndex: 10, minHeight: "100vh" }}>
   158	      {/* ADMIN NAV */}
   159	      <nav style={{ position: "fixed", top: 0, width: "100%", padding: "16px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100, background: "rgba(10,10,15,0.95)", borderBottom: "1px solid var(--border-custom)", backdropFilter: "blur(12px)" }}>
   160	        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
   161	          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>data<span style={{ color: "#e8ff47" }}>Bit</span>Bytes</span>
   162	          <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ff6b47", background: "rgba(255,107,71,0.1)", padding: "4px 10px", border: "1px solid rgba(255,107,71,0.3)" }}>Admin</span>
   163	        </div>
   164	        <div style={{ display: "flex", gap: 8 }}>
   165	          <button onClick={() => setTab("posts")} style={tabBtnStyle(tab === "posts")}>Posts ({posts.length})</button>
   166	          <button onClick={() => setTab("comments")} style={tabBtnStyle(tab === "comments")}>
   167	            Comments {pendingCount > 0 && <span style={{ background: "#ff6b47", color: "#fff", padding: "2px 6px", fontSize: "0.6rem", marginLeft: 6 }}>{pendingCount}</span>}
   168	          </button>
   169	          <button onClick={() => openEditor()} style={{ ...tabBtnStyle(false), background: "#e8ff47", color: "var(--bg)", borderColor: "#e8ff47" }}>+ New Post</button>
   170	        </div>
   171	      </nav>
   172	
   173	      <div style={{ paddingTop: 80, padding: "80px 36px 60px" }}>
   174	        {/* POSTS TAB */}
   175	        {tab === "posts" && (
   176	          <div>
   177	            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: 32 }}>All Posts</h2>
   178	            {posts.length === 0 ? (
   179	              <div style={{ border: "1px solid var(--border-custom)", background: "var(--surface)", padding: "60px 36px", textAlign: "center" }}>
   180	                <div style={{ fontSize: "2rem", marginBottom: 12 }}>✍️</div>
   181	                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>No posts yet</div>
   182	                <button onClick={() => openEditor()} style={{ background: "#e8ff47", color: "var(--bg)", border: "none", padding: "10px 24px", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", marginTop: 8 }}>Create Your First Post</button>
   183	              </div>
   184	            ) : (
   185	              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-custom)", border: "1px solid var(--border-custom)" }}>
   186	                {posts.map((post) => (
   187	                  <div key={post._id} style={{ background: "var(--bg)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
   188	                    <div style={{ flex: 1, minWidth: 200 }}>
   189	                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
   190	                        <span style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: post.categoryColor }}>{post.category}</span>
   191	                        <span style={{ fontSize: "0.62rem", padding: "2px 8px", background: post.published ? "rgba(71,255,232,0.12)" : "rgba(255,107,71,0.12)", color: post.published ? "#47ffe8" : "#ff6b47", border: `1px solid ${post.published ? "rgba(71,255,232,0.3)" : "rgba(255,107,71,0.3)"}`, letterSpacing: "0.1em", textTransform: "uppercase" }}>
   192	                          {post.published ? "Published" : "Draft"}
   193	                        </span>
   194	                      </div>
   195	                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.95rem", color: "var(--text)" }}>{post.title}</div>
   196	                      <div style={{ fontSize: "0.7rem", color: "var(--muted-custom)", marginTop: 4 }}>{new Date(post.createdAt).toLocaleDateString()}</div>
   197	                    </div>
   198	                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
   199	                      <button onClick={() => togglePublish(post)} style={actionBtn("transparent")}>{post.published ? "Unpublish" : "Publish"}</button>
   200	                      <button onClick={() => openEditor(post)} style={actionBtn("#47ffe8")}>Edit</button>
   201	                      <button onClick={() => handleDelete(post._id)} style={actionBtn("#ff6b47")}>Delete</button>
   202	                    </div>
   203	                  </div>
   204	                ))}
   205	              </div>
   206	            )}
   207	          </div>
   208	        )}
   209	
   210	        {/* COMMENTS TAB */}
   211	        {tab === "comments" && (
   212	          <div>
   213	            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: 32 }}>Comment Moderation</h2>
   214	            {comments.length === 0 ? (
   215	              <div style={{ border: "1px solid var(--border-custom)", background: "var(--surface)", padding: "60px 36px", textAlign: "center" }}>
   216	                <div style={{ fontSize: "2rem", marginBottom: 12 }}>💬</div>
   217	                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, color: "var(--text)" }}>No comments yet</div>
   218	              </div>
   219	            ) : (
   220	              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-custom)", border: "1px solid var(--border-custom)" }}>
   221	                {comments.map((c) => (
   222	                  <div key={c._id} style={{ background: "var(--bg)", padding: "20px 24px" }}>
   223	                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
   224	                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
   225	                        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.85rem", color: "var(--text)" }}>{c.author}</span>
   226	                        <span style={{ fontSize: "0.65rem", color: "var(--muted-custom)" }}>{c.email}</span>
   227	                        <span style={{ fontSize: "0.62rem", padding: "2px 8px", background: c.approved ? "rgba(71,255,232,0.12)" : "rgba(255,199,71,0.12)", color: c.approved ? "#47ffe8" : "#e8ff47", border: `1px solid ${c.approved ? "rgba(71,255,232,0.3)" : "rgba(255,199,71,0.3)"}`, letterSpacing: "0.1em", textTransform: "uppercase" }}>
   228	                          {c.approved ? "Approved" : "Pending"}
   229	                        </span>
   230	                      </div>
   231	                      <div style={{ fontSize: "0.68rem", color: "var(--muted-custom)" }}>on post: {c.postSlug}</div>
   232	                    </div>
   233	                    <div style={{ fontSize: "0.83rem", color: "var(--muted-custom)", lineHeight: 1.6, marginBottom: 12 }}>{c.content}</div>
   234	                    <div style={{ display: "flex", gap: 8 }}>
   235	                      {!c.approved && <button onClick={() => handleCommentAction(c._id, "approve")} style={actionBtn("#47ffe8")}>✓ Approve</button>}
   236	                      {c.approved && <button onClick={() => handleCommentAction(c._id, "reject")} style={actionBtn("transparent")}>✗ Reject</button>}
   237	                      <button onClick={() => handleCommentAction(c._id, "delete")} style={actionBtn("#ff6b47")}>🗑 Delete</button>
   238	                    </div>
   239	                  </div>
   240	                ))}
   241	              </div>
   242	            )}
   243	          </div>
   244	        )}
   245	
   246	        {/* EDITOR TAB */}
   247	        {tab === "editor" && (
   248	          <div>
   249	            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
   250	              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem" }}>{editingPost ? "Edit Post" : "New Post"}</h2>
   251	              <button onClick={() => setTab("posts")} style={actionBtn("transparent")}>← Back to Posts</button>
   252	            </div>
   253	            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
   254	              {/* Title */}
   255	              <div>
   256	                <label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 6, display: "block" }}>Title</label>
   257	                <input value={form.title} onChange={(e) => updateSlug(e.target.value)} style={inputStyle} placeholder="Post title..." />
   258	              </div>
   259	              {/* Slug */}
   260	              <div>
   261	                <label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 6, display: "block" }}>Slug</label>
   262	                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} style={inputStyle} placeholder="post-url-slug" />
   263	              </div>
   264	              {/* Category & Published */}
   265	              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
   266	                <div>
   267	                  <label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 6, display: "block" }}>Category</label>
   268	                  <select value={form.category} onChange={(e) => { const cat = CATEGORIES.find((c) => c.name === e.target.value); setForm({ ...form, category: e.target.value, categoryColor: cat?.color || "#e8ff47" }); }} style={{ ...inputStyle, cursor: "pointer" }}>
   269	                    {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
   270	                  </select>
   271	                </div>
   272	                <div>
   273	                  <label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 6, display: "block" }}>Status</label>
   274	                  <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
   275	                    <button type="button" onClick={() => setForm({ ...form, published: false })} style={tabBtnStyle(!form.published)}>Draft</button>
   276	                    <button type="button" onClick={() => setForm({ ...form, published: true })} style={tabBtnStyle(form.published)}>Published</button>
   277	                  </div>
   278	                </div>
   279	              </div>
   280	              {/* Excerpt */}
   281	              <div>
   282	                <label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 6, display: "block" }}>Excerpt</label>
   283	                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Short description..." />
   284	              </div>
   285	              {/* Content - TipTap */}
   286	              <div>
   287	                <label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 6, display: "block" }}>Content</label>
   288	                <TipTapEditor content={form.content} onChange={(html) => setForm({ ...form, content: html })} />
   289	              </div>
   290	              {/* Actions */}
   291	              <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
   292	                <button onClick={handleSave} disabled={saving || !form.title.trim()} style={{ background: "#e8ff47", color: "var(--bg)", border: "1px solid #e8ff47", padding: "14px 32px", fontFamily: "var(--font-sans)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", opacity: saving ? 0.5 : 1 }}>
   293	                  {saving ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
   294	                </button>
   295	                <button onClick={() => setTab("posts")} style={actionBtn("transparent")}>Cancel</button>
   296	              </div>
   297	            </div>
   298	          </div>
   299	        )}
   300	      </div>
   301	    </div>
   302	  );
   303	}
   304	
