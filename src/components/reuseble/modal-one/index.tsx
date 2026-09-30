import {
  Dialog1,
  DialogContent1,
  DialogDescription1,
  DialogHeader1,
  DialogTitle1,
  DialogTrigger1,
} from "@/components/ui/dialog1";
import { cn } from "@/lib";
import React from "react";

interface ModalProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  profile?: any;
  headerStyle?: string;
}

export default function ModalOne({
  profile,
  open,
  setIsOpen,
  children,
  className,
  headerStyle,
}: ModalProps) {
  return (
    <Dialog1 open={open} onOpenChange={setIsOpen}>
      <DialogTrigger1 asChild />
      <DialogContent1
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className={cn(
          `sm:max-w-md p-0 gap-0 bg-[#121212]/20 backdrop-blur-3xl rounded-2xl overflow-y-auto   max-h-[95vh] h-fit scrollbar-hide border-[1px]`,
          className
        )}
      >
        <DialogHeader1 className={cn("text-white p-4", headerStyle)}>
          <div className="flex items-center space-x-2">{profile}</div>
          <DialogTitle1
            className={"text-white hidden font-medium"}
          ></DialogTitle1>
        </DialogHeader1>
        <DialogDescription1 className="hidden"></DialogDescription1>
        <div className="p-4">{children}</div>
      </DialogContent1>
    </Dialog1>
  );
}
