import { cn } from "@/lib";
import { childrenProps } from "@/types";
import React from "react";

interface showProps extends childrenProps {
  className?: string;
}

export default function WapperBox({ className, children }: showProps) {
  return <div className={cn("relative md:-top-21", className)}>{children}</div>;
}
