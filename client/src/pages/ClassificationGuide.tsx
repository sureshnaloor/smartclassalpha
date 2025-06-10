import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, BookOpen, Layers, FileText } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="p-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Classification Guide</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <CardTitle className="text-xl text-slate-800">Material Classification Guide</CardTitle>
              <CardDescription className="text-slate-600">
                Standardized classification system for materials and services in ERP systems
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Alert className="mb-6 bg-indigo-50/80 border-indigo-200">
                <InfoIcon className="h-4 w-4 mr-2 text-indigo-600" />
                <AlertDescription className="text-indigo-700">
                  This classification system is used for G/L account assignment, material search, and reporting. Primary groups are mapped to G/L accounts for accounting purposes.
                </AlertDescription>
              </Alert>

              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-600" />
                Classification Hierarchy
              </h3>
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-4 mb-2 text-sm font-medium text-slate-600">
                  <div>Primary Group</div>
                  <div>Secondary Group</div>
                  <div>Tertiary Group</div>
                </div>
                <div className="grid grid-cols-3 gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
                  <div className="bg-indigo-50/50 p-3 rounded-lg">
                    Used for G/L account assignment
                    <div className="mt-1 text-xs text-slate-500">Example: Electrical</div>
                  </div>
                  <div className="bg-blue-50/50 p-3 rounded-lg">
                    Functional category within primary group
                    <div className="mt-1 text-xs text-slate-500">Example: Motors & Drives</div>
                  </div>
                  <div className="bg-cyan-50/50 p-3 rounded-lg">
                    Specific material/service type
                    <div className="mt-1 text-xs text-slate-500">Example: AC Motors</div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-600" />
                Primary Groups
              </h3>
              <Accordion type="single" collapsible className="mb-6">
                {primaryGroups.map((group) => (
                  <AccordionItem key={group.id} value={group.id} className="border-slate-200">
                    <AccordionTrigger className="hover:no-underline bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white">
                      <div className="flex items-center">
                        <span className="text-md font-medium text-slate-800">{group.name}</span>
                        <span className="ml-2 text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
                          G/L: {group.glAccounts[0]}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-4 pt-2">
                        <p className="text-slate-600">{group.description}</p>
                        <div>
                          <h4 className="text-sm font-medium text-slate-700 mb-1">Examples:</h4>
                          <ul className="list-disc list-inside text-sm text-slate-600 pl-2">
                            {group.examples.map((example, idx) => (
                              <li key={idx}>{example}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-700 mb-1">G/L Accounts:</h4>
                          <ul className="list-disc list-inside text-sm text-slate-600 pl-2">
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

              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-600" />
                Secondary & Tertiary Groups
              </h3>
              <div className="space-y-4">
                {Object.entries(secondaryGroupsExamples).map(([primaryKey, secondaryGroups]) => (
                  <div key={primaryKey} className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                      <span className="text-indigo-600">
                        {primaryGroups.find(g => g.id === primaryKey)?.name}
                      </span>
                      <span className="text-slate-400">- Secondary Groups</span>
                    </h4>
                    <div className="space-y-3">
                      {secondaryGroups.map((secondaryGroup) => (
                        <div key={secondaryGroup.id} className="pl-4 border-l-2 border-indigo-200">
                          <h5 className="font-medium text-slate-800">{secondaryGroup.name}</h5>
                          <p className="text-sm text-slate-600 my-1">{secondaryGroup.description}</p>
                          
                          <div className="mt-2">
                            <h6 className="text-xs font-medium text-slate-700">Tertiary Groups:</h6>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {secondaryGroup.tertiaryGroups.map((tertiary, idx) => (
                                <span key={idx} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
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
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-xl text-slate-800">SAP Material Description Specifications</CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Standards for formatting material descriptions in SAP and other ERP systems
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-slate-800 mb-2">Short Description Format</h3>
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-mono mb-2 text-indigo-600">NOUN,MODIFIER,ATTRIBUTE1,ATTRIBUTE2,...</p>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p>• Limited to 40 characters in SAP (may vary for other ERP systems)</p>
                      <p>• Use commas to separate attributes</p>
                      <p>• Use uppercase for better visibility</p>
                      <p>• Abbreviate words when necessary</p>
                      <p>• Start with the noun (main item), followed by modifiers and key attributes</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-slate-800 mb-2">Long Description Format</h3>
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm mb-2 text-slate-700">Detailed description with full specifications and standard references.</p>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p>• Limited to 1000-5000 characters depending on ERP system</p>
                      <p>• Include detailed specifications, manufacturer information, and model numbers</p>
                      <p>• Reference applicable industry standards and certifications</p>
                      <p>• Include dimensions, material composition, and compatibility information</p>
                      <p>• Use consistent formatting and terminology across similar materials</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-slate-800 mb-2">Common Abbreviations</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
                      <thead>
                        <tr className="bg-slate-50/80">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Full Term</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Abbreviation</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Full Term</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Abbreviation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="px-4 py-3 text-slate-700">Alternating Current</td>
                          <td className="px-4 py-3 font-mono text-indigo-600">AC</td>
                          <td className="px-4 py-3 text-slate-700">Direct Current</td>
                          <td className="px-4 py-3 font-mono text-indigo-600">DC</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-slate-700">Kilowatt</td>
                          <td className="px-4 py-3 font-mono text-indigo-600">KW</td>
                          <td className="px-4 py-3 text-slate-700">Three Phase</td>
                          <td className="px-4 py-3 font-mono text-indigo-600">3-PH</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-slate-700">Diameter</td>
                          <td className="px-4 py-3 font-mono text-indigo-600">DIA</td>
                          <td className="px-4 py-3 text-slate-700">Stainless Steel</td>
                          <td className="px-4 py-3 font-mono text-indigo-600">SS</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-slate-700">Maximum</td>
                          <td className="px-4 py-3 font-mono text-indigo-600">MAX</td>
                          <td className="px-4 py-3 text-slate-700">Minimum</td>
                          <td className="px-4 py-3 font-mono text-indigo-600">MIN</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-slate-700">Millimeter</td>
                          <td className="px-4 py-3 font-mono text-indigo-600">MM</td>
                          <td className="px-4 py-3 text-slate-700">Centimeter</td>
                          <td className="px-4 py-3 font-mono text-indigo-600">CM</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
