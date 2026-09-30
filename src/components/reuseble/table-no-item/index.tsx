import React from "react";
import { TableCell, TableRow } from "@/components/ui";
import { cn } from "@/lib/utils";


interface itemProps {
  title?: string;
  colSpan: number;
  className?: string;
  tdStyle?: string;
}

export function TableNoItem({
  title = "No Data Found",
  colSpan,
  className,
  tdStyle,
}: itemProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className={cn("text-center", tdStyle)}>
        <div className={cn("py-24 2xl:py-40 text-center", className)}>
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="53"
              height="42"
              viewBox="0 0 53 42"
              fill="none"
            >
              <path
                d="M48.7919 7.34737C48.4976 6.19237 47.0547 5.25 45.5828 5.25H27.5105C26.0412 5.25 23.983 4.41525 22.9434 3.39412L21.3626 1.85062C20.323 0.8295 18.2675 0 16.7982 0H8.16517C6.69319 0 5.35647 1.17337 5.19468 2.60925L4.42023 10.5H49.325L48.7919 7.34737ZM51.4627 13.125H1.53727C1.32304 13.1251 1.11121 13.1696 0.915336 13.2554C0.719463 13.3413 0.54387 13.4667 0.399804 13.6236C0.255739 13.7805 0.146377 13.9655 0.0787234 14.1667C0.0110702 14.3679 -0.0133823 14.5808 0.00693216 14.7919L2.45494 40.173C2.5037 40.6729 2.73878 41.137 3.11435 41.4747C3.48992 41.8125 3.97909 41.9997 4.48654 42H48.5135C49.0209 41.9997 49.5101 41.8125 49.8857 41.4747C50.2612 41.137 50.4963 40.6729 50.5451 40.173L52.9931 14.7919C53.0134 14.5808 52.9889 14.3679 52.9213 14.1667C52.8536 13.9655 52.7443 13.7805 52.6002 13.6236C52.4561 13.4667 52.2805 13.3413 52.0847 13.2554C51.8888 13.1696 51.677 13.1251 51.4627 13.125Z"
                fill="#99a1af"
              />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mt-5">{title}</h3>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function NoItemData({ title = "No Data Found", className }: any) {
  return (
    <div
      className={cn(
        "py-24 2xl:py-40 text-center flex flex-col justify-center",
        className
      )}
    >
      <div className="flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="53"
          height="42"
          viewBox="0 0 53 42"
          fill="none"
        >
          <path
            d="M48.7919 7.34737C48.4976 6.19237 47.0547 5.25 45.5828 5.25H27.5105C26.0412 5.25 23.983 4.41525 22.9434 3.39412L21.3626 1.85062C20.323 0.8295 18.2675 0 16.7982 0H8.16517C6.69319 0 5.35647 1.17337 5.19468 2.60925L4.42023 10.5H49.325L48.7919 7.34737ZM51.4627 13.125H1.53727C1.32304 13.1251 1.11121 13.1696 0.915336 13.2554C0.719463 13.3413 0.54387 13.4667 0.399804 13.6236C0.255739 13.7805 0.146377 13.9655 0.0787234 14.1667C0.0110702 14.3679 -0.0133823 14.5808 0.00693216 14.7919L2.45494 40.173C2.5037 40.6729 2.73878 41.137 3.11435 41.4747C3.48992 41.8125 3.97909 41.9997 4.48654 42H48.5135C49.0209 41.9997 49.5101 41.8125 49.8857 41.4747C50.2612 41.137 50.4963 40.6729 50.5451 40.173L52.9931 14.7919C53.0134 14.5808 52.9889 14.3679 52.9213 14.1667C52.8536 13.9655 52.7443 13.7805 52.6002 13.6236C52.4561 13.4667 52.2805 13.3413 52.0847 13.2554C51.8888 13.1696 51.677 13.1251 51.4627 13.125Z"
            fill="#99a1af"
          />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-gray-400 mt-5">{title}</h3>
    </div>
  );
}
