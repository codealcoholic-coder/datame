     1	"use client";
     2	
     3	import { useEffect, useRef } from "react";
     4	import Link from "next/link";
     5	
     6	const tickerItems = [
     7	  "Classical ML", "Bayesian Statistics", "RAG Pipelines", "Transformer Architectures",
     8	  "Vector Databases", "Causal Inference", "Fine-Tuning LLMs", "Decision Trees",
     9	  "Prompt Engineering", "A/B Testing", "Embeddings", "Generative AI",
    10	];
    11	
    12	const topics = [
    13	  { num: "01", icon: "📐", title: "Classical ML", desc: "From linear models to gradient boosting — understanding the algorithms that still power 80% of production systems.", tags: ["SVMs", "XGBoost", "Clustering", "Regression"], accent: "#e8ff47" },
    14	  { num: "02", icon: "∑", title: "Statistics", desc: "Bayesian inference, hypothesis testing, and distribution theory — the math underneath all the magic.", tags: ["Bayesian", "Inference", "A/B Tests", "Causal"], accent: "#47ffe8" },
    15	  { num: "03", icon: "⛓", title: "RAG & Retrieval", desc: "Retrieval-Augmented Generation patterns, vector search, chunking strategies, and evaluation frameworks.", tags: ["Embeddings", "Vector DB", "Reranking", "GraphRAG"], accent: "#ff6b47" },
    16	  { num: "04", icon: "✦", title: "Generative AI", desc: "LLMs, diffusion models, fine-tuning, alignment, and the architectures reshaping how we build software.", tags: ["LLMs", "Fine-tuning", "Agents", "Diffusion"], accent: "#b847ff" },
    17	];
    18	
    19	const issues = [
    20	  { num: "047", cat: "Generative AI", color: "#e8ff47", title: "Why Your RAG Pipeline Hallucinate — and How to Fix It", date: "Feb 24, 2025" },
    21	  { num: "046", cat: "Statistics", color: "#47ffe8", title: "The Bayesian Trap: When Priors Silently Ruin Your Models", date: "Feb 17, 2025" },
    22	  { num: "045", cat: "Classical ML", color: "#e8ff47", title: "Gradient Boosting vs Neural Nets: A Fair Fight in 2025", date: "Feb 10, 2025" },
    23	  { num: "044", cat: "RAG & Retrieval", color: "#ff6b47", title: "GraphRAG Explained: Knowledge Graphs Meet LLMs", date: "Feb 03, 2025" },
    24	  { num: "043", cat: "Generative AI", color: "#b847ff", title: "LoRA, QLoRA, and the Fine-Tuning Hierarchy You Need to Know", date: "Jan 27, 2025" },
    25	];
    26	
    27	const testimonials = [
    28	  { initials: "AK", name: "Arjun K.", role: "ML Engineer · Bangalore", text: "\"The RAG pipeline breakdown was the clearest explanation I've found anywhere. I finally understand why chunking strategy matters so much.\"" },
    29	  { initials: "SR", name: "Sofia R.", role: "Data Scientist · Berlin", text: "\"Finally a newsletter that doesn't dumb things down. The statistical inference series changed how I think about model evaluation.\"" },
    30	  { initials: "MJ", name: "Marcus J.", role: "Senior DS · Toronto", text: "\"I've tried dozens of ML newsletters. dataBitBytes is the only one I consistently open immediately. The XGBoost deep-dive alone was worth subscribing.\"" },
    31	];
    32	
    33	const features = [
    34	  { icon: "🧠", title: "Concept-First Writing", desc: "Every issue starts with why, not what. Mental models over syntax." },
    35	  { icon: "📊", title: "Visual Breakdowns", desc: "Diagrams, annotated code, and step-by-step walkthroughs make complex topics click." },
    36	  { icon: "⚡", title: "10-Minute Reads", desc: "Dense but readable. Every issue is calibrated to give maximum insight per minute." },
    37	  { icon: "🔗", title: "Curated Resources", desc: "Papers, repos, tools, and talks — only the ones worth your time." },
    38	];
    39	
    40	export default function Home() {
    41	  const cursorRef = useRef<HTMLDivElement>(null);
    42	  const ringRef = useRef<HTMLDivElement>(null);
    43	  const navRef = useRef<HTMLElement>(null);
    44	
    45	  useEffect(() => {
    46	    // Custom cursor
    47	    const cursor = cursorRef.current;
    48	    const ring = ringRef.current;
    49	    if (!cursor || !ring) return;
    50	    let mx = 0, my = 0, rx = 0, ry = 0;
    51	    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    52	    document.addEventListener("mousemove", onMove);
    53	    let raf: number;
    54	    const animate = () => {
    55	      cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
    56	      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    57	      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    58	      raf = requestAnimationFrame(animate);
    59	    };
    60	    animate();
    61	
    62	    // Nav scroll
    63	    const nav = navRef.current;
    64	    const onScroll = () => { nav?.classList.toggle("scrolled", window.scrollY > 40); };
    65	    window.addEventListener("scroll", onScroll);
    66	
    67	    // Reveal on scroll
    68	    const reveals = document.querySelectorAll(".reveal");
    69	    const obs = new IntersectionObserver((entries) => {
    70	      entries.forEach((entry, i) => {
    71	        if (entry.isIntersecting) {
    72	          setTimeout(() => entry.target.classList.add("visible"), i * 80);
    73	          obs.unobserve(entry.target);
    74	        }
    75	      });
    76	    }, { threshold: 0.1 });
    77	    reveals.forEach((el) => obs.observe(el));
    78	
    79	    return () => {
    80	      document.removeEventListener("mousemove", onMove);
    81	      window.removeEventListener("scroll", onScroll);
    82	      cancelAnimationFrame(raf);
    83	      obs.disconnect();
    84	    };
    85	  }, []);
    86	
    87	  return (
    88	    <>
    89	      {/* Custom Cursor */}
    90	      <div ref={cursorRef} style={{ width: 12, height: 12, background: "var(--accent)", borderRadius: "50%", position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999, transition: "transform 0.15s ease", mixBlendMode: "exclusion" }} />
    91	      <div ref={ringRef} style={{ width: 36, height: 36, border: "1px solid var(--accent)", borderRadius: "50%", position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9998, transition: "transform 0.4s ease", mixBlendMode: "exclusion", opacity: 0.6 }} />
    92	
    93	      {/* NAV */}
    94	      <nav ref={navRef} style={{ position: "fixed", top: 0, width: "100%", padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100, background: "linear-gradient(var(--bg), transparent)", borderBottom: "1px solid transparent", transition: "border-color 0.3s, background 0.3s" }}>
    95	        <Link href="/" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em", color: "var(--text)", textDecoration: "none" }}>
    96	          data<span style={{ color: "#e8ff47" }}>Bit</span>Bytes
    97	        </Link>
    98	        <ul style={{ display: "flex", gap: 32, listStyle: "none" }} className="hidden md:flex">
    99	          <li><a href="#topics" style={{ color: "var(--muted-custom)", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Topics</a></li>
   100	          <li><Link href="/blog" style={{ color: "var(--muted-custom)", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Blog</Link></li>
   101	          <li><a href="#about" style={{ color: "var(--muted-custom)", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>About</a></li>
   102	        </ul>
   103	        <Link href="/blog" style={{ background: "#e8ff47", color: "var(--bg)", border: "none", padding: "10px 22px", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s" }}>
   104	          Read Blog →
   105	        </Link>
   106	      </nav>
   107	
   108	      {/* HERO */}
   109	      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: "120px 48px 80px", position: "relative", zIndex: 10, maxWidth: 1200 }}>
   110	        <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
   111	          <span style={{ display: "block", width: 32, height: 1, background: "#e8ff47" }} />
   112	          Weekly Newsletter · Est. 2025
   113	        </div>
   114	        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(3.5rem, 8vw, 7rem)", lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: 32, color: "var(--text)" }}>
   115	          Master the <em style={{ fontStyle: "italic", color: "#e8ff47" }}>Stack</em><br />
   116	          <span style={{ display: "block", color: "var(--muted-custom)" }}>that Matters.</span>
   117	        </h1>
   118	        <p style={{ fontSize: "0.95rem", color: "var(--muted-custom)", maxWidth: 480, lineHeight: 1.8, marginBottom: 48 }}>
   119	          Weekly deep-dives into Classical ML, Statistics, RAG architectures, and Generative AI — distilled into precise, actionable bytes. No fluff, no hype.
   120	        </p>
   121	        <div style={{ display: "flex", gap: 0, maxWidth: 480, width: "100%" }}>
   122	          <input type="email" placeholder="your@email.com" style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border-custom)", borderRight: "none", padding: "16px 20px", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.85rem", outline: "none" }} />
   123	          <button style={{ background: "#e8ff47", color: "var(--bg)", border: "1px solid #e8ff47", padding: "16px 28px", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}>Subscribe →</button>
   124	        </div>
   125	        <div style={{ marginTop: 64, display: "flex", gap: 48, flexWrap: "wrap" }}>
   126	          {[{ num: "12", suffix: "K+", label: "Subscribers" }, { num: "52", suffix: "+", label: "Issues / Year" }, { num: "4", suffix: ".9", label: "Avg. Rating" }].map((s) => (
   127	            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
   128	              <div style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--text)" }}>{s.num}<span style={{ color: "#e8ff47" }}>{s.suffix}</span></div>
   129	              <div style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-custom)" }}>{s.label}</div>
   130	            </div>
   131	          ))}
   132	        </div>
   133	      </section>
   134	
   135	      {/* TICKER */}
   136	      <div style={{ overflow: "hidden", borderTop: "1px solid var(--border-custom)", borderBottom: "1px solid var(--border-custom)", background: "var(--surface)", padding: "14px 0", position: "relative", zIndex: 10 }}>
   137	        <div style={{ display: "flex", animation: "ticker 30s linear infinite", whiteSpace: "nowrap" }}>
   138	          {[...tickerItems, ...tickerItems].map((item, i) => (
   139	            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 24, padding: "0 32px", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted-custom)" }}>
   140	              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#e8ff47", flexShrink: 0 }} />
   141	              {item}
   142	            </span>
   143	          ))}
   144	        </div>
   145	      </div>
   146	
   147	      {/* TOPICS */}
   148	      <section id="topics" style={{ padding: "100px 48px", position: "relative", zIndex: 10 }}>
   149	        <div className="reveal" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 56, paddingBottom: 20, borderBottom: "1px solid var(--border-custom)" }}>
   150	          <div>
   151	            <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 8 }}>Coverage</div>
   152	            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}>Four Pillars,<br />One Stack.</h2>
   153	          </div>
   154	          <div style={{ fontFamily: "var(--font-serif)", fontSize: "5rem", color: "var(--muted2)", lineHeight: 1 }}>04</div>
   155	        </div>
   156	        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "var(--border-custom)", border: "1px solid var(--border-custom)" }} className="!grid-cols-2 md:!grid-cols-4">
   157	          {topics.map((t) => (
   158	            <div key={t.num} className="reveal" style={{ background: "var(--bg)", padding: "40px 32px", transition: "background 0.25s", position: "relative", overflow: "hidden" }}>
   159	              <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--muted2)", marginBottom: 20 }}>{t.num}</div>
   160	              <span style={{ fontSize: "2rem", marginBottom: 16, display: "block" }}>{t.icon}</span>
   161	              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.15rem", color: "var(--text)", marginBottom: 12 }}>{t.title}</div>
   162	              <div style={{ fontSize: "0.8rem", lineHeight: 1.7, color: "var(--muted-custom)" }}>{t.desc}</div>
   163	              <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 6 }}>
   164	                {t.tags.map((tag) => (
   165	                  <span key={tag} style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", border: "1px solid var(--border-custom)", color: "var(--muted-custom)", background: "var(--surface2)" }}>{tag}</span>
   166	                ))}
   167	              </div>
   168	            </div>
   169	          ))}
   170	        </div>
   171	      </section>
   172	
   173	      {/* LATEST ISSUES */}
   174	      <section id="issues" style={{ padding: "0 48px 100px", position: "relative", zIndex: 10 }}>
   175	        <div className="reveal" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 56, paddingBottom: 20, borderBottom: "1px solid var(--border-custom)" }}>
   176	          <div>
   177	            <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 8 }}>Latest</div>
   178	            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}>Recent Issues</h2>
   179	          </div>
   180	          <Link href="/blog" style={{ fontFamily: "var(--font-serif)", fontSize: "5rem", color: "var(--muted2)", lineHeight: 1, textDecoration: "none" }}>→</Link>
   181	        </div>
   182	        <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-custom)", border: "1px solid var(--border-custom)" }}>
   183	          {issues.map((iss) => (
   184	            <Link key={iss.num} href="/blog" style={{ background: "var(--bg)", display: "grid", gridTemplateColumns: "80px 1fr auto auto", alignItems: "center", gap: 32, padding: "28px 32px", textDecoration: "none", transition: "background 0.2s", borderLeft: "3px solid transparent" }}>
   185	              <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "var(--muted2)" }}>{iss.num}</div>
   186	              <div>
   187	                <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6, color: iss.color }}>{iss.cat}</div>
   188	                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1rem", color: "var(--text)" }}>{iss.title}</div>
   189	              </div>
   190	              <div className="hidden md:block" style={{ fontSize: "0.72rem", color: "var(--muted-custom)" }}>{iss.date}</div>
   191	              <div className="hidden md:block" style={{ fontSize: "1.2rem", color: "var(--muted2)", transition: "transform 0.2s, color 0.2s" }}>→</div>
   192	            </Link>
   193	          ))}
   194	        </div>
   195	      </section>
   196	
   197	      {/* ABOUT */}
   198	      <section id="about" style={{ padding: "100px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, borderTop: "1px solid var(--border-custom)", position: "relative", zIndex: 10 }} className="!grid-cols-1 md:!grid-cols-2">
   199	        <div className="reveal">
   200	          <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 8 }}>About</div>
   201	          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", lineHeight: 1.35, color: "var(--text)", marginBottom: 28, letterSpacing: "-0.02em" }}>
   202	            Built for the data professional who wants <em style={{ color: "#e8ff47", fontStyle: "italic" }}>depth</em>, not just headlines.
   203	          </div>
   204	          <p style={{ fontSize: "0.82rem", lineHeight: 1.85, color: "var(--muted-custom)", marginBottom: 36 }}>
   205	            dataBitBytes is a curated weekly newsletter focused on the intersection of rigorous statistical thinking, classical machine learning, and modern generative AI systems. Every issue is crafted to give you a real mental model — not surface-level summaries.<br /><br />
   206	            Whether you&apos;re a researcher, ML engineer, data scientist, or a curious builder — each edition takes one concept and explains it the way it should be taught.
   207	          </p>
   208	          <div style={{ display: "flex", gap: 0, width: "100%" }}>
   209	            <input type="email" placeholder="your@email.com" style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border-custom)", borderRight: "none", padding: "16px 20px", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.8rem", outline: "none" }} />
   210	            <button style={{ background: "#e8ff47", color: "var(--bg)", border: "1px solid #e8ff47", padding: "16px 28px", fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}>Join Free →</button>
   211	          </div>
   212	        </div>
   213	        <div className="reveal" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
   214	          {features.map((f) => (
   215	            <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: 20, border: "1px solid var(--border-custom)", background: "var(--surface)", transition: "border-color 0.2s" }}>
   216	              <div style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: 2 }}>{f.icon}</div>
   217	              <div>
   218	                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.88rem", color: "var(--text)", marginBottom: 4 }}>{f.title}</div>
   219	                <div style={{ fontSize: "0.76rem", color: "var(--muted-custom)", lineHeight: 1.6 }}>{f.desc}</div>
   220	              </div>
   221	            </div>
   222	          ))}
   223	        </div>
   224	      </section>
   225	
   226	      {/* TESTIMONIALS */}
   227	      <section style={{ padding: "100px 48px", borderTop: "1px solid var(--border-custom)", position: "relative", zIndex: 10 }}>
   228	        <div className="reveal" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 56, paddingBottom: 20, borderBottom: "1px solid var(--border-custom)" }}>
   229	          <div>
   230	            <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 8 }}>Social Proof</div>
   231	            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}>What Readers Say</h2>
   232	          </div>
   233	          <div style={{ fontFamily: "var(--font-serif)", fontSize: "5rem", color: "var(--muted2)", lineHeight: 1 }}>★</div>
   234	        </div>
   235	        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--border-custom)", border: "1px solid var(--border-custom)" }} className="!grid-cols-1 md:!grid-cols-3">
   236	          {testimonials.map((t) => (
   237	            <div key={t.initials} className="reveal" style={{ background: "var(--bg)", padding: "36px 32px", transition: "background 0.2s" }}>
   238	              <div style={{ color: "#e8ff47", fontSize: "0.75rem", letterSpacing: 3, marginBottom: 16 }}>★★★★★</div>
   239	              <div style={{ fontSize: "0.83rem", lineHeight: 1.75, color: "var(--muted-custom)", marginBottom: 24 }}>{t.text}</div>
   240	              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
   241	                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface2)", border: "1px solid var(--border-custom)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", color: "#e8ff47", fontFamily: "var(--font-heading)", fontWeight: 700 }}>{t.initials}</div>
   242	                <div>
   243	                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.85rem", color: "var(--text)" }}>{t.name}</div>
   244	                  <div style={{ fontSize: "0.68rem", color: "var(--muted-custom)", letterSpacing: "0.05em" }}>{t.role}</div>
   245	                </div>
   246	              </div>
   247	            </div>
   248	          ))}
   249	        </div>
   250	      </section>
   251	
   252	      {/* CTA */}
   253	      <div className="reveal" style={{ margin: "0 48px 100px", background: "var(--surface)", border: "1px solid var(--border-custom)", padding: 80, position: "relative", overflow: "hidden", zIndex: 10 }}>
   254	        <div style={{ position: "absolute", right: -20, bottom: -40, fontFamily: "var(--font-serif)", fontSize: "9rem", color: "var(--muted2)", opacity: 0.15, whiteSpace: "nowrap", pointerEvents: "none", letterSpacing: "-0.05em" }}>dataBitBytes</div>
   255	        <div style={{ maxWidth: 600, position: "relative" }}>
   256	          <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#e8ff47", marginBottom: 8 }}>Get Started</div>
   257	          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em", marginBottom: 16 }}>One Email.<br />Every Week.</h2>
   258	          <p style={{ fontSize: "0.88rem", color: "var(--muted-custom)", lineHeight: 1.7, marginBottom: 40 }}>Join 12,000+ data professionals getting sharper every Sunday. Free forever. Unsubscribe anytime.</p>
   259	          <div style={{ display: "flex", gap: 0, maxWidth: 460 }}>
   260	            <input type="email" placeholder="your@email.com" style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--border-custom)", borderRight: "none", padding: "15px 20px", color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: "0.83rem", outline: "none" }} />
   261	            <button style={{ background: "#e8ff47", color: "var(--bg)", border: "1px solid #e8ff47", padding: "15px 28px", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}>Subscribe →</button>
   262	          </div>
   263	        </div>
   264	      </div>
   265	
   266	      {/* FOOTER */}
   267	      <footer style={{ borderTop: "1px solid var(--border-custom)", padding: 48, display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 10 }} className="!flex-col md:!flex-row gap-6">
   268	        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>
   269	          data<span style={{ color: "#e8ff47" }}>Bit</span>Bytes
   270	        </div>
   271	        <ul style={{ display: "flex", gap: 28, listStyle: "none", flexWrap: "wrap", justifyContent: "center" }}>
   272	          <li><Link href="/blog" style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-custom)", textDecoration: "none" }}>Blog</Link></li>
   273	          <li><a href="#about" style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-custom)", textDecoration: "none" }}>About</a></li>
   274	          <li><a href="#topics" style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-custom)", textDecoration: "none" }}>Topics</a></li>
   275	        </ul>
   276	        <div style={{ fontSize: "0.7rem", color: "var(--muted2)" }}>© 2025 dataBitBytes. All rights reserved.</div>
   277	      </footer>
   278	
   279	      {/* Ticker animation keyframes */}
   280	      <style>{`
   281	        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
   282	        nav.scrolled { background: rgba(10,10,15,0.92) !important; border-color: var(--border-custom) !important; backdrop-filter: blur(12px); }
   283	        body { cursor: none; }
   284	      `}</style>
   285	    </>
   286	  );
   287	}
   288	
