import React from "react";
import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="h-[calc(100vh-300px)] !bg-background w-screen flex flex-col items-center justify-center">
      <Loader className="h-6 w-6 text-[#ce819a] animate-spin" />
    </div>
  );
}
