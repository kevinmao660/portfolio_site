import { HoverCorners } from "@/components/hover-corners";
import type { ProjectDbStat, ProjectStats as ProjectStatsType } from "@/constants/site-data";

type ProjectStatsProps = {
  stats: ProjectStatsType;
  /** Live operational numbers queried from the project's own database, if any. */
  dbStats?: ProjectDbStat[];
  dbStatsCaption?: string;
  dbStatsAsOf?: string;
};

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="group relative border border-black/10 bg-neutral-50 p-3">
      <HoverCorners size={8} />
      <div className="font-mono text-[9px] uppercase tracking-wider text-black/50">{label}</div>
      <div className="font-headline mt-1 text-xl font-bold text-black">{value}</div>
    </div>
  );
}

/** Fixed per-language identity — color follows the language, never its rank within a project. */
const LANGUAGE_SHADE: Record<string, string> = {
  TypeScript: "#000000",
  Python: "#404040",
  JavaScript: "#808080",
  CSS: "#c4c4c4",
};
const FALLBACK_SHADE = "#a3a3a3";

function totalLines(languages: Record<string, number>) {
  return Object.values(languages).reduce((a, b) => a + b, 0);
}

function LanguageBar({ languages }: { languages: Record<string, number> }) {
  const total = totalLines(languages);
  const segments = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .map(([name, lines]) => ({
      name,
      lines,
      pct: Math.round((lines / total) * 1000) / 10,
      color: LANGUAGE_SHADE[name] ?? FALLBACK_SHADE,
    }));

  return (
    <div>
      <div
        className="grid h-5 w-full gap-[2px]"
        style={{ gridTemplateColumns: segments.map((s) => `${s.lines}fr`).join(" ") }}
      >
        {segments.map((seg, i) => (
          <div
            key={seg.name}
            title={`${seg.name} — ${seg.lines.toLocaleString()} lines (${seg.pct}%)`}
            style={{ backgroundColor: seg.color }}
            className={`${i === 0 ? "rounded-l-sm" : ""} ${
              i === segments.length - 1 ? "rounded-r-sm" : ""
            }`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((seg) => (
          <div
            key={seg.name}
            className="font-mono flex items-center gap-1.5 text-[10px] text-black/60"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-[1px]"
              style={{ backgroundColor: seg.color }}
              aria-hidden
            />
            {seg.name} · {seg.lines.toLocaleString()} · {seg.pct}%
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectStats({
  stats,
  dbStats,
  dbStatsCaption,
  dbStatsAsOf,
}: ProjectStatsProps) {
  const activeLine =
    stats.firstCommit && stats.lastCommit
      ? `Active ${stats.firstCommit} → ${stats.lastCommit}`
      : stats.activePeriod
        ? `Active ${stats.activePeriod}`
        : null;

  return (
    <div>
      <div>
        <div className="font-mono mb-2 text-[9px] uppercase tracking-wider text-black/50">
          Language composition
        </div>
        <LanguageBar languages={stats.languages} />
      </div>

      <div className="font-mono mt-6 text-[10px] uppercase tracking-wider text-black/40">
        {activeLine ? `${activeLine} · ` : ""}
        {stats.dependencies} dependencies
        {stats.testFiles
          ? ` · ${stats.testFiles} test files (${stats.testLines?.toLocaleString()} lines)`
          : ""}
      </div>

      {dbStats && dbStats.length > 0 ? (
        <div className="mt-8 border-t border-black/10 pt-6">
          <div className="font-mono mb-2 text-[9px] uppercase tracking-wider text-black/50">
            {dbStatsAsOf ? `Updated ${dbStatsAsOf}` : "Updated as of today"}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {dbStats.map((s) => (
              <StatTile
                key={s.label}
                label={s.label}
                value={`${s.value.toLocaleString()}${s.suffix ?? ""}`}
              />
            ))}
          </div>
          {dbStatsCaption ? (
            <div className="font-mono mt-4 text-[10px] leading-relaxed text-black/40">
              {dbStatsCaption}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
