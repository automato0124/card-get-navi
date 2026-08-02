import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="container flex flex-col items-center gap-5 py-10 text-center">
        <div>
          <Logo />
        </div>
        <p className="max-w-xl text-sm font-bold leading-7 text-slate-600">
          本サイトは公式ではありません。最終的な応募条件は各店舗の公式ページで確認してください。
        </p>
        <div className="flex w-full flex-col items-center justify-between gap-3 border-t border-line pt-5 text-sm font-bold text-slate-600 sm:flex-row">
          <p className="text-xs">© カードゲットナビ</p>
          <nav aria-label="フッター">
            <Link href="/contact" className="hover:text-brand-700">お問い合わせ</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
