import { MongoClient, Db } from "mongodb";
const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = "databytes_blog";
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  cachedClient = client;
  cachedDb = db;
  return db;
}
// TypeScript interfaces
export interface BlogPost {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML from TipTap
  category: string;
  categoryColor: string;
  coverImage?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface Comment {
  _id?: string;
  postSlug: string;
  author: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: string;
}
