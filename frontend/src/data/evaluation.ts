export const MIN_SCORE = 0.60;

export const EVALUATION_DATA = {
  vectorOnlyMRR: "0.645",
  hybridMRR: "0.739",
  heldOutQuestionsCount: 20,
  automatedTestsCount: 36,
  explanationWhenCantAnswer: "Scores below threshold or ungrounded evidence trigger an immediate refusal.",
  pipelineSteps: "Question → pgvector + BM25 → rank fusion → score gate → Llama 3.1 8B → cited answer",
  minScore: MIN_SCORE,
};
