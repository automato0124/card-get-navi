"use client";

import { useMemo, useState } from "react";
import { Copy, Download, Plus, Upload } from "lucide-react";
import { getLotteriesWithRelations, lotteries as seedLotteries } from "@/lib/data";
import { formatTokyo, tokyoLocalInputToIso } from "@/lib/time";
import type { Lottery } from "@/lib/types";

function toCsv(rows: Lottery[]) {
  const header = ["id", "title", "product_id", "shop_id", "application_method", "start_at", "end_at", "official_application_url", "requirements"];
  const body = rows.map((row) =>
    [row.id, row.title, row.productId, row.shopId, row.applicationMethod, row.startAt || "", row.endAt || "", row.officialApplicationUrl || "", row.requirements.join("|")]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(",")
  );
  return [header.join(","), ...body].join("\n");
}

function tweetText(lottery: ReturnType<typeof getLotteriesWithRelations>[number]) {
  return `【${lottery.computedStatus === "closing_soon" ? "本日締切" : "ポケカ抽選開始"}】\n\n${lottery.product.name}の抽選受付が${lottery.shop.name}で${lottery.computedStatus === "upcoming" ? "近日開始します" : "受付中です"}。\n\n締切：${formatTokyo(lottery.endAt)}\n応募方法：${lottery.applicationMethod}\n条件：${lottery.requirements.join("、") || "公式ページ確認"}\n\n詳細はこちら\n/products/${lottery.product.slug}`;
}

export function AdminConsole() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState<Lottery[]>(seedLotteries);
  const [draft, setDraft] = useState({ title: "", productId: "prod-aurora", shopId: "shop-a", endAt: "" });
  const related = useMemo(() => getLotteriesWithRelations().map((lottery) => ({ ...lottery, ...(rows.find((row) => row.id === lottery.id) || {}) })), [rows]);
  const stale = rows.filter((row) => Date.now() - new Date(row.sourceCheckedAt).getTime() > 48 * 60 * 60 * 1000).length;
  const open = related.filter((row) => ["open", "closing_soon"].includes(row.computedStatus)).length;
  const todayClosing = related.filter((row) => row.computedStatus === "closing_soon").length;
  const upcoming = related.filter((row) => row.computedStatus === "upcoming").length;
  const ended = related.filter((row) => row.computedStatus === "ended").length;

  if (!loggedIn) {
    return (
      <main className="container grid min-h-[60vh] place-items-center py-10">
        <form
          className="w-full max-w-sm rounded-3xl border border-line bg-white p-6 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            if (password) setLoggedIn(true);
          }}
        >
          <h1 className="text-2xl font-black">管理者ログイン</h1>
          <p className="mt-2 text-sm text-slate-600">本番のコンテンツ編集は microCMS 管理画面で行います。</p>
          <label className="mt-5 grid gap-1 text-sm font-bold">
            管理パスワード
            <input className="h-11 rounded-2xl border border-line px-3" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button className="mt-4 w-full rounded-2xl bg-brand-600 px-4 py-2 font-bold text-white">ログイン</button>
        </form>
      </main>
    );
  }

  return (
    <main className="container space-y-8 py-10">
      <section className="space-y-2">
        <h1 className="text-3xl font-black">管理ダッシュボード</h1>
        <p className="text-sm text-slate-600">CSV、広告、サイト設定の確認用ダッシュボードです。本番データは microCMS で管理します。</p>
      </section>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {[["今日締切", todayClosing], ["受付中", open], ["近日開始", upcoming], ["終了済み", ended], ["48h超未確認", stale], ["広告クリック", 0]].map(([label, value]) => (
          <div key={String(label)} className="rounded-3xl border border-line bg-white p-4"><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-brand-700">{String(value)}</p></div>
        ))}
      </section>
      <section className="rounded-3xl border border-line bg-white p-4">
        <h2 className="text-xl font-black">抽選情報登録</h2>
        <form
          className="mt-4 grid gap-3 md:grid-cols-5"
          onSubmit={(event) => {
            event.preventDefault();
            setRows((current) => [
              {
                id: `local-${Date.now()}`,
                title: draft.title || "管理画面追加サンプル",
                productId: draft.productId,
                shopId: draft.shopId,
                applicationMethod: "online",
                startAt: new Date().toISOString(),
                endAt: draft.endAt ? tokyoLocalInputToIso(draft.endAt) : new Date(Date.now() + 86400000).toISOString(),
                officialApplicationUrl: "https://example.com/admin-created",
                sourceUrl: "https://example.com/source",
                sourceType: "manual",
                sourceCheckedAt: new Date().toISOString(),
                prefecture: "全国",
                area: "オンライン",
                isOnline: true,
                requirements: ["会員登録"],
                isFeatured: false,
                priority: 99,
                isPublished: true,
                updatedAt: new Date().toISOString()
              },
              ...current
            ]);
          }}
        >
          <input className="h-10 rounded-2xl border border-line px-3 md:col-span-2" placeholder="タイトル" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          <input className="h-10 rounded-2xl border border-line px-3" type="datetime-local" value={draft.endAt} onChange={(event) => setDraft({ ...draft, endAt: event.target.value })} />
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-2 font-bold text-white"><Plus className="h-4 w-4" />登録</button>
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line px-4 py-2 font-bold" onClick={() => navigator.clipboard.writeText(toCsv(rows))}><Download className="h-4 w-4" />CSV出力</button>
        </form>
        <button type="button" className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-line px-4 py-2 text-sm font-bold"><Upload className="h-4 w-4" />CSVインポート枠</button>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-black">抽選情報管理</h2>
        <div className="grid gap-3">
          {related.map((lottery) => {
            const text = tweetText(lottery);
            return (
              <article key={lottery.id} className="rounded-3xl border border-line bg-white p-4">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{lottery.title}</h3>
                    <p className="text-sm text-slate-600">{lottery.product.name} / {lottery.shop.name} / 締切 {formatTokyo(lottery.endAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-2xl border border-line px-3 py-2 text-sm font-bold" onClick={() => setRows((current) => current.map((row) => row.id === lottery.id ? { ...row, sourceCheckedAt: new Date().toISOString() } : row))}>確認済み</button>
                    <button className="rounded-2xl border border-line px-3 py-2 text-sm font-bold" onClick={() => setRows((current) => current.filter((row) => row.id !== lottery.id))}>削除</button>
                  </div>
                </div>
                <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm">
                  <div className="flex items-center justify-between gap-2"><strong>X投稿文</strong><button className="inline-flex items-center gap-1 text-brand-700" onClick={() => navigator.clipboard.writeText(text)}><Copy className="h-4 w-4" />コピー</button></div>
                  <p className="mt-2 whitespace-pre-wrap">{text}</p>
                  <p className={text.length > 280 ? "font-bold text-red-700" : "text-slate-500"}>{text.length} / 280文字</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
