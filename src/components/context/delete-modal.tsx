"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import React, { createContext, useContext, useState, ReactNode } from "react";

/* =======================
   ✅ Types
======================= */
type ConfirmDialogOptions = Partial<Omit<ConfirmDialogState, "open" | "resolve">>;

interface ConfirmDialogState {
  open: boolean;
  title: string;
  subTitle?: string;
  description: string;
  confirmText: string;
  cancelText: string;
  className?: string;
  titleStyle?: string;
  btnStyle?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  resolve?: (value: boolean) => void;
}

interface ConfirmDialogContextType {
  confirm: (options?: ConfirmDialogOptions) => Promise<boolean>;
}

interface ConfirmDialogProviderProps {
  children: ReactNode;
}

/* =======================
   ✅ Default State
======================= */
const initialDialogState: ConfirmDialogState = {
  open: false,
  title: "Are you sure to delete this video?",
  subTitle: "Delete Provider",
  description: "Users can't find your video anymore.",
  confirmText: "Delete",
  cancelText: "Cancel",
  className: "",
  titleStyle: "",
  btnStyle: "",
  onConfirm: undefined,
  onCancel: undefined,
  resolve: undefined,
};

/* =======================
   ✅ Context
======================= */
const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(
  undefined
);

/* =======================
   ✅ Provider
======================= */
export const ConfirmDialogProvider = ({ children }: ConfirmDialogProviderProps) => {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>(initialDialogState);

  // Main confirm function
  const confirm = (options: ConfirmDialogOptions = {}): Promise<boolean> => {
    const finalState = {
      ...initialDialogState, // fallback to defaults if any field missing
      ...options,            // override with provided options
      open: true,            // open the dialog
    };
    return new Promise((resolve) => {
      setDialogState({ ...finalState, resolve });
    });
  };

  // Handlers
  const handleConfirm = () => {
    dialogState.resolve?.(true);
    dialogState.onConfirm?.();
    closeDialog();
  };

  const handleCancel = () => {
    dialogState.resolve?.(false);
    dialogState.onCancel?.();
    closeDialog();
  };

  // ✅ Close without resetting content (prevents default flashing on exit)
  const closeDialog = () => {
    setDialogState((prev) => ({
      ...prev,
      open: false,        // শুধু বন্ধ করা হবে
      resolve: undefined, // promise cleanup
      onConfirm: undefined,
      onCancel: undefined,
    }));
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      <AlertDialog
        open={dialogState.open}
        onOpenChange={(open) => {
          if (!open) closeDialog(); // শুধু বন্ধ, reset নয়
        }}
      >
        <AlertDialogContent
          className={cn("rounded-xl w-[420px] px-10 py-6", dialogState?.className)}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              {/* Subtitle Header Bar */}
              <div className="h-12 grid place-items-center justify-center absolute top-0 left-0 w-full rounded-t-xl bg-reds-figma text-white">
                {dialogState.subTitle}
              </div>

              {/* Icon + Title */}
              <ul>
                <li className="flex justify-center mb-2 mt-10">
                  <svg
                    width="48"
                    height="60"
                    viewBox="0 0 48 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M47.3334 3.33333H35.6667L32.3334 0H15.6667L12.3334 3.33333H0.666687V10H47.3334M4.00002 53.3333C4.00002 55.1014 4.7024 56.7971 5.95264 58.0474C7.20288 59.2976 8.89858 60 10.6667 60H37.3334C39.1015 60 40.7972 59.2976 42.0474 58.0474C43.2976 56.7971 44 55.1014 44 53.3333V13.3333H4.00002V53.3333Z"
                      fill="#FB5E5E"
                    />
                  </svg>
                </li>

                <li
                  className={cn(
                    "text-center text-reds text-2xl mb-2",
                    dialogState.titleStyle
                  )}
                >
                  {dialogState.title}
                </li>
              </ul>
            </AlertDialogTitle>

            {dialogState.description ? (
              <AlertDialogDescription className="text-center text-secondery-figma">
                {dialogState.description}
              </AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>

          <AlertDialogFooter className="sm:justify-center mt-3">
            <AlertDialogCancel
              onClick={handleCancel}
              className={cn(
                "cursor-pointer bg-[#2D2D2D] hover:bg-[#2D2D2D] border-none hover:text-white rounded-xl py-5 px-8",
                dialogState?.btnStyle
              )}
            >
              {dialogState.cancelText}
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirm}
              className={cn(
                "cursor-pointer bg-reds-figma hover:bg-reds-figma border-none hover:text-white rounded-xl py-5 px-8",
                dialogState?.btnStyle
              )}
            >
              {dialogState.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmDialogContext.Provider>
  );
};

/* =======================
   ✅ Hook
======================= */
export default function useConfirmation(): ConfirmDialogContextType {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error("useConfirmation must be used within a ConfirmDialogProvider");
  }
  return context;
}
