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
          className="relative grid h-12 w-12 place-items-center rounded-full border-2 border-line bg-white transition hover:bg-brand-50 md:hidden"
          aria-label="メニュー"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <Menu className={`absolute h-6 w-6 transition duration-200 ${open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
          <X className={`absolute h-6 w-6 transition duration-200 ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"}`} />
        </button>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${open ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}`}>
        <nav className={`container grid gap-3 pb-5 pt-1 text-base font-black transition duration-300 ${open ? "translate-y-0" : "-translate-y-2"}`} aria-label="モバイル">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl border border-line bg-white px-4 py-4 hover:bg-brand-50"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Xを開く"
            className="grid h-12 w-12 place-items-center rounded-full border border-line hover:bg-brand-50"
          >
            <XIcon className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
