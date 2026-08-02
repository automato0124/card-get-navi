"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";
import { XIcon } from "./x-icon";

const nav = [
  ["発売カレンダー", "/calendar"],
  ["店舗一覧", "/shops"]
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 md:flex" aria-label="グローバル">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-brand-700">
              {label}
            </Link>
          ))}
          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Xを開く"
            className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-brand-500 hover:text-brand-700"
          >
            <XIcon className="h-4 w-4" />
          </a>
        </nav>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
          aria-label="メニュー"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <nav className="container grid gap-2 pb-4 text-sm font-medium md:hidden" aria-label="モバイル">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full px-3 py-2 hover:bg-brand-50" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Xを開く"
            className="grid h-10 w-10 place-items-center rounded-full border border-line hover:bg-brand-50"
          >
            <XIcon className="h-4 w-4" />
          </a>
        </nav>
      ) : null}
    </header>
  );
}
