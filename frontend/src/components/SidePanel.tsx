import React, { useEffect, useState } from "react";
import { getHealth } from "../api/client";
import type { HealthResponse } from "../api/types";
import { EVALUATION_DATA } from "../data/evaluation";
import "../styles/SidePanel.css";

export const SidePanel: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    getHealth()
      .then((data) => {
        if (isMounted) setHealth(data);
      })
      .catch(() => {
        // Leave health as null on failure
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <aside className="sidepanel-container" aria-label="System Evaluation and Status">
      <div className="sidepanel-section">
        <span className="sidepanel-label">EVALUATION</span>
        <div className="sidepanel-metric">
          {EVALUATION_DATA.vectorOnlyMRR} → {EVALUATION_DATA.hybridMRR}
        </div>
        <div className="sidepanel-caption">
          MRR, hybrid vs vector only, {EVALUATION_DATA.heldOutQuestionsCount} held-out questions
        </div>
      </div>

      <div className="sidepanel-stats">
        <div className="sidepanel-stat-row">
          <span className="sidepanel-stat-name">Documents</span>
          <span className="sidepanel-stat-value">
            {health?.total_documents !== undefined
              ? health.total_documents.toLocaleString("en-US")
              : "—"}
          </span>
        </div>
        <div className="sidepanel-stat-row">
          <span className="sidepanel-stat-name">Chunks</span>
          <span className="sidepanel-stat-value">
            {health?.total_chunks !== undefined
              ? health.total_chunks.toLocaleString("en-US")
              : "—"}
          </span>
        </div>
        <div className="sidepanel-stat-row">
          <span className="sidepanel-stat-name">Automated tests</span>
          <span className="sidepanel-stat-value">
            {EVALUATION_DATA.automatedTestsCount.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      <div className="sidepanel-note">
        Small sample. See limitations in the Evaluation tab.
      </div>

      <div className="sidepanel-divider" />

      <div className="sidepanel-section">
        <span className="sidepanel-label">WHEN IT CAN'T ANSWER</span>
        <p className="sidepanel-text">{EVALUATION_DATA.explanationWhenCantAnswer}</p>
      </div>

      <div className="sidepanel-section">
        <span className="sidepanel-label">PIPELINE</span>
        <p className="sidepanel-text sidepanel-pipeline">{EVALUATION_DATA.pipelineSteps}</p>
      </div>
    </aside>
  );
};
