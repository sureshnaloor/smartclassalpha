// Material types
export interface Material {
  id: number;
  materialId: string | null;
  materialName: string;
  materialType: string;
  basicDescription: string;
  technicalSpecs: string | null;
  manufacturer: string | null;
  modelNumber: string | null;
  primaryGroup: string;
  secondaryGroup: string | null;
  tertiaryGroup: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  specifications: Specification[] | null;
  processedAt: string;
  userId: number | null;
}

export interface MaterialInputForm {
  materialName: string;
  materialType: string;
  materialId?: string;
  basicDescription: string;
  technicalSpecs?: string;
  manufacturer?: string;
  modelNumber?: string;
  primaryGroup: string;
  secondaryGroup?: string;
  tertiaryGroup?: string;
}

// Classification types
export interface ClassificationGroups {
  primaryGroup: string;
  secondaryGroup?: string;
  tertiaryGroup?: string;
}

// AI Settings types
export interface AISettings {
  id: number;
  provider: string;
  model: string;
  temperature: string;
  topP: string;
  topK: string;
  erpSystem: string;
  shortDescLimit: number;
  longDescLimit: number;
  learningMode: "none" | "one-shot" | "multi-shot";
  additionalContext?: string;
  examples?: LearningExample[] | null;
  userId: number | null;
  enableAdvancedML?: boolean;
}

// LLM Parameters
export interface LLMParameters {
  temperature: string;
  topP: string;
  topK: string;
}

// Learning example
export interface LearningExample {
  id?: number;
  input: string;
  output: string;
  userId?: number | null;
}

// Processing Result
export interface ProcessingResult {
  id: number;
  materialId: number;
  shortDescription: string;
  longDescription: string;
  specifications: Specification[] | null;
  classificationGroups: ClassificationGroups;
  processedAt: string;
  mlClassification?: MLClassification;
}

// Specification
export interface Specification {
  attribute: string;
  value: string;
  unit?: string;
  standard?: string;
}

// ML-enhanced classification
export interface AlternativeClassification {
  primaryGroup: string;
  secondaryGroup?: string;
  tertiaryGroup?: string;
  confidence: number;
  reasoning: string;
}

export interface MLClassification {
  confidence?: number;
  alternativeClassifications?: AlternativeClassification[];
  keyAttributes?: string[];
  similarMaterials?: string[];
}

// Processing history
export interface ProcessingHistory {
  id: number;
  batchId: string | null;
  materialCount: number;
  successful: number;
  failed: number;
  processedAt: string;
  userId: number | null;
}

// Material processing request
export interface MaterialProcessingRequest extends MaterialInputForm, LLMParameters {
  learningMode: "none" | "one-shot" | "multi-shot";
  examples?: LearningExample[];
  additionalContext?: string;
  erpSystem: string;
  shortDescLimit: number;
  longDescLimit: number;
  enableAdvancedML?: boolean;
}

// Material processing response
export interface MaterialProcessingResponse {
  material: Material;
  processingResult: ProcessingResult;
}

// Batch processing response
export interface BatchProcessingResponse {
  batchId: string;
  total: number;
  successful: number;
  failed: number;
  results: MaterialProcessingResponse[];
  errors: any[];
}

// User
export interface User {
  id: number;
  username: string;
  initials: string;
  name: string;
  role: string;
}
