import React from 'react';
import { X } from 'lucide-react';
import { ImageFile } from '../types';

interface ImagePreviewProps {
  image: ImageFile;
  onRemove: (id: string) => void;
  showCropped?: boolean;
  className?: string;
  showRemoveButton?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  onRemove,
  showCropped = false,
  className = '',
  showRemoveButton = true,
}) => {
  const src = showCropped && image.croppedPreview ? image.croppedPreview : image.preview;

  return (
    <div 
      className={`
        group relative rounded-lg overflow-hidden bg-gray-100 
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      <img
        src={src}
        alt={`Preview of ${image.file.name}`}
        className="w-full h-full object-cover"
      />
      
      {showRemoveButton && (
        <button
          type="button"
          onClick={() => onRemove(image.id)}
          className="
            absolute top-2 right-2 bg-black/50 rounded-full p-1
            text-white opacity-0 group-hover:opacity-100
            transition-opacity duration-300 ease-in-out
            hover:bg-red-600
          "
        >
          <X size={16} />
        </button>
      )}
      
      {image.cropSize && (
        <div className="
          absolute bottom-0 left-0 right-0 bg-black/50 text-white
          text-xs px-2 py-1 text-center
        ">
          {image.cropSize}
        </div>
      )}
    </div>
  );
};

export default ImagePreview;