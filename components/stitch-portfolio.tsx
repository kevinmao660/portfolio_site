"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SpaceBackdrop } from "@/components/space-backdrop";
import { TypeOnView } from "@/components/type-on-view";
import { siteData } from "@/constants/site-data";
import { site } from "@/constants/site";

const kalshiProject =
  siteData.projects.find((p) => p.title.startsWith("Kalshi")) ?? siteData.projects[0];
const miniAmazonProject =
  siteData.projects.find((p) => p.title.startsWith("Mini-Amazon")) ?? siteData.projects[1];
const portfolioProject =
  siteData.projects.find((p) => p.title === "Portfolio Site") ?? siteData.projects[2];

const NAV_IDS = ["about", "experience", "work", "education"] as const;
/** Includes sections not in the nav (e.g. `#contact`) for initial hash scroll */
const HASH_IDS = [...NAV_IDS, "contact"] as const;

export function StitchPortfolio() {
  const workCarouselRef = useRef<HTMLDivElement | null>(null);
  const workCycleRef = useRef<HTMLDivElement | null>(null);

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

  /** Always-on horizontal motion for project cards (seamless loop). */
  useEffect(() => {
    const root = workCarouselRef.current;
    const cycle = workCycleRef.current;
    if (!root || !cycle) return;

    let alive = true;
    let rafId = 0;
    let lastTs = 0;
    const PX_PER_SEC = 44;

    const loop = (ts: number) => {
      if (!alive) return;
      rafId = requestAnimationFrame(loop);

      if (!lastTs) {
        lastTs = ts;
        return;
      }

      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;

      const loopWidth = cycle.scrollWidth;
      if (loopWidth <= 0) return;

      let next = root.scrollLeft + PX_PER_SEC * dt;
      if (next >= loopWidth) {
        next -= loopWidth;
      }

      root.scrollLeft = next;
    };

    rafId = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      lastTs = 0;
      const loopWidth = cycle.scrollWidth;
      if (loopWidth > 0) {
        root.scrollLeft = root.scrollLeft % loopWidth;
      }
    });
    ro.observe(root);
    ro.observe(cycle);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const navLinkClass = (id: string) =>
    `font-label border-b pb-1 text-xs font-bold uppercase tracking-tighter transition-colors ${
      activeSection === id
        ? "border-black text-black"
        : "border-transparent text-black/45 hover:text-black"
    } ${pulseNav === id ? "nav-section-pulse" : ""}`;

  return (
    <>
      <div className="ghost-grid pointer-events-none fixed inset-0 z-0" />
      <SpaceBackdrop />

      <nav className="fixed top-0 z-50 mx-auto flex w-full items-center justify-between border-b border-black/10 bg-[#ffffff] px-6 py-4">
        <div className="font-mono text-lg font-black tracking-widest text-black">{site.navMark}</div>
        <div className="hidden gap-8 md:ml-auto md:flex">
          <a className={navLinkClass("about")} href="#about" onClick={(e) => onNavClick(e, "about")}>
            ABOUT
          </a>
          <a
            className={navLinkClass("experience")}
            href="#experience"
            onClick={(e) => onNavClick(e, "experience")}
          >
            EXPERIENCE
          </a>
          <a className={navLinkClass("work")} href="#work" onClick={(e) => onNavClick(e, "work")}>
            WORK
          </a>
          <a
            className={navLinkClass("education")}
            href="#education"
            onClick={(e) => onNavClick(e, "education")}
          >
            EDUCATION
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

        <section className="px-6 py-24 md:px-12 lg:px-24" id="work">
          <div className="mb-16 border-b border-black/10 pb-8">
            <TypeOnView
              as="span"
              text={site.workSectionEyebrow}
              className="font-mono mb-2 block text-xs text-black"
              stepMs={26}
            />
            <TypeOnView
              as="h2"
              text="Other Things I'm Involved With"
              className="font-headline text-4xl font-extrabold uppercase tracking-tighter text-black"
              stepMs={24}
            />
          </div>

          <div className="relative -mx-1">
            <div
              ref={workCarouselRef}
              className="work-carousel overflow-x-auto overflow-y-hidden overscroll-x-contain pb-4 pl-1 pr-1 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex w-max gap-4 md:gap-5">
                <div ref={workCycleRef} className="flex gap-4 md:gap-5">
                  <div
                    data-work-slide
                    className="flex h-[420px] w-[min(92vw,52rem)] shrink-0 flex-col justify-between border border-black/15 bg-neutral-100 p-8 md:h-[500px]"
                  >
                    <div>
                      <span className="material-symbols-outlined mb-4 text-black">folder_open</span>
                      <TypeOnView
                        as="h3"
                        text="All Projects"
                        className="font-headline text-2xl font-bold text-black"
                        stepMs={24}
                      />
                      <TypeOnView
                        as="p"
                        text="One place for Kalshi UI, Mini-Amazon, this portfolio, and systems projects."
                        className="font-mono mt-2 max-w-xl text-[10px] text-black/60"
                        stepMs={14}
                        delayMs={120}
                      />
                      <ul className="mt-4 space-y-1 border-l border-black/10 pl-3 font-mono text-[10px] text-black/55">
                        <li>Live market data + execution UI (Kalshi)</li>
                        <li>Full-stack commerce simulation (Flask + Postgres)</li>
                        <li>Systems coursework in C (cache + memory)</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {siteData.projects.map((project) => (
                          <a
                            key={project.title}
                            href={project.githubUrl || site.github}
                            target="_blank"
                            rel="noreferrer"
                            className="border border-black/15 bg-white px-3 py-1.5 font-mono text-[10px] text-black/80 transition-colors hover:bg-black hover:text-white"
                          >
                            {project.title}
                          </a>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["TYPESCRIPT", "PYTHON", "C", "FULL-STACK"].map((tag) => (
                          <span
                            key={tag}
                            className="border border-black/10 bg-white px-2 py-1 font-mono text-[9px] text-black/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <a
                    data-work-slide
                    href={site.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-[500px] w-[min(92vw,52rem)] shrink-0 flex-col justify-between border border-black/15 bg-neutral-100 p-8"
                    id="project-card-primary"
                  >
                    <div>
                      <span className="material-symbols-outlined mb-4 text-black">groups</span>
                      <TypeOnView
                        as="h3"
                        text="Campus Involvement"
                        className="font-headline text-2xl font-bold tracking-tight text-black"
                        stepMs={22}
                      />
                      <TypeOnView
                        as="p"
                        text="Some groups I spend a lot of time with at Duke."
                        className="font-mono mt-2 max-w-xl text-[10px] text-black/60"
                        stepMs={14}
                        delayMs={120}
                      />
                      <ul className="mt-4 space-y-1 border-l border-black/10 pl-3 font-mono text-[10px] text-black/55">
                        <li>HackDuke: co-led planning for 250+ attendee hackathon</li>
                        <li>Product@Duke: co-president, workshops + mentorship</li>
                        <li>Cross-functional work across engineering/design/logistics</li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["HACKDUKE", "PRODUCT@DUKE"].map((tag) => (
                        <span
                          key={tag}
                          className="border border-black/10 bg-white px-2 py-1 font-mono text-[9px] text-black/70"
                        >
                          {tag}
                        </span>
                      ))}
                      {["LEADERSHIP", "OPERATIONS", "PRODUCT"].map((tag) => (
                        <span
                          key={tag}
                          className="border border-black/10 bg-white px-2 py-1 font-mono text-[9px] text-black/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>

                  <a
                    data-work-slide
                    href={site.repoPortfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-[500px] w-[min(92vw,52rem)] shrink-0 flex-col justify-between border border-black/15 bg-neutral-100 p-8"
                  >
                    <div>
                      <span className="material-symbols-outlined mb-4 text-black">science</span>
                      <TypeOnView
                        as="h3"
                        text="Currently Exploring"
                        className="font-headline text-xl font-bold tracking-tight text-black"
                        stepMs={22}
                      />
                      <TypeOnView
                        as="p"
                        text="Building with Stitch + Cursor, and experimenting with product-y interfaces."
                        className="font-mono mt-2 max-w-xl text-[10px] text-black/60"
                        stepMs={14}
                        delayMs={120}
                      />
                      <ul className="mt-4 space-y-1 border-l border-black/10 pl-3 font-mono text-[10px] text-black/55">
                        <li>Motion-heavy UI systems and interaction polish</li>
                        <li>AI-assisted workflows for rapid iteration</li>
                        <li>Balancing fast shipping with clean architecture</li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["AI/ML", "FRONTEND", "SYSTEMS", "STITCH", "CURSOR", "NEXT.JS"].map((tag) => (
                        <span
                          key={tag}
                          className="border border-black/10 bg-white px-2 py-1 font-mono text-[9px] text-black/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>

                  <a
                    data-work-slide
                    href={site.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-[420px] w-[min(92vw,52rem)] shrink-0 flex-col justify-between border border-black/15 bg-neutral-100 p-8 md:h-[500px]"
                  >
                    <div>
                      <span className="material-symbols-outlined mb-4 text-black">handshake</span>
                      <TypeOnView
                        as="h3"
                        text="Open To"
                        className="font-headline text-lg font-bold text-black"
                        stepMs={26}
                      />
                      <TypeOnView
                        as="p"
                        text="Collaborating on products, internships, and side projects."
                        className="font-mono mt-2 text-[10px] text-black/55"
                        stepMs={16}
                        delayMs={100}
                      />
                      <ul className="mt-4 space-y-1 border-l border-black/10 pl-3 font-mono text-[10px] text-black/55">
                        <li>Software engineering internships and new grad roles</li>
                        <li>Project collaborations with strong product focus</li>
                        <li>Hackathon teams and technical communities</li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["SWE", "ML INFRA", "FULL-STACK", "PRODUCT", "HACKATHONS"].map((tag) => (
                        <span
                          key={tag}
                          className="border border-black/10 bg-white px-2 py-1 font-mono text-[9px] text-black/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none flex gap-4 md:gap-5"
                >
                  <div
                    data-work-slide
                    className="flex h-[420px] w-[min(92vw,52rem)] shrink-0 flex-col justify-between border border-black/15 bg-neutral-100 p-8 md:h-[500px]"
                  >
                    <div>
                      <span className="material-symbols-outlined mb-4 text-black">folder_open</span>
                      <h3 className="font-headline text-2xl font-bold text-black">All Projects</h3>
                      <p className="font-mono mt-2 max-w-xl text-[10px] text-black/60">
                        One place for Kalshi UI, Mini-Amazon, this portfolio, and systems projects.
                      </p>
                      <ul className="mt-4 space-y-1 border-l border-black/10 pl-3 font-mono text-[10px] text-black/55">
                        <li>Live market data + execution UI (Kalshi)</li>
                        <li>Full-stack commerce simulation (Flask + Postgres)</li>
                        <li>Systems coursework in C (cache + memory)</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {siteData.projects.map((project) => (
                          <span
                            key={`clone-${project.title}`}
                            className="border border-black/15 bg-white px-3 py-1.5 font-mono text-[10px] text-black/80"
                          >
                            {project.title}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["TYPESCRIPT", "PYTHON", "C", "FULL-STACK"].map((tag) => (
                          <span
                            key={`clone-${tag}`}
                            className="border border-black/10 bg-white px-2 py-1 font-mono text-[9px] text-black/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <a
                    data-work-slide
                    href={site.linkedin}
                    tabIndex={-1}
                    className="flex h-[500px] w-[min(92vw,52rem)] shrink-0 flex-col justify-between border border-black/15 bg-neutral-100 p-8"
                  >
                    <div>
                      <span className="material-symbols-outlined mb-4 text-black">groups</span>
                      <h3 className="font-headline text-2xl font-bold tracking-tight text-black">
                        Campus Involvement
                      </h3>
                      <p className="font-mono mt-2 max-w-xl text-[10px] text-black/60">
                        Some groups I spend a lot of time with at Duke.
                      </p>
                      <ul className="mt-4 space-y-1 border-l border-black/10 pl-3 font-mono text-[10px] text-black/55">
                        <li>HackDuke: co-led planning for 250+ attendee hackathon</li>
                        <li>Product@Duke: co-president, workshops + mentorship</li>
                        <li>Cross-functional work across engineering/design/logistics</li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["HACKDUKE", "PRODUCT@DUKE"].map((tag) => (
                        <span
                          key={tag}
                          className="border border-black/10 bg-white px-2 py-1 font-mono text-[9px] text-black/70"
                        >
                          {tag}
                        </span>
                      ))}
                      {["LEADERSHIP", "OPERATIONS", "PRODUCT"].map((tag) => (
                        <span
                          key={tag}
                          className="border border-black/10 bg-white px-2 py-1 font-mono text-[9px] text-black/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>

                  <a
                    data-work-slide
                    href={site.repoPortfolio}
                    tabIndex={-1}
                    className="flex h-[500px] w-[min(92vw,52rem)] shrink-0 flex-col justify-between border border-black/15 bg-neutral-100 p-8"
                  >
                    <div>
                      <span className="material-symbols-outlined mb-4 text-black">science</span>
                      <h3 className="font-headline text-xl font-bold tracking-tight text-black">
                        Currently Exploring
                      </h3>
                      <p className="font-mono mt-2 max-w-xl text-[10px] text-black/60">
                        Building with Stitch + Cursor, and experimenting with product-y interfaces.
                      </p>
                      <ul className="mt-4 space-y-1 border-l border-black/10 pl-3 font-mono text-[10px] text-black/55">
                        <li>Motion-heavy UI systems and interaction polish</li>
                        <li>AI-assisted workflows for rapid iteration</li>
                        <li>Balancing fast shipping with clean architecture</li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["AI/ML", "FRONTEND", "SYSTEMS", "STITCH", "CURSOR", "NEXT.JS"].map((tag) => (
                        <span
                          key={`clone-${tag}`}
                          className="border border-black/10 bg-white px-2 py-1 font-mono text-[9px] text-black/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>

                  <a
                    data-work-slide
                    href={site.linkedin}
                    tabIndex={-1}
                    className="flex h-[420px] w-[min(92vw,52rem)] shrink-0 flex-col justify-between border border-black/15 bg-neutral-100 p-8 md:h-[500px]"
                  >
                    <div>
                      <span className="material-symbols-outlined mb-4 text-black">handshake</span>
                      <h3 className="font-headline text-lg font-bold text-black">Open To</h3>
                      <p className="font-mono mt-2 text-[10px] text-black/55">
                        Collaborating on products, internships, and side projects.
                      </p>
                      <ul className="mt-4 space-y-1 border-l border-black/10 pl-3 font-mono text-[10px] text-black/55">
                        <li>Software engineering internships and new grad roles</li>
                        <li>Project collaborations with strong product focus</li>
                        <li>Hackathon teams and technical communities</li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["SWE", "ML INFRA", "FULL-STACK", "PRODUCT", "HACKATHONS"].map((tag) => (
                        <span
                          key={`clone-${tag}`}
                          className="border border-black/10 bg-white px-2 py-1 font-mono text-[9px] text-black/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>
                </div>
              </div>
            </div>
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
            <article className="border border-black/10 bg-neutral-50 p-8 md:p-10">
              <div className="mb-2 flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
                <TypeOnView
                  as="h3"
                  text={siteData.education.role}
                  className="font-headline text-xl font-bold tracking-tight text-black"
                  stepMs={22}
                />
                <span className="font-mono bg-black/5 px-2 py-1 text-[10px] uppercase text-black">
                  {siteData.education.period}
                </span>
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
