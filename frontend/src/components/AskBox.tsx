import React, { useState } from "react";
import "../styles/AskBox.css";

interface AskBoxProps {
  onAsk: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

const SUGGESTIONS = [
  "How do I validate a request body?",
  "What is dependency injection?",
  "What is the capital of France?",
];

export const AskBox: React.FC<AskBoxProps> = ({ onAsk, isLoading, initialQuery = "" }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && !isLoading) {
      onAsk(trimmed);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    if (!isLoading) {
      onAsk(text);
    }
  };

  return (
    <div className="askbox-container">
      <form onSubmit={handleSubmit} className="askbox-form">
        <label htmlFor="ask-input" className="sr-only">
          Ask a question about the FastAPI documentation
        </label>
        <div className="askbox-input-wrapper">
          <input
            id="ask-input"
            type="text"
            className="askbox-input"
            placeholder="Ask a question about FastAPI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            className="askbox-submit"
            disabled={isLoading || !query.trim()}
            aria-label="Submit question"
          >
            ASK ↵
          </button>
        </div>
      </form>

      <div className="askbox-suggestions">
        <span className="askbox-try-label">Try:</span>
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="askbox-suggestion-link"
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={isLoading}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

