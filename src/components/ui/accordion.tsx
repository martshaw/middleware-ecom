"use client";
import * as React from "react";
import { cn } from "./utils";

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  return (
    <div className={cn("divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white", className)}>
      {items.map((item, idx) => (
        <div key={idx}>
          <button
            className={cn(
              "w-full flex justify-between items-center p-4 text-left font-semibold text-gray-900 focus:outline-none focus:bg-gray-100 transition",
              openIndex === idx ? "bg-gray-50" : ""
            )}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            aria-expanded={openIndex === idx}
          >
            <span>{item.title}</span>
            <span>{openIndex === idx ? "-" : "+"}</span>
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              openIndex === idx ? "max-h-96 p-4 pt-0" : "max-h-0 p-0"
            )}
            style={{}}
          >
            {openIndex === idx && (
              <div className="text-gray-700 text-sm">{item.content}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
