export function NoticeBanner({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "success" | "warning" | "danger";
  title: string;
  children?: React.ReactNode;
}) {
  const base = "rounded-2xl border p-4 text-sm";
  const tones: Record<typeof tone, string> = {
    info: "border-zinc-200 bg-white text-zinc-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-red-200 bg-red-50 text-red-900",
  };

  return (
    <div className={base + " " + tones[tone]}>
      <div className="font-medium">{title}</div>
      {children ? <div className="mt-1 text-sm opacity-90">{children}</div> : null}
    </div>
  );
}
