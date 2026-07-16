export type EmploymentRole = {
  role: string;
  company: string;
  period: string;
  highlights: readonly string[];
};

export type EducationEntry = {
  school: string;
  program: string;
  period: string;
};

export const resumeIntro =
  "I'm a front-end leaning engineer with 8+ years of experience building high-quality web and mobile applications. I have a strong eye for detail and strive for pixel-perfect implementations. I enjoy close collaboration with product and design to craft the best user experiences, specialize in React and React Native, and stay up to date with modern AI and agentic development workflows to build smarter and faster.";

export const employment: readonly EmploymentRole[] = [
  {
    role: "Front End Engineer",
    company: "MoonPay",
    period: "2021 — Now",
    highlights: [
      "Contributed across multiple product teams, including the MoonPay website, account dashboard, and mobile app.",
      "Built major app features such as the discoverability tab (DeFi tokens, charts, market data), social features, web3 account importing, staking and much more.",
      "Created AI skills that automate parts of the delivery process to ship faster with higher quality.",
      "Improved performance and responsiveness across app and web through targeted optimizations.",
      "Built and iterated on features informed by data — experimentation with LaunchDarkly, product analytics in Looker, and monitoring and debugging with Datadog and Sentry.",
      "Collaborated with designers and backend teams to ship cohesive, scalable interfaces and maintain a shared design system.",
      "Integrated CMS and CRM systems such as HubSpot, Contentful, and Braze.",
      "Worked closely with SEO and QA to improve the visibility and accessibility of the web platform.",
    ],
  },
  {
    role: "Full Stack Developer",
    company: "Tangent Works",
    period: "2020 — 2021",
    highlights: [
      "Developed the front end of Tangent Works' time-series analytics platform using React and GraphQL.",
      "Created and maintained tim-studio, a Python package giving users a simplified way to interact with the platform's microservice architecture.",
    ],
  },
  {
    role: "Full Stack Developer",
    company: "A&C Systems",
    period: "2020 — 2021",
    highlights: [
      "Created and maintained webshops for multiple Belgian internet providers in PHP.",
      "Developed and maintained SaaS projects using React, MUI, and Symfony.",
    ],
  },
];

export const education: readonly EducationEntry[] = [
  {
    school: "Syntra Brussel",
    program: "Full Stack Developer",
    period: "2015 — 2017",
  },
  {
    school: "Artevelde Hogeschool",
    program: "Graphic and Digital Media",
    period: "2012 — 2015",
  },
];

export const technologies: readonly string[] = [
  "React",
  "React Native",
  "TypeScript",
  "Next.js",
  "Expo",
  "Tailwind",
  "React Query",
  "GraphQL",
  "Node.js",
  "NestJS",
  "LaunchDarkly",
  "Looker",
  "Datadog",
  "Sentry",
  "Figma",
  "Python",
  "Jest",
  "Cypress",
  "Unity",
  "C#",
];

export const interests =
  "Playing music, gaming, game development, fitness, and learning new skills.";
