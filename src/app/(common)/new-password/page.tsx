"use client";
import Form from "@/components/reuseble/from";
import { FromInput } from "@/components/reuseble/from-input";
import { newPasswordSchema } from "@/components/schema";
import { Button } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { BackBtn2 } from "@/components/reuseble/back-btn";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import bgImg from "@/assets/bg2.png";
import Image from "next/image";
import { toast } from "sonner";
import { Suspense } from "react";

function NewPasswordChild() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const from = useForm({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      new_password: "",
      c_password: "",
    },
  });

  const handleSubmit = async (values: FieldValues) => {
    const data = {
      ...values,
      email,
    };
    const res = await resetPassword(data).unwrap();
    if (res.success) {
      toast.success("Password updated successfully", {
        description: "Please login with your new password.",
      });
      router.push("/");
      from.reset();
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
          <h1 className="text-center text-2xl font-medium">
            Set a new password
          </h1>
          <h1 className="text-center max-w-xs mx-auto text-secondery-figma">
            Create a new password. Ensure that its different from previous one.
          </h1>
          <div className="pt-20">
            <Form from={from} className="space-y-7" onSubmit={handleSubmit}>
              <FromInput
                name="new_password"
                label="Password"
                placeholder="Enter your password"
                stylelabel="bg-input-bg"
                eye={true}
                type="password"
              />
              <FromInput
                name="c_password"
                label="Confirm Password"
                placeholder="Enter your confirm password"
                stylelabel="bg-input-bg"
                eye={true}
                type="password"
              />

              <div className="flex justify-center">
                <Button
                  disabled={isLoading}
                  size={"lg"}
                  className="!px-10"
                  variant="primary"
                >
                  Update password
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PasswordParent() {
  return (
    <Suspense>
      <NewPasswordChild />
    </Suspense>
  );
}
