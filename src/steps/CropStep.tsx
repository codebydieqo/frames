import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { ArrowLeft, ArrowRight, Crop as CropIcon } from 'lucide-react';
import { useImageContext } from '../contexts/ImageContext';
import Button from '../components/Button';
import { createCroppedImage } from '../utils/helpers';
import { getAspectRatio } from '../utils/helpers';

interface Point {
  x: number;
  y: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CropStep: React.FC = () => {
  const { images, updateImageCrop, nextStep, prevStep, selectedSize } = useImageContext();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const activeImage = images[activeImageIndex];
  const aspectRatio = selectedSize ? getAspectRatio(selectedSize) : 1;

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const saveCrop = async () => {
    if (!activeImage || !croppedArea) return;

    try {
      const croppedImageUrl = await createCroppedImage(
        activeImage.preview,
        croppedArea
      );
      
      updateImageCrop(activeImage.id, croppedImageUrl, croppedArea);
      
      // Move to next image or complete
      if (activeImageIndex < images.length - 1) {
        setActiveImageIndex(activeImageIndex + 1);
        // Reset crop and zoom for next image
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      } else {
        // All images processed
        nextStep();
      }
    } catch (e) {
      console.error('Error creating cropped image:', e);
    }
  };

  const goToPreviousImage = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
      // Reset crop and zoom for previous image
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } else {
      prevStep();
    }
  };

  const handleBackToSizes = () => {
    prevStep();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Crop Your Images</h2>
      <p className="text-gray-600 mb-4">
        Adjust the crop area for each image ({activeImageIndex + 1} of {images.length})
      </p>

      {/* Image selector thumbnails */}
      <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <div 
            key={image.id}
            onClick={() => setActiveImageIndex(index)}
            className={`
              w-16 h-16 flex-shrink-0 cursor-pointer rounded border-2
              ${activeImageIndex === index ? 'border-blue-600' : 'border-transparent'}
              ${image.croppedPreview ? 'ring-2 ring-green-500' : ''}
            `}
          >
            <img 
              src={image.preview} 
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))}
      </div>

      {/* Cropper */}
      <div className="relative bg-gray-800 rounded-lg overflow-hidden" style={{ height: '50vh', minHeight: '400px' }}>
        {activeImage && (
          <Cropper
            image={activeImage.preview}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            objectFit="contain"
          />
        )}
      </div>

      {/* Zoom slider */}
      <div className="mt-4 px-4">
        <label htmlFor="zoom-slider" className="block text-sm font-medium text-gray-700 mb-1">
          Zoom: {zoom.toFixed(1)}×
        </label>
        <input
          id="zoom-slider"
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between">
        <Button
          onClick={goToPreviousImage}
          variant="outline"
          icon={<ArrowLeft size={18} />}
        >
          {activeImageIndex > 0 ? 'Previous Image' : 'Back to Sizes'}
        </Button>
        <Button
          onClick={saveCrop}
          icon={<CropIcon size={18} />}
        >
          {activeImageIndex < images.length - 1 ? 'Save & Next Image' : 'Finish Cropping'}
        </Button>
      </div>
    </div>
  );
};

export default CropStep;