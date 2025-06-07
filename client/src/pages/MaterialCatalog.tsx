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
import { Search, Filter, FileDown } from 'lucide-react';
import { format } from 'date-fns';
import { Material } from '@/types';
import { Loader2 } from 'lucide-react';

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
     <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Material Catalog</h1>
            <p className="text-slate-500 mt-1">Browse and manage your processed materials</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <Button size="sm">
              <FileDown className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search materials..."
            className="pl-10 py-3 rounded-xl shadow-sm border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-slate-500">Loading materials...</span>
          </div>
        ) : !filteredMaterials || filteredMaterials.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-lg">
            {searchTerm ? 'No materials match your search' : 'No materials in catalog'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-slate-100 p-6 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    {material.materialId || material.id.toString().padStart(10, '0')}
                  </span>
                  <Badge variant="outline" className="ml-auto">
                    {material.materialType.charAt(0).toUpperCase() + material.materialType.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">{material.shortDescription}</h2>
                  <p className="text-slate-600 mt-1"><span> ( </span>{material.materialName} <span> ) </span></p>
                  
                  {material.primaryGroup && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="secondary">{material.primaryGroup}</Badge>
                      {material.secondaryGroup && (
                        <Badge variant="secondary">{material.secondaryGroup}</Badge>
                      )}
                      {material.tertiaryGroup && (
                        <Badge variant="secondary">{material.tertiaryGroup}</Badge>
                      )}
                    </div>
                  )}
                </div>
                {material.longDescription && (
                  <div className="text-slate-600 text-sm mt-2 lowercase italic border-l-4 border-primary pl-3 bg-slate-50 rounded">
                    {material.longDescription}
                  </div>
                )}
               {material.specifications && Array.isArray(material.specifications) && (
  <div className="mt-2">
    <div className="font-semibold text-slate-700 mb-1">Specifications:</div>
    <div className="flex flex-wrap gap-2">
      {material.specifications.map((spec: any, idx: number) => (
        <span
          key={idx}
          className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-xs font-mono flex flex-col min-w-[120px]"
        >
          <span className="font-semibold">{spec.attribute}</span>
          <span>
            {spec.value}
            {spec.unit ? ` ${spec.unit}` : ''}
          </span>
          {spec.standard && spec.standard !== 'N/A' && (
            <span className="text-slate-400">({spec.standard})</span>
          )}
        </span>
      ))}
    </div>
  </div>
)}
                <div className="text-xs text-slate-400 mt-4">
                  Processed: {format(new Date(material.processedAt), 'MMM d, yyyy')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
