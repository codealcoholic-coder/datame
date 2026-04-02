"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import React from "react";

// Types for API data
interface Post {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  published: boolean;
  createdAt: string;
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

interface Stats {
  postsCount: number;
  commentsCount: number;
}

// Knowledge Graph Node type
interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  size: number;
  category: string;
  animDuration: number; // Pre-computed animation duration
}

// Knowledge Graph Edge type
interface GraphEdge {
  from: string;
  to: string;
}

// Knowledge Graph Data with pre-computed animation durations
const graphNodes: GraphNode[] = [
  // Core topics (larger nodes)
  { id: "ml", label: "Machine Learning", x: 45, y: 35, color: "#e8ff47", size: 24, category: "core", animDuration: 4.5 },
  { id: "stats", label: "Statistics", x: 20, y: 60, color: "#47ffe8", size: 22, category: "core", animDuration: 5.2 },
  { id: "genai", label: "Generative AI", x: 75, y: 65, color: "#b847ff", size: 22, category: "core", animDuration: 4.8 },
  { id: "rag", label: "RAG", x: 80, y: 30, color: "#ff6b47", size: 20, category: "core", animDuration: 5.5 },
  
  // ML subtopics
  { id: "xgboost", label: "XGBoost", x: 30, y: 20, color: "#e8ff47", size: 12, category: "ml", animDuration: 4.2 },
  { id: "trees", label: "Trees", x: 25, y: 42, color: "#e8ff47", size: 11, category: "ml", animDuration: 5.0 },
  { id: "clustering", label: "Clustering", x: 60, y: 50, color: "#e8ff47", size: 11, category: "ml", animDuration: 4.7 },
  
  // Stats subtopics
  { id: "bayesian", label: "Bayesian", x: 8, y: 45, color: "#47ffe8", size: 12, category: "stats", animDuration: 5.3 },
  { id: "causal", label: "Causal", x: 35, y: 75, color: "#47ffe8", size: 11, category: "stats", animDuration: 4.4 },
  
  // GenAI subtopics
  { id: "llm", label: "LLMs", x: 90, y: 50, color: "#b847ff", size: 14, category: "genai", animDuration: 4.9 },
  { id: "finetuning", label: "Fine-tuning", x: 65, y: 82, color: "#b847ff", size: 11, category: "genai", animDuration: 5.1 },
  { id: "agents", label: "Agents", x: 88, y: 78, color: "#b847ff", size: 10, category: "genai", animDuration: 4.6 },
  
  // RAG subtopics
  { id: "embeddings", label: "Embeddings", x: 92, y: 18, color: "#ff6b47", size: 12, category: "rag", animDuration: 5.4 },
  { id: "vectordb", label: "VectorDB", x: 70, y: 12, color: "#ff6b47", size: 11, category: "rag", animDuration: 4.3 },
];

const graphEdges: GraphEdge[] = [
  // Core connections
  { from: "ml", to: "stats" },
  { from: "ml", to: "genai" },
  { from: "genai", to: "rag" },
  { from: "stats", to: "genai" },
  { from: "ml", to: "rag" },
  
  // ML connections
  { from: "ml", to: "xgboost" },
  { from: "ml", to: "trees" },
  { from: "ml", to: "clustering" },
  
  // Stats connections
  { from: "stats", to: "bayesian" },
  { from: "stats", to: "causal" },
  
  // GenAI connections
  { from: "genai", to: "llm" },
  { from: "genai", to: "finetuning" },
  { from: "genai", to: "agents" },
  { from: "llm", to: "agents" },
  
  // RAG connections
  { from: "rag", to: "embeddings" },
  { from: "rag", to: "vectordb" },
  { from: "llm", to: "rag" },
];

// Pre-computed particles with fixed positions
const particles = [
  { x: 15, y: 25, dur1: 6.5, dur2: 4.2 },
  { x: 50, y: 90, dur1: 7.2, dur2: 3.8 },
  { x: 85, y: 40, dur1: 5.8, dur2: 4.5 },
  { x: 40, y: 15, dur1: 6.8, dur2: 3.5 },
  { x: 95, y: 85, dur1: 7.5, dur2: 4.0 },
  { x: 12, y: 80, dur1: 6.2, dur2: 4.8 },
  { x: 55, y: 55, dur1: 7.0, dur2: 3.2 },
  { x: 78, y: 92, dur1: 5.5, dur2: 4.3 },
];

// Knowledge Graph Component - Client Only Rendering
function KnowledgeGraph(): React.ReactElement | null {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Only render on client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getNodeById = (id: string): GraphNode | undefined => {
    return graphNodes.find((n) => n.id === id);
  };

  const isConnected = (nodeId: string): boolean => {
    if (!hoveredNode) return false;
    return graphEdges.some(
      (e) =>
        (e.from === hoveredNode && e.to === nodeId) ||
        (e.to === hoveredNode && e.from === nodeId) ||
        nodeId === hoveredNode
    );
  };

  // Don't render on server
  if (!isClient) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        right: 0,
        transform: "translateY(-50%)",
        width: "45%",
        height: "70%",
        maxHeight: 500,
        overflow: "visible",
        pointerEvents: "none",
      }}
      className="hidden md:block"
    >
      <svg
        viewBox="0 0 100 100"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "visible",
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {graphEdges.map((edge, index) => {
          const fromNode = getNodeById(edge.from);
          const toNode = getNodeById(edge.to);
          if (!fromNode || !toNode) return null;

          const isHighlighted =
            hoveredNode &&
            (edge.from === hoveredNode || edge.to === hoveredNode);

          return (
            <line
              key={`edge-${index}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={isHighlighted ? "#e8ff47" : "rgba(255,255,255,0.12)"}
              strokeWidth={isHighlighted ? 0.5 : 0.2}
              style={{
                transition: "stroke 0.3s, stroke-width 0.3s",
              }}
            />
          );
        })}

        {/* Nodes */}
        {graphNodes.map((node) => {
          const isHovered = hoveredNode === node.id;
          const isConnectedToHovered = isConnected(node.id);
          const shouldDim = hoveredNode && !isConnectedToHovered;
          const nodeRadius = node.size / 10;

          return (
            <g
              key={node.id}
              style={{
                pointerEvents: "auto",
                cursor: "pointer",
                transition: "opacity 0.3s",
                opacity: shouldDim ? 0.15 : 1,
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Pulse ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill={node.color}
                opacity={0.2}
              >
                <animate
                  attributeName="r"
                  values={`${nodeRadius};${nodeRadius * 1.8};${nodeRadius}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.2;0.05;0.2"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Main node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? nodeRadius * 1.3 : nodeRadius}
                fill={node.color}
                opacity={isHovered ? 1 : 0.85}
                style={{
                  transition: "r 0.2s, opacity 0.2s",
                  filter: "url(#glow)",
                }}
              >
                <animate
                  attributeName="cy"
                  values={`${node.y};${node.y - 0.8};${node.y}`}
                  dur={`${node.animDuration}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Label */}
              <text
                x={node.x}
                y={node.y + nodeRadius + 3}
                textAnchor="middle"
                fill={isHovered ? "#ffffff" : "rgba(255,255,255,0.6)"}
                fontSize={node.category === "core" ? 2.5 : 1.8}
                fontFamily="var(--font-sans)"
                fontWeight={node.category === "core" ? 600 : 400}
                style={{
                  transition: "fill 0.2s",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {/* Decorative particles */}
        {particles.map((p, i) => (
          <circle
            key={`particle-${i}`}
            cx={p.x}
            cy={p.y}
            r={0.4}
            fill="rgba(232, 255, 71, 0.3)"
          >
            <animate
              attributeName="cy"
              values={`${p.y};${p.y - 5};${p.y}`}
              dur={`${p.dur1}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0.1;0.3"
              dur={`${p.dur2}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      {/* Left gradient for text readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          background: "linear-gradient(to right, var(--bg) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// Static data
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
  "Data Engineering",
  "MLOps",
  "Feature Engineering",
  "Model Evaluation",
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

const features = [
  {
    icon: "🧠",
    title: "Concept-First Writing",
    desc: "Every article starts with why, not what. Mental models over syntax.",
  },
  {
    icon: "📊",
    title: "Visual Breakdowns",
    desc: "Diagrams, annotated code, and step-by-step walkthroughs make complex topics click.",
  },
  {
    icon: "🔬",
    title: "In-Depth Research",
    desc: "We dive deep into papers, implementations, and real-world applications.",
  },
  {
    icon: "🔗",
    title: "Curated Resources",
    desc: "Papers, repos, tools, and talks — only the ones worth your time.",
  },
];

// Helper functions
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getIssueNumber(index: number, total: number): string {
  const issueNum = total - index;
  return issueNum.toString().padStart(3, "0");
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// CSS styles as a string
const globalStyles = `
  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  nav.scrolled {
    background: rgba(10, 10, 15, 0.92) !important;
    border-color: var(--border-custom) !important;
    backdrop-filter: blur(12px);
  }
`;

export default function Home(): React.ReactElement {
  const navRef = useRef<HTMLElement>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredComments, setFeaturedComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<Stats>({ postsCount: 0, commentsCount: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const postsRes = await fetch("/api/posts");
        if (!postsRes.ok) throw new Error("Failed to fetch posts");
        const postsData: Post[] = await postsRes.json();

        const publishedPosts = postsData
          .filter((post) => post.published)
          .slice(0, 5);
        setPosts(publishedPosts);

        const totalPublished = postsData.filter((p) => p.published).length;

        const allComments: Comment[] = [];
        for (const post of publishedPosts.slice(0, 3)) {
          try {
            const commentsRes = await fetch(
              `/api/comments?post_slug=${post.slug}`
            );
            if (commentsRes.ok) {
              const commentsData: Comment[] = await commentsRes.json();
              allComments.push(...commentsData);
            }
          } catch (commentError) {
            console.error("Failed to fetch comments for post:", post.slug, commentError);
          }
        }

        const approvedComments = allComments
          .filter((c) => c.approved && c.content.length > 50)
          .slice(0, 3);
        setFeaturedComments(approvedComments);

        setStats({
          postsCount: totalPublished,
          commentsCount: allComments.filter((c) => c.approved).length,
        });
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Nav scroll and reveal animations
  useEffect(() => {
    const nav = navRef.current;
    const onScroll = (): void => {
      nav?.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);

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
      { threshold: 0.1 }
    );
    reveals.forEach((el) => obs.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <div>
      {/* Inject global styles */}
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

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
          Explore Articles →
        </Link>
      </nav>

      {/* HERO WITH KNOWLEDGE GRAPH */}
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
          overflow: "hidden",
        }}
      >
        {/* Knowledge Graph Background */}
        <KnowledgeGraph />

        {/* Hero Content */}
        <div style={{ maxWidth: 580, position: "relative", zIndex: 2 }}>
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
            Data Science Blog · Weekly Updates
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: 32,
              color: "var(--text)",
            }}
          >
            Learn Data Science,
            <br />
            <span style={{ color: "#e8ff47" }}>
              <em style={{ fontStyle: "italic" }}>One Byte</em>
            </span>{" "}
            <span style={{ color: "var(--muted-custom)" }}>at a Time.</span>
          </h1>
          <p
            style={{
              fontSize: "0.92rem",
              color: "var(--muted-custom)",
              maxWidth: 480,
              lineHeight: 1.8,
              marginBottom: 40,
            }}
          >
            Deep-dive articles on Classical ML, Statistics, RAG architectures,
            and Generative AI. We break down complex concepts into clear,
            actionable insights — with new content published weekly.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link
              href="/blog"
              style={{
                background: "#e8ff47",
                color: "var(--bg)",
                border: "1px solid #e8ff47",
                padding: "14px 28px",
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Read the Blog →
            </Link>
            <a
              href="#topics"
              style={{
                background: "transparent",
                color: "var(--text)",
                border: "1px solid var(--border-custom)",
                padding: "14px 28px",
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Explore Topics
            </a>
          </div>

          {/* DYNAMIC STATS */}
          <div
            style={{ marginTop: 56, display: "flex", gap: 40, flexWrap: "wrap" }}
          >
            {loading ? (
              <div style={{ color: "var(--muted-custom)", fontSize: "0.85rem" }}>
                Loading stats...
              </div>
            ) : (
              <React.Fragment>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.8rem",
                      color: "var(--text)",
                    }}
                  >
                    {stats.postsCount}
                    <span style={{ color: "#e8ff47" }}>+</span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--muted-custom)",
                    }}
                  >
                    In-Depth Articles
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.8rem",
                      color: "var(--text)",
                    }}
                  >
                    {topics.length}
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--muted-custom)",
                    }}
                  >
                    Core Topics
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.8rem",
                      color: "var(--text)",
                    }}
                  >
                    Weekly
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--muted-custom)",
                    }}
                  >
                    New Content
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>

        {/* Graph legend - visible on medium+ screens */}
        <div
          className="hidden md:flex"
          style={{
            position: "absolute",
            bottom: 32,
            right: 48,
            gap: 20,
            zIndex: 2,
          }}
        >
          {[
            { color: "#e8ff47", label: "ML" },
            { color: "#47ffe8", label: "Stats" },
            { color: "#ff6b47", label: "RAG" },
            { color: "#b847ff", label: "GenAI" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: item.color,
                }}
              />
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--muted-custom)",
                }}
              >
                {item.label}
              </span>
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
              What We Cover
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
          className="!grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4"
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

      {/* LATEST ARTICLES - DYNAMIC */}
      <section
        id="articles"
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
              Recent Articles
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
          {loading && (
            <div
              style={{
                background: "var(--bg)",
                padding: "60px 32px",
                textAlign: "center",
                color: "var(--muted-custom)",
              }}
            >
              Loading articles...
            </div>
          )}
          {!loading && error && (
            <div
              style={{
                background: "var(--bg)",
                padding: "60px 32px",
                textAlign: "center",
                color: "var(--muted-custom)",
              }}
            >
              {error}
            </div>
          )}
          {!loading && !error && posts.length === 0 && (
            <div
              style={{
                background: "var(--bg)",
                padding: "60px 32px",
                textAlign: "center",
                color: "var(--muted-custom)",
              }}
            >
              No articles yet. Check back soon — new content drops weekly!
            </div>
          )}
          {!loading &&
            !error &&
            posts.length > 0 &&
            posts.map((post, index) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                style={{
                  background: "var(--bg)",
                  display: "grid",
                  gridTemplateColumns: "60px 1fr auto auto",
                  alignItems: "center",
                  gap: 24,
                  padding: "24px 28px",
                  textDecoration: "none",
                  transition: "background 0.2s",
                  borderLeft: "3px solid transparent",
                }}
                className="!grid-cols-[1fr] sm:!grid-cols-[60px_1fr_auto_auto]"
              >
                <div
                  className="hidden sm:block"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.6rem",
                    color: "var(--muted2)",
                  }}
                >
                  {getIssueNumber(index, stats.postsCount)}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                      color: post.categoryColor || "#e8ff47",
                    }}
                  >
                    {post.category}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "var(--text)",
                    }}
                  >
                    {post.title}
                  </div>
                </div>
                <div
                  className="hidden md:block"
                  style={{ fontSize: "0.72rem", color: "var(--muted-custom)" }}
                >
                  {formatDate(post.createdAt)}
                </div>
                <div
                  className="hidden sm:block"
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
        {!loading && !error && posts.length > 0 && (
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link
              href="/blog"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#e8ff47",
                textDecoration: "none",
                borderBottom: "1px solid #e8ff47",
                paddingBottom: 4,
              }}
            >
              View All Articles →
            </Link>
          </div>
        )}
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
            dataBitBytes is a data science blog focused on the intersection of
            rigorous statistical thinking, classical machine learning, and
            modern generative AI systems. Every article is crafted to give you a
            real mental model — not surface-level summaries.
            <br />
            <br />
            Whether you&apos;re a researcher, ML engineer, data scientist, or a
            curious builder — we take one concept at a time and explain it the
            way it should be taught. New articles drop every week.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Link
              href="/blog"
              style={{
                background: "#e8ff47",
                color: "var(--bg)",
                border: "1px solid #e8ff47",
                padding: "14px 24px",
                fontFamily: "var(--font-sans)",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Start Reading →
            </Link>
            <span
              style={{
                fontSize: "0.72rem",
                color: "var(--muted-custom)",
                letterSpacing: "0.05em",
              }}
            >
              New articles every week
            </span>
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

      {/* TESTIMONIALS - DYNAMIC FROM COMMENTS */}
      {featuredComments.length > 0 && (
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
                Community
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
            {featuredComments.map((comment) => (
              <div
                key={comment._id}
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
                  &quot;{comment.content}&quot;
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
                    {getInitials(comment.author)}
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
                      {comment.author}
                    </div>
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: "var(--muted-custom)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div
        className="reveal"
        style={{
          margin: "0 48px 100px",
          background: "var(--surface)",
          border: "1px solid var(--border-custom)",
          padding: "60px",
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
            fontSize: "8rem",
            color: "var(--muted2)",
            opacity: 0.15,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            letterSpacing: "-0.05em",
          }}
        >
          dataBitBytes
        </div>
        <div style={{ maxWidth: 550, position: "relative" }}>
          <div
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#e8ff47",
              marginBottom: 8,
            }}
          >
            Start Learning
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Ready to Go
            <br />
            Deeper?
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--muted-custom)",
              lineHeight: 1.7,
              marginBottom: 32,
            }}
          >
            Explore our collection of in-depth articles on machine learning,
            statistics, and AI. New content published weekly.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link
              href="/blog"
              style={{
                background: "#e8ff47",
                color: "var(--bg)",
                border: "1px solid #e8ff47",
                padding: "14px 24px",
                fontFamily: "var(--font-sans)",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Browse All Articles →
            </Link>
            <a
              href="#topics"
              style={{
                background: "transparent",
                color: "var(--text)",
                border: "1px solid var(--border-custom)",
                padding: "14px 24px",
                fontFamily: "var(--font-sans)",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              View Topics
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid var(--border-custom)",
          padding: "48px",
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
        </ul>
        <div style={{ fontSize: "0.7rem", color: "var(--muted2)" }}>
          © 2025 dataBitBytes. All rights reserved.
        </div>
      </footer>
    </div>
  );
}