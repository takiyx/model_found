import Link from "next/link";
import type { Topic } from "@/lib/topics";

export function TopicCard({
  topic,
  count7d,
}: {
  topic: Topic;
  count7d?: number;
}) {
  return (
    <Link
      href={topic.href}
      className="group relative overflow-hidden rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-zinc-500">特集</div>
          <div className="mt-2 truncate text-lg font-semibold tracking-tight text-zinc-900">
            {topic.title}
          </div>
          {topic.subtitle ? (
            <div className="mt-1 text-sm text-zinc-600">{topic.subtitle}</div>
          ) : null}
        </div>

        {typeof count7d === "number" ? (
          <div className="shrink-0 rounded-full border bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
            直近7日 {count7d}
          </div>
        ) : null}
      </div>

      {topic.tags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {topic.tags.slice(0, 6).map((t) => (
            <span key={t} className="rounded-full border bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-700">
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-zinc-100" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-zinc-50" />
      </div>
    </Link>
  );
}
