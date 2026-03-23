import { NextResponse } from "next/server";

const STRAPI_BASE = process.env.STRAPI_BASE_URL || "http://192.168.10.41:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

export async function GET() {
  try {
    const res = await fetch(`${STRAPI_BASE}/api/resume?populate=*`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch resume" }, { status: 502 });
    }

    const json = await res.json();
    const relUrl: string | undefined = json?.data?.resume?.url;

    if (!relUrl) {
      return NextResponse.json({ error: "Resume file not found" }, { status: 404 });
    }

    const fileUrl = relUrl.startsWith("http") ? relUrl : `${STRAPI_BASE}${relUrl}`;

    // 302 redirect → browser opens PDF directly (Chrome PDF viewer)
    return NextResponse.redirect(fileUrl);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
