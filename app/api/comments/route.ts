     1	import { NextRequest, NextResponse } from "next/server";
     2	import { getDb, Comment } from "@/lib/mongodb";
     3	import { ObjectId } from "mongodb";
     4	
     5	// GET /api/comments?post_slug=xxx - get comments for a post
     6	// GET /api/comments?admin_key=xxx - get ALL comments (admin)
     7	export async function GET(req: NextRequest) {
     8	  try {
     9	    const db = await getDb();
    10	    const { searchParams } = new URL(req.url);
    11	    const postSlug = searchParams.get("post_slug");
    12	    const adminKey = searchParams.get("admin_key");
    13	    const isAdmin = adminKey === process.env.ADMIN_SECRET_KEY;
    14	
    15	    let filter: Record<string, unknown> = {};
    16	    if (postSlug) {
    17	      filter.postSlug = postSlug;
    18	      if (!isAdmin) filter.approved = true; // public only sees approved
    19	    }
    20	    if (isAdmin && !postSlug) {
    21	      // Admin can see all comments
    22	      filter = {};
    23	    } else if (!isAdmin && !postSlug) {
    24	      return NextResponse.json({ error: "post_slug required" }, { status: 400 });
    25	    }
    26	
    27	    const comments = await db
    28	      .collection("comments")
    29	      .find(filter)
    30	      .sort({ createdAt: -1 })
    31	      .toArray();
    32	
    33	    return NextResponse.json(comments);
    34	  } catch (error) {
    35	    console.error("GET /api/comments error:", error);
    36	    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    37	  }
    38	}
    39	
    40	// POST /api/comments - submit a comment (public, pending approval)
    41	export async function POST(req: NextRequest) {
    42	  try {
    43	    const body = await req.json();
    44	    const db = await getDb();
    45	
    46	    const comment: Comment = {
    47	      postSlug: body.postSlug,
    48	      author: body.author || "Anonymous",
    49	      email: body.email || "",
    50	      content: body.content,
    51	      approved: false, // always pending by default
    52	      createdAt: new Date().toISOString(),
    53	    };
    54	
    55	    const result = await db.collection("comments").insertOne(comment as unknown as Record<string, unknown>);
    56	    return NextResponse.json({ ...comment, _id: result.insertedId }, { status: 201 });
    57	  } catch (error) {
    58	    console.error("POST /api/comments error:", error);
    59	    return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 });
    60	  }
    61	}
    62	
    63	// PUT /api/comments - approve/reject a comment (admin only)
    64	export async function PUT(req: NextRequest) {
    65	  try {
    66	    const body = await req.json();
    67	    const { admin_key, _id, approved } = body;
    68	
    69	    if (admin_key !== process.env.ADMIN_SECRET_KEY) {
    70	      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    71	    }
    72	
    73	    const db = await getDb();
    74	    await db.collection("comments").updateOne(
    75	      { _id: new ObjectId(_id) },
    76	      { $set: { approved } }
    77	    );
    78	
    79	    return NextResponse.json({ success: true });
    80	  } catch (error) {
    81	    console.error("PUT /api/comments error:", error);
    82	    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
    83	  }
    84	}
    85	
    86	// DELETE /api/comments - delete a comment (admin only)
    87	export async function DELETE(req: NextRequest) {
    88	  try {
    89	    const { searchParams } = new URL(req.url);
    90	    const id = searchParams.get("id");
    91	    const adminKey = searchParams.get("admin_key");
    92	
    93	    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    94	      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    95	    }
    96	
    97	    if (!id) {
    98	      return NextResponse.json({ error: "Comment ID required" }, { status: 400 });
    99	    }
   100	
   101	    const db = await getDb();
   102	    await db.collection("comments").deleteOne({ _id: new ObjectId(id) });
   103	    return NextResponse.json({ success: true });
   104	  } catch (error) {
   105	    console.error("DELETE /api/comments error:", error);
   106	    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
   107	  }
   108	}
   109	
   110	
