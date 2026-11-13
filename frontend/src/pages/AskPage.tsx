import React, { useState } from "react";
import { ask } from "../api/client";
import type { AskResponse } from "../api/types";
import { AskBox } from "../components/AskBox";
import { Answer } from "../components/Answer";
import { RefusalNotice } from "../components/RefusalNotice";
import { Sources } from "../components/Sources";
import { SidePanel } from "../components/SidePanel";
import "../styles/AskPage.css";

type PageState = "idle" | "loading" | "answer" | "refused" | "error";

export const AskPage: React.FC = () => {
  const [state, setState] = useState<PageState>("idle");
  const [result, setResult] = useState<AskResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>("");

  const handleAsk = async (query: string) => {
    setLastQuery(query);
    setState("loading");
    setErrorMessage(null);

    try {
      const response = await ask(query);
      setResult(response);
      if (response.refused) {
        setState("refused");
      } else {
        setState("answer");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Can't reach the API. Check that it is running, then retry.");
      }
      setState("error");
    }
  };

  const handleRetry = () => {
    if (lastQuery) {
      handleAsk(lastQuery);
    }
  };

  return (
    <div className="askpage-layout">
      <div className="askpage-main-col">
        <AskBox onAsk={handleAsk} isLoading={state === "loading"} initialQuery={lastQuery} />

        {/* Loading notice */}
        {state === "loading" && (
          <div className="askpage-loading-banner">
            Searching the documentation and generating an answer. This can take up to a minute.
          </div>
        )}

        {/* Error message */}
        {state === "error" && errorMessage && (
          <div className="askpage-error-banner" role="alert">
            <span className="askpage-error-text">{errorMessage}</span>
            <button type="button" className="askpage-retry-link" onClick={handleRetry}>
              Retry
            </button>
          </div>
        )}

        {/* Answer / Result region */}
        <section
          className="askpage-result-region"
          aria-live="polite"
          aria-atomic="false"
        >
          {result && (
            <>
              {result.refused ? (
                <RefusalNotice topVectorScore={result.top_vector_score} />
              ) : (
                <Answer data={result} />
              )}

              <Sources
                sourcesRetrieved={result.sources_retrieved}
                sourcesCited={result.sources_cited}
                retriever={result.retriever}
                isRefused={result.refused}
              />
            </>
          )}
        </section>
      </div>

      <div className="askpage-side-col">
        <SidePanel />
      </div>
    </div>
  );
};
