import { NextResponse } from "next/server";

/**
 * Order intake endpoint.
 *
 * Zero-config by default: validates the payload and returns { ok: true }.
 * The client always has a guaranteed WhatsApp/Telegram fallback, so the form
 * works even with no backend secrets.
 *
 * To actually deliver leads to a Telegram chat, set these env vars
 * (e.g. in Vercel project settings) — no code change needed:
 *   TELEGRAM_BOT_TOKEN=123456:ABC...
 *   TELEGRAM_CHAT_ID=-1001234567890
 */

type OrderPayload = {
  name?: string;
  phone?: string;
  email?: string;
  product?: string;
  details?: string;
  locale?: string;
};

export async function POST(request: Request) {
  let body: OrderPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();

  if (name.length < 2 || !isValidPhone(phone)) {
    return NextResponse.json(
      { ok: false, error: "validation" },
      { status: 400 },
    );
  }

  const delivered = await sendToTelegram(body);

  return NextResponse.json({ ok: true, delivered });
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

async function sendToTelegram(o: OrderPayload): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const text = [
    "🪚 New request — tartoon.am",
    `Name: ${o.name}`,
    `Phone: ${o.phone}`,
    o.email ? `Email: ${o.email}` : null,
    o.product ? `Product: ${o.product}` : null,
    o.details ? `Details: ${o.details}` : null,
    o.locale ? `Locale: ${o.locale}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}
