import "../styles/TopBar.css";

export type Tab = "ask" | "evaluation" | "how-it-works";

interface TopBarProps {
  activeTab: Tab;
  onTabChange?: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "ask", label: "Ask" },
  { id: "evaluation", label: "Evaluation" },
  { id: "how-it-works", label: "How it works" },
];

export default function TopBar({ activeTab, onTabChange }: TopBarProps) {
  return (
    <header className="topbar">
      <span className="topbar__logo">Evaluated Docs Assistant</span>

      <nav className="topbar__tabs" aria-label="Main navigation">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange && onTabChange(tab.id)}
            className={`topbar__tab${activeTab === tab.id ? " topbar__tab--active" : ""}`}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <a
        className="topbar__github"
        href="https://github.com/praneeth-hari/Evaluated-Docs-Assistant"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub ↗
      </a>
    </header>
  );
}
