"use client";

import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Oops! The page you are looking for does not exist.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => router.push("/")} variant="primary" size="lg" className="rounded-md">Home</Button>
         <Button
          onClick={() => router.back()}
          variant="destructive"
          size="lg"
          className="rounded-md bg-gray-300 hover:bg-gray-300 cursor-pointer text-black"
        >
          {" "}
          Back
        </Button>
      </div>
    </div>
  );
}
