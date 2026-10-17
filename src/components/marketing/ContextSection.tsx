import Image from "next/image";
import { Fragment } from "react";
import { brand } from "@/config/brand";

const STEPS = ["Information", "Prompt", "Drawsy", "Visualize"] as const;

function StepArrow() {
  return (
    <li className="landing-context-arrow" aria-hidden>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 12H19"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M13 6L19 12L13 18"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </li>
  );
}

/** Frame 14 — Give it context. Get clarity. */
export function ContextSection() {
  return (
    <section
      className="landing-context"
      id="how-it-works"
      aria-label={`${brand.shortName}: Give it context. Get clarity.`}
    >
      <div className="landing-context-frame" data-reveal="soft">
        <Image
          src="/drawsy_context.png"
          alt=""
          width={1360}
          height={609}
          className="landing-context-img"
          sizes="(max-width: 1400px) calc(100vw - 60px), 1360px"
          priority={false}
        />
        {/* Figma image 55 dark overlay */}
        <div className="landing-context-shade" aria-hidden />

        <p className="landing-context-eyebrow">
          Give it context. Get clarity.
        </p>
        <p className="landing-context-brand">{brand.shortName}</p>

        <ol className="landing-context-steps">
          {STEPS.map((step, index) => (
            <Fragment key={step}>
              {index > 0 ? <StepArrow /> : null}
              <li className="landing-context-step-label">{step}</li>
            </Fragment>
          ))}
        </ol>
      </div>
    </section>
  );
}
