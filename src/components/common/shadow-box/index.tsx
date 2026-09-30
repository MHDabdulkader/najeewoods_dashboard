"use client";
import { cn } from "@/lib";
import { childrenProps } from "@/types";
import React from "react";

interface showProps extends childrenProps {
  className?: string;
}

export default function ShadowBox({ className, children }: showProps) {

  return (
    <div
      className={cn(
        `bg-[#1D1D1D]/20   p-3  md:p-8 relative md:-top-21 backdrop-blur-2xl border border-white/10 rounded-md`,
        className
      )}
    >
      {children}
    </div>
  );
}
