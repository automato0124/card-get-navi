import { AlertCircle, CheckCircle2, Clock, PauseCircle, Search } from "lucide-react";
import type { LotteryStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const config: Record<LotteryStatus, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  draft: { label: "下書き", className: "bg-slate-100 text-slate-700", icon: Search },
  upcoming: { label: "近日開始", className: "bg-blue-50 text-blue-700", icon: Clock },
  open: { label: "受付中", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  closing_soon: { label: "締切近い", className: "bg-red-50 text-red-700", icon: AlertCircle },
  ended: { label: "終了済み", className: "bg-slate-100 text-slate-600", icon: CheckCircle2 },
  unknown: { label: "詳細確認中", className: "bg-amber-50 text-amber-700", icon: Search },
  suspended: { label: "停止中", className: "bg-red-50 text-red-700", icon: PauseCircle }
};

export function StatusBadge({ status }: { status: LotteryStatus }) {
  const item = config[status];
  const Icon = item.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold", item.className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {item.label}
    </span>
  );
}
