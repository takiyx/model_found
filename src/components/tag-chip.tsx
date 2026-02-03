import Link from "next/link";

export function TagChip({ tag }: { tag: string }) {
  return (
    <Link
      href={`/t/${encodeURIComponent(tag)}`}
      className="rounded-full border bg-white px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-50"
    >
      {tag}
    </Link>
  );
}
