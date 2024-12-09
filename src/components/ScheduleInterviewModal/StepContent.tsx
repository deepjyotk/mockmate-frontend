import React from 'react';

// Define an interface for option objects
interface Option {
  id: string;
  label: string;
}

interface StepContentProps {
  title: string;
  options: Option[] | string[];
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
  handleNext: () => void;
  handleBack?: () => void;
}

// Utility function for common button styles
const getButtonStyle = (isSelected: boolean): string => {
  return isSelected
    ? "bg-blue-700 text-white font-semibold"
    : "bg-gray-100 text-gray-700 font-medium hover:bg-gray-200";
};

const StepContent: React.FC<StepContentProps> = ({
  title,
  options,
  selectedOption,
  onOptionSelect,
  handleNext,
  handleBack,
}) => (
  <div className="flex flex-col h-full">
    {/* Main Content */}
    <div className="flex-1 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex flex-col space-y-4">
        {options.map((option) => {
          // Determine if the option is an object or a string
          const optionObj = typeof option === 'string' ? { id: option, label: option } : option;
          const isSelected = selectedOption === optionObj.id;

          return (
            <button
              key={optionObj.id}
              onClick={() => onOptionSelect(optionObj.id)}
              className={`px-4 py-2 rounded-lg text-lg ${getButtonStyle(isSelected)}`}
              aria-pressed={isSelected}
              aria-label={`Select ${optionObj.label}`}
            >
              {optionObj.label}
            </button>
          );
        })}
      </div>
    </div>

    {/* Navigation Buttons */}
    <div className="mt-4">
      <div className="flex justify-between space-x-2">
        {handleBack && (
          <button
            onClick={handleBack}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            aria-label="Go Back"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!selectedOption}
          className={`flex-1 px-4 py-2 rounded-lg 
            ${selectedOption ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'} 
            ${handleBack ? '' : 'ml-auto'}`}

          aria-label="Next Step"
        >
          Next
        </button>
      </div>
    </div>
  </div>
);

export default StepContent;