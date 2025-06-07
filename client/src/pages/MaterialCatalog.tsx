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
    <div>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Material Catalog</CardTitle>
              <CardDescription>
                Browse and manage your processed materials
              </CardDescription>
            </div>
            <div className="mt-2 md:mt-0">
              <Button variant="outline" size="sm" className="mr-2">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button size="sm">
                <FileDown className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search materials..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading materials...</span>
            </div>
          ) : !filteredMaterials || filteredMaterials.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              {searchTerm ? 'No materials match your search' : 'No materials in catalog'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Material Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Classification</TableHead>
                    <TableHead>Processed Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-mono">
                        {material.materialId || material.id.toString().padStart(10, '0')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {material.materialName}
                        {material.shortDescription && (
                          <div className="text-xs text-gray-500 mt-1 font-mono">
                            {material.shortDescription}
                          </div>
                        )}
                        {material.longDescription && (
                          <div className="text-sm text-gray-600 mt-2">
                            {material.longDescription}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {material.materialType.charAt(0).toUpperCase() + material.materialType.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {material.primaryGroup}
                          </Badge>
                          {material.secondaryGroup && (
                            <Badge variant="secondary" className="text-xs">
                              {material.secondaryGroup}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {format(new Date(material.processedAt), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
