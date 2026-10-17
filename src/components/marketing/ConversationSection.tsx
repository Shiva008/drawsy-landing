/** Frame 59 — The conversation stays with the work. (1440×808 @ ~13115) */

export function ConversationSection() {
  return (
    <section
      className="landing-conversation"
      id="conversation"
      aria-labelledby="landing-conversation-title"
    >
      <div className="landing-conversation-grain" aria-hidden />
      <div className="landing-conversation-frame" data-reveal="soft">
        <div className="landing-conversation-panel" aria-hidden />
        <h2
          id="landing-conversation-title"
          className="landing-conversation-title"
        >
          The conversation stays with the work.
        </h2>
        <p className="landing-conversation-subtitle">
          Talk, point, comment, and create together on the same canvas, without
          breaking the flow between explaining an idea and working on it.
        </p>
      </div>
    </section>
  );
}
