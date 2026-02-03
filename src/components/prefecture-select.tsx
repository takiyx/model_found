import { Prefecture } from "@prisma/client";
import { prefectureLabels } from "@/lib/prefectures";

export function PrefectureSelect({
  value,
  onChange,
  required,
  className,
}: {
  value: Prefecture;
  onChange: (v: Prefecture) => void;
  required?: boolean;
  className?: string;
}) {
  const entries = Object.entries(prefectureLabels) as [Prefecture, string][];

  return (
    <select
      required={required}
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value as Prefecture)}
    >
      {entries.map(([v, label]) => (
        <option key={v} value={v}>
          {label}
        </option>
      ))}
    </select>
  );
}
