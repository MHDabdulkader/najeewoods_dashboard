import RepeatCount from "@/components/reuseble/repeat-count/count";
import { Skeleton } from "@/components/ui";
import { cn } from "@/lib";
import React from "react";

export function MusicSkeleton({className,count=16}:any) {
  return (
    <div className={cn(`flex gap-6 lg:gap-4  2xl:gap-6 flex-wrap`,className)}>
      <RepeatCount count={count}>
        <Skeleton className="w-[200px]  h-[180px]" />
      </RepeatCount>
    </div>
  );
}
