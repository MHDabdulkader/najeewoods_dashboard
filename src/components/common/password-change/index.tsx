import Form from "@/components/reuseble/from";
import { FromInput } from "@/components/reuseble/from-input";
import { ImgBox } from "@/components/reuseble/img-box";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordChangeSchema } from "@/components/schema";
import { useUpdatePasswordMutation } from "@/redux/api/authApi";
import passImg from "@/assets/pass.png";
import { Button } from "@/components/ui";
import FavIcon from "@/icon/favIcon";
import { toast } from "sonner";
import { useState } from "react";

export default function PasswordChange() {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const [error, setError] = useState("");
  //  password
  const passwordfrom = useForm({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      c_password: "",
    },
  });
  const handlePasswordSubmit = async (values: FieldValues) => {
    setError("");
    try {
      const res = await updatePassword(values).unwrap();
      if (res.success) {
        passwordfrom.reset();
        toast.success("Password Changed Successfully", {
          description: "Your password has been updated successfully",
          position: "bottom-right",
        });
      }
    } catch (err: any) {
      setError(err?.data?.message);
    }
  };
  return (
    <Form
      from={passwordfrom}
      className="space-y-7"
      onSubmit={handlePasswordSubmit}
    >
      <ImgBox
        src={passImg}
        className="w-[300px] h-[140px] mx-auto"
        alt="img1"
      />

      <FromInput
        eye={true}
        name="old_password"
        label="Current password"
        placeholder="Enter your current password"
        stylelabel="bg-background"
      />
      <FromInput
        eye={true}
        name="new_password"
        label="New password"
        placeholder="Enter your new password"
        stylelabel="bg-background"
      />
      <div>
        <FromInput
          eye={true}
          name="c_password"
          label="Confirm new password"
          placeholder="Re-enter your new password"
          stylelabel="bg-background"
        />
        {error && (
          <h1 className="mt-3 text-red-400 text-sm text-center">{error}</h1>
        )}
      </div>
      <div className="flex justify-center">
        <Button disabled={isLoading} variant="primary">
          <FavIcon name="save" />
          Save Change
        </Button>
      </div>
    </Form>
  );
}
