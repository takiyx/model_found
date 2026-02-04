import Link from "next/link";

export function TagChip({ tag }: { tag: string }) {
  return (
    <Link
      href={`/t/${encodeURIComponent(tag)}`}
      className="rounded-full border border-zinc-200/70 bg-white/70 px-2 py-0.5 text-xs text-zinc-700 backdrop-blur transition hover:border-zinc-300 hover:bg-white dark:border-zinc-800/70 dark:bg-zinc-950/40 dark:text-zinc-200"
    >
      {tag}
    </Link>
  );
}
