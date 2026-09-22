// CaptureSignature.jsx
import React from "react";
import PropTypes from "prop-types";
import { Camera } from "lucide-react";

/**
 * CaptureSignature
 * - Plain JS (JSX) version (no TypeScript)
 * - Responsive: container centers and respects aspect ratio; max width applied
 * - Accessibility: button uses type="button", status text uses aria-live
 * - Safe defaults: no-op onCapture and false captured if props not provided
 */

function CaptureSignature({ onCapture = () => {}, captured = false }) {
  return (
    <section className="w-full max-w-xl mx-auto px-4" aria-labelledby="capture-signature-title">
      <h2 id="capture-signature-title" className="text-2xl font-bold text-foreground mb-2">
        Capture Signature
      </h2>
      <p className="text-muted-foreground mb-6">
        Position the document within the frame and capture.
      </p>

      <div className="relative rounded-xl overflow-hidden bg-cashier-dark aspect-video flex items-center justify-center">
        {/* Corner brackets */}
        <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-primary rounded-tl-md" />
        <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-primary rounded-tr-md" />
        <div className="absolute bottom-12 left-6 w-12 h-12 border-b-2 border-l-2 border-primary rounded-bl-md" />
        <div className="absolute bottom-12 right-6 w-12 h-12 border-b-2 border-r-2 border-primary rounded-br-md" />

        {/* Center content: icon or captured message */}
        {captured ? (
          <p
            className="text-primary-foreground text-lg font-medium flex items-center gap-2"
            role="status"
            aria-live="polite"
          >
            <span>Photo Captured</span>
            <span aria-hidden="true">✓</span>
          </p>
        ) : (
          <Camera className="w-16 h-16 text-primary-foreground/40" aria-hidden="true" />
        )}

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-foreground/60 py-2 text-center">
          <span className="text-primary-foreground text-xs">Camera Active - Simulation Mode</span>
        </div>
      </div>

      {/* Capture button (hidden if already captured) */}
      {!captured && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={onCapture}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            aria-label="Capture signature photo"
          >
            <Camera className="w-5 h-5" />
            <span>Capture Photo</span>
          </button>
        </div>
      )}
    </section>
  );
}

CaptureSignature.propTypes = {
  onCapture: PropTypes.func,
  captured: PropTypes.bool,
};

export default CaptureSignature;
