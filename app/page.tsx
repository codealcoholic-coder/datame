"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
const tickerItems = [
  "Classical ML",
  "Bayesian Statistics",
  "RAG Pipelines",
  "Transformer Architectures",
  "Vector Databases",
  "Causal Inference",
  "Fine-Tuning LLMs",
  "Decision Trees",
  "Prompt Engineering",
  "A/B Testing",
  "Embeddings",
  "Generative AI",
];
const topics = [
  {
    num: "01",
    icon: "📐",
    title: "Classical ML",
    desc: "From linear models to gradient boosting — understanding the algorithms that still power 80% of production systems.",
    tags: ["SVMs", "XGBoost", "Clustering", "Regression"],
    accent: "#e8ff47",
  },
  {
    num: "02",
    icon: "∑",
    title: "Statistics",
    desc: "Bayesian inference, hypothesis testing, and distribution theory — the math underneath all the magic.",
    tags: ["Bayesian", "Inference", "A/B Tests", "Causal"],
    accent: "#47ffe8",
  },
  {
    num: "03",
    icon: "⛓",
    title: "RAG & Retrieval",
    desc: "Retrieval-Augmented Generation patterns, vector search, chunking strategies, and evaluation frameworks.",
    tags: ["Embeddings", "Vector DB", "Reranking", "GraphRAG"],
    accent: "#ff6b47",
  },
  {
    num: "04",
    icon: "✦",
    title: "Generative AI",
    desc: "LLMs, diffusion models, fine-tuning, alignment, and the architectures reshaping how we build software.",
    tags: ["LLMs", "Fine-tuning", "Agents", "Diffusion"],
    accent: "#b847ff",
  },
];
const issues = [
  {
    num: "047",
    cat: "Generative AI",
    color: "#e8ff47",
    title: "Why Your RAG Pipeline Hallucinate — and How to Fix It",
    date: "Feb 24, 2025",
  },
  {
    num: "046",
    cat: "Statistics",
    color: "#47ffe8",
    title: "The Bayesian Trap: When Priors Silently Ruin Your Models",
    date: "Feb 17, 2025",
  },
  {
    num: "045",
    cat: "Classical ML",
    color: "#e8ff47",
    title: "Gradient Boosting vs Neural Nets: A Fair Fight in 2025",
    date: "Feb 10, 2025",
  },
  {
    num: "044",
    cat: "RAG & Retrieval",
    color: "#ff6b47",
    title: "GraphRAG Explained: Knowledge Graphs Meet LLMs",
    date: "Feb 03, 2025",
  },
  {
    num: "043",
    cat: "Generative AI",
    color: "#b847ff",
    title: "LoRA, QLoRA, and the Fine-Tuning Hierarchy You Need to Know",
    date: "Jan 27, 2025",
  },
];
const testimonials = [
  {
    initials: "AK",
    name: "Arjun K.",
    role: "ML Engineer · Bangalore",
    text: '"The RAG pipeline breakdown was the clearest explanation I\'ve found anywhere. I finally understand why chunking strategy matters so much."',
  },
  {
    initials: "SR",
    name: "Sofia R.",
    role: "Data Scientist · Berlin",
    text: '"Finally a newsletter that doesn\'t dumb things down. The statistical inference series changed how I think about model evaluation."',
  },
  {
    initials: "MJ",
    name: "Marcus J.",
    role: "Senior DS · Toronto",
    text: '"I\'ve tried dozens of ML newsletters. dataBitBytes is the only one I consistently open immediately. The XGBoost deep-dive alone was worth subscribing."',
  },
];
const features = [
  {
    icon: "🧠",
    title: "Concept-First Writing",
    desc: "Every issue starts with why, not what. Mental models over syntax.",
  },
  {
    icon: "📊",
    title: "Visual Breakdowns",
    desc: "Diagrams, annotated code, and step-by-step walkthroughs make complex topics click.",
  },
  {
    icon: "⚡",
    title: "10-Minute Reads",
    desc: "Dense but readable. Every issue is calibrated to give maximum insight per minute.",
  },
  {
    icon: "🔗",
    title: "Curated Resources",
    desc: "Papers, repos, tools, and talks — only the ones worth your time.",
  },
];
export default function Home() {
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    // Nav scroll
    const nav = navRef.current;
    const onScroll = () => {
      nav?.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);
    // Reveal on scroll
    const reveals = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 80);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    reveals.forEach((el) => obs.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);
  return (
    <>
      {/* NAV */}
      <nav
        ref={navRef}
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          padding: "20px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 100,
          background: "linear-gradient(var(--bg), transparent)",
          borderBottom: "1px solid transparent",
          transition: "border-color 0.3s, background 0.3s",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "1.15rem",
            letterSpacing: "-0.02em",
            color: "var(--text)",
            textDecoration: "none",
          }}
        >
          data<span style={{ color: "#e8ff47" }}>Bit</span>Bytes
        </Link>
        <ul
          style={{ display: "flex", gap: 32, listStyle: "none" }}
          className="hidden md:flex"
        >
          <li>
            <a
              href="#topics"
              style={{
                color: "var(--muted-custom)",
                textDecoration: "none",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Topics
            </a>
          </li>
          <li>
            <Link
              href="/blog"
              style={{
                color: "var(--muted-custom)",
                textDecoration: "none",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Blog
            </Link>
          </li>
          <li>
            <a
              href="#about"
              style={{
                color: "var(--muted-custom)",
                textDecoration: "none",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              About
            </a>
          </li>
        </ul>
        <Link
          href="/blog"
          style={{
            background: "#e8ff47",
            color: "var(--bg)",
            border: "none",
            padding: "10px 22px",
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >
          Read Blog →
        </Link>
      </nav>
      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "120px 48px 80px",
          position: "relative",
          zIndex: 10,
          maxWidth: 1200,
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#e8ff47",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              display: "block",
              width: 32,
              height: 1,
              background: "#e8ff47",
            }}
          />
          Weekly Newsletter · Est. 2025
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(3.5rem, 8vw, 7rem)",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            marginBottom: 32,
            color: "var(--text)",
          }}
        >
          Master the{" "}
          <em style={{ fontStyle: "italic", color: "#e8ff47" }}>Stack</em>
          <br />
          <span style={{ display: "block", color: "var(--muted-custom)" }}>
            that Matters.
          </span>
        </h1>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--muted-custom)",
            maxWidth: 480,
            lineHeight: 1.8,
            marginBottom: 48,
          }}
        >
          Weekly deep-dives into Classical ML, Statistics, RAG architectures,
          and Generative AI — distilled into precise, actionable bytes. No
          fluff, no hype.
        </p>
        <div style={{ display: "flex", gap: 0, maxWidth: 480, width: "100%" }}>
          <input
            type="email"
            placeholder="your@email.com"
            style={{
              flex: 1,
              background: "var(--surface)",
              border: "1px solid var(--border-custom)",
              borderRight: "none",
              padding: "16px 20px",
              color: "var(--text)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              outline: "none",
            }}
          />
          <button
            style={{
              background: "#e8ff47",
              color: "var(--bg)",
              border: "1px solid #e8ff47",
              padding: "16px 28px",
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Subscribe →
          </button>
        </div>
        <div
          style={{ marginTop: 64, display: "flex", gap: 48, flexWrap: "wrap" }}
        >
          {[
            { num: "12", suffix: "K+", label: "Subscribers" },
            { num: "52", suffix: "+", label: "Issues / Year" },
            { num: "4", suffix: ".9", label: "Avg. Rating" },
          ].map((s) => (
            <div
              key={s.label}
              style={{ display: "flex", flexDirection: "column", gap: 4 }}
            >
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "2rem",
                  color: "var(--text)",
                }}
              >
                {s.num}
                <span style={{ color: "#e8ff47" }}>{s.suffix}</span>
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted-custom)",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* TICKER */}
      <div
        style={{
          overflow: "hidden",
          borderTop: "1px solid var(--border-custom)",
          borderBottom: "1px solid var(--border-custom)",
          background: "var(--surface)",
          padding: "14px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            animation: "ticker 30s linear infinite",
            whiteSpace: "nowrap",
          }}
        >
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 24,
                padding: "0 32px",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--muted-custom)",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#e8ff47",
                  flexShrink: 0,
                }}
              />
              {item}
            </span>
          ))}
        </div>
      </div>
      {/* TOPICS */}
      <section
        id="topics"
        style={{ padding: "100px 48px", position: "relative", zIndex: 10 }}
      >
        <div
          className="reveal"
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 56,
            paddingBottom: 20,
            borderBottom: "1px solid var(--border-custom)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#e8ff47",
                marginBottom: 8,
              }}
            >
              Coverage
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Four Pillars,
              <br />
              One Stack.
            </h2>
          </div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "5rem",
              color: "var(--muted2)",
              lineHeight: 1,
            }}
          >
            04
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px",
            background: "var(--border-custom)",
            border: "1px solid var(--border-custom)",
          }}
          className="!grid-cols-2 md:!grid-cols-4"
        >
          {topics.map((t) => (
            <div
              key={t.num}
              className="reveal"
              style={{
                background: "var(--bg)",
                padding: "40px 32px",
                transition: "background 0.25s",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "var(--muted2)",
                  marginBottom: 20,
                }}
              >
                {t.num}
              </div>
              <span
                style={{ fontSize: "2rem", marginBottom: 16, display: "block" }}
              >
                {t.icon}
              </span>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  color: "var(--text)",
                  marginBottom: 12,
                }}
              >
                {t.title}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  lineHeight: 1.7,
                  color: "var(--muted-custom)",
                }}
              >
                {t.desc}
              </div>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.62rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      border: "1px solid var(--border-custom)",
                      color: "var(--muted-custom)",
                      background: "var(--surface2)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* LATEST ISSUES */}
      <section
        id="issues"
        style={{ padding: "0 48px 100px", position: "relative", zIndex: 10 }}
      >
        <div
          className="reveal"
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 56,
            paddingBottom: 20,
            borderBottom: "1px solid var(--border-custom)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#e8ff47",
                marginBottom: 8,
              }}
            >
              Latest
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Recent Issues
            </h2>
          </div>
          <Link
            href="/blog"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "5rem",
              color: "var(--muted2)",
              lineHeight: 1,
              textDecoration: "none",
            }}
          >
            →
          </Link>
        </div>
        <div
          className="reveal"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            background: "var(--border-custom)",
            border: "1px solid var(--border-custom)",
          }}
        >
          {issues.map((iss) => (
            <Link
              key={iss.num}
              href="/blog"
              style={{
                background: "var(--bg)",
                display: "grid",
                gridTemplateColumns: "80px 1fr auto auto",
                alignItems: "center",
                gap: 32,
                padding: "28px 32px",
                textDecoration: "none",
                transition: "background 0.2s",
                borderLeft: "3px solid transparent",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.8rem",
                  color: "var(--muted2)",
                }}
              >
                {iss.num}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                    color: iss.color,
                  }}
                >
                  {iss.cat}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "var(--text)",
                  }}
                >
                  {iss.title}
                </div>
              </div>
              <div
                className="hidden md:block"
                style={{ fontSize: "0.72rem", color: "var(--muted-custom)" }}
              >
                {iss.date}
              </div>
              <div
                className="hidden md:block"
                style={{
                  fontSize: "1.2rem",
                  color: "var(--muted2)",
                  transition: "transform 0.2s, color 0.2s",
                }}
              >
                →
              </div>
            </Link>
          ))}
        </div>
      </section>
      {/* ABOUT */}
      <section
        id="about"
        style={{
          padding: "100px 48px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          borderTop: "1px solid var(--border-custom)",
          position: "relative",
          zIndex: 10,
        }}
        className="!grid-cols-1 md:!grid-cols-2"
      >
        <div className="reveal">
          <div
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#e8ff47",
              marginBottom: 8,
            }}
          >
            About
          </div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.8rem",
              lineHeight: 1.35,
              color: "var(--text)",
              marginBottom: 28,
              letterSpacing: "-0.02em",
            }}
          >
            Built for the data professional who wants{" "}
            <em style={{ color: "#e8ff47", fontStyle: "italic" }}>depth</em>,
            not just headlines.
          </div>
          <p
            style={{
              fontSize: "0.82rem",
              lineHeight: 1.85,
              color: "var(--muted-custom)",
              marginBottom: 36,
            }}
          >
            dataBitBytes is a curated weekly newsletter focused on the
            intersection of rigorous statistical thinking, classical machine
            learning, and modern generative AI systems. Every issue is crafted
            to give you a real mental model — not surface-level summaries.
            <br />
            <br />
            Whether you&apos;re a researcher, ML engineer, data scientist, or a
            curious builder — each edition takes one concept and explains it the
            way it should be taught.
          </p>
          <div style={{ display: "flex", gap: 0, width: "100%" }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                flex: 1,
                background: "var(--surface)",
                border: "1px solid var(--border-custom)",
                borderRight: "none",
                padding: "16px 20px",
                color: "var(--text)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.8rem",
                outline: "none",
              }}
            />
            <button
              style={{
                background: "#e8ff47",
                color: "var(--bg)",
                border: "1px solid #e8ff47",
                padding: "16px 28px",
                fontFamily: "var(--font-sans)",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Join Free →
            </button>
          </div>
        </div>
        <div
          className="reveal"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                padding: 20,
                border: "1px solid var(--border-custom)",
                background: "var(--surface)",
                transition: "border-color 0.2s",
              }}
            >
              <div style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: 2 }}>
                {f.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    color: "var(--text)",
                    marginBottom: 4,
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    fontSize: "0.76rem",
                    color: "var(--muted-custom)",
                    lineHeight: 1.6,
                  }}
                >
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* TESTIMONIALS */}
      <section
        style={{
          padding: "100px 48px",
          borderTop: "1px solid var(--border-custom)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          className="reveal"
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 56,
            paddingBottom: 20,
            borderBottom: "1px solid var(--border-custom)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#e8ff47",
                marginBottom: 8,
              }}
            >
              Social Proof
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              What Readers Say
            </h2>
          </div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "5rem",
              color: "var(--muted2)",
              lineHeight: 1,
            }}
          >
            ★
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "var(--border-custom)",
            border: "1px solid var(--border-custom)",
          }}
          className="!grid-cols-1 md:!grid-cols-3"
        >
          {testimonials.map((t) => (
            <div
              key={t.initials}
              className="reveal"
              style={{
                background: "var(--bg)",
                padding: "36px 32px",
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  color: "#e8ff47",
                  fontSize: "0.75rem",
                  letterSpacing: 3,
                  marginBottom: 16,
                }}
              >
                ★★★★★
              </div>
              <div
                style={{
                  fontSize: "0.83rem",
                  lineHeight: 1.75,
                  color: "var(--muted-custom)",
                  marginBottom: 24,
                }}
              >
                {t.text}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--surface2)",
                    border: "1px solid var(--border-custom)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    color: "#e8ff47",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      color: "var(--text)",
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--muted-custom)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* CTA */}
      <div
        className="reveal"
        style={{
          margin: "0 48px 100px",
          background: "var(--surface)",
          border: "1px solid var(--border-custom)",
          padding: 80,
          position: "relative",
          overflow: "hidden",
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -20,
            bottom: -40,
            fontFamily: "var(--font-serif)",
            fontSize: "9rem",
            color: "var(--muted2)",
            opacity: 0.15,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            letterSpacing: "-0.05em",
          }}
        >
          dataBitBytes
        </div>
        <div style={{ maxWidth: 600, position: "relative" }}>
          <div
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#e8ff47",
              marginBottom: 8,
            }}
          >
            Get Started
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            One Email.
            <br />
            Every Week.
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--muted-custom)",
              lineHeight: 1.7,
              marginBottom: 40,
            }}
          >
            Join 12,000+ data professionals getting sharper every Sunday. Free
            forever. Unsubscribe anytime.
          </p>
          <div style={{ display: "flex", gap: 0, maxWidth: 460 }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                flex: 1,
                background: "var(--bg)",
                border: "1px solid var(--border-custom)",
                borderRight: "none",
                padding: "15px 20px",
                color: "var(--text)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.83rem",
                outline: "none",
              }}
            />
            <button
              style={{
                background: "#e8ff47",
                color: "var(--bg)",
                border: "1px solid #e8ff47",
                padding: "15px 28px",
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Subscribe →
            </button>
          </div>
        </div>
      </div>
      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid var(--border-custom)",
          padding: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 10,
        }}
        className="!flex-col md:!flex-row gap-6"
      >
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "1rem",
            color: "var(--text)",
          }}
        >
          data<span style={{ color: "#e8ff47" }}>Bit</span>Bytes
        </div>
        <ul
          style={{
            display: "flex",
            gap: 28,
            listStyle: "none",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <li>
            <Link
              href="/blog"
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted-custom)",
                textDecoration: "none",
              }}
            >
              Blog
            </Link>
          </li>
          <li>
            <a
              href="#about"
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted-custom)",
                textDecoration: "none",
              }}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#topics"
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted-custom)",
                textDecoration: "none",
              }}
            >
              Topics
            </a>
          </li>
        </ul>
        <div style={{ fontSize: "0.7rem", color: "var(--muted2)" }}>
          © 2025 dataBitBytes. All rights reserved.
        </div>
      </footer>
      {/* Ticker animation keyframes */}
      <style>{`
@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
nav.scrolled { background: rgba(10,10,15,0.92) !important; border-color: var(--border-custom) !important; backdrop-filter: blur(12px); }
body { cursor: none; }
`}</style>
    </>
  );
}
