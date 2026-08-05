import type { Metadata } from "next";
import { addDays, endOfMonth, format, getDay, startOfMonth } from "date-fns";
import { LotteryCard } from "@/components/lottery-card";
import { getPublicData } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { formatTokyo, todayKeyTokyo } from "@/lib/time";

export const metadata: Metadata = createMetadata({
  title: "抽選カレンダー",
  description: "ポケカの抽選締切、受付開始を月別カレンダーで確認できます。",
  path: "/calendar"
});

export default async function CalendarPage() {
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  const days: Date[] = [];
  for (let date = start; date <= end; date = addDays(date, 1)) days.push(date);
  const { lotteries } = await getPublicData();
  const todayKey = todayKeyTokyo(new Date());
  const monthLabel = format(start, "yyyy年M月");
  const leadingBlanks = Array.from({ length: getDay(start) });
  const daysWithEvents = days.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const closingLotteries = lotteries.filter((lottery) => lottery.endAt && todayKeyTokyo(lottery.endAt) === key);
    const startingLotteries = lotteries.filter((lottery) => lottery.startAt && todayKeyTokyo(lottery.startAt) === key);
    return {
      day,
      key,
      closing: closingLotteries.length,
      starts: startingLotteries.length,
      lotteries: [...closingLotteries, ...startingLotteries.filter((startLottery) => !closingLotteries.some((closingLottery) => closingLottery.id === startLottery.id))]
    };
  });
  const activeDays = daysWithEvents.filter((day) => day.closing || day.starts);
  const trailingBlanks = Array.from({ length: (7 - ((leadingBlanks.length + days.length) % 7)) % 7 });

  return (
    <main className="container space-y-8 py-10">
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black text-slate-500">{monthLabel}</p>
            <h1 className="mt-1 text-xl font-black md:text-2xl">抽選カレンダー</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-black">
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-red-700">締切</span>
          <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-yellow-700">開始</span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm [-webkit-overflow-scrolling:touch]">
          <div className="min-w-[620px] md:min-w-0">
            <div className="grid grid-cols-7 border-b border-line bg-slate-50 text-xs font-black text-slate-500">
              {["日", "月", "火", "水", "木", "金", "土"].map((day) => <div key={day} className="p-2 text-center">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 text-xs">
              {leadingBlanks.map((_, index) => <div key={`blank-${index}`} className="min-h-24 border-r border-b border-line bg-slate-50/60 last:border-r-0" />)}
              {daysWithEvents.map(({ day, key, closing, starts }) => {
                const hasEvents = closing || starts;
                return (
                  <a
                    key={key}
                    href={hasEvents ? `#day-${key}` : "#"}
                    aria-disabled={!hasEvents}
                    className={`min-h-24 border-r border-b border-line p-2 transition last:border-r-0 ${hasEvents ? "bg-white hover:bg-brand-50" : "pointer-events-none bg-white text-slate-300"} ${key === todayKey ? "ring-2 ring-inset ring-brand-500" : ""}`}
                  >
                    <span className="font-black">{format(day, "d")}</span>
                    <div className="mt-2 space-y-1 text-[11px] font-black leading-tight">
                      {closing ? <p className="rounded-full bg-red-50 px-1.5 text-red-700">締切 {closing}</p> : null}
                      {starts ? <p className="rounded-full bg-yellow-50 px-1.5 text-yellow-700">開始 {starts}</p> : null}
                    </div>
                  </a>
                );
              })}
              {trailingBlanks.map((_, index) => <div key={`trailing-blank-${index}`} className="min-h-24 border-r border-b border-line bg-slate-50/60 last:border-r-0" />)}
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-8">
        <h2 className="text-xl font-black">日別一覧</h2>
        {activeDays.map(({ day, key, lotteries: dayLotteries }) => {
          return (
            <div key={key} id={`day-${key}`} className="scroll-mt-24 border-b border-line pb-8">
              <h3 className="mb-4 text-lg font-black">{formatTokyo(day.toISOString(), "M月d日")}</h3>
              <div className="grid gap-4">{dayLotteries.map((lottery) => <LotteryCard key={`${key}-${lottery.id}`} lottery={lottery} compact />)}</div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
