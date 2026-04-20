"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  FolderGit2,
  Sparkles,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { ProjectCard } from "@/components/project-card";
import { SocialLink } from "@/components/social-link";
import { TypedReveal } from "@/components/typed-reveal";
import type { SiteData } from "@/constants/site-data";

type PortfolioShellProps = {
  siteData: SiteData;
};

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 },
  },
};

export function PortfolioShell({ siteData }: PortfolioShellProps) {
  const socialIcons = {
    GitHub: FolderGit2,
    LinkedIn: BriefcaseBusiness,
  } as const;

  return (
    <div className="relative overflow-x-clip">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.32em] text-white/72"
          >
            {siteData.person.label}
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {siteData.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-mono text-[11px] uppercase tracking-[0.26em] text-white/56 transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-10">
        <motion.section
          id="hero"
          className="border-x border-white/10 px-6 py-16 sm:py-20 lg:px-10 lg:py-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionReveal}
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)] lg:gap-12">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/12 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.26em] text-white/64">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Precision, motion, and systems thinking
              </div>

              <div className="space-y-6">
                <TypedReveal
                  as="h1"
                  text={`${siteData.person.name}\n${siteData.person.title}`}
                  className="max-w-4xl text-5xl font-semibold leading-none tracking-[-0.05em] text-white sm:text-6xl lg:text-8xl"
                  stepMs={10}
                />

                <TypedReveal
                  as="p"
                  text={siteData.person.bio}
                  className="max-w-2xl text-lg leading-8 text-muted sm:text-xl"
                  delayMs={180}
                  stepMs={8}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-slate-950 transition-transform hover:scale-[1.02]"
                >
                  View Projects
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#experience"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm text-white/88 transition-colors hover:border-accent hover:text-accent"
                >
                  Experience
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="technical-panel rounded-[2rem] p-6">
                <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
                  Status
                </div>
                <TypedReveal
                  as="p"
                  text={siteData.person.status}
                  className="text-2xl font-semibold tracking-tight text-white"
                  stepMs={11}
                />
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.22em] text-accent">
                  {siteData.person.location}
                </p>
              </div>

              <div className="grid gap-4 sm:col-span-2 lg:col-span-1">
                {siteData.metrics.map((metric) => (
                  <div key={metric.label} className="technical-panel rounded-[2rem] p-5">
                    <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
                      {metric.label}
                    </div>
                    <div className="mt-4 text-2xl font-semibold tracking-tight text-white">
                      {metric.value}
                    </div>
                    <div className="mt-3 text-sm leading-6 text-muted">{metric.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="experience"
          className="border-x border-t border-white/10 px-6 py-16 sm:py-20 lg:px-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionReveal}
        >
          <div className="mb-12 flex max-w-3xl flex-col gap-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Experience
            </div>
            <TypedReveal
              as="h2"
              text="Built for teams that move fast and care about execution quality."
              className="text-3xl font-semibold tracking-tight text-white sm:text-5xl"
              stepMs={10}
            />
            <TypedReveal
              as="p"
              text="A technical timeline with clear roles, delivery impact, and the details that matter when products need to ship well."
              className="text-base leading-7 text-muted sm:text-lg"
              delayMs={120}
              stepMs={9}
            />
          </div>

          <ExperienceTimeline items={siteData.experience} />
        </motion.section>

        <motion.section
          id="education"
          className="border-x border-t border-white/10 px-6 py-16 sm:py-20 lg:px-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionReveal}
        >
          <div className="mb-12 flex max-w-3xl flex-col gap-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Education
            </div>
            <TypedReveal
              as="h2"
              text="Degree, coursework, and campus roles."
              className="text-3xl font-semibold tracking-tight text-white sm:text-5xl"
              stepMs={10}
            />
          </div>

          <ExperienceTimeline items={[siteData.education]} />
        </motion.section>

        <motion.section
          id="projects"
          className="border-x border-t border-white/10 px-6 py-16 sm:py-20 lg:px-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionReveal}
        >
          <div className="mb-12 flex max-w-3xl flex-col gap-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Selected Work
            </div>
            <TypedReveal
              as="h2"
              text="A bento-inspired project grid with polished interactions and code-first storytelling."
              className="text-3xl font-semibold tracking-tight text-white sm:text-5xl"
              stepMs={10}
            />
            <TypedReveal
              as="p"
              text="Each card is designed to feel editorial and tactical: clear technical stack, strong hover motion, and quick pathways into the repo."
              className="text-base leading-7 text-muted sm:text-lg"
              delayMs={120}
              stepMs={9}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {siteData.projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                featured={index === 0}
              />
            ))}
          </div>
        </motion.section>

        <motion.section
          id="connect"
          className="border-x border-y border-white/10 px-6 py-16 sm:py-20 lg:px-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionReveal}
        >
          <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)]">
            <div className="space-y-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                Connect
              </div>
              <TypedReveal
                as="h2"
                text="Available for teams building ambitious software with serious attention to detail."
                className="text-3xl font-semibold tracking-tight text-white sm:text-5xl"
                stepMs={10}
              />
            </div>

            <TypedReveal
              as="p"
              text="The social block stays simple and intentional: direct links, high contrast, and a clean landing point for recruiters, collaborators, and anyone reviewing the work."
              className="max-w-2xl text-base leading-7 text-muted sm:text-lg"
              delayMs={120}
              stepMs={9}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {siteData.socials.map((link) => (
              <SocialLink
                key={link.label}
                label={link.label}
                href={link.href}
                handle={link.handle}
                icon={socialIcons[link.label as keyof typeof socialIcons]}
              />
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
