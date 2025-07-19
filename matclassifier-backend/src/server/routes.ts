import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { processMaterial, AIProcessingRequestSchema, AIProcessingResponseSchema } from "./openai";
import { insertMaterialSchema, insertProcessingResultSchema, insertLearningExampleSchema } from "../../../shared/schema";
import multer from "multer";
import { parse as csvParse } from "csv-parse";
import fs from "fs";
import { callDeepSeek } from "./deepseek";

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const API_PREFIX = "/api";

  // Get default AI settings
  app.get(`${API_PREFIX}/ai-settings/default`, async (req, res) => {
    try {
      const settings = await storage.getDefaultAISettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching default AI settings:", error);
      res.status(500).json({ message: "Failed to fetch default AI settings" });
    }
  });

  // Update AI settings
  app.put(`${API_PREFIX}/ai-settings/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedSettings = await storage.updateAISettings(id, req.body);
      
      if (!updatedSettings) {
        return res.status(404).json({ message: "AI settings not found" });
      }
      
      res.json(updatedSettings);
    } catch (error) {
      console.error("Error updating AI settings:", error);
      res.status(500).json({ message: "Failed to update AI settings" });
    }
  });

  // Process a single material
  app.post(`${API_PREFIX}/process-material`, async (req, res) => {
    try {
      // Validate request body
      const validatedRequest = AIProcessingRequestSchema.parse(req.body);
      
      // Process with OpenAI
      const processingResult = await processMaterial(validatedRequest);
      
      // Create material in storage
      const material = await storage.createMaterial({
        materialName: validatedRequest.materialName,
        materialType: validatedRequest.materialType,
        materialId: validatedRequest.materialId || null,
        basicDescription: validatedRequest.basicDescription,
        technicalSpecs: validatedRequest.technicalSpecs || null,
        manufacturer: validatedRequest.manufacturer || null,
        modelNumber: validatedRequest.modelNumber || null,
        primaryGroup: validatedRequest.primaryGroup,
        secondaryGroup: validatedRequest.secondaryGroup || null,
        tertiaryGroup: validatedRequest.tertiaryGroup || null,
        shortDescription: processingResult.shortDescription,
        longDescription: processingResult.longDescription,
        specifications: processingResult.specifications || null,
        userId: null
      });
      
      // Create processing result
      await storage.createProcessingResult({
        materialId: material.id,
        shortDescription: processingResult.shortDescription,
        longDescription: processingResult.longDescription,
        specifications: processingResult.specifications || null,
        classificationGroups: processingResult.classificationGroups,
      });

       //Create processing history for single material
    await storage.createProcessingHistory({
        batchId: null, // because single material processing does not have a batch
        
        materialCount: 1,
        successful: 1,
        failed: 0,
        userId: null 
});
      
      // Return the processed result
      res.json({
        material,
        processingResult
      });
    } catch (error) {
      console.error("Error processing material:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process material" });
    }
  });

  // Process a batch of materials from CSV
  app.post(`${API_PREFIX}/process-batch`, upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Parse CSV file
      const results: any[] = [];
      const errors: any[] = [];
      let successful = 0;
      let failed = 0;
      
      // Get AI settings from body
      const aiSettings = req.body;
      
      fs.createReadStream(file.path)
        .pipe(csvParse({ columns: true, trim: true }))
        .on("data", async (row) => {
          try {
            // Prepare request for each row
            const request = {
              materialName: row.materialName || "",
              materialType: row.materialType || "",
              materialId: row.materialId || "",
              basicDescription: row.basicDescription || "",
              technicalSpecs: row.technicalSpecs || "",
              manufacturer: row.manufacturer || "",
              modelNumber: row.modelNumber || "",
              primaryGroup: row.primaryGroup || "",
              secondaryGroup: row.secondaryGroup || "",
              tertiaryGroup: row.tertiaryGroup || "",
              // Include AI settings from the request body
              ...aiSettings
            };
            
            // Process with OpenAI
            const processingResult = await processMaterial(request);
            
            // Create material in storage
            const material = await storage.createMaterial({
              materialName: request.materialName,
              materialType: request.materialType,
              materialId: request.materialId || null,
              basicDescription: request.basicDescription,
              technicalSpecs: request.technicalSpecs || null,
              manufacturer: request.manufacturer || null,
              modelNumber: request.modelNumber || null,
              primaryGroup: request.primaryGroup,
              secondaryGroup: request.secondaryGroup || null,
              tertiaryGroup: request.tertiaryGroup || null,
              shortDescription: processingResult.shortDescription,
              longDescription: processingResult.longDescription,
              specifications: processingResult.specifications || null,
              userId: null
            });
            
            // Create processing result
            await storage.createProcessingResult({
              materialId: material.id,
              shortDescription: processingResult.shortDescription,
              longDescription: processingResult.longDescription,
              specifications: processingResult.specifications || null,
              classificationGroups: processingResult.classificationGroups,
            });
            
            results.push({ material, processingResult });
            successful++;
          } catch (error) {
            if (error instanceof Error) {
            errors.push({ row, error: error.message });
            } else {
              errors.push({ row, error: 'Unknown error occurred' });
            }
            failed++;
          }
        })
        .on("end", async () => {
          // Create processing history entry
          const batchId = Date.now().toString();
          await storage.createProcessingHistory({
            batchId,
            materialCount: successful + failed,
            successful,
            failed,
            userId: null
          });
          
          // Delete the temporary file
          fs.unlinkSync(file.path);
          
          res.json({
            batchId,
            total: successful + failed,
            successful,
            failed,
            results,
            errors
          });
        })
        .on("error", (error) => {
          console.error("Error parsing CSV:", error);
          res.status(500).json({ message: "Failed to parse CSV file" });
        });
    } catch (error) {
      console.error("Error processing batch:", error);
      res.status(500).json({ message: "Failed to process batch" });
    }
  });

  // Get all materials
  app.get(`${API_PREFIX}/materials`, async (req, res) => {
    try {
      const materials = await storage.getAllMaterials();
      res.json(materials);
    } catch (error) {
      console.error("Error fetching materials:", error);
      res.status(500).json({ message: "Failed to fetch materials" });
    }
  });

  // Get a material by ID
  app.get(`${API_PREFIX}/materials/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const material = await storage.getMaterial(id);
      
      if (!material) {
        return res.status(404).json({ message: "Material not found" });
      }
      
      // Get processing result for this material
      const processingResult = await storage.getProcessingResultByMaterialId(id);
      
      res.json({
        material,
        processingResult
      });
    } catch (error) {
      console.error("Error fetching material:", error);
      res.status(500).json({ message: "Failed to fetch material" });
    }
  });

  // Get all processing history
  app.get(`${API_PREFIX}/processing-history`, async (req, res) => {
    try {
      const history = await storage.getAllProcessingHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching processing history:", error);
      res.status(500).json({ message: "Failed to fetch processing history" });
    }
  });

  // Learning examples CRUD operations
  app.get(`${API_PREFIX}/learning-examples`, async (req, res) => {
    try {
      const examples = await storage.getAllLearningExamples();
      res.json(examples);
    } catch (error) {
      console.error("Error fetching learning examples:", error);
      res.status(500).json({ message: "Failed to fetch learning examples" });
    }
  });

  app.post(`${API_PREFIX}/learning-examples`, async (req, res) => {
    try {
      const validatedRequest = insertLearningExampleSchema.parse(req.body);
      const example = await storage.createLearningExample(validatedRequest);
      res.status(201).json(example);
    } catch (error) {
      console.error("Error creating learning example:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create learning example" });
    }
  });

  app.delete(`${API_PREFIX}/learning-examples/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLearningExample(id);
      
      if (!success) {
        return res.status(404).json({ message: "Learning example not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting learning example:", error);
      res.status(500).json({ message: "Failed to delete learning example" });
    }
  });

  // Material Standardization endpoint
  app.post(`${API_PREFIX}/standardize-materials`, upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const templateFields = JSON.parse(req.body.templateFields || '{}');
      const transformations = JSON.parse(req.body.transformations || '[]');
      const aiSettings = JSON.parse(req.body.aiSettings || '{}');

      // Parse CSV file
      const results: Record<string, any[]> = {
        standardized: [],
        oversized: [],
        uncleansed: [],
        characteristic_notavailable: []
      };
      
      const visibleResults: any[] = [];
      let total = 0;

      // Read the file content first to handle CSV parsing more robustly
      const fileContent = fs.readFileSync(file.path, 'utf-8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      // Skip header line
      const dataLines = lines.slice(1);
      
      for (const line of dataLines) {
        try {
          total++;
          
          // Handle quoted CSV fields properly
          let description = line.trim();
          if (description.startsWith('"') && description.endsWith('"')) {
            description = description.slice(1, -1);
          }
          
          // Create example transformations text
          const exampleTransformations = transformations
            .filter((t: any) => t.input && t.output)
            .map((t: any) => `Input: "${t.input}"\nOutput: "${t.output}"`)
            .join('\n\n');
          
          const prompt = `
Task: Standardize material descriptions following specific patterns.

EXAMPLE PATTERNS:
Primary (must be first word): ${templateFields.primary}
Secondary (size/rating): ${templateFields.secondary}
Tertiary (material/type): ${templateFields.tertiary}
Other specs: ${templateFields.other}

If ${templateFields.secondary} has <model> in it, then use the model as the secondary characteristic. if it has <model><partnumber> in it, then use the model & partnumber as the secondary characteristic.

EXAMPLE TRANSFORMATIONS:
${exampleTransformations}

INPUT DESCRIPTION: "${description}"

RULES:
1. Output must be in UPPERCASE
2. Maximum 40 characters
3. Must follow order: PRIMARY SECONDARY TERTIARY OTHER
4. Must match pattern of examples
5. First word MUST match pattern from Primary examples
6. At least one of Secondary and Tertiary must be present in the description.
7. if cleaned description is more than 40 characters, try retaining primary, secondary, tertiary, and any other specs that are present in the description may be trimmed.
7. If you are not sure that the material can be standardized, output "UNCLEANSED"

Now standardize the input description: "${description}"

if transformed description is more than 40 characters, output "OVERSIZED"
if you are not finding either 'Secondary' and 'Tertiary' in the description or if you are not sure that the material can be standardized, output "UNCLEANSED"
if primary characteristic is missing, output "CHARACTERISTIC_NOT_AVAILABLE"

Output only the standardized description or one of these keywords: CHARACTERISTIC_NOT_AVAILABLE, OVERSIZED, UNCLEANSED`;

          console.log(`Processing material: "${description}"`);
          console.log(`Template fields:`, templateFields);
          console.log(`Transformations:`, transformations);

          // Call DeepSeek for standardization
          const result = await callDeepSeek(prompt, parseFloat(aiSettings.temperature || "0.1"));
          console.log(`AI Response for "${description}": "${result}"`);
          
          let type: string;
          let material: any;

          switch (result) {
            case 'CHARACTERISTIC_NOT_AVAILABLE':
              type = 'characteristic_notavailable';
              material = { originalDescription: description };
              break;
            case 'OVERSIZED':
              type = 'oversized';
              material = { originalDescription: description, standardDescription: result };
              break;
            case 'UNCLEANSED':
              type = 'uncleansed';
              material = { originalDescription: description };
              break;
            default:
              type = 'standardized';
              material = { originalDescription: description, standardDescription: result };
              break;
          }

          results[type as keyof typeof results].push(material);
          visibleResults.push({ type, material });

        } catch (error) {
          console.error('Error processing material:', error);
          const description = line.trim().replace(/^"|"$/g, '');
          results.uncleansed.push({ originalDescription: description });
          visibleResults.push({ 
            type: 'uncleansed', 
            material: { originalDescription: description } 
          });
        }
      }
      
      // Delete the temporary file
      try {
        fs.unlinkSync(file.path);
      } catch (unlinkError) {
        console.error("Error deleting temporary file:", unlinkError);
      }
      
      res.json({
        total,
        results,
        visibleResults
      });

    } catch (error) {
      console.error("Error standardizing materials:", error);
      // Delete the temporary file even on error
      try {
        if (req.file && req.file.path) {
          fs.unlinkSync(req.file.path);
        }
      } catch (unlinkError) {
        console.error("Error deleting temporary file:", unlinkError);
      }
      res.status(500).json({ message: "Failed to standardize materials" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
