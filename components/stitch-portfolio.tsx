"use client";

import Image from "next/image";
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

type CatAnimClass = "cat-float" | "cat-sleeping" | "";

const NAV_IDS = ["about", "experience", "work", "education"] as const;
/** Includes sections not in the nav (e.g. `#contact`) for initial hash scroll */
const HASH_IDS = [...NAV_IDS, "contact"] as const;

export function StitchPortfolio() {
  const workRef = useRef<HTMLElement | null>(null);
  const workCarouselRef = useRef<HTMLDivElement | null>(null);
  const workCycleRef = useRef<HTMLDivElement | null>(null);
  const primaryCardRef = useRef<HTMLAnchorElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const timelineNodeRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const socialAnchorRef = useRef<HTMLAnchorElement | null>(null);

  const [catTop, setCatTop] = useState("25%");
  const [catRight, setCatRight] = useState("10%");
  const [catTransform, setCatTransform] = useState("scale(1) rotate(0deg)");
  const [catAnimClass, setCatAnimClass] = useState<CatAnimClass>("cat-float");

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

  const updateCatPosition = useCallback(() => {
    const work = workRef.current;
    const primaryCard = primaryCardRef.current;
    const experience = experienceRef.current;
    const timelineNode = timelineNodeRef.current;
    const footer = footerRef.current;
    const socialAnchor = socialAnchorRef.current;

    if (!work || !primaryCard || !experience || !timelineNode || !footer || !socialAnchor) {
      return;
    }

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    const workRect = work.getBoundingClientRect();
    const expRect = experience.getBoundingClientRect();
    const footRect = footer.getBoundingClientRect();

    /* Hero → experience (timeline) → work (primary card) → footer */
    if (scrollY < expRect.top + scrollY - windowHeight / 3) {
      setCatTop("25%");
      setCatRight("10%");
      setCatTransform("scale(1) rotate(0deg)");
      setCatAnimClass("cat-float");
    } else if (scrollY < workRect.top + scrollY - windowHeight / 3) {
      const nodeRect = timelineNode.getBoundingClientRect();
      setCatTop(`${nodeRect.top - 40}px`);
      setCatRight(`${window.innerWidth - nodeRect.left - 20}px`);
      setCatTransform("scale(0.8) rotate(5deg)");
      setCatAnimClass("cat-float");
    } else if (scrollY < footRect.top + scrollY - windowHeight) {
      const cardRect = primaryCard.getBoundingClientRect();
      setCatTop(`${cardRect.top + 20}px`);
      setCatRight(`${window.innerWidth - cardRect.right + 20}px`);
      setCatTransform("scale(1.2) rotate(-15deg)");
      setCatAnimClass("");
    } else {
      const socialRect = socialAnchor.getBoundingClientRect();
      setCatTop(`${socialRect.top - 60}px`);
      setCatRight(`${window.innerWidth - socialRect.right - 40}px`);
      setCatTransform("scale(1.1) rotate(-45deg)");
      setCatAnimClass("cat-sleeping");
    }
  }, []);

  useEffect(() => {
    const run = () => queueMicrotask(() => updateCatPosition());
    run();
    window.addEventListener("scroll", updateCatPosition, { passive: true });
    window.addEventListener("resize", updateCatPosition);
    return () => {
      window.removeEventListener("scroll", updateCatPosition);
      window.removeEventListener("resize", updateCatPosition);
    };
  }, [updateCatPosition]);

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

      <div
        id="tactical-cat"
        className="pointer-events-none fixed z-[100]"
        style={{
          top: catTop,
          right: catRight,
          width: 80,
          height: 80,
          transform: catTransform,
        }}
      >
        <div className={`h-full w-full ${catAnimClass}`}>
          <svg
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <path
              d="M12 5C12.67 5 13.35 5.09 14 5.26C15.78 3.26 19.03 2.42 20.42 2.83C20.86 4.08 20.31 6.29 19 8C22.07 9.42 24 11.5 24 13.5C24 17.92 19.52 21.5 14 21.5C8.48 21.5 4 17.92 4 13.5C4 11.5 5.93 9.42 9 8C7.69 6.29 7.14 4.08 7.58 2.83C8.97 2.42 12.22 3.26 14 5.26C14.65 5.09 15.33 5 16 5"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <circle cx="9" cy="13" fill="#000000" r="1">
              <animate
                attributeName="opacity"
                dur="2s"
                repeatCount="indefinite"
                values="1;0.3;1"
              />
            </circle>
            <circle cx="15" cy="13" fill="#000000" r="1">
              <animate
                attributeName="opacity"
                dur="2s"
                repeatCount="indefinite"
                values="1;0.3;1"
              />
            </circle>
            <path
              d="M7 4L9 6"
              stroke="#000000"
              strokeLinecap="round"
              strokeWidth="1"
            />
            <path
              d="M17 4L15 6"
              stroke="#000000"
              strokeLinecap="round"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>

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
          ref={experienceRef}
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
                  ref={index === 0 ? timelineNodeRef : undefined}
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

        <section ref={workRef} className="px-6 py-24 md:px-12 lg:px-24" id="work">
          <div className="mb-16 border-b border-black/10 pb-8">
            <TypeOnView
              as="span"
              text={site.workSectionEyebrow}
              className="font-mono mb-2 block text-xs text-black"
              stepMs={26}
            />
            <TypeOnView
              as="h2"
              text="Selected Works"
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
                  <a
                    data-work-slide
                    href={site.repoPortfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block h-[420px] w-[min(92vw,52rem)] shrink-0 overflow-hidden border border-black/15 bg-neutral-100 md:h-[500px]"
                  >
                    <div className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-8">
                      <TypeOnView
                        as="h3"
                        text="This portfolio"
                        className="font-headline mb-2 text-2xl font-bold text-white"
                        stepMs={24}
                      />
                      <TypeOnView
                        as="p"
                        text={portfolioProject.summary}
                        className="font-mono max-w-sm text-xs text-white/85"
                        stepMs={14}
                        delayMs={120}
                      />
                    </div>
                    <Image
                      alt="High-tech server room with status lights"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ-ds0ViDd73SnYrFLFde3MPQudTwVpckIrfr34U4TgXTLkpIsJCVn7iroD63TQdtuyxLAZKF_LSTPHvjJbMFLawCJws_Lu_PWABmTLG03zKFQ1VveDHizL3rhtJXFQ6LF8G81zmXl4J9o6U0y58956Rp6Hh9hIvTwNNbVr5dQBreo8zhfBNEtEm1tBVyH0n3fdBB_Oo8Bb8pINsP7wgL0q8LntfJvJCzzhvJDjvC_UNeywff_TanDEyOhzipF7fEodgrNOhebHe8"
                      fill
                      className="absolute inset-0 object-cover opacity-20 transition-transform duration-1000 group-hover:scale-110"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </a>

                  <a
                    ref={primaryCardRef}
                    data-work-slide
                    href={site.repoKalshiUi}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block h-[500px] w-[min(92vw,52rem)] shrink-0 overflow-hidden border border-black/15 bg-neutral-100"
                    id="project-card-primary"
                  >
                    <div className="absolute left-6 top-6 z-20">
                      <span className="mb-2 block w-fit bg-black px-2 py-1 font-mono text-[10px] text-white">
                        Open source
                      </span>
                      <TypeOnView
                        as="h3"
                        text="Kalshi UI"
                        className="font-headline text-3xl font-bold tracking-tight text-white drop-shadow-sm"
                        stepMs={22}
                      />
                    </div>
                    <Image
                      alt="Abstract 3D visualization of neural networks and data streams"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUzUudRhLuYLVKNeSpfElWkXl6qtYaFWnNBCIeVRbDEAxAZy-sn_jerCT7y72YT__Ev8qGXY96pczW_9nhfZS2Nh6jhyjI1qEM1v9hGJDD7q7TQNMg7p8WUH20oSSLeuza8Hs8bzuzFv7LS3C_VmzXZ3Y2WBL39lpjwE3ms14p9OKmeQDeLNuRnCsL4LLMYUckn01evMiP8NJRluH90fL9AAWyfB8ab2rGvWQjhXevXBYYp860R3qb3HegG_jWCuUvNm3Hv2Zu4WU"
                      fill
                      className="absolute inset-0 object-cover opacity-40 grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 z-20 flex items-end justify-between">
                      <TypeOnView
                        as="p"
                        text={kalshiProject.summary}
                        className="font-mono max-w-xs text-xs text-white/90"
                        stepMs={14}
                        delayMs={120}
                      />
                      <span className="material-symbols-outlined text-white">north_east</span>
                    </div>
                  </a>

                  <a
                    data-work-slide
                    href={site.github}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block h-[500px] w-[min(92vw,52rem)] shrink-0 overflow-hidden border border-black/15 bg-neutral-100"
                  >
                    <div className="absolute left-6 top-6 z-20">
                      <span className="font-mono mb-2 block text-[10px] text-white/80">GitHub</span>
                      <TypeOnView
                        as="h3"
                        text="Repositories"
                        className="font-headline text-xl font-bold tracking-tight text-white drop-shadow-sm"
                        stepMs={22}
                      />
                    </div>
                    <Image
                      alt="Technical schematic of a drone with digital overlays"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjKTZxBz_lekB20xktSB-zcNPSlqR0pmpsfRDrqFHcAaEHSXUrHtLj2DPQBm1ph0_-DGPC88U6SJPVF7OxRhEY6t2-_KeaE5xXRRcerXwzMYwlme4raqsRrSN6wt9B-g_gaXk-6CFsHA3LGBc3CKydZHy8AmhYhBHws5ZxK1AGXSQHQiQy7MYh5eZfoLlYlQJhsnsR8O49PqQ_CEilmUgi11vkTIRQPnpqBWXErDALb4dAswRYp-Rp5X4a7MAPI9AYIZckoHb8Dc0"
                      fill
                      className="absolute inset-0 object-cover opacity-30 grayscale transition-all group-hover:opacity-50"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
                    <div className="absolute bottom-6 left-6 z-20">
                      <span className="font-label flex items-center gap-2 text-[10px] uppercase tracking-widest text-white underline-offset-4">
                        View profile{" "}
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                    </div>
                  </a>

                  <a
                    data-work-slide
                    href={miniAmazonProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-[420px] w-[min(92vw,52rem)] shrink-0 flex-col justify-between border border-black/15 bg-neutral-100 p-8 md:h-[500px]"
                  >
                    <div>
                      <span className="material-symbols-outlined mb-4 text-black">code</span>
                      <TypeOnView
                        as="h3"
                        text="Mini-Amazon"
                        className="font-headline text-lg font-bold text-black"
                        stepMs={26}
                      />
                      <TypeOnView
                        as="p"
                        text={miniAmazonProject.summary}
                        className="font-mono mt-2 text-[10px] text-black/55"
                        stepMs={16}
                        delayMs={100}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["PYTHON", "FLASK", "POSTGRES"].map((tag) => (
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
                  <a
                    data-work-slide
                    href={site.repoPortfolio}
                    tabIndex={-1}
                    className="group relative block h-[420px] w-[min(92vw,52rem)] shrink-0 overflow-hidden border border-black/15 bg-neutral-100 md:h-[500px]"
                  >
                    <div className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-8">
                      <h3 className="font-headline mb-2 text-2xl font-bold text-white">This portfolio</h3>
                      <p className="font-mono max-w-sm text-xs text-white/85">{portfolioProject.summary}</p>
                    </div>
                    <Image
                      alt=""
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ-ds0ViDd73SnYrFLFde3MPQudTwVpckIrfr34U4TgXTLkpIsJCVn7iroD63TQdtuyxLAZKF_LSTPHvjJbMFLawCJws_Lu_PWABmTLG03zKFQ1VveDHizL3rhtJXFQ6LF8G81zmXl4J9o6U0y58956Rp6Hh9hIvTwNNbVr5dQBreo8zhfBNEtEm1tBVyH0n3fdBB_Oo8Bb8pINsP7wgL0q8LntfJvJCzzhvJDjvC_UNeywff_TanDEyOhzipF7fEodgrNOhebHe8"
                      fill
                      className="absolute inset-0 object-cover opacity-20"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </a>

                  <a
                    data-work-slide
                    href={site.repoKalshiUi}
                    tabIndex={-1}
                    className="group relative block h-[500px] w-[min(92vw,52rem)] shrink-0 overflow-hidden border border-black/15 bg-neutral-100"
                  >
                    <div className="absolute left-6 top-6 z-20">
                      <span className="mb-2 block w-fit bg-black px-2 py-1 font-mono text-[10px] text-white">
                        Open source
                      </span>
                      <h3 className="font-headline text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                        Kalshi UI
                      </h3>
                    </div>
                    <Image
                      alt=""
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUzUudRhLuYLVKNeSpfElWkXl6qtYaFWnNBCIeVRbDEAxAZy-sn_jerCT7y72YT__Ev8qGXY96pczW_9nhfZS2Nh6jhyjI1qEM1v9hGJDD7q7TQNMg7p8WUH20oSSLeuza8Hs8bzuzFv7LS3C_VmzXZ3Y2WBL39lpjwE3ms14p9OKmeQDeLNuRnCsL4LLMYUckn01evMiP8NJRluH90fL9AAWyfB8ab2rGvWQjhXevXBYYp860R3qb3HegG_jWCuUvNm3Hv2Zu4WU"
                      fill
                      className="absolute inset-0 object-cover opacity-40 grayscale"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </a>

                  <a
                    data-work-slide
                    href={site.github}
                    tabIndex={-1}
                    className="group relative block h-[500px] w-[min(92vw,52rem)] shrink-0 overflow-hidden border border-black/15 bg-neutral-100"
                  >
                    <div className="absolute left-6 top-6 z-20">
                      <span className="font-mono mb-2 block text-[10px] text-white/80">GitHub</span>
                      <h3 className="font-headline text-xl font-bold tracking-tight text-white drop-shadow-sm">
                        Repositories
                      </h3>
                    </div>
                    <Image
                      alt=""
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjKTZxBz_lekB20xktSB-zcNPSlqR0pmpsfRDrqFHcAaEHSXUrHtLj2DPQBm1ph0_-DGPC88U6SJPVF7OxRhEY6t2-_KeaE5xXRRcerXwzMYwlme4raqsRrSN6wt9B-g_gaXk-6CFsHA3LGBc3CKydZHy8AmhYhBHws5ZxK1AGXSQHQiQy7MYh5eZfoLlYlQJhsnsR8O49PqQ_CEilmUgi11vkTIRQPnpqBWXErDALb4dAswRYp-Rp5X4a7MAPI9AYIZckoHb8Dc0"
                      fill
                      className="absolute inset-0 object-cover opacity-30 grayscale"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
                  </a>

                  <a
                    data-work-slide
                    href={miniAmazonProject.githubUrl}
                    tabIndex={-1}
                    className="flex h-[420px] w-[min(92vw,52rem)] shrink-0 flex-col justify-between border border-black/15 bg-neutral-100 p-8 md:h-[500px]"
                  >
                    <div>
                      <span className="material-symbols-outlined mb-4 text-black">code</span>
                      <h3 className="font-headline text-lg font-bold text-black">Mini-Amazon</h3>
                      <p className="font-mono mt-2 text-[10px] text-black/55">{miniAmazonProject.summary}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["PYTHON", "FLASK", "POSTGRES"].map((tag) => (
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
        ref={footerRef}
        className="flex w-full flex-col items-center justify-between gap-4 border-t border-black/10 bg-white px-8 py-12 md:flex-row"
        id="footer"
      >
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black">
          {site.footerSlug}
        </div>
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
            ref={socialAnchorRef}
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
