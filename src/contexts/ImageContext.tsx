import React, { createContext, useContext, useState, useEffect } from 'react';
import { ImageFile, FrameSize } from '../types';
import { revokeObjectURLs } from '../utils/helpers';
import { MAX_IMAGES } from '../utils/constants';

interface ImageContextProps {
  images: ImageFile[];
  addImages: (newImages: ImageFile[]) => void;
  removeImage: (id: string) => void;
  updateImageCrop: (id: string, croppedPreview: string, crop: any) => void;
  setFrameSize: (id: string, size: FrameSize) => void;
  selectedSize: FrameSize | null;
  setSelectedSize: (size: FrameSize | null) => void;
  pdfUrl: string;
  setPdfUrl: (url: string) => void;
  resetImages: () => void;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  maxSteps: number;
}

const ImageContext = createContext<ImageContextProps | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedSize, setSelectedSize] = useState<FrameSize | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const maxSteps = 4; // Upload, Size, Crop, Download

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      revokeObjectURLs(images);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  const addImages = (newImages: ImageFile[]) => {
    setImages((prevImages) => {
      // Limit to maximum number of images
      const combined = [...prevImages, ...newImages];
      return combined.slice(0, MAX_IMAGES);
    });
  };

  const removeImage = (id: string) => {
    setImages((prevImages) => {
      const imageToRemove = prevImages.find((img) => img.id === id);
      if (imageToRemove?.preview) URL.revokeObjectURL(imageToRemove.preview);
      if (imageToRemove?.croppedPreview) URL.revokeObjectURL(imageToRemove.croppedPreview);
      return prevImages.filter((img) => img.id !== id);
    });
  };

  const updateImageCrop = (id: string, croppedPreview: string, crop: any) => {
    setImages((prevImages) => 
      prevImages.map((img) => 
        img.id === id 
          ? { ...img, croppedPreview, crop } 
          : img
      )
    );
  };

  const setFrameSize = (id: string, size: FrameSize) => {
    setImages((prevImages) => 
      prevImages.map((img) => 
        img.id === id 
          ? { ...img, cropSize: size } 
          : img
      )
    );
  };

  const resetImages = () => {
    revokeObjectURLs(images);
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setImages([]);
    setSelectedSize(null);
    setPdfUrl('');
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < maxSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < maxSteps) {
      setCurrentStep(step);
    }
  };

  const value = {
    images,
    addImages,
    removeImage,
    updateImageCrop,
    setFrameSize,
    selectedSize,
    setSelectedSize,
    pdfUrl,
    setPdfUrl,
    resetImages,
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    maxSteps,
  };

  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};