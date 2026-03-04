import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const payload = {
    embeds: [
      {
        title: '📬 New Contact Form Submission',
        color: 0x00e5a8,
        fields: [
          { name: '👤 Name',    value: name,    inline: true },
          { name: '📧 Email',   value: email,   inline: true },
          { name: '📌 Subject', value: subject, inline: false },
          { name: '💬 Message', value: message, inline: false },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: 'jqiu006.net contact form' },
      },
    ],
  };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to send to Discord' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
