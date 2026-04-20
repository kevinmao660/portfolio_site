import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

type SocialLinkProps = {
  label: string;
  href: string;
  handle: string;
  icon: LucideIcon;
};

export function SocialLink({ label, href, handle, icon: Icon }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="technical-panel group flex min-h-36 flex-col justify-between rounded-[2rem] p-5 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
          {label}
        </div>
        <Icon className="h-5 w-5 text-accent transition-transform duration-300 group-hover:rotate-6" />
      </div>

      <div>
        <div className="mb-2 text-2xl font-semibold tracking-tight text-white">{label}</div>
        <div className="font-mono text-sm text-white/64">{handle}</div>
      </div>

      <div className="mt-6 inline-flex items-center gap-2 text-sm text-white/80">
        Open Link
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </a>
  );
}
