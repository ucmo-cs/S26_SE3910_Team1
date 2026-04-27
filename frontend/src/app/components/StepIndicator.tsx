import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute left-0 top-5 h-0.5 w-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-[#37644B] dark:bg-green-500 transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  isCompleted
                    ? "bg-[#37644B] dark:bg-green-500 text-white"
                    : isCurrent
                    ? "bg-[#37644B] dark:bg-green-500 text-white ring-4 ring-[#37644B]/15 dark:ring-green-900/30"
                    : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-2 border-gray-200 dark:border-gray-700"
                }`}
              >
                {isCompleted ? (
                  <Check className="size-5" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium whitespace-nowrap ${
                  isCurrent
                    ? "text-[#37644B] dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
