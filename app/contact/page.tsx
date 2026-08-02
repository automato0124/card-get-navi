import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "お問い合わせ",
  description: "カードゲットナビへの掲載情報の修正依頼、広告掲載、その他のお問い合わせ先です。",
  path: "/contact"
});

export default function ContactPage() {
  return <main className="container max-w-3xl space-y-4 py-10"><h1 className="text-2xl font-black md:text-3xl">お問い合わせ</h1><p className="leading-8 text-slate-700">掲載情報の修正依頼、広告掲載、その他のお問い合わせは <a className="font-bold text-brand-700 underline underline-offset-4" href="mailto:cardgetnavi@gmail.com">cardgetnavi@gmail.com</a> までご連絡ください。</p></main>;
}
