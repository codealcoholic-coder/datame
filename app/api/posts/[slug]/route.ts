import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
export async function GET(
req: NextRequest,
{ params }: { params: Promise<{ slug: string }> }
) {
try {
const { slug } = await params;
const db = await getDb();
const post = await db.collection("posts").findOne({ slug, published: true });
if (!post) {
return NextResponse.json({ error: "Post not found" }, { status: 404 });
}
return NextResponse.json(post);
} catch (error) {
console.error("GET /api/posts/[slug] error:", error);
return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
}
}
