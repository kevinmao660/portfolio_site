"use client";

import { ArrowUpRight, FolderGit2 } from "lucide-react";
import { motion } from "framer-motion";
import { TypedReveal } from "@/components/typed-reveal";
import type { ProjectItem } from "@/constants/site-data";

type ProjectCardProps = {
  project: ProjectItem;
  featured?: boolean;
};

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className={`technical-panel rounded-[2rem] p-6 sm:p-7 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
          Project
        </div>
        <div className="rounded-full border border-white/12 bg-white/4 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
          {project.status}
        </div>
      </div>

      <div className="space-y-4">
        <TypedReveal
          as="h3"
          text={project.title}
          className="max-w-xl text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          stepMs={12}
        />
        <TypedReveal
          as="p"
          text={project.summary}
          className="max-w-2xl text-base leading-7 text-muted"
          delayMs={120}
          stepMs={10}
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {project.tech.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/12 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white/72"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm text-white transition-colors hover:border-accent hover:text-accent"
        >
          <FolderGit2 className="h-4 w-4" />
          View Code
        </a>
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-slate-950 transition-transform hover:scale-[1.02]"
        >
          Live Preview
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </motion.article>
  );
}
