import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container grid min-h-[55vh] place-items-center py-16 text-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-black md:text-3xl">ページが見つかりません</h1>
        <p className="text-slate-600">URLが変更されたか、掲載が終了した可能性があります。</p>
        <Link href="/" className="inline-flex rounded-2xl bg-brand-600 px-4 py-2 font-bold text-white">
          トップへ戻る
        </Link>
      </div>
    </main>
  );
}
