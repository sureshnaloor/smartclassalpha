import OpenAI from "openai";
import { z } from "zod";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = "gpt-4o";

// Schema for AI Processing Request
export const AIProcessingRequestSchema = z.object({
  materialName: z.string(),
  materialType: z.string(),
  materialId: z.string().optional(),
  basicDescription: z.string(),
  technicalSpecs: z.string().optional(),
  manufacturer: z.string().optional(),
  modelNumber: z.string().optional(),
  primaryGroup: z.string(),
  secondaryGroup: z.string().optional(),
  tertiaryGroup: z.string().optional(),
  learningMode: z.enum(["none", "one-shot", "multi-shot"]),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
  })).optional(),
  additionalContext: z.string().optional(),
  erpSystem: z.string(),
  shortDescLimit: z.number(),
  longDescLimit: z.number(),
  temperature: z.string(),
  topP: z.string(),
  topK: z.string(),
  enableAdvancedML: z.boolean().optional(),
});

export type AIProcessingRequest = z.infer<typeof AIProcessingRequestSchema>;

// Schema for AI Processing Response
export const AIProcessingResponseSchema = z.object({
  shortDescription: z.string(),
  longDescription: z.string(),
  classificationGroups: z.object({
    primaryGroup: z.string(),
    secondaryGroup: z.string().optional(),
    tertiaryGroup: z.string().optional(),
  }),
  specifications: z.array(z.object({
    attribute: z.string(),
    value: z.string(),
    unit: z.string().optional(),
    standard: z.string().optional(),
  })).optional(),
  mlClassification: z.object({
    confidence: z.number().optional(),
    alternativeClassifications: z.array(z.object({
      primaryGroup: z.string(),
      secondaryGroup: z.string().optional(),
      tertiaryGroup: z.string().optional(),
      confidence: z.number(),
      reasoning: z.string(),
    })).optional(),
    keyAttributes: z.array(z.string()).optional(),
    similarMaterials: z.array(z.string()).optional(),
  }).optional(),
});

export type AIProcessingResponse = z.infer<typeof AIProcessingResponseSchema>;

// Process material with OpenAI
export async function processMaterial(request: AIProcessingRequest): Promise<AIProcessingResponse> {
  try {
    // Configure the LLM request based on the provided parameters
    let messages: any[] = [
      {
        role: "system",
        content: generateSystemPrompt(request)
      },
      {
        role: "user",
        content: generateUserPrompt(request)
      }
    ];

    // Add examples for one-shot or multi-shot learning
    if (request.learningMode !== "none" && request.examples && request.examples.length > 0) {
      const exampleMessages = request.examples.flatMap(example => [
        { role: "user", content: example.input },
        { role: "assistant", content: example.output }
      ]);
      
      // Insert examples after system message but before the actual user query
      messages.splice(1, 0, ...exampleMessages);
    }

    // Parse the configuration parameters
    const temperature = parseFloat(request.temperature);
    const topP = parseFloat(request.topP);
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: messages,
      temperature: temperature,
      top_p: topP,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    // Parse the response
    let result = JSON.parse(content);
    
    // Add advanced ML classification if enabled
    if (request.enableAdvancedML) {
      const mlClassification = await generateAdvancedClassification(request, result);
      result = { ...result, mlClassification };
    }
    
    return AIProcessingResponseSchema.parse(result);
  } catch (error) {
    console.error("Error processing material with OpenAI:", error);
    throw error;
  }
}

// Generate advanced ML-based classification suggestions
async function generateAdvancedClassification(request: AIProcessingRequest, standardResult: any): Promise<any> {
  try {
    const materialData = {
      materialName: request.materialName,
      materialType: request.materialType,
      basicDescription: request.basicDescription,
      technicalSpecs: request.technicalSpecs || '',
      manufacturer: request.manufacturer || '',
      modelNumber: request.modelNumber || '',
      currentClassification: standardResult.classificationGroups,
      specifications: standardResult.specifications || []
    };
    
    const systemPrompt = `You are an advanced materials classification expert with deep knowledge of ERP systems, 
material science, and machine learning. Your task is to analyze the provided material information and:

1. Suggest alternative classification possibilities with confidence scores and reasoning
2. Identify key attributes that influenced the classification
3. List potentially similar materials in the same category
4. Provide a confidence score for the current classification

Format your output as JSON with the following structure:
{
  "confidence": 0.95, // 0.0 to 1.0 scale
  "alternativeClassifications": [
    {
      "primaryGroup": "alternative_primary_group",
      "secondaryGroup": "alternative_secondary_group",
      "tertiaryGroup": "alternative_tertiary_group",
      "confidence": 0.85,
      "reasoning": "explanation for why this classification might be appropriate"
    }
  ],
  "keyAttributes": ["attribute1", "attribute2", "attribute3"],
  "similarMaterials": ["similar_material_1", "similar_material_2"]
}`;

    const userPrompt = `Analyze the following material and provide advanced classification insights:
${JSON.stringify(materialData, null, 2)}`;

    // Call OpenAI API for advanced analysis
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2, // Lower temperature for more deterministic results
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI for advanced classification");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating advanced classification:", error);
    // Return a minimal result if analysis fails
    return { 
      confidence: 0.7, 
      alternativeClassifications: [],
      keyAttributes: [],
      similarMaterials: []
    };
  }
}

// Generate system prompt based on request
function generateSystemPrompt(request: AIProcessingRequest): string {
  return `You are an expert Material Master Data specialist for ${request.erpSystem} and other ERP systems.
Your task is to create standardized, ERP-compatible material descriptions and classifications.

Guidelines:
1. Create a short description limited to ${request.shortDescLimit} characters, using abbreviations and uppercase.
2. Create a detailed long description limited to ${request.longDescLimit} characters.
3. Extract and standardize technical specifications from the provided information.
4. Classify the material into appropriate material groups.
5. Format the output as JSON with the following structure:
{
  "shortDescription": "SHORT_DESCRIPTION_IN_ERP_FORMAT",
  "longDescription": "DETAILED_DESCRIPTION_WITH_SPECIFICATIONS_AND_STANDARDS",
  "classificationGroups": {
    "primaryGroup": "PRIMARY_GROUP",
    "secondaryGroup": "SECONDARY_GROUP",
    "tertiaryGroup": "TERTIARY_GROUP"
  },
  "specifications": [
    {
      "attribute": "ATTRIBUTE_NAME",
      "value": "VALUE",
      "unit": "UNIT",
      "standard": "APPLICABLE_STANDARD"
    }
  ]
}

${request.additionalContext ? `Additional Context: ${request.additionalContext}` : ''}`;
}

// Generate user prompt based on request
function generateUserPrompt(request: AIProcessingRequest): string {
  const materialInfo = [
    `Material Name: ${request.materialName}`,
    `Material Type: ${request.materialType}`,
    request.materialId ? `Material ID: ${request.materialId}` : '',
    `Basic Description: ${request.basicDescription}`,
    request.technicalSpecs ? `Technical Specifications: ${request.technicalSpecs}` : '',
    request.manufacturer ? `Manufacturer: ${request.manufacturer}` : '',
    request.modelNumber ? `Model/Part Number: ${request.modelNumber}` : '',
    `Primary Group: ${request.primaryGroup}`,
    request.secondaryGroup ? `Secondary Group: ${request.secondaryGroup}` : '',
    request.tertiaryGroup ? `Tertiary Group: ${request.tertiaryGroup}` : ''
  ].filter(Boolean).join('\n');

  return `Please process the following material for ${request.erpSystem}:\n\n${materialInfo}`;
}
