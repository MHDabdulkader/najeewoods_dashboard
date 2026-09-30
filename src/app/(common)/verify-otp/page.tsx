"use client";
import { Button, Input } from "@/components/ui";
import bgImg from "@/assets/bg2.png";
import Image from "next/image";
import { BackBtn2 } from "@/components/reuseble/back-btn";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  useState,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  Suspense,
} from "react";
import { useOtpVarifyMutation } from "@/redux/api/authApi";
import { toast } from "sonner";

function VarifyOTpChild() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [code, setCode] = useState<string[]>(Array(4).fill(""));
  const [error, setError] = useState<string>("");
  const [isError, setIsError] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const [otpVarify, { isLoading }] = useOtpVarifyMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const { value } = e.target;
    // Allow only single digit numbers
    if (!/^\d?$/.test(value)) return;

    const updated = [...code];
    updated[i] = value;
    setCode(updated);

    // Auto-focus next input
    if (value && i < 4) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, i: number) => {
    // Backspace focuses previous input if current is empty
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 4);
    if (!/^\d{4}$/.test(pastedData)) {
      setError("Please paste a 6-digit number.");
      return;
    }
    setError("");
    setCode(pastedData.split(""));
  };

  const handleVerify = async () => {
    setIsError("");
    try {
      const joinedCode = code.join("");
      if (joinedCode.length < 4) {
        setError("Please enter all 4 digits.");
      } else {
        const value = { email, code: code.join("") };
        const res = await otpVarify(value).unwrap();
        if (res.success) {
            toast.success("OTP Verified Successfully", {
            description: "You can now set a new password",
            });
          setCode([]);
          router.push(`/new-password?email=${email}`);
        }
        // router.push("/new-password");
        setError("");
      }
    } catch (err: any) {
      if (err?.data?.message) {
        setIsError(err?.data?.message);
      }
    }
  };
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="w-11/12 relative lg:w-fit lg:min-w-lg z-50  xl:min-w-xl px-10  py-20 rounded-xl border">
        <Image
          src={bgImg}
          alt="title"
          fill
          className="object-cover z-[-1] rounded-md"
        />
        <div className="z-10 absolute top-3 left-3">
          <BackBtn2 />
        </div>
        <div className="z-10">
          <h1 className="text-center text-2xl font-medium">Verify Code</h1>
          <div className="*:text-center *:text-secondery-figma">
            <h1> We have sent an email to</h1>
            <h1>{email || "Not provided Email"} with a 4 digit code.</h1>
          </div>
          <div className="pt-20">
            <div className="flex justify-center space-x-3 mb-2">
              {code.map((digit, i) => (
                <Input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={handlePaste}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  className="w-12 h-12 text-center text-lg font-medium"
                />
              ))}
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
            {isError && (
              <p className="text-red-500 text-sm text-center mb-4">{isError}</p>
            )}
            <div className="flex justify-center">
              <Button
                size={"lg"}
                className="mt-4 !px-10"
                type="button"
                variant="primary"
                onClick={handleVerify}
                disabled={isLoading}
              >
                Verify
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VarifyOtpParent() {
  return (
    <Suspense>
      <VarifyOTpChild />
    </Suspense>
  );
}
