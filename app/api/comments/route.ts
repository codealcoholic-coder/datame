import { NextRequest, NextResponse } from "next/server";
import { getDb, Comment } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
// GET /api/comments?post_slug=xxx - get comments for a post
// GET /api/comments?admin_key=xxx - get ALL comments (admin)
export async function GET(req: NextRequest) {
    try {
        const db = await getDb();
        const { searchParams } = new URL(req.url);
        const postSlug = searchParams.get("post_slug");
        const adminKey = searchParams.get("admin_key");
        const isAdmin = adminKey === process.env.ADMIN_SECRET_KEY;
        let filter: Record<string, unknown> = {};
        if (postSlug) {
            filter.postSlug = postSlug;
            if (!isAdmin) filter.approved = true; // public only sees approved
        }
        if (isAdmin && !postSlug) {
            // Admin can see all comments
            filter = {};
        } else if (!isAdmin && !postSlug) {
            return NextResponse.json({ error: "post_slug required" }, { status: 400 });
        }
        const comments = await db
            .collection("comments")
            .find(filter)
            .sort({ createdAt: -1 })
            .toArray();
        return NextResponse.json(comments);
    } catch (error) {
        console.error("GET /api/comments error:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}
// POST /api/comments - submit a comment (public, pending approval)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const db = await getDb();
        const comment: Comment = {
            postSlug: body.postSlug,
            author: body.author || "Anonymous",
            email: body.email || "",
            content: body.content,
            approved: false, // always pending by default
            createdAt: new Date().toISOString(),
        };
        const result = await db.collection("comments").insertOne(comment as unknown as Record<string, unknown>);
        return NextResponse.json({ ...comment, _id: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error("POST /api/comments error:", error);
        return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 });
    }
}
// PUT /api/comments - approve/reject a comment (admin only)
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { admin_key, _id, approved } = body;
        if (admin_key !== process.env.ADMIN_SECRET_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const db = await getDb();
        await db.collection("comments").updateOne(
            { _id: new ObjectId(_id) },
            { $set: { approved } }
        );
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT /api/comments error:", error);
        return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
    }
}
// DELETE /api/comments - delete a comment (admin only)
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const adminKey = searchParams.get("admin_key");
        if (adminKey !== process.env.ADMIN_SECRET_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!id) {
            return NextResponse.json({ error: "Comment ID required" }, { status: 400 });
        }
        const db = await getDb();
        await db.collection("comments").deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/comments error:", error);
        return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }
}
