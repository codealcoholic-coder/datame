     1	import { NextRequest, NextResponse } from "next/server";
     2	import { getDb, BlogPost } from "@/lib/mongodb";
     3	import { ObjectId } from "mongodb";
     4	
     5	// GET /api/posts - list posts (public: only published, admin: all)
     6	export async function GET(req: NextRequest) {
     7	  try {
     8	    const db = await getDb();
     9	    const { searchParams } = new URL(req.url);
    10	    const adminKey = searchParams.get("admin_key");
    11	    const isAdmin = adminKey === process.env.ADMIN_SECRET_KEY;
    12	
    13	    const filter = isAdmin ? {} : { published: true };
    14	    const posts = await db
    15	      .collection("posts")
    16	      .find(filter)
    17	      .sort({ createdAt: -1 })
    18	      .toArray();
    19	
    20	    return NextResponse.json(posts);
    21	  } catch (error) {
    22	    console.error("GET /api/posts error:", error);
    23	    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    24	  }
    25	}
    26	
    27	// POST /api/posts - create a post (admin only)
    28	export async function POST(req: NextRequest) {
    29	  try {
    30	    const body = await req.json();
    31	    const { admin_key, ...postData } = body;
    32	
    33	    if (admin_key !== process.env.ADMIN_SECRET_KEY) {
    34	      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    35	    }
    36	
    37	    const db = await getDb();
    38	    const now = new Date().toISOString();
    39	
    40	    const post: BlogPost = {
    41	      slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    42	      title: postData.title,
    43	      excerpt: postData.excerpt || "",
    44	      content: postData.content || "",
    45	      category: postData.category || "General",
    46	      categoryColor: postData.categoryColor || "#e8ff47",
    47	      coverImage: postData.coverImage || "",
    48	      published: postData.published ?? false,
    49	      createdAt: now,
    50	      updatedAt: now,
    51	    };
    52	
    53	    const result = await db.collection("posts").insertOne(post as unknown as Record<string, unknown>);
    54	    return NextResponse.json({ ...post, _id: result.insertedId }, { status: 201 });
    55	  } catch (error) {
    56	    console.error("POST /api/posts error:", error);
    57	    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    58	  }
    59	}
    60	
    61	// PUT /api/posts - update a post (admin only)
    62	export async function PUT(req: NextRequest) {
    63	  try {
    64	    const body = await req.json();
    65	    const { admin_key, _id, ...updates } = body;
    66	
    67	    if (admin_key !== process.env.ADMIN_SECRET_KEY) {
    68	      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    69	    }
    70	
    71	    const db = await getDb();
    72	    updates.updatedAt = new Date().toISOString();
    73	
    74	    await db.collection("posts").updateOne(
    75	      { _id: new ObjectId(_id) },
    76	      { $set: updates }
    77	    );
    78	
    79	    return NextResponse.json({ success: true });
    80	  } catch (error) {
    81	    console.error("PUT /api/posts error:", error);
    82	    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    83	  }
    84	}
    85	
    86	// DELETE /api/posts - delete a post (admin only)
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
    98	      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    99	    }
   100	
   101	    const db = await getDb();
   102	    await db.collection("posts").deleteOne({ _id: new ObjectId(id) });
   103	    // Also delete related comments
   104	    await db.collection("comments").deleteMany({ postSlug: id });
   105	
   106	    return NextResponse.json({ success: true });
   107	  } catch (error) {
   108	    console.error("DELETE /api/posts error:", error);
   109	    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
   110	  }
   111	}
   112	
   113	
