import Link from "next/link";

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  actionHref,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        {subtitle ? (
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</div>
        ) : null}
      </div>

      {actionLabel && actionHref ? (
        <Link
          className="text-xs font-medium text-[color:var(--accent)] hover:underline"
          href={actionHref}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
