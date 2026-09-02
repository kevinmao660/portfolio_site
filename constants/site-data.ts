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
  achievements: string[];
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
  summary: string;
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
      achievements: [
        "Dragon is Genius Sports’ AI-powered 25 Hz multi-camera CV system producing 3.1M position samples per game.",
        "Rebuilt Kazaam, Dragon’s operations and game-lifecycle layer, as sole architect coordinating CV pipeline components, running automated health checks and routing alerts across 85+ competitions (NBA, EPL, UCL, etc.).",
        "Replaced in-memory daemons with a Postgres-backed Graphile Worker system: leases and watchdog recovery prevent duplicate or lost runs, and releasing leases on shutdown cuts redeploy downtime to near-zero.",
        "Built the full competition management stack across four layers: Kazaam REST API, a Data Graph GraphQL module, a Control Center operator UI, and Auth0 M2M-based permissions spanning all three services.",
        "Diagnosed and fixed a silent alert gap in Dragon’s Temporal pre-run workflow by wiring alerting into Kazaam.",
        "Directed AI coding agents (Cursor, skills, subagents) across development, deployment, code review, and diagnostics via Grafana and Slack, running them in parallel across git worktrees for onboarding and testing.",
      ],
    },
    {
      company: "Fidelity Investments — Asset Management Database Automation",
      role: "Software Engineer Intern",
      period: "Jun 2025 — Aug 2025",
      location: "Durham, NC",
      achievements: [
        "Designed, built, and deployed a full-stack database healthcheck platform using Angular, FastAPI, and Oracle DB.",
        "Developed a threaded SQL engine supporting health checks across 30+ Oracle schemas and 4,000+ tables.",
        "Architected the platform for scale, enabling adoption across Fidelity Asset Management’s entire database estate.",
        "Integrated with enterprise Jenkins CI/CD pipelines and deployed to EKS for reliability and scalability.",
        "Delivered iteratively in a Scrum-based Agile workflow with regular stakeholder updates.",
      ],
    },
    {
      company: "Students Who Sit",
      role: "Software Engineer Intern",
      period: "Aug 2024 — Jan 2025",
      location: "Durham, NC",
      achievements: [
        "Engineered a production Stripe Connect payment integration using Airtable, Softr, and the Stripe API.",
        "Built a real-time sitter re-registration workflow with Airtable automations and webhook triggers.",
        "Developed automated email notifications that increased sitter onboarding completion.",
        "Designed Airtable–Stripe integration architecture to minimize API overhead and improve reliability.",
      ],
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
        "One of the things I've been working on the most recently. Prediction markets like Polymarket pay you for keeping limit orders resting on certain markets, so this is a bot suite that goes and collects those liquidity rewards — it scans for which markets are actually worth sitting on, deploys a bot to each one, and pulls out when they stop paying. The whole thing runs on a DigitalOcean droplet 24/7 and has been live for a few months now. The numbers below are queried straight out of its own database, not estimated.",
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
        "Something I've been thinking about more recently. People carry around a lot that matters — to-do lists, half-formed ideas, the things they know they'll forget — and it ends up scattered across notes apps, Notion docs and everywhere else, so there's always a delay between having a thought and finding it again. Buckets is my attempt at collapsing that into a single entry point: you say the thought, and instead of you deciding where it goes, AI files it for you and learns from any correction you make. Still early, and still very much something I'm working out.",
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
        "The thing you're looking at. Started as an excuse to point Claude Code, Codex and Google Stitch at the same repo and see what came out, and turned into a rabbit hole of typing animations, scrambling nav links and little corner brackets that appear when you hover. No backend, no database, no analytics — just one big typed object and an unreasonable amount of framer-motion. Poke at it.",
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
