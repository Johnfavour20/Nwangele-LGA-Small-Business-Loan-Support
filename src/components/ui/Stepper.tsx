import React from 'react';
import { ICONS } from '../../constants';

interface StepperProps {
  steps: { id: number; name: string }[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            {currentStep > step.id ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-green-600" />
                </div>
                <span className="relative flex h-8 w-8 items-center justify-center bg-green-600 rounded-full hover:bg-green-700">
                  <span className="text-white">{ICONS.checkmark}</span>
                </span>
              </>
            ) : currentStep === step.id ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <span className="relative flex h-8 w-8 items-center justify-center bg-white dark:bg-gray-800 border-2 border-green-600 rounded-full" aria-current="step">
                  <span className="h-2.5 w-2.5 bg-green-600 rounded-full" />
                </span>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <span className="relative flex h-8 w-8 items-center justify-center bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full hover:border-gray-400">
                </span>
              </>
            )}
             <span
              className={`absolute top-10 left-1/2 -translate-x-1/2 hidden sm:block w-24 text-center text-sm
                ${currentStep === step.id
                  ? 'font-bold text-green-700 dark:text-green-400'
                  : 'font-medium text-gray-600 dark:text-gray-400'
                }
                ${currentStep < step.id ? 'text-gray-500 dark:text-gray-500' : ''}
              `}
            >
              {step.name}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
};
