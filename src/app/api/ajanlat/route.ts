import { NextRequest, NextResponse } from 'next/server';

interface QuotePayload {
  types: string[];
  location: string;
  timeline: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  leadScore: 'hot' | 'warm' | 'cold';
}

const scoreEmoji = { hot: '🔥', warm: '🌡️', cold: '❄️' };

export async function POST(request: NextRequest) {
  let body: QuotePayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, phone, description, types, location, timeline, budget, leadScore } = body;

  if (!name?.trim() || !email?.trim() || !phone?.trim() || description?.trim().length < 50) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 422 });
  }

  // Build email body for the owner
  const subject = `[${scoreEmoji[leadScore]} ${leadScore.toUpperCase()}] Új ajánlatkérés – ${name}`;
  const text = `
Új ajánlatkérés érkezett a weboldalon!

Lead minőség: ${scoreEmoji[leadScore]} ${leadScore.toUpperCase()}
─────────────────────────────────
Típus(ok): ${types.join(', ')}
Helyszín: ${location}
Időpont: ${timeline}
Büdzsé: ${budget}

Kapcsolat:
  Név:     ${name}
  E-mail:  ${email}
  Telefon: ${phone}

Leírás:
${description}
─────────────────────────────────
Küldés ideje: ${new Date().toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' })}
`.trim();

  // If RESEND_API_KEY is set, send real email; otherwise log for development
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.OWNER_EMAIL ?? 'czimbertibor2@gmail.com';

  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Cimbi Weboldal <noreply@czimber-tibor.vercel.app>',
          to: [toEmail],
          subject,
          text,
        }),
      });

      if (!res.ok) {
        console.error('Resend error:', await res.text());
        return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
      }
    } catch (err) {
      console.error('Email error:', err);
      return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
    }
  } else {
    // Development: log to console
    console.log('\n📬 QUOTE FORM SUBMISSION\n', text, '\n');
  }

  return NextResponse.json({ ok: true, leadScore });
}
