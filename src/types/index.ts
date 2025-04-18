export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  croppedPreview?: string;
  crop?: CropData;
  cropSize?: FrameSize;
}

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StepProps {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export type FrameSize = '2x2' | '3x3' | '4x6' | '5x7' | '3.5x5' | '8x10' | '8.5x11';

export interface SizeDimensions {
  width: number;
  height: number;
  label: string;
}

export interface FrameSizeData {
  [key: string]: SizeDimensions;
}