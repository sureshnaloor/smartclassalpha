import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { createInsertSchema } from "drizzle-zod";
import { z, ZodTypeAny} from "zod";

// Users schema - keeping the existing users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Material schema - for storing processed materials
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  materialId: text("material_id"),
  materialName: text("material_name").notNull(),
  materialType: text("material_type").notNull(),
  basicDescription: text("basic_description").notNull(),
  technicalSpecs: text("technical_specs"),
  manufacturer: text("manufacturer"),
  modelNumber: text("model_number"),
  primaryGroup: text("primary_group").notNull(),
  secondaryGroup: text("secondary_group"),
  tertiaryGroup: text("tertiary_group"),
  shortDescription: text("short_description"),
  longDescription: text("long_description"),
  specifications: jsonb("specifications"),
  processedAt: timestamp("processed_at").defaultNow(),
  userId: integer("user_id").references(() => users.id),
});

export const insertMaterialSchema = createInsertSchema(materials).omit({
  id: true,
  processedAt: true
});

// AI processing results
export const processingResults = pgTable("processing_results", {
  id: serial("id").primaryKey(),
  materialId: integer("material_id").references(() => materials.id),
  shortDescription: text("short_description").notNull(),
  longDescription: text("long_description").notNull(),
  specifications: jsonb("specifications"),
  classificationGroups: jsonb("classification_groups").notNull(),
  processedAt: timestamp("processed_at").defaultNow(),
});

export const insertProcessingResultSchema = createInsertSchema(processingResults).omit({
  id: true,
  processedAt: true
});

// AI processing history
export const processingHistory = pgTable("processing_history", {
  id: serial("id").primaryKey(),
  batchId: text("batch_id"),
  materialCount: integer("material_count").notNull(),
  successful: integer("successful").notNull(),
  failed: integer("failed").notNull(),
  processedAt: timestamp("processed_at").defaultNow(),
  userId: integer("user_id").references(() => users.id),
});

export const insertProcessingHistorySchema = createInsertSchema(processingHistory).omit({
  id: true,
  processedAt: true
});

// AI Settings
export const aiSettings = pgTable("ai_settings", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(),
  model: text("model").notNull(),
  temperature: text("temperature").notNull(),
  topP: text("top_p").notNull(),
  topK: text("top_k").notNull(),
  erpSystem: text("erp_system").notNull(),
  shortDescLimit: integer("short_desc_limit").notNull(),
  longDescLimit: integer("long_desc_limit").notNull(),
  learningMode: text("learning_mode").notNull(),
  additionalContext: text("additional_context"),
  examples: jsonb("examples"),
  userId: integer("user_id").references(() => users.id),
});

export const insertAISettingsSchema = createInsertSchema(aiSettings).omit({
  id: true
});

// Learning examples - for one-shot and multi-shot learning
export const learningExamples = pgTable("learning_examples", {
  id: serial("id").primaryKey(),
  input: text("input").notNull(),
  output: text("output").notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertLearningExampleSchema = createInsertSchema(learningExamples).omit({
  id: true
});

export const learningExamplesRelations = relations(learningExamples, ({one}) => ({
  user: one(users, {
    fields: [learningExamples.userId],
    references: [users.id]
  }),
}));

export const usersRelations = relations(users, ({many}) => ({
  learningExamples: many(learningExamples),
  aiSettings: many(aiSettings),
  materials: many(materials),
  processingHistories: many(processingHistory),
}));

export const aiSettingsRelations = relations(aiSettings, ({one}) => ({
  user: one(users, {
    fields: [aiSettings.userId],
    references: [users.id]
  }),
}));

export const materialsRelations = relations(materials, ({one, many}) => ({
  user: one(users, {
    fields: [materials.userId],
    references: [users.id]
  }),
  processingResults: many(processingResults),
}));

export const processingResultsRelations = relations(processingResults, ({one}) => ({
  material: one(materials, {
    fields: [processingResults.materialId],
    references: [materials.id]
  }),
}));

export const processingHistoryRelations = relations(processingHistory, ({one}) => ({
  user: one(users, {
    fields: [processingHistory.userId],
    references: [users.id]
  }),
}));

// Define types for all schemas
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;

export type ProcessingResult = typeof processingResults.$inferSelect;
export type InsertProcessingResult = z.infer<typeof insertProcessingResultSchema>;

export type ProcessingHistory = typeof processingHistory.$inferSelect;
export type InsertProcessingHistory = z.infer<typeof insertProcessingHistorySchema>;

export type AISettings = typeof aiSettings.$inferSelect;
export type InsertAISettings = z.infer<typeof insertAISettingsSchema>;

export type LearningExample = typeof learningExamples.$inferSelect;
export type InsertLearningExample = z.infer<typeof insertLearningExampleSchema>;
