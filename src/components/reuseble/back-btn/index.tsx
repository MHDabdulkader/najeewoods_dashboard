"use client";
import { cn } from "@/lib";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackBtn({className}:any) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.back()}
      className={cn(`size-10 2xl:size-11 cursor-pointer bg-white/20 rounded-full grid place-items-center`,className)}
    >
      <ArrowLeft />
    </div>
  );
}

// BackBtn2
export function BackBtn2({className}:any) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.back()}
      className={cn(`cursor-pointer border h-10 px-2 rounded-md grid place-items-center`,className)}
    >
      <span className="flex gap-x-2"> <ArrowLeft /> Back</span>
    </div>
  );
}
