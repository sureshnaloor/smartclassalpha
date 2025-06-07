import { pgTable, foreignKey, serial, text, integer, jsonb, timestamp, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const learningExamples = pgTable("learning_examples", {
	id: serial().primaryKey().notNull(),
	input: text().notNull(),
	output: text().notNull(),
	userId: integer("user_id"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "learning_examples_user_id_users_id_fk"
		}),
]);

export const aiSettings = pgTable("ai_settings", {
	id: serial().primaryKey().notNull(),
	provider: text().notNull(),
	model: text().notNull(),
	temperature: text().notNull(),
	topP: text("top_p").notNull(),
	topK: text("top_k").notNull(),
	erpSystem: text("erp_system").notNull(),
	shortDescLimit: integer("short_desc_limit").notNull(),
	longDescLimit: integer("long_desc_limit").notNull(),
	learningMode: text("learning_mode").notNull(),
	additionalContext: text("additional_context"),
	examples: jsonb(),
	userId: integer("user_id"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "ai_settings_user_id_users_id_fk"
		}),
]);

export const materials = pgTable("materials", {
	id: serial().primaryKey().notNull(),
	materialId: text("material_id"),
	materialName: text("material_name").notNull(),
	materialType: text("material_type").notNull(),
	basicDescription: text("basic_description").notNull(),
	technicalSpecs: text("technical_specs"),
	manufacturer: text(),
	modelNumber: text("model_number"),
	primaryGroup: text("primary_group").notNull(),
	secondaryGroup: text("secondary_group"),
	tertiaryGroup: text("tertiary_group"),
	shortDescription: text("short_description"),
	longDescription: text("long_description"),
	specifications: jsonb(),
	processedAt: timestamp("processed_at", { mode: 'string' }).defaultNow(),
	userId: integer("user_id"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "materials_user_id_users_id_fk"
		}),
]);

export const processingResults = pgTable("processing_results", {
	id: serial().primaryKey().notNull(),
	materialId: integer("material_id"),
	shortDescription: text("short_description").notNull(),
	longDescription: text("long_description").notNull(),
	specifications: jsonb(),
	classificationGroups: jsonb("classification_groups").notNull(),
	processedAt: timestamp("processed_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.materialId],
			foreignColumns: [materials.id],
			name: "processing_results_material_id_materials_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: text().notNull(),
	password: text().notNull(),
}, (table) => [
	unique("users_username_unique").on(table.username),
]);

export const processingHistory = pgTable("processing_history", {
	id: serial().primaryKey().notNull(),
	batchId: text("batch_id"),
	materialCount: integer("material_count").notNull(),
	successful: integer().notNull(),
	failed: integer().notNull(),
	processedAt: timestamp("processed_at", { mode: 'string' }).defaultNow(),
	userId: integer("user_id"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "processing_history_user_id_users_id_fk"
		}),
]);
