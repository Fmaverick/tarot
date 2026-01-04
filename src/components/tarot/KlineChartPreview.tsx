import React, { useRef } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface KlineChartPreviewProps {
  htmlContent: string;
  onClose: () => void;
}

export function KlineChartPreview({ htmlContent, onClose }: KlineChartPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto-resize iframe based on content height is tricky with cross-origin or srcDoc,
  // but since we control the template, we can set a reasonable default height.
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white/40 backdrop-blur-sm border border-black/5 rounded-2xl overflow-hidden shadow-sm mb-6 flex flex-col"
    >
      <div className="p-3 border-b border-black/5 flex items-center justify-between bg-white/20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-serif opacity-50">人生 K 线图预览</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => {
              // Open in new window for full view
              const newWindow = window.open();
              if (newWindow) {
                newWindow.document.write(htmlContent);
                newWindow.document.close();
              }
            }}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
            title="在新窗口打开"
          >
            <Maximize2 className="w-3 h-3 opacity-30" />
          </button>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
            title="关闭预览"
          >
            <X className="w-3 h-3 opacity-30" />
          </button>
        </div>
      </div>
      
      <div className="w-full h-[600px] bg-white/20 relative">
        <iframe
          ref={iframeRef}
          srcDoc={htmlContent}
          className="w-full h-full border-none"
          title="Life Tree K-Line Chart"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </motion.div>
  );
}
