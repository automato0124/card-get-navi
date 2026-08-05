import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container grid min-h-[55vh] place-items-center py-16 text-center">
      <div className="space-y-4">
        <h1 className="text-xl font-black md:text-2xl">ページが見つかりません</h1>
        <p className="text-sm text-slate-600">URLが変更されたか、掲載が終了した可能性があります。</p>
        <Link href="/" className="inline-flex rounded-2xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">
          トップへ戻る
        </Link>
      </div>
    </main>
  );
}
