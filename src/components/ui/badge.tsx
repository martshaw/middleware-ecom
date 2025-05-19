import * as React from "react";
import { cn } from "./utils";

const colorClasses = {
  default: "bg-gray-200 text-gray-800",
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  orange: "bg-orange-100 text-orange-800",
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
};

type BadgeProps = {
  className?: string;
  color?: keyof typeof colorClasses;
  children: React.ReactNode;
  key?: string | number;
};

const Badge = React.forwardRef<HTMLSpanElement, Omit<BadgeProps, "ref">>(
  ({ className, color = "default", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mr-2",
          colorClasses[color as keyof typeof colorClasses] || colorClasses.default,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
