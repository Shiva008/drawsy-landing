/** Frame 18 — It's not an image. It's a canvas. (1440×808 @ ~9503) */

export function CanvasSection() {
  return (
    <section
      className="landing-canvas"
      id="canvas"
      aria-labelledby="landing-canvas-title"
    >
      <div className="landing-canvas-grain" aria-hidden />
      <div className="landing-canvas-frame" data-reveal="soft">
        <h2 id="landing-canvas-title" className="landing-canvas-title">
          It&apos;s not an image. It&apos;s a canvas.
        </h2>
        <p className="landing-canvas-subtitle">
          Everything Drawsy creates becomes part of a workspace you can edit,
          reshape, expand, and keep building on.
        </p>
        <div className="landing-canvas-panel" aria-hidden />
      </div>
    </section>
  );
}
