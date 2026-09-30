"use client";
import ResponsivePagination from "react-responsive-pagination";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

export function Pagination({
  current_page = 1,
  onPageChange,
  total = 10,
  per_page,
  className,
  activeStyle,
  itemStyle,
}: any) {
  const totalCount = Math.ceil(total / per_page);

  if (total <= per_page) return null;

  return (
    <div className={cn("lg:w-[320px] flex justify-end", className)}>
      <ResponsivePagination
        previousLabel={<ChevronsLeft className="size-5" />}
        nextLabel={<ChevronsRight className="size-5" />}
        className="flex flex-row gap-1 w-fit"
        pageItemClassName={cn(
          "h-10 border rounded-full w-10 flex items-center justify-center whitespace-nowrap text-sm font-medium hover:bg-transparent hover:text-white",
          itemStyle
        )}
        pageLinkClassName="h-10 w-10 flex items-center justify-center rounded-full"
        activeItemClassName={cn(
          `bg-transparent border-none text-white bgOne hover:!text-white  hover:bg-transparent rounded-full`,
          activeStyle
        )}
        disabledItemClassName="hover:!bg-transparent"
        current={current_page}
        total={totalCount}
        onPageChange={onPageChange}
      />
    </div>
  );
}
