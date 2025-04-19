import React from "react";
import { ImageProvider, useImageContext } from "./contexts/ImageContext";
import StepIndicator from "./components/StepIndicator";
import UploadStep from "./steps/UploadStep";
import SizeStep from "./steps/SizeStep";
import CropStep from "./steps/CropStep";
import DownloadStep from "./steps/DownloadStep";
import { Camera } from "lucide-react";

// Main app container
const AppContainer: React.FC = () => {
  return (
    <ImageProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow w-full max-w-screen-xl">
          <StepProgress />
          <StepContent />
        </main>
        <Footer />
      </div>
    </ImageProvider>
  );
};

// Header component
const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center w-full max-w-screen-xl">
        <div className="flex items-center">
          <Camera className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-xl font-bold text-gray-800">Frames.io</h1>
        </div>
        <div className="ml-auto text-sm text-gray-500">Photo Framing Tool</div>
      </div>
    </header>
  );
};

// Step progress indicator
const StepProgress: React.FC = () => {
  return (
    <div className="mb-8 mt-4">
      <StepIndicator />
    </div>
  );
};

// Step content based on current step
const StepContent: React.FC = () => {
  const { currentStep } = useImageContext();

  switch (currentStep) {
    case 0:
      return <UploadStep />;
    case 1:
      return <SizeStep />;
    case 2:
      return <CropStep />;
    case 3:
      return <DownloadStep />;
    default:
      return <UploadStep />;
  }
};

// Footer component
const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-sm mt-auto py-6">
      <div className="container mx-auto px-4 w-full max-w-screen-xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Camera className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Frames.io</span>
          </div>

          <div className="text-sm text-gray-500 text-center">
            Create perfectly sized photos for your frames in seconds
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppContainer;
