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
import { Loader2 } from 'lucide-react';

export default function ProcessingHistoryPage() {
  const { data: history, isLoading, error } = useQuery<ProcessingHistory[]>({
    queryKey: ['/api/processing-history'],
  });

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Processing History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading history...</span>
            </div>
          ) : error ? (
            <div className="py-6 text-center text-red-500">
              Error loading history. Please try again later.
            </div>
          ) : !history || history.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              No processing history found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Processed At</TableHead>
                  <TableHead>Materials</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => {
                  const successRate = Math.round((item.successful / item.materialCount) * 100);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.batchId || `Batch #${item.id}`}
                      </TableCell>
                      <TableCell>
                        {format(new Date(item.processedAt), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        {item.materialCount} material{item.materialCount !== 1 ? 's' : ''}
                      </TableCell>
                      <TableCell>{successRate}%</TableCell>
                      <TableCell>
                        {item.failed === 0 ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            Completed
                          </Badge>
                        ) : item.successful === 0 ? (
                          <Badge variant="destructive">
                            Failed
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                            Partial ({item.successful}/{item.materialCount})
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
