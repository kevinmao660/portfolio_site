"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HoverCorners } from "@/components/hover-corners";
import { ProjectGrid } from "@/components/project-grid";
import { ScrambleText } from "@/components/scramble-text";
import { SpaceBackdrop } from "@/components/space-backdrop";
import { SpotlightGrid } from "@/components/spotlight-grid";
import { TypeOnView } from "@/components/type-on-view";
import { siteData } from "@/constants/site-data";
import { site } from "@/constants/site";

const NAV_IDS = ["about", "experience", "projects", "education"] as const;
/** Includes sections not in the nav (e.g. `#contact`) for initial hash scroll */
const HASH_IDS = [...NAV_IDS, "contact"] as const;

export function StitchPortfolio() {
  const [activeSection, setActiveSection] = useState<string>("about");
  const [pulseNav, setPulseNav] = useState<string | null>(null);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", `#${id}`);
    setActiveSection(id);
    setPulseNav(id);
    window.setTimeout(() => setPulseNav(null), 550);
  }, []);

  const onNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      scrollToSection(id);
    },
    [scrollToSection],
  );

  useEffect(() => {
    const sections = NAV_IDS.map((id) => document.getElementById(id)).filter(
      (n): n is HTMLElement => Boolean(n),
    );
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.15, 0.35] },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash || !HASH_IDS.includes(hash as (typeof HASH_IDS)[number])) return;
    queueMicrotask(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(hash);
    });
  }, []);

  const navLinkClass = (id: string) =>
    `font-label border-b pb-1 text-xs font-bold uppercase tracking-tighter transition-colors ${
      activeSection === id
        ? "border-black text-black"
        : "border-transparent text-black/45 hover:text-black"
    } ${pulseNav === id ? "nav-section-pulse" : ""}`;

  return (
    <>
      <SpotlightGrid />
      <SpaceBackdrop />

      <nav className="fixed top-0 z-50 mx-auto flex w-full items-center justify-between border-b border-black/10 bg-[#ffffff] px-6 py-4">
        <div className="font-mono text-lg font-black tracking-widest text-black">{site.navMark}</div>
        <div className="hidden gap-8 md:ml-auto md:flex">
          <a className={navLinkClass("about")} href="#about" onClick={(e) => onNavClick(e, "about")}>
            <ScrambleText as="span" text="ABOUT" />
          </a>
          <a
            className={navLinkClass("experience")}
            href="#experience"
            onClick={(e) => onNavClick(e, "experience")}
          >
            <ScrambleText as="span" text="EXPERIENCE" delayMs={40} />
          </a>
          <a
            className={navLinkClass("projects")}
            href="#projects"
            onClick={(e) => onNavClick(e, "projects")}
          >
            <ScrambleText as="span" text="PROJECTS" delayMs={80} />
          </a>
          <a
            className={navLinkClass("education")}
            href="#education"
            onClick={(e) => onNavClick(e, "education")}
          >
            <ScrambleText as="span" text="EDUCATION" delayMs={120} />
          </a>
        </div>
      </nav>

      <main className="relative z-10">
        <section
          className="relative z-[2] flex min-h-screen flex-col justify-center bg-[#ffffff] px-6 pb-16 pt-20 md:px-12 lg:px-24"
          id="about"
        >
          <div className="max-w-7xl">
            <TypeOnView
              as="span"
              text={site.heroEyebrow}
              className="font-label mb-6 block text-[0.75rem] uppercase tracking-[0.3em] text-black"
              stepMs={48}
            />
            <h1 className="font-headline mb-8 text-5xl font-black leading-[0.9] tracking-tighter text-black md:text-7xl lg:text-9xl">
              <TypeOnView as="span" text={site.heroTitleLine1} className="font-black" stepMs={56} />
              <br />
              <TypeOnView
                as="span"
                text={site.heroTitleLine2}
                className="font-black"
                stepMs={56}
                delayMs={900}
              />
            </h1>
            <TypeOnView
              as="p"
              text={site.bio}
              className="font-mono max-w-2xl text-sm leading-relaxed text-black/70 md:text-lg"
              stepMs={28}
              delayMs={420}
            />
          </div>
        </section>

        <section
          className="relative bg-neutral-50 px-6 py-24 md:px-12 lg:px-24"
          id="experience"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-16">
              <TypeOnView
                as="h2"
                text="Experiences"
                className="font-headline mb-4 text-4xl font-extrabold uppercase tracking-tighter text-black"
                stepMs={24}
              />
              <div className="h-1 w-12 bg-black" />
            </div>
            <div className="relative space-y-12">
              <div className="absolute bottom-2 left-[7px] top-2 w-px bg-black/15" />

              {siteData.experience.map((item, index) => (
                <div
                  key={`${item.company}-${item.period}`}
                  className="group relative pl-10"
                  id={index === 0 ? "timeline-node-1" : undefined}
                >
                  <div
                    className={`absolute left-0 top-1.5 h-4 w-4 border-2 bg-white transition-colors ${
                      index === 0
                        ? "border-black group-hover:bg-black"
                        : "border-black/30 group-hover:border-black"
                    }`}
                  />
                  <div className="mb-2 flex flex-col items-start md:flex-row md:items-center md:justify-between">
                    <TypeOnView
                      as="h3"
                      text={item.role}
                      className="font-headline text-xl font-bold tracking-tight text-black"
                      stepMs={22}
                    />
                    <span
                      className={`font-mono px-2 py-1 text-[10px] uppercase text-black ${
                        index === 0 ? "bg-black/5" : "border border-black/20 text-black/60"
                      }`}
                    >
                      {item.period}
                    </span>
                  </div>
                  <TypeOnView
                    as="p"
                    text={`${item.company} · ${item.location}`}
                    className="font-mono mb-4 text-xs text-black/50"
                    stepMs={18}
                    delayMs={80}
                  />
                  <ul className="space-y-2 border-l-2 border-black/10 pl-4 text-sm text-black/70">
                    {item.achievements.map((line, lineIndex) => (
                      <li key={`${item.company}-ach-${lineIndex}`}>
                        <TypeOnView
                          as="span"
                          text={line}
                          stepMs={12}
                          delayMs={lineIndex * 100}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-black/10 bg-white px-6 py-24 md:px-12 lg:px-24" id="projects">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 border-b border-black/10 pb-8">
              <ScrambleText
                as="span"
                text={site.projectsSectionEyebrow}
                className="font-mono mb-2 block text-xs text-black"
              />
              <TypeOnView
                as="h2"
                text="Projects"
                className="font-headline text-4xl font-extrabold uppercase tracking-tighter text-black"
                stepMs={24}
              />
            </div>

            <ProjectGrid projects={siteData.projects} />
          </div>
        </section>

        <section
          className="border-t border-black/10 bg-white px-6 py-24 md:px-12 lg:px-24"
          id="education"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-12">
              <TypeOnView
                as="h2"
                text="Education"
                className="font-headline mb-4 text-4xl font-extrabold uppercase tracking-tighter text-black"
                stepMs={24}
              />
              <div className="h-1 w-12 bg-black" />
            </div>
            <article className="group relative border border-black/10 bg-neutral-50 p-8 md:p-10">
              <HoverCorners />
              <div className="mb-2">
                <TypeOnView
                  as="h3"
                  text={siteData.education.role}
                  className="font-headline text-xl font-bold tracking-tight text-black"
                  stepMs={22}
                />
              </div>
              <TypeOnView
                as="p"
                text={`${siteData.education.company} · ${siteData.education.location}`}
                className="font-mono mb-6 text-xs text-black/50"
                stepMs={18}
                delayMs={80}
              />
              <ul className="space-y-3 border-l-2 border-black/10 pl-4 text-sm text-black/70">
                {siteData.education.achievements.map((line, lineIndex) => (
                  <li key={`education-${lineIndex}`}>
                    <TypeOnView
                      as="span"
                      text={line}
                      stepMs={12}
                      delayMs={lineIndex * 100}
                    />
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section
          className="flex flex-col items-center justify-center px-6 py-24 md:py-32"
          id="contact"
        >
          <nav
            className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 border-t border-black/10 pt-12"
            aria-label="Contact links"
          >
            <a
              href={`mailto:${site.email}`}
              className="font-mono text-sm text-black/70 underline-offset-4 transition-colors hover:text-black hover:underline"
            >
              Email
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm text-black/70 underline-offset-4 transition-colors hover:text-black hover:underline"
            >
              GitHub
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm text-black/70 underline-offset-4 transition-colors hover:text-black hover:underline"
            >
              LinkedIn
            </a>
          </nav>
        </section>
      </main>

      <footer
        className="flex w-full flex-col items-center justify-between gap-4 border-t border-black/10 bg-white px-8 py-12 md:flex-row"
        id="footer"
      >
        <div className="flex gap-8">
          <a
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 underline-offset-4 transition-colors duration-200 hover:text-black hover:underline"
            href={site.github}
            target="_blank"
            rel="noreferrer"
          >
            GITHUB
          </a>
          <a
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 underline-offset-4 transition-colors duration-200 hover:text-black hover:underline"
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            id="social-anchor"
          >
            LINKEDIN
          </a>
          <a
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 underline-offset-4 transition-colors duration-200 hover:text-black hover:underline"
            href={`mailto:${site.email}`}
          >
            Email
          </a>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
          {site.copyright}
        </div>
      </footer>
    </>
  );
}
