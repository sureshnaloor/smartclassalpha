import { useQuery } from '@tanstack/react-query';
import { ProcessingHistory } from '@/types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2, History } from 'lucide-react';

export default function ProcessingHistoryPage() {
  const { data: history, isLoading, error } = useQuery<ProcessingHistory[]>({
    queryKey: ['/api/processing-history'],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <History className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Processing History</h1>
        </div>
        
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300">
          <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="text-xl text-slate-800">Batch Processing Records</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-slate-600">Loading history...</span>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-red-500 bg-red-50/50">
                Error loading history. Please try again later.
              </div>
            ) : !history || history.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-50/50">
                No processing history found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                      <TableHead className="text-slate-700">Batch ID</TableHead>
                      <TableHead className="text-slate-700">Processed At</TableHead>
                      <TableHead className="text-slate-700">Materials</TableHead>
                      <TableHead className="text-slate-700">Success Rate</TableHead>
                      <TableHead className="text-slate-700">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => {
                      const successRate = item.materialCount > 0 
                        ? Math.round((item.successful / item.materialCount) * 100)
                        : 0;
                      return (
                        <TableRow 
                          key={item.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell className="font-medium text-slate-800">
                            {item.batchId || `Batch #${item.id}`}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {format(new Date(item.processedAt), 'MMM d, yyyy HH:mm')}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {item.materialCount} material{item.materialCount !== 1 ? 's' : ''}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                  style={{ width: `${Math.min(Math.max(successRate, 0), 100)}%` }}
                                />
                              </div>
                              <span className="text-slate-700 font-medium">{successRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.failed === 0 ? (
                              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-sm">
                                Completed
                              </Badge>
                            ) : item.successful === 0 ? (
                              <Badge variant="destructive" className="shadow-sm">
                                Failed
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 shadow-sm">
                                Partial ({item.successful}/{item.materialCount})
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
