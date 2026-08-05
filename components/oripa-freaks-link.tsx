/* eslint-disable @next/next/no-img-element */

import { ExternalLink } from "lucide-react";

const ORIPA_FREAKS_URL = "https://px.a8.net/svt/ejp?a8mat=4B9VHF+9LWV8Y+5WQC+5YRHE";
const ORIPA_FREAKS_TRACKING_URL = "https://www11.a8.net/0.gif?a8mat=4B9VHF+9LWV8Y+5WQC+5YRHE";

export function OripaFreaksLink() {
  return (
    <aside aria-label="広告">
      <a
        href={ORIPA_FREAKS_URL}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-ink bg-accent-yellow px-3.5 py-2.5 text-sm font-black text-ink shadow-[3px_3px_0_#2866c7] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#2866c7]"
      >
        オリパフリークス
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      </a>
      <img width={1} height={1} src={ORIPA_FREAKS_TRACKING_URL} alt="" loading="lazy" decoding="async" className="sr-only" />
    </aside>
  );
}
