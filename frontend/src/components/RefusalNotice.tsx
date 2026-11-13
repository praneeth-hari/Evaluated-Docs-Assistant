import React from "react";
import { MIN_SCORE } from "../data/evaluation";
import "../styles/RefusalNotice.css";

interface RefusalNoticeProps {
  topVectorScore?: number | null;
}

export const RefusalNotice: React.FC<RefusalNoticeProps> = ({ topVectorScore }) => {
  const topScoreFormatted =
    topVectorScore !== null && topVectorScore !== undefined
      ? topVectorScore.toFixed(2)
      : "0.00";
  const thresholdFormatted = MIN_SCORE.toFixed(2);

  return (
    <div className="refusal-notice">
      <div className="refusal-title">
        No answer: the documentation did not contain enough evidence.
      </div>
      <div className="refusal-subtitle">No guess is made.</div>
      <div className="refusal-score-detail">
        Top similarity score {topScoreFormatted}, below the {thresholdFormatted} needed to answer.
      </div>
    </div>
  );
};
