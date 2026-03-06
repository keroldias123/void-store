"use client"
import React, { useState, useRef, useEffect } from "react";

export interface AutocompleteOption {
  label: string;
  value: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value: AutocompleteOption | null) => void;
  placeholder?: string;
  emptyMessage?: string;
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Pesquisar...",
  emptyMessage = "Sem resultados",
}: AutocompleteProps) {
  const [query, setQuery] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  function select(option: AutocompleteOption) {
    setQuery(option.label);
    setOpen(false);
    onChange?.(option);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[highlight];
      if (item) select(item);
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
    {/* SEARCH INPUT */}
    <div className="relative">
      {/* lupa */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-4.35-4.35m1.6-5.65a7.25 7.25 0 1 1-14.5 0 7.25 7.25 0 0 1 14.5 0Z"
        />
      </svg>
  
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        className="
          w-full
          rounded-l
          border border-gray-200
          bg-white
          pl-9 pr-3 py-2.5
          text-sm
          outline-none
          transition
          focus:border-primary
          focus:ring-2
          focus:ring-primary/20
          placeholder:text-gray-400
        "
      />
    </div>
  
    {/* DROPDOWN */}
    {open && (
      <div className="
        absolute z-50 mt-2 w-full
        rounded-l
        border border-gray-200
        bg-white
        overflow-hidden
      ">
        {filtered.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-500">
            {emptyMessage}
          </div>
        )}
  
        {filtered.map((opt, i) => (
          <div
            key={opt.value}
            onMouseEnter={() => setHighlight(i)}
            onMouseDown={() => select(opt)}
            className={`
              px-4 py-2.5
              cursor-pointer
              text-sm
              flex items-center gap-2
              transition-colors
              ${
                i === highlight
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-50"
              }
            `}
          >
            {/* ícone opcional de produto */}
            <div className="h-6 w-6 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-500">
              🛍️
            </div>
  
            {opt.label}
          </div>
        ))}
      </div>
    )}
  </div>
  );
}