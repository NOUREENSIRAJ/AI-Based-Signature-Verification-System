// SelectDocumentType.jsx
import React from "react";
import PropTypes from "prop-types";
import { Car, Home, Heart, GraduationCap } from "lucide-react";

const docTypes = [
  {
    name: "Verify Cheque",
    desc: "Verify driver's license details",
    icon: Car,
    color: "bg-success-light text-success",
  },
  {
    name: "Verify Cheque",
    desc: "Verify residence permit details",
    icon: Home,
    color: "bg-[hsl(30,100%,93%)] text-[hsl(30,80%,50%)]",
  },
  {
    name: "Verify Cheque",
    desc: "Verify health insurance details",
    icon: Heart,
    color: "bg-[hsl(340,80%,93%)] text-[hsl(340,70%,55%)]",
  },
  {
    name: "Verify Cheque",
    desc: "Verify student id details",
    icon: GraduationCap,
    color: "bg-[hsl(250,60%,93%)] text-[hsl(250,50%,55%)]",
  },
];

function SelectDocumentType({ onSelect = () => {}, selectedType = "" }) {
  return (
    <section className="w-full max-w-4xl mx-auto px-4" aria-labelledby="select-doc-type-heading">
      <h2 id="select-doc-type-heading" className="text-2xl font-bold text-foreground mb-2">
        Select Document Type
      </h2>
      <p className="text-muted-foreground mb-8">
        Choose the type of document provided by the customer.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list" aria-label="Document types">
        {docTypes.map((doc, i) => {
          const Icon = doc.icon;
          const isSelected = selectedType === doc.desc;

          return (
            <button
              key={`${doc.desc}-${i}`}
              type="button"
              onClick={() => onSelect(doc.desc)}
              className={`p-6 rounded-lg border text-left transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                isSelected ? "border-primary bg-accent" : "border-border bg-card"
              }`}
              role="listitem"
              aria-pressed={isSelected}
            >
              <div className={`w-10 h-10 rounded-lg ${doc.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>

              <h3 className="font-semibold text-foreground text-sm">{doc.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{doc.desc}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

SelectDocumentType.propTypes = {
  onSelect: PropTypes.func,
  selectedType: PropTypes.string,
};

export default SelectDocumentType;
