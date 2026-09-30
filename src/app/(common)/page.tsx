"use client";
import Form from "@/components/reuseble/from";
import { FromInput } from "@/components/reuseble/from-input";
import { loginSchema } from "@/components/schema";
import { Button, Checkbox, Label } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { authApi, useLoginInMutation } from "@/redux/api/authApi";
import { authKey, helpers, ResponseApiErrors } from "@/lib";
import { redirect, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import bgImg from "@/assets/bg.png";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import React, { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/feature/authSlice";

export default function RootPage() {
  const router = useRouter();
  const [LoginIn, { isLoading }] = useLoginInMutation();
  const token = helpers.getAuthCookie(authKey) || "";
  const decoded: any = token ? jwtDecode(token) : null;
  const isAdmin = decoded?.user?.role == "admin";
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isAdmin) {
      return redirect("/dashboard");
    }
  }, [isAdmin]);

  const from = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: FieldValues) => {
    try {
      const res = await LoginIn(values).unwrap();
      if (res.success) {
        helpers.setAuthCookie(authKey, res?.data?.token);
        dispatch(setUser({ token: res?.data?.token }));
        if(helpers.getAuthCookie(authKey)){
          dispatch(
          authApi.endpoints.getProfile.initiate(undefined, {
            forceRefetch: true,
          })
        );
        }
        const decode = helpers.decodeToken(res?.data?.token || "");
        if (decode?.user?.role === "admin") {
          router.push("/dashboard");
          from.reset();
          toast.success("Login Successful", {
            description: "Welcome back! You have been logged in successfully.",
          });
        } else {
          toast.error("Access Restricted — Super Admins Only", {
            description: "Use valid credentials to continue",
          });
        }
      }
    } catch (err: any) {
      ResponseApiErrors(from, err);
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
        <div className="z-10">
          <h1 className="text-center text-2xl font-medium">
            Login to your account
          </h1>
          <h1 className="text-center  text-secondery-figma">
            Please enter your email & password to continue
          </h1>
          <div className="pt-20">
            <Form from={from} className="space-y-7" onSubmit={handleSubmit}>
              <FromInput
                name="email"
                label="Email"
                placeholder="Enter your email"
                stylelabel="bg-input-bg"
                type="email"
              />
              <div>
                <FromInput
                  eye={true}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  stylelabel="bg-input-bg"
                  type="password"
                />
                <div className="flex items-center mt-3 justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox className="" id="remember-me" />
                    <Label htmlFor="remember-me">Remember me</Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-[#EC7C5C] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  disabled={isLoading}
                  size="lg"
                  className="!px-10"
                  variant="primary"
                >
                  Sign In
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
