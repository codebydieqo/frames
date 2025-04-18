import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image, AlertCircle } from "lucide-react";
import { useImageContext } from "../contexts/ImageContext";
import { processFiles } from "../utils/helpers";
import { MAX_IMAGES } from "../utils/constants";
import Button from "../components/Button";
import ImagePreview from "../components/ImagePreview";

const UploadStep: React.FC = () => {
  const { images, addImages, removeImage, nextStep } = useImageContext();
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Reset error
      setError(null);

      // Check file types
      const invalidFiles = acceptedFiles.filter(
        (file) => !file.type.startsWith("image/")
      );

      if (invalidFiles.length > 0) {
        setError("Only image files are allowed.");
        return;
      }

      // Process valid files
      const validFiles = acceptedFiles.filter((file) =>
        file.type.startsWith("image/")
      );

      // Check if adding these would exceed the max
      if (images.length + validFiles.length > MAX_IMAGES) {
        setError(`You can only upload up to ${MAX_IMAGES} images.`);
        // Only add up to the max
        const remaining = MAX_IMAGES - images.length;
        if (remaining > 0) {
          const limitedFiles = validFiles.slice(0, remaining);
          addImages(processFiles(limitedFiles));
        }
        return;
      }

      // Add all valid files
      addImages(processFiles(validFiles));
    },
    [images.length, addImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: MAX_IMAGES - images.length,
  });

  const handleContinue = () => {
    if (images.length > 0) {
      nextStep();
    } else {
      setError("Please upload at least one image.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Upload Your Images
      </h2>
      <p className="text-gray-600 mb-6">
        Select up to {MAX_IMAGES} images to resize and format for printing.
      </p>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 transition-all duration-300
          flex flex-col items-center justify-center cursor-pointer
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }
          ${images.length >= MAX_IMAGES ? "opacity-50 pointer-events-none" : ""}
        `}
        style={{ minHeight: "200px" }}
      >
        <input {...getInputProps()} />
        <Upload
          className={`mb-4 ${isDragActive ? "text-blue-500" : "text-gray-400"}`}
          size={40}
        />
        <p className="text-lg font-medium text-center">
          {isDragActive
            ? "Drop the images here..."
            : "Drag & drop images here, or click to select files"}
        </p>
        <p className="text-sm text-gray-500 mt-2 text-center">
          {images.length >= MAX_IMAGES
            ? `Maximum ${MAX_IMAGES} images reached.`
            : `${images.length} of ${MAX_IMAGES} images selected.`}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg flex items-start">
          <AlertCircle
            className="text-red-500 mr-2 flex-shrink-0 mt-0.5"
            size={18}
          />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Selected Images
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <ImagePreview
                key={image.id}
                image={image}
                onRemove={removeImage}
                className="aspect-square"
              />
            ))}
          </div>
        </div>
      )}

      {/* Button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={images.length === 0}
          icon={<Image size={18} />}
        >
          Continue to Size Selection
        </Button>
      </div>
    </div>
  );
};

export default UploadStep;
