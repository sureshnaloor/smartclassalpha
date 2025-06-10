import { ProcessingTabs } from '@/components/MaterialProcessing/ProcessingTabs';
import { motion } from 'framer-motion';
import { Database, FileText, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Database className="h-8 w-8 text-indigo-600" />
              Material Processing
            </h1>
            <p className="text-slate-500 mt-1">Process and classify materials using AI</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-medium text-slate-700">Single Material</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Process one material at a time</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-medium text-slate-700">Batch Upload</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Process multiple materials via CSV</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ProcessingTabs />
        </motion.div>
      </div>
    </div>
  );
}
