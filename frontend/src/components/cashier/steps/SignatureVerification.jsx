// SignatureVerification.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Smartphone,
  Mail,
  CheckCircle,
  Loader2,
  Fingerprint,
  Zap,
  Clock,
  GitBranch,
} from "lucide-react";

const verificationSteps = [
  { label: "Analyzing curve geometry", icon: Fingerprint },
  { label: "Checking pressure points", icon: Zap },
  { label: "Validating stroke velocity", icon: Clock },
  { label: "Matching historical patterns", icon: GitBranch },
];

function SignatureVerification({ onVerified = () => {}, customerName = "Customer" }) {
  const [phase, setPhase] = useState("waiting"); // "waiting" | "verifying" | "match" | "complete"
  const [sigVerified, setSigVerified] = useState(false);
  const [activeVerStep, setActiveVerStep] = useState(0);

  // Auto-advance verification steps with safe cleanup
  useEffect(() => {
    let stepTimer;
    let matchTimer;

    if (phase === "verifying" && activeVerStep < verificationSteps.length) {
      stepTimer = setTimeout(() => {
        if (activeVerStep < verificationSteps.length - 1) {
          setActiveVerStep((s) => s + 1);
        } else {
          // last step finished -> short delay then go to "match"
          matchTimer = setTimeout(() => setPhase("match"), 800);
        }
      }, 1000);
    }

    return () => {
      clearTimeout(stepTimer);
      clearTimeout(matchTimer);
    };
  }, [phase, activeVerStep]);

  const handleCheckVerified = () => {
    setSigVerified(true);
    setPhase("verifying");
    setActiveVerStep(0);
  };

  // Completed state
  if (phase === "complete") {
    return (
      <div className="flex flex-col items-center px-4">
        <div className="bg-card rounded-xl p-8 shadow-sm border border-border max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Verification Complete</h3>
          <p className="text-muted-foreground mb-6">
            Successfully verified signature for <strong>{customerName}</strong>
          </p>

          <div className="bg-muted rounded-lg p-4 space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Document Type</span>
              <span className="font-medium text-foreground">passport</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Document Status</span>
              <span className="font-medium text-success">Captured</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Signature</span>
              <span className="font-medium text-success">Verified (AI Match)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onVerified}
            className="w-full py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
          >
            Start New Verification
          </button>
        </div>
      </div>
    );
  }

  // Match state (confidence shown)
  if (phase === "match") {
    return (
      <div className="flex flex-col items-center px-4">
        <div className="bg-card rounded-xl p-8 shadow-sm border border-border max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Signature Match</h3>
          <p className="text-muted-foreground mb-6">
            Confidence Score: <span className="font-bold text-success">80%</span>
          </p>

          <div className="bg-muted rounded-lg p-4 space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Curve Similarity</span>
              <span className="font-semibold text-foreground">92%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pressure Points</span>
              <span className="font-semibold text-foreground">88%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Speed Consistency</span>
              <span className="font-semibold text-foreground">85%</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPhase("complete")}
            className="w-full py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
          >
            Continue to Completion
          </button>
        </div>
      </div>
    );
  }

  // Verifying in progress
  if (phase === "verifying") {
    return (
      <div className="flex flex-col items-center px-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">Signature Verification</h2>
        <p className="text-muted-foreground mb-6">
          A verification link has been sent to the customer's email.
        </p>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4">
            <Fingerprint className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Verifying Signature</h3>
          <p className="text-sm text-primary mb-6">AI is analyzing biometric features...</p>

          <div className="space-y-4 text-left">
            {verificationSteps.map((step, i) => {
              const done = i < activeVerStep;
              const active = i === activeVerStep;
              const Icon = step.icon;
              return (
                <div key={`${i}-${step.label}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-sm text-foreground">{step.label}</span>
                  </div>

                  {done ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : active ? (
                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Waiting for verification (default)
  return (
    <div className="flex flex-col items-center px-4">
      <h2 className="text-2xl font-bold text-foreground mb-2">Signature Verification</h2>
      <p className="text-muted-foreground mb-6">
        A verification link has been sent to the customer's email.
      </p>

      <div className="border border-border rounded-xl p-6 max-w-lg w-full text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
            <Mail className="w-3 h-3 text-destructive-foreground" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-foreground mb-3">Check Mobile Device</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Please ask the customer to check their Gmail and press{" "}
          <strong className="text-foreground">"Yes"</strong> on the verification link provided to
          complete the signature process.
        </p>

        <button
          type="button"
          onClick={handleCheckVerified}
          className={`w-full flex items-center justify-between px-6 py-3 rounded-full border transition-colors ${
            sigVerified ? "border-primary bg-accent" : "border-border bg-muted hover:border-primary"
          }`}
          aria-pressed={sigVerified}
        >
          <span className="text-sm font-medium text-foreground">Signature Verified</span>
          <div
            className={`w-5 h-5 rounded-full border-2 transition-colors ${
              sigVerified ? "bg-primary border-primary" : "border-muted-foreground"
            }`}
          />
        </button>

        <p className="text-xs text-primary mt-3">Confirm verification to proceed to completion</p>
      </div>
    </div>
  );
}

SignatureVerification.propTypes = {
  onVerified: PropTypes.func,
  customerName: PropTypes.string,
};

export default SignatureVerification;
