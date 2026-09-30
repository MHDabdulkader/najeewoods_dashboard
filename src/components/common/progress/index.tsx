import { cn } from "@/lib";
import React from "react";

export default function ProgressBox({ progress, className }: { progress: number; className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <div>
        <div className="bg-card-figma relative h-3 mb-2.5 rounded-full w-full">
          <div
            className="bgOne h-3 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
          <span className="text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
