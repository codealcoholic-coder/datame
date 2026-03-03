import { NextRequest, NextResponse } from "next/server";
import { getDb, BlogPost } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
// GET /api/posts - list posts (public: only published, admin: all)
export async function GET(req: NextRequest) {
try {
const db = await getDb();
const { searchParams } = new URL(req.url);
const adminKey = searchParams.get("admin_key");
const isAdmin = adminKey === process.env.ADMIN_SECRET_KEY;
const filter = isAdmin ? {} : { published: true };
const posts = await db
.collection("posts")
.find(filter)
.sort({ createdAt: -1 })
.toArray();
return NextResponse.json(posts);
} catch (error) {
console.error("GET /api/posts error:", error);
return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
}
}
// POST /api/posts - create a post (admin only)
export async function POST(req: NextRequest) {
try {
const body = await req.json();
const { admin_key, ...postData } = body;
if (admin_key !== process.env.ADMIN_SECRET_KEY) {
return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const db = await getDb();
const now = new Date().toISOString();
const post: BlogPost = {
slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
title: postData.title,
excerpt: postData.excerpt || "",
content: postData.content || "",
category: postData.category || "General",
categoryColor: postData.categoryColor || "#e8ff47",
coverImage: postData.coverImage || "",
published: postData.published ?? false,
createdAt: now,
updatedAt: now,
};
const result = await db.collection("posts").insertOne(post as unknown as Record<string, unknown>);
return NextResponse.json({ ...post, _id: result.insertedId }, { status: 201 });
} catch (error) {
console.error("POST /api/posts error:", error);
return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
}
}
// PUT /api/posts - update a post (admin only)
export async function PUT(req: NextRequest) {
try {
const body = await req.json();
const { admin_key, _id, ...updates } = body;
if (admin_key !== process.env.ADMIN_SECRET_KEY) {
return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const db = await getDb();
updates.updatedAt = new Date().toISOString();
await db.collection("posts").updateOne(
{ _id: new ObjectId(_id) },
{ $set: updates }
);
return NextResponse.json({ success: true });
} catch (error) {
console.error("PUT /api/posts error:", error);
return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
}
}
// DELETE /api/posts - delete a post (admin only)
export async function DELETE(req: NextRequest) {
try {
const { searchParams } = new URL(req.url);
const id = searchParams.get("id");
const adminKey = searchParams.get("admin_key");
if (adminKey !== process.env.ADMIN_SECRET_KEY) {
return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
if (!id) {
return NextResponse.json({ error: "Post ID required" }, { status: 400 });
}
const db = await getDb();
await db.collection("posts").deleteOne({ _id: new ObjectId(id) });
// Also delete related comments
await db.collection("comments").deleteMany({ postSlug: id });
return NextResponse.json({ success: true });
} catch (error) {
console.error("DELETE /api/posts error:", error);
return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
}
}
