export interface LatencyMs {
  retrieval: number;
  llm: number;
  total: number;
  rerank?: number | null;
}

export interface SourceItem {
  index: number;
  source_path: string;
  title: string;
  heading_path: string;
  score?: number | null;
  rrf_score?: number | null;
  vector_score?: number | null;
  rerank_score?: number | null;
}

export interface AskResponse {
  query: string;
  answer: string;
  refused: boolean;
  sources_cited: SourceItem[];
  sources_retrieved: SourceItem[];
  warnings: string[];
  latency_ms: LatencyMs;
  retriever: string;
  top_vector_score?: number | null;
  top_rerank_score?: number | null;
  rerank_latency_ms?: number | null;
}

export interface HealthResponse {
  status: string;
  database: boolean;
  llm_reachable: boolean;
  llm_model: string;
  total_documents: number;
  total_chunks: number;
  retriever: string;
  reranker_enabled: boolean;
  bm25_loaded: boolean;
}

