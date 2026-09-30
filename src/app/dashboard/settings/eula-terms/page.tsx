"use client";

import {
  useGetAboutQuery,
  useStoreAboutMutation,
} from "@/redux/api/settingApi";
import { useEffect, useState } from "react";

import ShadowBox from "@/components/common/shadow-box";
import TextEditor from "@/components/reuseble/text-editor";
import WapperBox from "@/components/reuseble/wapper-box";
import { Button } from "@/components/ui";
import { toast } from "sonner";

export default function Terms() {
  const [content, setContent] = useState<string>("");
  const { data: about } = useGetAboutQuery({
    type: "eula",
  });
  const [storeAbout, { isLoading }] = useStoreAboutMutation();

  useEffect(() => {
    if (about?.data?.type == "eula") {
      setContent(about?.data?.content);
    }
  }, [about]);

  async function handleSubmit() {
    const values = {
      type: "eula",
      content: content,
    };
    const res = await storeAbout(values).unwrap();
    if (res.success) {
      toast.success("Update Successful", {
        description: "Terms updated successfully.",
        position: "bottom-right",
      });
    }
  }
  return (
    <div>
      <ShadowBox>
        <div className="flex flex-col  lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl font-semibold"> EULA Terms</h1>
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
          <TextEditor value={content} onChange={setContent} />
        </div>
      </WapperBox>
    </div>
  );
}
