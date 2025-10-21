// src/components/StepsTracker.tsx
import { CheckCircle2 } from "lucide-react";

interface StepsTrackerProps {
  currentStep: number; // 1 = Address, 2 = Payment, 3 = Confirmed
}

const StepsTracker = ({ currentStep }: StepsTrackerProps) => {
  const steps = [
    { id: 1, title: "Address" },
    { id: 2, title: "Payment" },
    { id: 3, title: "Order Confirmed" },
  ];

  return (
    <div className="flex items-center justify-center mb-8 mt-6">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              {isCompleted ? (
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              ) : (
                <div
                  className={`h-8 w-8 flex items-center justify-center rounded-full border-2 ${
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-gray-400 text-gray-400"
                  }`}
                >
                  {step.id}
                </div>
              )}
              <span
                className={`text-sm mt-2 ${
                  isActive
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>

            {/* --- Line between steps --- */}
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 mx-2 ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepsTracker;
