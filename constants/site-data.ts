export type NavigationItem = {
  label: string;
  href: string;
};

export type MetricItem = {
  label: string;
  value: string;
  detail: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location: string;
  /**
   * First-person take on the role — what the work actually was and what it left me
   * thinking about. This carries the roles; bullets are only used for education.
   */
  summary?: string;
  achievements?: string[];
};

/**
 * Real, measured engineering stats for a project — not estimates. Lines are
 * authored source only (excludes generated/lockfile JSON, node_modules, caches).
 * Sourced by cloning/inspecting the actual repo; update by re-measuring, not guessing.
 */
export type ProjectStats = {
  /** Source lines by language, e.g. { TypeScript: 5300, CSS: 7 } */
  languages: Record<string, number>;
  files: number;
  /** Git-derived, so absent on anything not kept in a repo. */
  commits?: number;
  firstCommit?: string;
  lastCommit?: string;
  /** Stands in for the commit range when there is no git history to read one out of. */
  activePeriod?: string;
  dependencies: number;
  testFiles?: number;
  testLines?: number;
};

export type ProjectDbStat = {
  label: string;
  value: number;
  /** Appended after the formatted number, e.g. "x" for a return multiple. */
  suffix?: string;
};

export type ProjectItem = {
  title: string;
  /** My take on it — why I built it, what I think of it. Also what the card shows. */
  summary: string;
  /**
   * How the thing actually works, in technical terms. Reads under the diagram in the
   * modal, so it explains what the diagram is showing rather than repeating the summary.
   */
  technical?: string;
  tech: string[];
  /** Omitted when the project isn't in a public repo — the card then shows no "View Code". */
  githubUrl?: string;
  liveUrl: string;
  status: string;
  stats?: ProjectStats;
  /** Live operational numbers queried directly from the project's own database — not estimates. */
  dbStats?: ProjectDbStat[];
  /** Extra color for the dbStats block — no dollar amounts. */
  dbStatsCaption?: string;
  /** Date this snapshot was actually queried — update whenever dbStats is re-measured. */
  dbStatsAsOf?: string;
};

export type SocialLinkItem = {
  label: string;
  href: string;
  handle: string;
};

export type SiteData = {
  person: {
    name: string;
    label: string;
    title: string;
    bio: string;
    status: string;
    location: string;
  };
  navigation: NavigationItem[];
  metrics: MetricItem[];
  experience: ExperienceItem[];
  /** College / degree — rendered in its own section on the portfolio */
  education: ExperienceItem;
  projects: ProjectItem[];
  socials: SocialLinkItem[];
};

export const siteData: SiteData = {
  person: {
    name: "Kevin",
    label: "CLAUDE CODE + CODEX + STITCH",
    title: "Vibe-coding practice, and a place to put the work.",
    bio: "Hi, I’m Kevin — I'm currently a student @ Duke studying CS. Wanted to get better at vibe coding and put some of the things I've been working on in one place, so I built this with Claude Code, Codex and Google Stitch.",
    status: "Built with Claude Code, Codex and Google Stitch.",
    location: "Durham, NC",
  },
  navigation: [
    { label: "About", href: "#hero" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Education", href: "#education" },
    { label: "Connect", href: "#connect" },
  ],
  metrics: [
    {
      label: "Focus",
      value: "Full-stack & ML infra",
      detail: "Python, TypeScript, React, FastAPI, Angular, Oracle, GCP.",
    },
    {
      label: "Education",
      value: "Duke · 2027",
      detail: "Distributed systems, ML, NLP, databases, algorithms, OS.",
    },
    {
      label: "Leadership",
      value: "Product@Duke",
      detail: "Co-president; shipped for 250+ person events.",
    },
  ],
  experience: [
    {
      company: "Genius Sports (Second Spectrum) — Dragon AI & CV Infrastructure Team",
      role: "Software Engineer Intern",
      period: "May 2026 — Aug 2026",
      location: "New York, NY",
      summary:
        "I think there's a lot of potential in the sports and AI stats industry, and it's pretty clearly going to be big. Dragon is the platform that ingests game data and tracks NBA stats straight off the camera feeds, every point, rebound, pass, assist, and I worked on the operations layer around it. That got me a lot more interested in AI infra in general, down to things like token usage. There are way more parts to the business than I originally thought, and a ton of potential in the ad space and in automating the data side of it. Genuinely cool team to be on, too.",
    },
    {
      company: "Fidelity Investments — Asset Management Database Automation",
      role: "Software Engineer Intern",
      period: "Jun 2025 — Aug 2025",
      location: "Durham, NC",
      summary:
        "Doing SWE in banking is way more about databases than I expected. So much of it is making sure data is always available, safe and stable, and that migrations stay chill instead of knocking something over.",
    },
    {
      company: "Students Who Sit",
      role: "Software Engineer Intern",
      period: "Aug 2024 — Jan 2025",
      location: "Durham, NC",
      summary:
        "Built out the payments side here. Stripe Connect wired through Airtable and Softr so money actually moved for babysitting jobs, plus the webhook automations behind it, mostly getting sitters through their registrations and re-registrations.",
    },
  ],
  education: {
    company: "Duke University",
    role: "B.S. Computer Science — AI & ML concentration, Minor in Statistics",
    period: "Aug 2023 — May 2027",
    location: "Durham, NC",
    achievements: [
      "GPA: 3.8/4.0.",
      "Coursework: data structures & algorithms, distributed systems, databases, DAA, operating systems, computer architecture, machine learning, NLP, linear algebra.",
      "Activities: HackDuke (Co-Director), Product@Duke (Co-President), Brownstone, Club Water Polo.",
    ],
  },
  projects: [
    {
      title: "Polymarket Incentives Bot",
      summary:
        "The thing I've spent the most time on recently. Prediction markets pay you just for leaving orders resting on the book, which sounded strange enough that I wanted to see if the whole loop could run itself. It can. It's been live for a few months, and most of the work since has gone into which markets are actually worth the capital.",
      technical:
        "One FastAPI process holds every long-lived component and exposes them over REST plus SSE streams. A separate WebSocket proxy owns the single upstream connection and fans it out to the workers and the browser, so nothing opens a duplicate feed. State is split by durability: Postgres for run history and the market catalog, SQLite for cache and local settings. The frontend is a React dashboard reading over REST and subscribing to SSE for anything live. Infrastructure is deliberately boring: backend, both databases and the dashboard all sit on one DigitalOcean droplet running 24/7, up for months at a stretch. The numbers above come straight out of that database.",
      tech: [
        "Python",
        "FastAPI",
        "React",
        "Vite",
        "TypeScript",
        "Tailwind CSS",
        "SQLite",
        "Postgres",
        "WebSockets",
      ],
      githubUrl: "https://github.com/kevinmao660/polymarket_incentives_bot",
      liveUrl: "",
      status: "Running live",
      stats: {
        languages: { Python: 17828, TypeScript: 10529, CSS: 70 },
        files: 73,
        commits: 63,
        firstCommit: "2026-06-12",
        lastCommit: "2026-09-01",
        dependencies: 28,
        testFiles: 27,
        testLines: 4769,
      },
      dbStats: [
        { label: "Deploys", value: 150320 },
        { label: "Hours of uptime", value: 670 },
        { label: "Return on seed", value: 132, suffix: "x" },
      ],
      dbStatsCaption:
        "85 days live · ~1 deploy every 49s, nonstop · 5,063 distinct markets traded · most persistent: 2,805 redeploys on a single tennis match in one 5h22m window",
      dbStatsAsOf: "2026-08-22",
    },
    {
      title: "Buckets",
      summary:
        "Something I've been thinking about more recently. The stuff that matters ends up scattered across notes apps, Notion docs and everywhere else, so there's always a delay between having a thought and finding it again. Buckets collapses that into one entry point: you say the thought, and instead of you deciding where it goes, AI files it and learns from any correction you make. Still early.",
      technical:
        "Next.js with server actions over a SQLite store. You dump a thought in one breath, often more than one thing at a time, and a single model call splits it into separate items and files each one into a bucket, with a type and a deadline if you gave one. Nothing is written until you press Create. When it files something wrong and you move it, that correction gets recorded and applied on the next sort, and as items pile up it re-reads your buckets and proposes splits or regroupings using only your own words.",
      tech: [
        "TypeScript",
        "Next.js",
        "React",
        "Server Actions",
        "SQLite",
        "Anthropic API",
      ],
      liveUrl: "",
      status: "In development",
      stats: {
        languages: { TypeScript: 4179, CSS: 1916 },
        files: 31,
        activePeriod: "Aug — Sep 2026",
        dependencies: 10,
      },
    },
    {
      title: "Portfolio Site",
      summary:
        "The thing you're looking at. Started as an excuse to point Claude Code, Codex and Google Stitch at the same repo and see what came out, and turned into a rabbit hole of typing animations, scrambling nav links and little corner brackets that appear when you hover. Poke at it.",
      technical:
        "Next.js App Router, statically prerendered, with no backend and no database. Every section renders at build time from one typed object in constants/, the diagrams are hand-authored inline SVG rather than a charting library, and the typing and scramble effects are IntersectionObserver-driven components that respect prefers-reduced-motion. Deploys to Vercel on push to main.",
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      githubUrl: "https://github.com/kevinmao660/portfolio_site",
      liveUrl: "",
      status: "You're on it",
    },
  ],
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/kevinmao660",
      handle: "@kevinmao660",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/kevin-mao-56bbb320b/",
      handle: "/in/kevin-mao-56bbb320b",
    },
  ],
};
