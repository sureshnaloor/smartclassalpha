import { eq, and } from 'drizzle-orm';
import { db } from './db';
import { IStorage } from './storage';
import {
  users, type User, type InsertUser,
  materials, type Material, type InsertMaterial,
  processingResults, type ProcessingResult, type InsertProcessingResult,
  processingHistory, type ProcessingHistory, type InsertProcessingHistory,
  aiSettings, type AISettings, type InsertAISettings,
  learningExamples, type LearningExample, type InsertLearningExample
} from "../../../shared/schema";

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results[0];
  }

  async createUser(userData: InsertUser): Promise<User> {
    const results = await db.insert(users).values(userData).returning();
    return results[0];
  }
  
  // Material operations
  async getMaterial(id: number): Promise<Material | undefined> {
    const results = await db.select().from(materials).where(eq(materials.id, id));
    return results[0];
  }
  
  async getMaterialByName(name: string): Promise<Material | undefined> {
    const results = await db.select().from(materials).where(eq(materials.materialName, name));
    return results[0];
  }
  
  async createMaterial(materialData: InsertMaterial): Promise<Material> {
    const now = new Date();
    const results = await db.insert(materials)
      .values({ ...materialData, processedAt: now })
      .returning();
    return results[0];
  }
  
  async updateMaterial(id: number, updateData: Partial<InsertMaterial>): Promise<Material | undefined> {
    const results = await db.update(materials)
      .set(updateData)
      .where(eq(materials.id, id))
      .returning();
    return results[0];
  }
  
  async deleteMaterial(id: number): Promise<boolean> {
    const results = await db.delete(materials)
      .where(eq(materials.id, id))
      .returning();
    return results.length > 0;
  }
  
  async getAllMaterials(): Promise<Material[]> {
    return await db.select().from(materials).orderBy(materials.processedAt);
  }
  
  // Processing result operations
  async getProcessingResult(id: number): Promise<ProcessingResult | undefined> {
    const results = await db.select().from(processingResults).where(eq(processingResults.id, id));
    return results[0];
  }
  
  async getProcessingResultByMaterialId(materialId: number): Promise<ProcessingResult | undefined> {
    const results = await db.select().from(processingResults)
      .where(eq(processingResults.materialId, materialId));
    return results[0];
  }
  
  async createProcessingResult(resultData: InsertProcessingResult): Promise<ProcessingResult> {
    const now = new Date();
    const results = await db.insert(processingResults)
      .values({ ...resultData, processedAt: now })
      .returning();
    return results[0];
  }
  
  // Processing history operations
  async getProcessingHistory(id: number): Promise<ProcessingHistory | undefined> {
    const results = await db.select().from(processingHistory).where(eq(processingHistory.id, id));
    return results[0];
  }
  
  async createProcessingHistory(historyData: InsertProcessingHistory): Promise<ProcessingHistory> {
    const now = new Date();
    const results = await db.insert(processingHistory)
      .values({ ...historyData, processedAt: now })
      .returning();
    return results[0];
  }
  
  async getAllProcessingHistory(): Promise<ProcessingHistory[]> {
    return await db.select().from(processingHistory).orderBy(processingHistory.processedAt);
  }
  
  // AI settings operations
  async getAISettings(id: number): Promise<AISettings | undefined> {
    const results = await db.select().from(aiSettings).where(eq(aiSettings.id, id));
    return results[0];
  }
  
  async getAISettingsByUserId(userId: number): Promise<AISettings | undefined> {
    const results = await db.select().from(aiSettings).where(eq(aiSettings.userId, userId));
    return results[0];
  }
  
  async createAISettings(settingsData: InsertAISettings): Promise<AISettings> {
    const results = await db.insert(aiSettings)
      .values(settingsData)
      .returning();
    return results[0];
  }
  
  async updateAISettings(id: number, updateData: Partial<InsertAISettings>): Promise<AISettings | undefined> {
    const results = await db.update(aiSettings)
      .set(updateData)
      .where(eq(aiSettings.id, id))
      .returning();
    return results[0];
  }
  
  async getDefaultAISettings(): Promise<AISettings> {
    // Try to get the first settings
    const allSettings = await db.select().from(aiSettings).limit(1);
    
    // If no settings exist, create default settings
    if (allSettings.length === 0) {
      const defaultSettings: InsertAISettings = {
        provider: "openai",
        model: "gpt-4o",
        temperature: "0.7",
        topP: "0.9",
        topK: "40",
        erpSystem: "sap",
        shortDescLimit: 40,
        longDescLimit: 1000,
        learningMode: "none",
        additionalContext: "",
        examples: null,
        userId: null
      };
      
      const results = await db.insert(aiSettings)
        .values(defaultSettings)
        .returning();
      return results[0];
    }
    
    return allSettings[0];
  }
  
  // Learning examples operations
  async getLearningExample(id: number): Promise<LearningExample | undefined> {
    const results = await db.select().from(learningExamples).where(eq(learningExamples.id, id));
    return results[0];
  }
  
  async createLearningExample(exampleData: InsertLearningExample): Promise<LearningExample> {
    const results = await db.insert(learningExamples)
      .values(exampleData)
      .returning();
    return results[0];
  }
  
  async deleteLearningExample(id: number): Promise<boolean> {
    const results = await db.delete(learningExamples)
      .where(eq(learningExamples.id, id))
      .returning();
    return results.length > 0;
  }
  
  async getAllLearningExamples(userId?: number): Promise<LearningExample[]> {
    if (userId) {
      return await db.select().from(learningExamples).where(eq(learningExamples.userId, userId));
    }
    return await db.select().from(learningExamples);
  }
} 