import { useState } from "react";
import "./styles/global.css";
import TopBar, { type Tab } from "./components/TopBar";
import { AskPage } from "./pages/AskPage";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("ask");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main style={{ flex: 1 }}>
        {activeTab === "ask" && <AskPage />}
        {activeTab === "evaluation" && (
          <div style={{ maxWidth: "1160px", margin: "40px auto", padding: "0 24px", color: "var(--mute)" }}>
            <p>Evaluation placeholder</p>
          </div>
        )}
        {activeTab === "how-it-works" && (
          <div style={{ maxWidth: "1160px", margin: "40px auto", padding: "0 24px", color: "var(--mute)" }}>
            <p>How it works placeholder</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
