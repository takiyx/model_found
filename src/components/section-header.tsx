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
        <h2 className="text-lg font-semibold tracking-tight text-black">{title}</h2>
        {subtitle ? <div className="mt-1 text-xs text-zinc-500">{subtitle}</div> : null}
      </div>

      {actionLabel && actionHref ? (
        <Link className="text-xs font-medium text-black/80 hover:text-black" href={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
