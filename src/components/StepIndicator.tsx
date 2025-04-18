import React from 'react';
import { Upload, Maximize, Crop, FileDown } from 'lucide-react';
import { useImageContext } from '../contexts/ImageContext';

const StepIndicator: React.FC = () => {
  const { currentStep, goToStep } = useImageContext();

  const steps = [
    { label: 'Upload', Icon: Upload, description: 'Upload your images' },
    { label: 'Size', Icon: Maximize, description: 'Select frame size' },
    { label: 'Crop', Icon: Crop, description: 'Adjust cropping' },
    { label: 'Download', Icon: FileDown, description: 'Generate and download PDF' },
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const { Icon, label } = step;
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;
          const isClickable = index < currentStep;
          
          return (
            <div 
              key={label} 
              className="flex flex-col items-center relative flex-1"
              onClick={() => isClickable && goToStep(index)}
            >
              <div className={`${isClickable ? 'cursor-pointer hover:opacity-80' : ''}`}>
                <div 
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full mb-2
                    transition-all duration-300 ease-in-out
                    ${isActive ? 'bg-blue-600 text-white scale-110' : 
                      isCompleted ? 'bg-blue-500 text-white' : 
                      'bg-gray-200 text-gray-500'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              <div 
                className={`text-sm font-medium transition-all duration-300
                  ${isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-blue-500' : 
                    'text-gray-500'}
                `}
              >
                {label}
              </div>
              
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div 
                  className={`absolute top-5 left-1/2 right-0 h-0.5 w-full
                    ${isCompleted ? 'bg-blue-500' : 'bg-gray-200'}
                  `}
                  style={{ transform: 'translateY(-50%)' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;