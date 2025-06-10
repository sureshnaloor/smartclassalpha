import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, FileDown, Database, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Material } from '@/types';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MaterialCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  
  const { data: materials, isLoading } = useQuery<Material[]>({
    queryKey: ['/api/materials'],
  });

  // Filter materials based on search term
  const filteredMaterials = materials?.filter(material => 
    material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.materialId?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    material.primaryGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Database className="h-8 w-8 text-indigo-600" />
              Material Catalog
            </h1>
            <p className="text-slate-500 mt-1">Browse and manage your processed materials</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm hover:bg-white">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <FileDown className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mb-8"
        >
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search materials..."
            className="pl-10 py-3 rounded-xl shadow-sm border-slate-200 bg-white/50 backdrop-blur-sm focus:bg-white transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-slate-500">Loading materials...</span>
          </div>
        ) : !filteredMaterials || filteredMaterials.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="py-16 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
              <Info className="h-8 w-8 text-indigo-600" />
            </div>
            <p className="text-slate-400 text-lg">
              {searchTerm ? 'No materials match your search' : 'No materials in catalog'}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl lg:max-w-[90%] mx-auto space-y-6"
          >
            {filteredMaterials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 p-4 sm:p-6 md:p-8 flex flex-col gap-4 bg-gradient-to-br from-white to-slate-50/50 hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                    {material.materialId || material.id.toString().padStart(10, '0')}
                  </span>
                  <Badge variant="outline" className="ml-auto bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                    {material.materialType.charAt(0).toUpperCase() + material.materialType.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">{material.shortDescription}</h2>
                  <p className="text-slate-600 mt-1 text-sm sm:text-base"><span> ( </span>{material.materialName} <span> ) </span></p>
                  
                  {material.primaryGroup && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">Primary: {material.primaryGroup}</Badge>
                      {material.secondaryGroup && (
                        <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">Secondary: {material.secondaryGroup}</Badge>
                      )}
                      {material.tertiaryGroup && (
                        <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100">Tertiary: {material.tertiaryGroup}</Badge>
                      )}
                    </div>
                  )}
                </div>
                {material.longDescription && (
                  <div className="text-slate-600 text-sm mt-2 lowercase italic border-l-4 border-indigo-200 pl-3 bg-indigo-50/50 rounded-r-lg">
                    {material.longDescription}
                  </div>
                )}
                {material.specifications && Array.isArray(material.specifications) && (
                  <div className="mt-2">
                    <div className="font-semibold text-slate-700 mb-2">Specifications:</div>
                    <div className="flex flex-wrap gap-3">
                      {material.specifications.map((spec: any, idx: number) => (
                        <span
                          key={idx}
                          className="bg-white/80 backdrop-blur-sm text-slate-700 px-4 py-2.5 rounded-xl text-xs font-mono flex flex-col min-w-[140px] border border-slate-200 hover:bg-white transition-colors"
                        >
                          <span className="font-semibold text-slate-900">{spec.attribute}</span>
                          <span className="text-slate-600">
                            {spec.value}
                            {spec.unit ? ` ${spec.unit}` : ''}
                          </span>
                          {spec.standard && spec.standard !== 'N/A' && (
                            <span className="text-slate-400 text-[10px] mt-1">({spec.standard})</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="text-xs text-slate-400 mt-4 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Processed: {format(new Date(material.processedAt), 'MMM d, yyyy')}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
