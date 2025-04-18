import { FrameSizeData } from '../types';

// Frame sizes in inches
export const FRAME_SIZES: FrameSizeData = {
  '2x2': { width: 2, height: 2, label: '2×2"' },
  '3x3': { width: 3, height: 3, label: '3×3"' },
  '4x6': { width: 4, height: 6, label: '4×6"' },
  '5x7': { width: 5, height: 7, label: '5×7"' },
  '3.5x5': { width: 3.5, height: 5, label: '3.5×5"' },
  '8x10': { width: 8, height: 10, label: '8×10"' }
};

// Resolution in DPI for better quality prints
export const DPI = 300;

// Maximum number of images allowed
export const MAX_IMAGES = 8;

// Letter size in inches (for PDF)
export const LETTER_SIZE = {
  width: 8.5,
  height: 11,
};

// Steps in the workflow
export const STEPS = [
  { label: 'Upload Images', icon: 'Upload' },
  { label: 'Select Size', icon: 'Maximize' },
  { label: 'Crop Images', icon: 'Crop' },
  { label: 'Download PDF', icon: 'FileDown' },
];