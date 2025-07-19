# Material Standardization Feature

## Overview

The Material Standardization feature allows users to standardize material descriptions using AI templates. This feature integrates seamlessly with the existing web application and uses the same AI infrastructure.

## Features

### 1. Template Configuration
- **Primary Characteristic**: Define the main material type (e.g., GASKET, SEAL, O-RING)
- **Secondary Characteristic**: Define size and rating patterns (e.g., 2 INCH 300#, 3 INCH 600#)
- **Tertiary Characteristic**: Define material and type specifications (e.g., SPIRAL WOUND SS316, SW SS304)
- **Other Specifications**: Define additional specifications (e.g., RING JOINT, RTJ)

### 2. Example Transformations
- Add input/output examples to train the AI
- Remove examples as needed
- Minimum 2 examples required

### 3. Batch Processing
- Upload CSV files with material descriptions
- Process multiple materials simultaneously
- Real-time progress tracking
- Automatic CSV download for results

### 4. Results Classification
- **Standardized**: Successfully standardized descriptions
- **Oversized**: Descriptions that exceed 40 characters
- **Uncleansed**: Descriptions that couldn't be standardized
- **Characteristic Not Available**: Missing primary characteristics

## Usage

### 1. Access the Feature
Navigate to "Material Standardization" in the sidebar menu.

### 2. Configure Templates
1. Fill in the template fields with your desired patterns
2. Add example transformations to guide the AI
3. Ensure at least 2 examples are provided

### 3. Upload and Process
1. Upload a CSV file with material descriptions
2. Click "Process Materials" to start standardization
3. Monitor progress in real-time
4. Download results as CSV files

### 4. Review Results
- View processing results in the table
- Check the summary for statistics
- Download categorized CSV files

## API Endpoint

### POST /api/standardize-materials

**Request:**
- `file`: CSV file with material descriptions
- `templateFields`: JSON string with template configuration
- `transformations`: JSON string with example transformations
- `aiSettings`: JSON string with AI settings

**Response:**
```json
{
  "total": 10,
  "results": {
    "standardized": [...],
    "oversized": [...],
    "uncleansed": [...],
    "characteristic_notavailable": [...]
  },
  "visibleResults": [...]
}
```

## File Format

### Input CSV
The CSV file should contain a column with material descriptions. The system will automatically detect the description column.

Example:
```csv
Description
spiral wound gasket, 2 inch 300#, ss316
2 inch class 300 spiral wound ss316 gasket
gasket, 3 inch 600#, ss304
```

### Output CSV
The system generates separate CSV files for each category:
- `{primary}_standardized_materials.csv`
- `{primary}_oversized_materials.csv`
- `{primary}_uncleansed_materials.csv`
- `{primary}_characteristic_notavailable_materials.csv`

## Integration

This feature is fully integrated with the existing application:

- **Navigation**: Added to sidebar menu
- **Routing**: New route `/standardization`
- **UI Components**: Uses existing shadcn/ui components
- **AI Integration**: Uses existing OpenAI/DeepSeek API infrastructure
- **State Management**: Uses React Query for data fetching
- **Styling**: Consistent with existing design system

## Technical Details

### Frontend
- **File**: `client/src/pages/MaterialStandardization.tsx`
- **Dependencies**: React, TypeScript, shadcn/ui, React Query
- **State Management**: Local state with React hooks

### Backend
- **Endpoint**: `matclassifier-backend/src/server/routes.ts`
- **Processing**: Uses existing `processMaterial` function
- **File Handling**: Uses multer for file uploads
- **CSV Parsing**: Uses csv-parse library

### AI Processing
- Uses the same AI infrastructure as other features
- Custom prompts for material standardization
- Character limit enforcement (40 characters)
- Pattern matching and validation

## Error Handling

- File upload validation
- CSV parsing error handling
- AI processing error recovery
- User-friendly error messages
- Toast notifications for feedback

## Performance

- Batch processing with progress tracking
- Efficient CSV parsing
- Memory-conscious file handling
- Background processing with real-time updates

## Security

- File type validation (CSV only)
- File size limits
- Input sanitization
- Secure file handling with temporary storage cleanup 