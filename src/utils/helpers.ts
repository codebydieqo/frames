import { nanoid } from 'nanoid';
import { ImageFile, CropData, FrameSize } from '../types';
import { FRAME_SIZES, DPI } from './constants';
import { jsPDF } from 'jspdf';

// Create a unique ID for each image
export const createImageId = () => nanoid();

// Convert inches to pixels at the specified DPI
export const inchesToPixels = (inches: number, dpi: number = DPI) => inches * dpi;

// Calculate the aspect ratio for a given frame size
export const getAspectRatio = (size: FrameSize) => {
  const dimensions = FRAME_SIZES[size];
  return dimensions.width / dimensions.height;
};

// Create an object URL for a file
export const createObjectURL = (file: File): string => {
  return URL.createObjectURL(file);
};

// Process uploaded files into our ImageFile format
export const processFiles = (acceptedFiles: File[]): ImageFile[] => {
  return acceptedFiles.map((file) => ({
    id: createImageId(),
    file,
    preview: createObjectURL(file),
  }));
};

// Clean up object URLs to prevent memory leaks
export const revokeObjectURLs = (images: ImageFile[]) => {
  images.forEach((image) => {
    if (image.preview) URL.revokeObjectURL(image.preview);
    if (image.croppedPreview) URL.revokeObjectURL(image.croppedPreview);
  });
};

// Create cropped image from canvas
export const createCroppedImage = async (
  imageSrc: string,
  pixelCrop: CropData,
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Set canvas size to crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert canvas to blob URL
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Canvas is empty');
      }
      resolve(URL.createObjectURL(blob));
    }, 'image/jpeg');
  });
};

// Create an image element from source
export const createImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = src;
  });
};

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Find the best position for an image on the current page
const findBestPosition = (
  width: number,
  height: number,
  usedPositions: Position[],
  pageWidth: number = 8.5,
  pageHeight: number = 11,
  margin: number = 0.5
): Position | null => {
  const availableWidth = pageWidth - 2 * margin;
  const availableHeight = pageHeight - 2 * margin;
  
  // Try positions with increasing y-coordinates
  for (let y = margin; y <= availableHeight - height; y += 0.1) {
    // Try positions with increasing x-coordinates
    for (let x = margin; x <= availableWidth - width; x += 0.1) {
      const position = { x, y, width, height };
      
      // Check if this position overlaps with any used positions
      const hasOverlap = usedPositions.some(used => {
        return !(
          position.x + position.width + 0.25 <= used.x ||
          position.x >= used.x + used.width + 0.25 ||
          position.y + position.height + 0.25 <= used.y ||
          position.y >= used.y + used.height + 0.25
        );
      });
      
      if (!hasOverlap) {
        return position;
      }
    }
  }
  
  return null;
};

// Generate a PDF with the cropped images
export const generatePDF = async (images: ImageFile[]): Promise<string> => {
  // Create a new PDF document (letter size)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [8.5, 11],
  });

  // Sort images by size to optimize placement (larger images first)
  const sortedImages = [...images].sort((a, b) => {
    if (!a.cropSize || !b.cropSize) return 0;
    const aSize = FRAME_SIZES[a.cropSize];
    const bSize = FRAME_SIZES[b.cropSize];
    return (bSize.width * bSize.height) - (aSize.width * aSize.height);
  });

  let currentPage = 1;
  let usedPositions: Position[] = [];

  for (let i = 0; i < sortedImages.length; i++) {
    const image = sortedImages[i];
    if (!image.croppedPreview || !image.cropSize) continue;

    const dimensions = FRAME_SIZES[image.cropSize];
    
    // Try to find a position on the current page
    const position = findBestPosition(
      dimensions.width,
      dimensions.height,
      usedPositions
    );
    
    // If no position found, start a new page
    if (!position) {
      if (i < sortedImages.length) {
        pdf.addPage();
        currentPage++;
        usedPositions = [];
        
        // Place image at the top of the new page
        const newPosition = {
          x: (8.5 - dimensions.width) / 2, // Center horizontally
          y: 0.5, // Top margin
          width: dimensions.width,
          height: dimensions.height,
        };
        
        pdf.addImage(
          image.croppedPreview,
          'JPEG',
          newPosition.x,
          newPosition.y,
          dimensions.width,
          dimensions.height
        );
        
        usedPositions.push(newPosition);
      }
    } else {
      // Add image at the found position
      pdf.addImage(
        image.croppedPreview,
        'JPEG',
        position.x,
        position.y,
        dimensions.width,
        dimensions.height
      );
      
      usedPositions.push(position);
    }
  }

  // Return data URL of the PDF
  return pdf.output('datauristring');
};