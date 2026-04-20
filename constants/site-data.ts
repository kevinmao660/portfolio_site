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

export type ProjectItem = {
  title: string;
  summary: string;
  tech: string[];
  githubUrl: string;
  liveUrl: string;
  status: string;
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
    label: "STITCH + CURSOR",
    title: "Vibe-coded portfolio experiment.",
    bio: "Hi, I’m Kevin — I wanted to try vibe coding, so I made this site with Google Stitch and Cursor.",
    status: "Built with Stitch layouts and Cursor.",
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
      company: "Genius Sports — GeniusIQ CV/ML Infra",
      role: "Incoming Software Engineer Intern",
      period: "May 2026 — Aug 2026",
      location: "New York, NY",
      achievements: [
        "Joining the CV/ML infrastructure team to build and operate production systems for computer vision and machine learning at scale.",
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
      title: "Kalshi Trading Terminal",
      summary:
        "Full-stack terminal for Kalshi markets: hot-volume screener, live trading, WebSocket market data, SSE for order books and trades, portfolio and order management.",
      tech: ["TypeScript", "React", "Express", "Tailwind CSS", "WebSocket", "SSE"],
      githubUrl: "https://github.com/kevinmao660/kalshi_UI",
      liveUrl: "",
      status: "Public repo",
    },
    {
      title: "Mini-Amazon E-Commerce Platform",
      summary:
        "Full-stack e-commerce simulation with browsing, ordering, and seller inventory; PostgreSQL-backed with improved order status flows.",
      tech: ["Python", "Flask", "PostgreSQL", "HTML/CSS"],
      githubUrl: "https://github.com/kevinmao660",
      liveUrl: "",
      status: "Coursework",
    },
    {
      title: "Portfolio Site",
      summary:
        "This site — Next.js, Tailwind, motion, and modular content for quick updates.",
      tech: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
      githubUrl: "https://github.com/kevinmao660/portfolio_site",
      liveUrl: "",
      status: "Live",
    },
    {
      title: "Systems in C",
      summary:
        "Cache simulator (LRU, write-back) and dynamic memory allocator with explicit free lists, coalescing, and heap optimization—validating correctness across configurations.",
      tech: ["C"],
      githubUrl: "https://github.com/kevinmao660",
      liveUrl: "",
      status: "Coursework",
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
