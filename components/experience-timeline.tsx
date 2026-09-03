import { TypedReveal } from "@/components/typed-reveal";
import type { ExperienceItem } from "@/constants/site-data";

type ExperienceTimelineProps = {
  items: ExperienceItem[];
};

export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  return (
    <div className="relative space-y-6">
      <div className="absolute left-[17px] top-5 hidden h-[calc(100%-40px)] w-px bg-white/12 md:block" />
      {items.map((item, index) => (
        <article
          key={`${item.company}-${item.period}`}
          className="technical-panel relative rounded-[2rem] p-6 sm:p-8 md:ml-10"
        >
          <div className="absolute -left-10 top-8 hidden h-4 w-4 rounded-full border border-accent bg-background md:block" />

          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
                Role {String(index + 1).padStart(2, "0")}
              </div>
              <TypedReveal
                as="h3"
                text={item.role}
                className="text-2xl font-semibold tracking-tight text-white"
                stepMs={12}
              />
              <TypedReveal
                as="p"
                text={item.company}
                className="text-lg text-accent"
                delayMs={80}
                stepMs={10}
              />
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/60">
                {item.period} / {item.location}
              </p>
            </div>

            <div className="space-y-4">
              {(item.achievements ?? []).map((achievement, achievementIndex) => (
                <div
                  key={`${item.company}-${achievementIndex}`}
                  className="flex gap-3 border-t border-white/8 pt-4 first:border-t-0 first:pt-0"
                >
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                  <TypedReveal
                    as="p"
                    text={achievement}
                    className="text-base leading-7 text-muted"
                    delayMs={achievementIndex * 120}
                    stepMs={8}
                  />
                </div>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
