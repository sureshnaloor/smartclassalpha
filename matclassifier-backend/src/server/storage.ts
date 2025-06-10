import {
  users, type User, type InsertUser,
  materials, type Material, type InsertMaterial,
  processingResults, type ProcessingResult, type InsertProcessingResult,
  processingHistory, type ProcessingHistory, type InsertProcessingHistory,
  aiSettings, type AISettings, type InsertAISettings,
  learningExamples, type LearningExample, type InsertLearningExample
} from "../../../shared/schema";
import { DbStorage } from "./dbStorage";

// Define the storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Material operations
  getMaterial(id: number): Promise<Material | undefined>;
  getMaterialByName(name: string): Promise<Material | undefined>;
  createMaterial(material: InsertMaterial): Promise<Material>;
  updateMaterial(id: number, material: Partial<InsertMaterial>): Promise<Material | undefined>;
  deleteMaterial(id: number): Promise<boolean>;
  getAllMaterials(): Promise<Material[]>;
  
  // Processing result operations
  getProcessingResult(id: number): Promise<ProcessingResult | undefined>;
  getProcessingResultByMaterialId(materialId: number): Promise<ProcessingResult | undefined>;
  createProcessingResult(result: InsertProcessingResult): Promise<ProcessingResult>;
  
  // Processing history operations
  getProcessingHistory(id: number): Promise<ProcessingHistory | undefined>;
  createProcessingHistory(history: InsertProcessingHistory): Promise<ProcessingHistory>;
  getAllProcessingHistory(): Promise<ProcessingHistory[]>;
  
  // AI settings operations
  getAISettings(id: number): Promise<AISettings | undefined>;
  getAISettingsByUserId(userId: number): Promise<AISettings | undefined>;
  createAISettings(settings: InsertAISettings): Promise<AISettings>;
  updateAISettings(id: number, settings: Partial<InsertAISettings>): Promise<AISettings | undefined>;
  getDefaultAISettings(): Promise<AISettings>;
  
  // Learning examples operations
  getLearningExample(id: number): Promise<LearningExample | undefined>;
  createLearningExample(example: InsertLearningExample): Promise<LearningExample>;
  deleteLearningExample(id: number): Promise<boolean>;
  getAllLearningExamples(userId?: number): Promise<LearningExample[]>;
}

// Export the database storage implementation
export const storage = new DbStorage();
