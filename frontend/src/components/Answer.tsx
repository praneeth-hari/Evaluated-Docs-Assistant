import React from "react";
import type { AskResponse } from "../api/types";
import "../styles/Answer.css";

interface AnswerProps {
  data: AskResponse;
}

// Helper to render text with inline code (`...`) and citations ([n])
function renderFormattedInline(text: string): React.ReactNode[] {
  // Regex to match code `...` or citation [n]
  const pattern = /(`[^`]+`|\[\d+\])/g;
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    if (!part) return null;

    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={i} className="answer-inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }

    if (/^\[\d+\]$/.test(part)) {
      const num = part.slice(1, -1);
      return (
        <sup key={i} className="answer-citation">
          [{num}]
        </sup>
      );
    }

    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// Built-in parser for paragraphs and ``` fenced code blocks
function renderMarkdown(content: string): React.ReactNode[] {
  const blocks = content.split(/(```[\s\S]*?```)/g);

  return blocks.map((block, index) => {
    if (!block.trim()) return null;

    if (block.startsWith("```") && block.endsWith("```")) {
      const firstNewline = block.indexOf("\n");
      let code = "";
      if (firstNewline !== -1) {
        code = block.slice(firstNewline + 1, -3);
      } else {
        code = block.slice(3, -3);
      }
      return (
        <pre key={index} className="answer-code-block">
          <code>{code.replace(/\r\n/g, "\n")}</code>
        </pre>
      );
    }

    // Split plain text into paragraphs by double linebreaks
    const paragraphs = block.split(/\n\s*\n/);
    return (
      <React.Fragment key={index}>
        {paragraphs.map((p, pIdx) => {
          const trimmed = p.trim();
          if (!trimmed) return null;
          return (
            <p key={pIdx} className="answer-paragraph">
              {renderFormattedInline(trimmed)}
            </p>
          );
        })}
      </React.Fragment>
    );
  });
}

export const Answer: React.FC<AnswerProps> = ({ data }) => {
  const { answer, sources_cited, retriever, top_vector_score, latency_ms, warnings } = data;
  const citedCount = sources_cited?.length || 0;

  const totalLatencySec = latency_ms?.total ? (latency_ms.total / 1000).toFixed(1) : "0.0";
  const topScoreFormatted = top_vector_score !== null && top_vector_score !== undefined
    ? top_vector_score.toFixed(2)
    : "N/A";

  return (
    <div className="answer-container">
      <div className="answer-header">
        <span className="answer-label">ANSWER</span>
        <span className="answer-cited-count">
          Cited · {citedCount} {citedCount === 1 ? "source" : "sources"}
        </span>
      </div>

      <div className="answer-body">{renderMarkdown(answer)}</div>

      <div className="answer-meta">
        {retriever} · top score {topScoreFormatted} · answered in {totalLatencySec} s
      </div>

      {warnings && warnings.length > 0 && (
        <div className="answer-warnings">
          {warnings.map((w, idx) => (
            <div key={idx} className="answer-warning-item">
              Note: {w}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

