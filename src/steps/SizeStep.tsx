import React from "react";
import { ArrowLeft, ArrowRight, Maximize } from "lucide-react";
import { useImageContext } from "../contexts/ImageContext";
import Button from "../components/Button";
import { FRAME_SIZES } from "../utils/constants";
import { FrameSize } from "../types";

const SizeStep: React.FC = () => {
  const {
    selectedSize,
    setSelectedSize,
    images,
    nextStep,
    prevStep,
    setFrameSize,
  } = useImageContext();

  const handleSizeSelect = (size: FrameSize) => {
    setSelectedSize(size);

    // Apply the selected size to all images
    images.forEach((image) => {
      setFrameSize(image.id, size);
    });
  };

  const handleContinue = () => {
    if (selectedSize) {
      nextStep();
    }
  };

  // Organize sizes by common dimensions
  const squareSizes = ["2x2", "3x3"];
  const smallSizes = ["3.5x5", "4x6"];
  const mediumSizes = ["5x7"];
  const largeSizes = ["8x10"];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Select Frame Size
      </h2>
      <p className="text-gray-600 mb-6">
        Choose a standard frame size for your images. All images will be cropped
        to this size.
      </p>

      <div className="grid gap-8">
        {/* Square sizes */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Square</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {squareSizes.map((size) => (
              <SizeOption
                key={size}
                size={size as FrameSize}
                isSelected={selectedSize === size}
                onSelect={handleSizeSelect}
              />
            ))}
          </div>
        </div>

        {/* Small sizes */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Small</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {smallSizes.map((size) => (
              <SizeOption
                key={size}
                size={size as FrameSize}
                isSelected={selectedSize === size}
                onSelect={handleSizeSelect}
              />
            ))}
          </div>
        </div>

        {/* Medium sizes */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Medium</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediumSizes.map((size) => (
              <SizeOption
                key={size}
                size={size as FrameSize}
                isSelected={selectedSize === size}
                onSelect={handleSizeSelect}
              />
            ))}
          </div>
        </div>

        {/* Large sizes */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Large</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {largeSizes.map((size) => (
              <SizeOption
                key={size}
                size={size as FrameSize}
                isSelected={selectedSize === size}
                onSelect={handleSizeSelect}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between space-x-4">
        <Button
          onClick={prevStep}
          variant="outline"
          icon={<ArrowLeft size={18} />}
          className="w-1/2"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedSize}
          icon={<ArrowRight size={18} />}
          className="w-1/2"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

interface SizeOptionProps {
  size: FrameSize;
  isSelected: boolean;
  onSelect: (size: FrameSize) => void;
}

const SizeOption: React.FC<SizeOptionProps> = ({
  size,
  isSelected,
  onSelect,
}) => {
  const dimensions = FRAME_SIZES[size];
  const aspectRatio = dimensions.width / dimensions.height;

  return (
    <div
      className={`
        border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "border-blue-600 bg-blue-50"
            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
        }
      `}
      onClick={() => onSelect(size)}
    >
      <div
        className="mx-auto mb-3 bg-white border border-gray-300 shadow-sm"
        style={{
          width: "100%",
          maxWidth: "100px",
          aspectRatio: aspectRatio,
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <Maximize
            size={aspectRatio > 1 ? 24 : 16}
            className="text-gray-400"
          />
        </div>
      </div>
      <div className="text-center">
        <p className="font-medium text-gray-800">{dimensions.label}</p>
        <p className="text-xs text-gray-500 mt-1">
          {dimensions.width}" × {dimensions.height}"
        </p>
      </div>
    </div>
  );
};

export default SizeStep;
