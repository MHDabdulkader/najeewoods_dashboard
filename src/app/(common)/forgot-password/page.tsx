"use client";
import Form from "@/components/reuseble/from";
import { FromInput } from "@/components/reuseble/from-input";
import { loginSchema } from "@/components/schema";
import { Button } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { BackBtn2 } from "@/components/reuseble/back-btn";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import bgImg from "@/assets/bg2.png";
import Image from "next/image";
import React from "react";

export default function ForgotPassword() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const from = useForm({
    resolver: zodResolver(loginSchema.partial()),
    defaultValues: {
      email: "",
    },
  });

  const handlePasswordSubmit = async (values: FieldValues) => {
    try {
      const res = await forgotPassword(values).unwrap();
      if (res.success) {
        toast.success("Successful", {
          description: "Password reset code sent to your email",
        });
        router.push(`/verify-otp?email=${values.email}`);
        from.reset();
      }
    } catch (err: any) {
      from.setError("email", {
        type: "manual",
        message: err.data?.message,
      });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="w-11/12 relative lg:w-fit lg:min-w-lg z-50  xl:min-w-xl px-10 py-20 lg:py-30 rounded-xl border">
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
          <h1 className="text-center text-2xl font-medium">
            Forgot password ?
          </h1>
          <h1 className="text-center text-secondery-figma">
            Please inter your registered email
          </h1>
          <div className="pt-20">
            <Form
              from={from}
              className="space-y-7"
              onSubmit={handlePasswordSubmit}
            >
              <FromInput
                name="email"
                label="Email"
                placeholder="Enter your email"
                stylelabel="bg-input-bg"
                type="email"
              />

              <div className="flex justify-center">
                <Button
                  disabled={isLoading}
                  size={"lg"}
                  className="!px-10"
                  variant={"primary"}
                >
                  Send code
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
