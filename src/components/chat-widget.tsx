"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Message = { from: "us" | "them"; text: string };

export function ChatWidget() {
  const t = useTranslations("chat");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "us", text: t("greeting") },
  ]);
  const [draft, setDraft] = useState("");

  function send() {
    if (!draft.trim()) return;
    // TODO: подключить реальный канал (Supabase Realtime / WhatsApp Business API / Telegram Bot API)
    setMessages((prev) => [...prev, { from: "them", text: draft.trim() }]);
    setDraft("");
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      {open && (
        <div className="mb-3 flex h-96 w-80 flex-col border border-ink bg-paper shadow-[6px_6px_0_0_var(--color-ink)]">
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
            <span className="font-mono text-xs uppercase tracking-wide text-ink">
              {t("title")}
            </span>
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="text-ink/50 hover:text-lacquer"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div key={i} className={cnRow(m.from)}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t border-ink/10 p-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t("placeholder")}
              className="flex-1 border border-ink/20 bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-lacquer"
            />
            <button
              onClick={send}
              className="border border-ink px-3 py-2 font-mono text-xs uppercase hover:bg-ink hover:text-paper"
            >
              →
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle chat"
        className="flex h-14 w-14 items-center justify-center border border-ink bg-lacquer text-paper shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}

function cnRow(from: Message["from"]) {
  const base = "max-w-[85%] px-3 py-2 text-sm";
  return from === "us"
    ? `${base} bg-oak/15 text-ink`
    : `${base} ml-auto bg-ink text-paper`;
}
