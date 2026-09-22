// SelectCustomer.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { User, Search } from "lucide-react";

const customers = [
  "John Smith",
  "Jane Doe",
  "Mike Johnson",
  "Sarah Williams",
  "David Brown",
  "Emily Davis",
  "Robert Wilson",
  "Jennifer Taylor",
];

function SelectCustomer({ onSelect = () => { }, selectedCustomer = "" }) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) =>
    c.toLowerCase().includes(search.trim().toLowerCase())
  );
  return (
    <section className="w-full max-w-xl mx-auto px-4" aria-labelledby="select-customer-heading">
      <h2 id="select-customer-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        Select Customer
      </h2>
      <p className="text-muted-foreground mb-6">
        Search for the customer to verify identity.
      </p>

      <div className="relative mb-4">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          inputMode="search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search customers"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
      </div>

      <div
        className="border border-border rounded-lg divide-y divide-border max-h-[400px] overflow-y-auto"
        role="list"
        aria-label="Customer results"
      >
        {filtered.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No customers found.</div>
        ) : (
          filtered.map((customer, idx) => (
            <button
              key={`${customer.name}-${idx}`}
              type="button"
              onClick={() => onSelect(customer.name)}
              className={`w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-accent transition-colors ${selectedCustomer === customer.name ? "bg-accent" : ""
                }`}
              role="listitem"
              aria-pressed={selectedCustomer === customer.name}
            >
              {/* Avatar Container */}
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                {customer.image ? (
                  <img
                    src={customer.image}
                    alt={customer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                )}
              </div>

              <span className="text-sm font-medium text-foreground">{customer.name}</span>
            </button>
          ))
        )}
      </div>
    </section>
  );
}

SelectCustomer.propTypes = {
  onSelect: PropTypes.func,
  selectedCustomer: PropTypes.string,
};

export default SelectCustomer;
