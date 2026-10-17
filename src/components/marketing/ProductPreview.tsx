import { brand } from "@/config/brand";

/** Lightweight product canvas preview matching the Desktop-6 hero mock. */
export function ProductPreview() {
  return (
    <div className="landing-preview" aria-hidden>
      <div className="landing-preview-surface">
        <div className="landing-preview-chrome">
          <div className="landing-preview-toolbar">
            <span className="landing-preview-tool is-active" />
            <span className="landing-preview-tool" />
            <span className="landing-preview-tool" />
            <span className="landing-preview-tool" />
            <span className="landing-preview-tool" />
            <span className="landing-preview-tool" />
          </div>
        </div>

        <div className="landing-preview-canvas">
          <p className="landing-preview-note">Explore more than a canvas.</p>
          <ul className="landing-preview-list">
            <li>Turn prompts into diagrams</li>
            <li>Connect your sources</li>
            <li>Edit everything visually</li>
          </ul>
          <div className="landing-preview-arrow" />
          <div className="landing-preview-badge">{brand.name}</div>
        </div>
      </div>
    </div>
  );
}
