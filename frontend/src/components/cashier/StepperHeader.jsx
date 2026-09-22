// StepperHeader.jsx
import React from "react";
import PropTypes from "prop-types";
import { Check } from "lucide-react";

/**
 * Responsive StepperHeader
 * - Mobile (default): vertical stack of steps with vertical connectors
 * - md+ (desktop): horizontal steps with horizontal connectors and labels under the circles
 */

function StepperHeader({ currentStep = 1, steps = [] }) {
  if (!Array.isArray(steps) || steps.length === 0) return null;

  return (
    <nav
      className="w-full max-w-4xl mx-auto px-4 py-6"
      aria-label="Progress"
      role="navigation"
    >
      <div
        className="flex flex-col md:flex-row items-start md:items-center justify-center gap-4 md:gap-6 overflow-x-auto"
        role="list"
      >
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isComplete = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          const circleBase =
            "flex items-center justify-center rounded-full font-semibold transition-colors flex-shrink-0";
          const circleSize = "w-10 h-10 md:w-12 md:h-12 text-sm md:text-base";
          const circleState = isComplete || isActive
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground";

          const labelClass = isActive
            ? "text-primary font-medium"
            : isComplete
            ? "text-foreground"
            : "text-muted-foreground";

          // connector color: based on whether the left step is complete (stepNum < currentStep)
          const connectorOn = stepNum < currentStep;

          return (
            <div
              key={`${index}-${String(label).slice(0, 30)}`}
              className="flex items-center md:flex-col md:items-center gap-2 md:gap-3 flex-shrink-0"
              role="listitem"
            >
              {/* Step circle + label (for md+ label goes under, for mobile label is inline) */}
              <div className="flex items-center md:flex-col md:items-center gap-2">
                <div
                  className={`${circleBase} ${circleSize} ${circleState}`}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Step ${stepNum}: ${label}`}
                >
                  {isComplete ? <Check className="w-5 h-5" /> : <span>{stepNum}</span>}
                </div>

                {/* Label: desktop -> below the circle, mobile -> to the right */}
                <span
                  className={`text-xs md:text-sm ${labelClass} ${
                    /* On mobile show inline */ "hidden md:inline-block"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Connectors:
                  - show horizontal connector on md+ (between steps)
                  - show vertical connector on mobile (between steps)
              */}
              {index < steps.length - 1 && (
                <>
                  {/* horizontal connector (desktop) */}
                  <div
                    className={`hidden md:block h-0.5 w-20 md:w-24 mx-2 ${
                      connectorOn ? "bg-primary" : "bg-border"
                    }`}
                    aria-hidden="true"
                  />

                  {/* vertical connector (mobile) */}
                  <div
                    className={`md:hidden w-0.5 h-6 my-1 ${
                      connectorOn ? "bg-primary" : "bg-border"
                    }`}
                    aria-hidden="true"
                  />

                  {/* label for mobile (when vertical layout is used, show label under connector as well) */}
                  {/* We want labels visible on mobile to the right of circle; above we hid labels for mobile.
                      So show a mobile label here (inline with connector) */}
                  <div className="md:hidden">
                    {/* Render the label to the right of the circle on mobile */}
                    <span className={`text-xs ${labelClass} ml-2`}>{/* empty placeholder */}</span>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* On md+, show labels under each step (we hid inline labels for mobile). For accessibility and clarity,
            we render labels under circles for md+ using a separate small block below the whole row. */}
      </div>

      {/* Secondary label row for desktop: render labels under each step to match circles above.
          This keeps labels aligned under each circle on md+ while being hidden on mobile. */}
      <div className="hidden md:flex md:flex-row items-center justify-center gap-6 mt-2">
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isComplete = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const labelClass = isActive
            ? "text-primary font-medium text-sm"
            : isComplete
            ? "text-foreground text-sm"
            : "text-muted-foreground text-sm";

          return (
            <div key={`label-${index}`} className="w-12 md:w-12 text-center flex-shrink-0">
              <span className={labelClass}>{label}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

StepperHeader.propTypes = {
  currentStep: PropTypes.number,
  steps: PropTypes.arrayOf(PropTypes.string),
};

export default StepperHeader;
