import { relations } from "drizzle-orm/relations";
import { users, learningExamples, aiSettings, materials, processingResults, processingHistory } from "./schema";

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