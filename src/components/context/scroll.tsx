import { createContext, useContext, useState } from "react";

/* =======================
   ✅ Provider
======================= */
const ScrollContext = createContext<any>(null); // Create the context

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [isScroll, setIsScroll] = useState<string>("");

  return (
    <ScrollContext.Provider value={{ isScroll, setIsScroll }}>
      {children}
    </ScrollContext.Provider>
  );
};

/* =======================
   ✅ Hook
======================= */
export default function useScroll() {
  const context = useContext(ScrollContext); // Use the correct context

  if (!context) {
    throw new Error("useScroll must be used within aScrollProvider");
  }

  return context;
}
