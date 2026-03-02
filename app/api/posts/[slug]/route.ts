     1	import { NextRequest, NextResponse } from "next/server";
     2	import { getDb } from "@/lib/mongodb";
     3	
     4	export async function GET(
     5	  req: NextRequest,
     6	  { params }: { params: Promise<{ slug: string }> }
     7	) {
     8	  try {
     9	    const { slug } = await params;
    10	    const db = await getDb();
    11	    const post = await db.collection("posts").findOne({ slug, published: true });
    12	
    13	    if (!post) {
    14	      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    15	    }
    16	
    17	    return NextResponse.json(post);
    18	  } catch (error) {
    19	    console.error("GET /api/posts/[slug] error:", error);
    20	    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
    21	  }
    22	}
    23	
