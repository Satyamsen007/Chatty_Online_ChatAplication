import React, { useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImagePreviewModal = ({ isOpen, onClose, imageUrl }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = imageUrl.split('/').pop() || `image-${Date.now()}.jpg`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = (e) => {
    e.stopPropagation();
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setScale(1);
    setRotation(0);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          {/* Top Controls */}
          <div
            className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="text-white hover:text-primary transition-colors flex items-center gap-2 bg-black/50 p-2 rounded-lg hover:bg-black/70 cursor-pointer"
                title="Download Image"
              >
                <Download className="size-5" />
                <span className="text-sm">Download</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={handleZoomOut}
                className="text-white hover:text-primary transition-colors bg-black/50 p-2 rounded-lg hover:bg-black/70 cursor-pointer"
                title="Zoom Out"
                disabled={scale <= 0.5}
              >
                <ZoomOut className="size-5" />
              </button>
              <button
                onClick={handleZoomIn}
                className="text-white hover:text-primary transition-colors bg-black/50 p-2 rounded-lg hover:bg-black/70 cursor-pointer"
                title="Zoom In"
                disabled={scale >= 3}
              >
                <ZoomIn className="size-5" />
              </button>
              <button
                onClick={handleRotate}
                className="text-white hover:text-primary transition-colors bg-black/50 p-2 rounded-lg hover:bg-black/70 cursor-pointer"
                title="Rotate Image"
              >
                <RotateCcw className="size-5" />
              </button>
              <button
                onClick={handleReset}
                className="text-white hover:text-primary transition-colors bg-black/50 p-2 rounded-lg hover:bg-black/70 cursor-pointer"
                title="Reset View"
              >
                Reset
              </button>
              <button
                onClick={handleClose}
                className="text-white hover:text-primary transition-colors bg-black/50 p-2 rounded-lg hover:bg-black/70 cursor-pointer"
                title="Close Preview"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Image Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-lg overflow-hidden bg-black/50">
              <motion.img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-contain"
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease-in-out'
                }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.1}
              />
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white text-xs sm:text-sm">
              {Math.round(scale * 100)}% • {rotation}°
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImagePreviewModal;