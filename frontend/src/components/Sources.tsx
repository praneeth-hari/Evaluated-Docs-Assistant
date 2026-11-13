import React from "react";
import type { SourceItem } from "../api/types";
import "../styles/Sources.css";

interface SourcesProps {
  sourcesRetrieved: SourceItem[];
  sourcesCited: SourceItem[];
  retriever?: string;
  isRefused?: boolean;
}

export const Sources: React.FC<SourcesProps> = ({
  sourcesRetrieved,
  sourcesCited,
  retriever = "",
  isRefused = false,
}) => {
  if (!sourcesRetrieved || sourcesRetrieved.length === 0) {
    return null;
  }

  const citedIndices = new Set(sourcesCited?.map((s) => s.index) || []);
  const isVectorOnly = retriever === "vector";

  return (
    <div className={`sources-container ${isRefused ? "sources-refused" : ""}`}>
      <div className="sources-header">
        <span className="sources-label">SOURCES</span>
        <span className="sources-score-heading">VECTOR SCORE</span>
      </div>

      <div className="sources-list">
        {sourcesRetrieved.map((item) => {
          const isCited = !isRefused && citedIndices.has(item.index);
          const scoreValue = isVectorOnly ? (item.score ?? item.vector_score) : (item.vector_score ?? item.score);
          const formattedScore = scoreValue !== null && scoreValue !== undefined ? scoreValue.toFixed(4) : "—";

          return (
            <div
              key={item.index}
              className={`source-row ${isCited ? "source-row-cited" : "source-row-muted"}`}
            >
              <div className="source-index">{item.index}</div>
              <div className="source-info">
                <div className="source-title">{item.title || item.source_path}</div>
                {item.heading_path && (
                  <div className="source-heading-path">{item.heading_path}</div>
                )}
              </div>
              <div className="source-score" title="Vector similarity score">
                {formattedScore}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
