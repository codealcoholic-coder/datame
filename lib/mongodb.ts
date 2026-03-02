     1	import { MongoClient, Db } from "mongodb";
     2	
     3	const MONGODB_URI = process.env.MONGODB_URI || "";
     4	const DB_NAME = "databytes_blog";
     5	
     6	let cachedClient: MongoClient | null = null;
     7	let cachedDb: Db | null = null;
     8	
     9	export async function getDb(): Promise<Db> {
    10	  if (cachedDb) return cachedDb;
    11	
    12	  if (!MONGODB_URI) {
    13	    throw new Error("MONGODB_URI environment variable is not set");
    14	  }
    15	
    16	  const client = new MongoClient(MONGODB_URI);
    17	  await client.connect();
    18	  const db = client.db(DB_NAME);
    19	
    20	  cachedClient = client;
    21	  cachedDb = db;
    22	
    23	  return db;
    24	}
    25	
    26	// TypeScript interfaces
    27	export interface BlogPost {
    28	  _id?: string;
    29	  slug: string;
    30	  title: string;
    31	  excerpt: string;
    32	  content: string; // HTML from TipTap
    33	  category: string;
    34	  categoryColor: string;
    35	  coverImage?: string;
    36	  published: boolean;
    37	  createdAt: string;
    38	  updatedAt: string;
    39	}
    40	
    41	export interface Comment {
    42	  _id?: string;
    43	  postSlug: string;
    44	  author: string;
    45	  email: string;
    46	  content: string;
    47	  approved: boolean;
    48	  createdAt: string;
    49	}
    50	
