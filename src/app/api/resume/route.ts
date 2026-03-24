const STRAPI_BASE = process.env.STRAPI_BASE_URL ?? "";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN ?? "";

export async function GET() {
  try {
    // Step 1: resolve the file URL (server-side, token never leaves server)
    const apiRes = await fetch(`${STRAPI_BASE}/api/resume?populate=*`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      next: { revalidate: 3600 },
    });

    if (!apiRes.ok) {
      return new Response("Unavailable", { status: 502 });
    }

    const json = await apiRes.json();
    const relUrl: string | undefined = json?.data?.resume?.url;
    if (!relUrl) return new Response("Not found", { status: 404 });

    const fileUrl = relUrl.startsWith("http") ? relUrl : `${STRAPI_BASE}${relUrl}`;

    // Step 2: fetch the PDF server-side and stream it back
    // The client only ever sees /api/resume — internal IP/path never exposed
    const fileRes = await fetch(fileUrl);
    if (!fileRes.ok) return new Response("File unavailable", { status: 502 });

    return new Response(fileRes.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="resume.pdf"',
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new Response("Server error", { status: 500 });
  }
}
