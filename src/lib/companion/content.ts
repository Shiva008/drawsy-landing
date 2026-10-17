import { siteConfig } from "@/config/site";

export const companionPageMeta = {
  title: "Drawsy Companion — Local AI for Codex & OpenCode",
  description:
    "Use Drawsy free with Companion. It connects the Codex or OpenCode you already have to the files and code on your computer. Windows, macOS, and Linux.",
  keywords: [
    "Drawsy Companion",
    "Codex CLI",
    "OpenCode",
    "local AI",
    "Drawsy canvas",
    "Microsoft Store",
  ],
} as const;

export const companionLanding = {
  eyebrow: "Drawsy Companion",
  title: "Bring your local AI into Drawsy.",
  titleAccent: "local AI",
  subtitle:
    "Use Drawsy free with Companion. It connects the AI you already use to the files on your computer.",
  installHint: "Install Companion on your computer, then open Drawsy.",
  learnMore: "Setup guide",
} as const;

export const companionHero = {
  eyebrow: "Drawsy Companion",
  /** Companion page can name Codex and OpenCode; the home section stays general. */
  titleLead: "Use the AI you",
  titleAccent: "already have.",
  subtitle:
    "Use Drawsy free with Companion. It connects the Codex or OpenCode you already have to the files and code on your computer.",
  secondaryCta: "Steps after install",
  primaryCtaUnknown: "Choose how to install",
} as const;

export const companionDownload = {
  eyebrow: "Download",
  title: "Install Companion",
  titleForPlatform: "Install on",
  subtitle:
    "Desktop app, one terminal command, or a prompt for your AI agent — pick what fits you.",
  subtitleUnknown:
    "Choose your system below — we’ll show the right installer and command.",
  desktopCardTitle: "Desktop app",
  desktopCardTitleForYou: "For your computer",
  desktopRecommendedBadge: "Recommended",
  terminalCardTitle: "Terminal install",
  terminalCardDescription:
    "One copy-paste command — if you are comfortable in PowerShell or Terminal.",
  terminalSkipHint:
    "Skip this if you used the Store or download button above.",
  windowsDirectHint:
    "Direct EXE is unsigned — Windows SmartScreen may warn. Microsoft Store is recommended for most people.",
  otherPlatformPrompt: "Not on this system?",
  choosePlatformHint: "Select Windows, macOS, or Linux to see install options.",
  cliOptionalSummary:
    "Optional: Node CLI for a windowless service (Node 22+)",
  cliOptionalDescription:
    "Same Companion as the desktop app — for scripts, CI, or when you do not want the GUI. Most people should use the app or terminal command above.",
  agentPromptEyebrow: "AI agent",
  agentPromptHeading: "Copy a setup prompt",
  agentPromptLead:
    "Paste into Cursor, Claude Code, Codex, or ChatGPT on this computer. Your agent installs Companion and verifies it — not just instructions.",
  agentPromptCompat:
    "Needs an agent that can run terminal commands locally (not a remote or CI machine).",
  agentPromptBarLabel: "System prompt",
  agentPromptCopy: "Copy prompt",
  agentPromptCopied: "Copied",
  agentPromptCopyFailed: "Copy failed",
  agentPromptAfterCopyTitle: "Next:",
  agentPromptAfterCopySteps: [
    "Open your agent (Cursor, Claude Code, Codex, ChatGPT, …)",
    "Paste the full prompt and send it",
    "Approve terminal commands when the agent asks",
    "When it reports success, open Drawsy and start a canvas",
  ] as const,
} as const;

/** Bottom of /companion — answers not covered by install + next steps (replaces duplicate “how it works” board). */
export const companionHelp = {
  eyebrow: "Help",
  title: "Before you install",
  subtitle: "The short version, if you are new here.",
  valueTitle: "Drawsy is free for this. Your AI stays where it already is.",
  valueLead:
    "Companion is a free app on your computer. It connects Drawsy to Codex or OpenCode you already use, and to the files and code on your machine. You do not buy that AI from Drawsy.",
  valuePoints: [
    "One of Codex or OpenCode is enough. Install it if you do not have it yet.",
    "You pick a folder. Companion does not upload your whole computer.",
    "Cloud sync, shared boards, and invites are optional Drawsy Pro — not required to start.",
  ],
  items: [
    {
      question: "Do I pay Drawsy for this AI?",
      answer:
        "No. You use Drawsy free with Companion. The AI is Codex or OpenCode you already have, working on the files and code on your computer.",
    },
    {
      question: "What do I pay Drawsy for?",
      answer:
        "Optional Pro features: cloud sync for canvases, presentation and Kanban sync, inviting people to boards, and cloud comments. Local canvas and Companion stay on the free plan.",
      links: [{ label: "See pricing", href: "/pricing" }],
    },
    {
      question: "Do I need both Codex and OpenCode?",
      answer:
        "No — install one CLI you already use. Companion talks to whichever you have running on this machine.",
    },
    {
      question: "Can I install on a remote server or in CI?",
      answer:
        "No. Companion must run on the same computer where you use the browser and keep your project files. SSH-only or cloud VMs are not supported for the normal flow.",
    },
    {
      question: "Store, direct download, or terminal — which should I pick?",
      answer:
        "Most people: Microsoft Store on Windows, or the direct DMG/AppImage on Mac/Linux. Terminal and the AI agent prompt are for developers; the optional Node CLI is for headless setups only.",
    },
    {
      question: "How do I know Companion is working?",
      answer:
        "The desktop app should open after install. Advanced check: open http://127.0.0.1:3031/health in a browser on this machine — you should see ok=true when Companion is running.",
    },
    {
      question: "What can Companion see on my computer?",
      answer:
        "Whatever you connect in Drawsy — typically a project folder — plus what Codex or OpenCode is allowed to use on this machine. The link runs locally (Companion on localhost). Drawsy isn’t uploading your disk; your CLI tools work the way they already do, with Drawsy as the front end.",
    },
  ],
} as const;

/** Section `#after-install` — single walkthrough; no duplicate CTAs (see steps 4–6). */
export const companionConnect = {
  eyebrow: "Next",
  title: "Use Drawsy with Companion",
  subtitle:
    "On the same computer as Companion. If you do not have Codex or OpenCode yet, start at step 1.",
  openDrawsy: "Open Drawsy",
  openDrawsyHref: siteConfig.appUrl,
  backToInstall: "Need to install Companion?",
} as const;

export const codexCliInstallUrl = "https://learn.chatgpt.com/docs/codex/cli";
export const openCodeInstallUrl = "https://opencode.ai/docs/#install";

/** Shown under Setup — assumes Companion install from Download or Setup above */
export const companionAfterInstallSteps = [
  {
    step: "1",
    name: "Codex or OpenCode",
    description:
      "Install Codex CLI or OpenCode CLI on this machine (one is enough):",
    icon: "/assets/companion/steps/terminal.png",
    links: [
      { label: "Codex CLI", href: codexCliInstallUrl },
      { label: "OpenCode CLI", href: openCodeInstallUrl },
    ],
  },
  {
    step: "2",
    name: "Companion running",
    description:
      "Companion should be open after install. If not, launch it from your apps — it stays in the background.",
    icon: "/assets/companion/steps/monitor.png",
  },
  {
    step: "3",
    name: "Open Drawsy",
    description: "Sign in on Drawsy Web if needed, then open or create a canvas:",
    icon: "/assets/companion/steps/drawsy.png",
    links: [{ label: "Drawsy Web", href: siteConfig.appUrl }],
  },
  {
    step: "4",
    name: "Connect a project",
    description: "Choose a local folder on this computer.",
    icon: "/assets/companion/steps/folder.png",
  },
  {
    step: "5",
    name: "Start building",
    description:
      "Ask Drawsy to plan or build using Codex or OpenCode — with the files and folders you connected on this machine.",
    icon: "/assets/companion/steps/sparkles.png",
  },
] as const;

export function companionStructuredData() {
  const pageUrl = `${siteConfig.url}/companion`;
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: companionHelp.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "links" in item && item.links[0]
            ? `${item.answer} ${item.links[0].label}: ${siteConfig.url}${item.links[0].href}`
            : item.answer,
      },
    })),
  };
  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Drawsy Companion",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux",
    url: pageUrl,
    description: companionPageMeta.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
  return [software, faq];
}
