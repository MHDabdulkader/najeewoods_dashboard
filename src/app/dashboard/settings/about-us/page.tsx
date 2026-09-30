"use client";
import ShadowBox from "@/components/common/shadow-box";
import TextEditor from "@/components/reuseble/text-editor";
import WapperBox from "@/components/reuseble/wapper-box";
import { Button } from "@/components/ui";
import {
  useGetAboutQuery,
  useStoreAboutMutation,
} from "@/redux/api/settingApi";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AboutUs() {
  const [content, setContent] = useState<string>("");
  const { data: about, isLoading: aboutLoading } = useGetAboutQuery({
    type: "about",
  });
  const [storeAbout, { isLoading }] = useStoreAboutMutation();

  useEffect(() => {
    if (about?.data?.type === "about") {
      setContent(about?.data?.content);
    }
  }, [about]);

  async function handleSubmit() {
    const values = {
      type: "about",
      content: content,
    };
    const res = await storeAbout(values).unwrap();
    if (res.success) {
      toast.success("Update Successful", {
        description: "About Us updated successfully.",
        position: "bottom-right",
      });
    }
  }

  return (
    <div>
      <ShadowBox>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl font-semibold">About us</h1>
          </div>
          <Button
            disabled={isLoading}
            onClick={() => handleSubmit()}
            variant="primary"
            size="lg"
          >
            Save changes
          </Button>
        </div>
      </ShadowBox>
      <WapperBox>
        <div className="mt-5">
          {aboutLoading ? (
            <div className="mx-auto min-h-[280px] flex items-center justify-center">
              <Loader className="animate-spin text-reds" />
            </div>
          ) : (
            <TextEditor value={content} onChange={setContent} />
          )}
        </div>
      </WapperBox>
    </div>
  );
}
