import { format, formatDistanceStrict, isAfter, isBefore, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import type { LotteryStatus } from "./types";

export const TOKYO_TZ = "Asia/Tokyo";
const timezonePattern = /(Z|[+-]\d{2}:?\d{2})$/i;

export function nowTokyo() {
  return toZonedTime(new Date(), TOKYO_TZ);
}

export function parseTokyoDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return fromZonedTime(`${value}T00:00:00`, TOKYO_TZ);
  if (!timezonePattern.test(value)) return fromZonedTime(value, TOKYO_TZ);
  return parseISO(value);
}

export function tokyoLocalInputToIso(value: string) {
  return fromZonedTime(value, TOKYO_TZ).toISOString();
}

export function formatTokyo(value?: string, pattern = "yyyy/MM/dd HH:mm") {
  if (!value) return "未定";
  return formatInTimeZone(parseTokyoDate(value), TOKYO_TZ, pattern, { locale: ja });
}

export function todayKeyTokyo(date: Date | string = new Date()) {
  return formatInTimeZone(typeof date === "string" ? parseTokyoDate(date) : date, TOKYO_TZ, "yyyy-MM-dd");
}

export function computeLotteryStatus(input: {
  startAt?: string;
  endAt?: string;
  statusOverride?: LotteryStatus | null;
  now?: Date;
}): LotteryStatus {
  if (input.statusOverride === "draft" || input.statusOverride === "suspended") return input.statusOverride;
  if (!input.endAt) return "unknown";

  const now = input.now ?? new Date();
  const start = input.startAt ? parseTokyoDate(input.startAt) : undefined;
  const end = parseTokyoDate(input.endAt);

  if (isAfter(now, end)) return "ended";
  if (start && isBefore(now, start)) return "upcoming";

  const msUntilEnd = end.getTime() - now.getTime();
  if (msUntilEnd <= 24 * 60 * 60 * 1000) return "closing_soon";
  return "open";
}

export function remainingTimeLabel(endAt?: string, now = new Date()) {
  if (!endAt) return "締切未定";
  const end = parseTokyoDate(endAt);
  if (isAfter(now, end)) return "終了";
  return `残り${formatDistanceStrict(end, now, { locale: ja })}`;
}

export function isSameTokyoDate(value: string | undefined, key = todayKeyTokyo()) {
  if (!value) return false;
  return formatInTimeZone(parseTokyoDate(value), TOKYO_TZ, "yyyy-MM-dd") === key;
}

export function dateLabel(value: string) {
  return format(parseTokyoDate(value), "M/d", { locale: ja });
}
