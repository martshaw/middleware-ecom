import * as React from "react";
import { cn } from "./utils";

interface Tab {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onTabChange: (key: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("flex border-b border-gray-200", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={cn(
            "px-4 py-2 text-sm font-medium transition border-b-2 -mb-px",
            active === tab.key
              ? "border-blue-600 text-blue-700 bg-white"
              : "border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-300"
          )}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
