"use client";
import Form from "@/components/reuseble/from";
import { FromInput } from "@/components/reuseble/from-input";
import { FromTextArea } from "@/components/reuseble/from-textarea";
import { supportSchema } from "@/components/schema";
import { Button } from "@/components/ui";
import { useSupportStoreMutation } from "@/redux/api/supportApi";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SupportBox() {
  const [supportStore, { isLoading }] = useSupportStoreMutation();
  const from = useForm({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });
  const handleSubmit = async (value: FieldValues) => {
    try {
      const data = {
        fullName: value.name,
        email: value.email,
        content: value.message,
      };
      const res = await supportStore(data);
      if (res.data?.status) {
        from.reset();
        toast.success("Your support request has been sent successfully", {
          description: "Please check your email in a few hours for a response.",
        });
      }
    } catch (err: any) {}
  };
  return (
    <div className="w-11/12 lg:max-w-6xl rounded-md border p-5 lg:p-10 mx-auto">
      <Form from={from} onSubmit={handleSubmit} className="pt-5 lg:pt-1">
        <div className="space-y-6">
          <FromInput
            name="name"
            label="Name"
            placeholder="Enter Your  Name"
            stylelabel="bg-background"
          />

          <FromInput
            name="email"
            label="Email"
            placeholder="Enter Your  Email"
            stylelabel="bg-background"
          />
          {/* <FromInput
            name="subject"
            label="Subject"
            placeholder="Enter Your  Subject"
            stylelabel="bg-background"
          /> */}
          <FromTextArea
            name="message"
            label="Message"
            placeholder="Enter Your  Message"
            stylelabel="bg-background"
            className="min-h-40"
          />

          <div className="flex justify-end">
            <Button disabled={isLoading} variant="primary" size="lg">
              {isLoading ? "Sending...." : "Send"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
