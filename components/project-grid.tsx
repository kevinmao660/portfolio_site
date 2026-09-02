"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { BucketsWorkflowDiagram } from "@/components/buckets-workflow-diagram";
import { HoverCorners } from "@/components/hover-corners";
import { PolymarketArchitectureDiagram } from "@/components/polymarket-architecture-diagram";
import { ProjectStats } from "@/components/project-stats";
import type { ProjectItem } from "@/constants/site-data";

/**
 * Projects whose modal carries a real, researched diagram, keyed by title. Each brings its own
 * heading, because a finished system earns an architecture and one still being built is better
 * explained by its workflow. A project without an entry here simply shows no diagram — nothing
 * generic is substituted.
 */
const PROJECT_DIAGRAMS: Record<
  string,
  { label: string; Component: React.ComponentType }
> = {
  "Polymarket Incentives Bot": {
    label: "Architecture",
    Component: PolymarketArchitectureDiagram,
  },
  Buckets: { label: "How it works", Component: BucketsWorkflowDiagram },
};

type ProjectGridProps = {
  projects: ProjectItem[];
};

function ProjectCardTile({
  project,
  onOpen,
}: {
  project: ProjectItem;
  onOpen: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), {
    stiffness: 300,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), {
    stiffness: 300,
    damping: 28,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layoutId={`project-card-${project.title}`}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group relative flex h-full cursor-pointer flex-col border border-black/15 bg-neutral-100 transition-colors hover:border-black/40"
    >
      <HoverCorners />
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 800 }}
        whileHover={reducedMotion ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="flex flex-1 cursor-pointer flex-col justify-between p-6 md:p-7"
      >
        <div>
          <motion.div
            layoutId={`project-status-${project.title}`}
            className="font-mono mb-4 inline-block w-fit border border-black/15 bg-white px-2 py-1 text-[9px] uppercase tracking-wider text-black/60"
          >
            {project.status}
          </motion.div>
          <motion.h3
            layoutId={`project-title-${project.title}`}
            className="font-headline text-xl font-bold tracking-tight text-black md:text-2xl"
          >
            {project.title}
          </motion.h3>
          <motion.p
            layoutId={`project-summary-${project.title}`}
            className="font-mono mt-3 text-[11px] leading-relaxed text-black/60 md:text-xs"
          >
            {project.summary}
          </motion.p>
        </div>

        <div>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="border border-black/10 bg-white px-2 py-1 font-mono text-[9px] text-black/70"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const openProject = projects.find((p) => p.title === openTitle) ?? null;
  const diagram = openProject ? PROJECT_DIAGRAMS[openProject.title] : undefined;

  useEffect(() => {
    if (!openProject) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenTitle(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openProject]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCardTile
            key={project.title}
            project={project}
            onOpen={() => setOpenTitle(project.title)}
          />
        ))}
      </div>

      <AnimatePresence>
        {openProject ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenTitle(null)}
          >
            <motion.div
              layoutId={`project-card-${openProject.title}`}
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto border border-black/15 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpenTitle(null)}
                className="absolute right-6 top-6 font-mono text-xs uppercase tracking-widest text-black/50 transition-colors hover:text-black"
                aria-label="Close project details"
              >
                Close
              </button>

              <div className="p-8 md:p-12">
                <motion.div
                  layoutId={`project-status-${openProject.title}`}
                  className="font-mono mb-6 inline-block w-fit border border-black/15 bg-neutral-100 px-2 py-1 text-[10px] uppercase tracking-wider text-black/60"
                >
                  {openProject.status}
                </motion.div>
                <motion.h3
                  layoutId={`project-title-${openProject.title}`}
                  className="font-headline text-3xl font-bold tracking-tight text-black md:text-5xl"
                >
                  {openProject.title}
                </motion.h3>
                <motion.p
                  layoutId={`project-summary-${openProject.title}`}
                  className="font-mono mt-4 max-w-2xl text-sm leading-relaxed text-black/70 md:text-base"
                >
                  {openProject.summary}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-6 flex flex-wrap gap-2"
                >
                  {openProject.tech.map((t) => (
                    <span
                      key={t}
                      className="border border-black/10 bg-neutral-50 px-2 py-1 font-mono text-[10px] text-black/70"
                    >
                      {t}
                    </span>
                  ))}
                </motion.div>

                {openProject.stats ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 border-t border-black/10 pt-8"
                  >
                    <ProjectStats
                      stats={openProject.stats}
                      dbStats={openProject.dbStats}
                      dbStatsCaption={openProject.dbStatsCaption}
                      dbStatsAsOf={openProject.dbStatsAsOf}
                    />
                  </motion.div>
                ) : null}

                {diagram ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26 }}
                    className="mt-8 border-t border-black/10 pt-8"
                  >
                    <div className="font-mono mb-4 text-[9px] uppercase tracking-wider text-black/50">
                      {diagram.label}
                    </div>
                    <diagram.Component />
                  </motion.div>
                ) : null}

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34 }}
                  className="mt-8 flex flex-wrap gap-3 empty:mt-0"
                >
                  {openProject.githubUrl ? (
                    <a
                      href={openProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-black/20 px-4 py-2 font-mono text-xs uppercase tracking-wider text-black transition-colors hover:bg-black hover:text-white"
                    >
                      View Code
                    </a>
                  ) : null}
                  {openProject.liveUrl ? (
                    <a
                      href={openProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-black/20 bg-black px-4 py-2 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:bg-black/80"
                    >
                      Live Preview
                    </a>
                  ) : null}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </MotionConfig>
  );
}
