"use client";

interface NavigationProps {
  currentStep: number;
  totalSteps: number;
  handleNext: () => void;
  handlePrev: () => void;
  handleSubmit: () => void;
  isSubmitting?: boolean;
}

const Navigation = ({
  currentStep,
  totalSteps,
  handleNext,
  handlePrev,
  handleSubmit,
  isSubmitting = false,
}: NavigationProps) => {
  return (
    <div className="mt-8 flex justify-between">
      {currentStep > 1 ? (
        <button
          onClick={handlePrev}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Quay lại
        </button>
      ) : (
        <div />
      )}

      {currentStep < totalSteps ? (
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Tiếp theo
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi"}
        </button>
      )}
    </div>
  );
};

export default Navigation; 