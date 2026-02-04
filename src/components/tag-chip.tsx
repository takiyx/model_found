import Link from "next/link";

export function TagChip({ tag }: { tag: string }) {
  return (
    <Link
      href={`/t/${encodeURIComponent(tag)}`}
      className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs text-black/80 transition hover:border-zinc-300 hover:bg-[color:var(--accent)]"
    >
      {tag}
    </Link>
  );
}
