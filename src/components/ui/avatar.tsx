import * as React from "react";
import { cn } from "./utils";
import Image
 from "next/image";
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 10, className }: AvatarProps) {
  return (
    <span className={cn(`inline-block rounded-full bg-gray-200 overflow-hidden w-${size} h-${size}`, className)}>
      {src ? (
        <Image src={src} alt={alt || "Avatar"} className="object-cover w-full h-full" />
      ) : (
        <span className="flex items-center justify-center w-full h-full text-gray-400">?</span>
      )}
    </span>
  );
}
