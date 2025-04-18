import React, { useEffect, useState } from 'react';
import { Download, FileDown, Loader2, RefreshCw } from 'lucide-react';
import { useImageContext } from '../contexts/ImageContext';
import Button from '../components/Button';
import ImagePreview from '../components/ImagePreview';
import { generatePDF } from '../utils/helpers';

const DownloadStep: React.FC = () => {
  const { images, pdfUrl, setPdfUrl, resetImages } = useImageContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate PDF when component mounts or when images change
  useEffect(() => {
    if (images.length > 0 && !pdfUrl && !isGenerating) {
      handleGeneratePDF();
    }
  }, [images, pdfUrl]);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Check if all images have been cropped
      const uncropped = images.filter(img => !img.croppedPreview);
      if (uncropped.length > 0) {
        setError(`${uncropped.length} images are not cropped. Please go back and crop all images.`);
        setIsGenerating(false);
        return;
      }
      
      const url = await generatePDF(images);
      setPdfUrl(url);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'photo-frames.pdf';
    link.click();
  };

  const handleStartOver = () => {
    resetImages();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Download Your Images</h2>
      
      {isGenerating ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-700">Generating your PDF...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <Button
            onClick={handleGeneratePDF}
            className="mt-4"
            icon={<RefreshCw size={18} />}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-6">
            Your images have been processed and are ready for download.
          </p>
          
          {/* Preview of cropped images */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Processed Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <ImagePreview
                  key={image.id}
                  image={image}
                  onRemove={() => {}}
                  showCropped={true}
                  className="aspect-square"
                  showRemoveButton={false}
                />
              ))}
            </div>
          </div>
          
          {/* PDF preview and download */}
          {pdfUrl && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Your PDF is ready</h3>
                <Button
                  onClick={handleDownload}
                  icon={<Download size={18} />}
                >
                  Download PDF
                </Button>
              </div>
              <div className="bg-white rounded border border-gray-300 p-4 flex items-center justify-center">
                <FileDown className="mr-3 text-gray-500" size={24} />
                <span className="text-gray-700">photo-frames.pdf</span>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Your images have been arranged on a letter-sized document (8.5×11 inches) 
                for easy printing.
              </p>
            </div>
          )}
          
          {/* Start over button */}
          <div className="text-center mt-8">
            <Button
              onClick={handleStartOver}
              variant="outline"
            >
              Start Over with New Images
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DownloadStep;