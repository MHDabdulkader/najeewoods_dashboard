"use client";
import { childrenProps } from "@/types";
import { ConfirmDialogProvider } from "../context/delete-modal";
import { Toaster } from "sonner";
import { Provider as ReduxProvider } from "react-redux";
import { useEffect } from "react";
import { initAuth } from "@/redux/feature/authSlice";
import { store } from "@/redux/store";

export default function Provider({ children }: childrenProps) {
  return (
    <ReduxProvider store={store}>
      <AuthInit />
      <ConfirmDialogProvider>
        {children}
        <Toaster
          toastOptions={{
            style: {
              background: "rgba(29, 29, 29, 0.20)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
              backdropFilter: "blur(48px)",
            },
            classNames: {
              description: "!text-white",
              icon: "!text-green-300",
            },
          }}
          position="top-right"
        />
      </ConfirmDialogProvider>
    </ReduxProvider>
  );
}

//  =========== profiel referch kora =========
function AuthInit() {
  const dispatch = store.dispatch;

  useEffect(() => {
    initAuth(dispatch, store.getState);
  }, [dispatch]);

  return null;
}
