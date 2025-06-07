import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

// Classification categories and details
const primaryGroups = [
  {
    id: "electrical",
    name: "Electrical",
    description: "Electrical components used in power, control, and instrumentation applications.",
    examples: ["Motors", "Drives", "Cables", "Switchgear", "Electrical Panels"],
    glAccounts: ["1500-100", "1500-110", "1500-120"],
  },
  {
    id: "mechanical",
    name: "Mechanical",
    description: "Mechanical components and equipment used in industrial processes.",
    examples: ["Pumps", "Valves", "Bearings", "Gearboxes", "Fasteners"],
    glAccounts: ["1500-200", "1500-210", "1500-220"],
  },
  {
    id: "chemical",
    name: "Chemical",
    description: "Chemical substances used in industrial processes and manufacturing.",
    examples: ["Solvents", "Adhesives", "Catalysts", "Lubricants", "Cleaning Agents"],
    glAccounts: ["1500-300", "1500-310", "1500-320"],
  },
  {
    id: "consumable",
    name: "Consumable",
    description: "Items that are consumed during regular operations and need frequent replacement.",
    examples: ["Filters", "Tools", "Office Supplies", "Safety Equipment", "PPE"],
    glAccounts: ["1500-400", "1500-410", "1500-420"],
  },
  {
    id: "service",
    name: "Service",
    description: "Services provided by internal departments or external vendors.",
    examples: ["Maintenance", "Consulting", "Training", "Installation", "Engineering"],
    glAccounts: ["6000-100", "6000-110", "6000-120"],
  },
];

// Secondary group structure for electrical primary group (simplified example)
const secondaryGroupsExamples = {
  electrical: [
    {
      id: "motor",
      name: "Motors & Drives",
      description: "Electric motors and variable frequency drives.",
      examples: ["AC Motors", "DC Motors", "Servo Motors", "VFDs"],
      tertiaryGroups: ["AC Motors", "DC Motors", "Servo Motors", "Stepper Motors"]
    },
    {
      id: "cable",
      name: "Cables & Wiring",
      description: "Power, control, and instrumentation cables and wiring.",
      examples: ["Power Cables", "Control Cables", "Network Cables", "Fiber Optic Cables"],
      tertiaryGroups: ["Power Cables", "Control Cables", "Network Cables"]
    }
  ],
  mechanical: [
    {
      id: "pump",
      name: "Pumps",
      description: "Fluid transfer and pressure generation equipment.",
      examples: ["Centrifugal Pumps", "Positive Displacement Pumps", "Diaphragm Pumps"],
      tertiaryGroups: ["Centrifugal Pumps", "Positive Displacement Pumps", "Diaphragm Pumps"]
    }
  ]
};

export default function ClassificationGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Material Classification Guide</CardTitle>
          <CardDescription>
            Standardized classification system for materials and services in ERP systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4 mr-2" />
            <AlertDescription>
              This classification system is used for G/L account assignment, material search, and reporting. Primary groups are mapped to G/L accounts for accounting purposes.
            </AlertDescription>
          </Alert>

          <h3 className="text-lg font-medium mb-3">Classification Hierarchy</h3>
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-4 mb-2 text-sm font-medium text-gray-500">
              <div>Primary Group</div>
              <div>Secondary Group</div>
              <div>Tertiary Group</div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <div>
                Used for G/L account assignment
                <div className="mt-1 text-xs text-gray-500">Example: Electrical</div>
              </div>
              <div>
                Functional category within primary group
                <div className="mt-1 text-xs text-gray-500">Example: Motors & Drives</div>
              </div>
              <div>
                Specific material/service type
                <div className="mt-1 text-xs text-gray-500">Example: AC Motors</div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3">Primary Groups</h3>
          <Accordion type="single" collapsible className="mb-6">
            {primaryGroups.map((group) => (
              <AccordionItem key={group.id} value={group.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center">
                    <span className="text-md font-medium">{group.name}</span>
                    <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                      G/L: {group.glAccounts[0]}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-4">
                    <p className="text-gray-600">{group.description}</p>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Examples:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                        {group.examples.map((example, idx) => (
                          <li key={idx}>{example}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">G/L Accounts:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                        {group.glAccounts.map((account, idx) => (
                          <li key={idx}>{account}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <h3 className="text-lg font-medium mb-3">Secondary & Tertiary Groups (Examples)</h3>
          <div className="space-y-4">
            {Object.entries(secondaryGroupsExamples).map(([primaryKey, secondaryGroups]) => (
              <div key={primaryKey} className="border rounded-md p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {primaryGroups.find(g => g.id === primaryKey)?.name} - Secondary Groups
                </h4>
                <div className="space-y-3">
                  {secondaryGroups.map((secondaryGroup) => (
                    <div key={secondaryGroup.id} className="pl-4 border-l-2 border-gray-200">
                      <h5 className="font-medium text-gray-800">{secondaryGroup.name}</h5>
                      <p className="text-sm text-gray-600 my-1">{secondaryGroup.description}</p>
                      
                      <div className="mt-2">
                        <h6 className="text-xs font-medium text-gray-700">Tertiary Groups:</h6>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {secondaryGroup.tertiaryGroups.map((tertiary, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                              {tertiary}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>SAP Material Description Specifications</CardTitle>
          <CardDescription>
            Standards for formatting material descriptions in SAP and other ERP systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Short Description Format</h3>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm font-mono mb-2">NOUN,MODIFIER,ATTRIBUTE1,ATTRIBUTE2,...</p>
                <div className="text-xs text-gray-600">
                  <p>• Limited to 40 characters in SAP (may vary for other ERP systems)</p>
                  <p>• Use commas to separate attributes</p>
                  <p>• Use uppercase for better visibility</p>
                  <p>• Abbreviate words when necessary</p>
                  <p>• Start with the noun (main item), followed by modifiers and key attributes</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Long Description Format</h3>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm mb-2">Detailed description with full specifications and standard references.</p>
                <div className="text-xs text-gray-600">
                  <p>• Limited to 1000-5000 characters depending on ERP system</p>
                  <p>• Include detailed specifications, manufacturer information, and model numbers</p>
                  <p>• Reference applicable industry standards and certifications</p>
                  <p>• Include dimensions, material composition, and compatibility information</p>
                  <p>• Use consistent formatting and terminology across similar materials</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Common Abbreviations</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Full Term</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Abbreviation</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Full Term</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Abbreviation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 py-2">Alternating Current</td>
                      <td className="px-3 py-2 font-mono">AC</td>
                      <td className="px-3 py-2">Direct Current</td>
                      <td className="px-3 py-2 font-mono">DC</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">Kilowatt</td>
                      <td className="px-3 py-2 font-mono">KW</td>
                      <td className="px-3 py-2">Three Phase</td>
                      <td className="px-3 py-2 font-mono">3-PH</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">Diameter</td>
                      <td className="px-3 py-2 font-mono">DIA</td>
                      <td className="px-3 py-2">Stainless Steel</td>
                      <td className="px-3 py-2 font-mono">SS</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">Maximum</td>
                      <td className="px-3 py-2 font-mono">MAX</td>
                      <td className="px-3 py-2">Minimum</td>
                      <td className="px-3 py-2 font-mono">MIN</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">Millimeter</td>
                      <td className="px-3 py-2 font-mono">MM</td>
                      <td className="px-3 py-2">Centimeter</td>
                      <td className="px-3 py-2 font-mono">CM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
