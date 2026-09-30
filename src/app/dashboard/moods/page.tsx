"use client";
import ShadowBox from "@/components/common/shadow-box";
import WapperBox from "@/components/reuseble/wapper-box";
import { CircleAlert, Plus, X } from "lucide-react";
import useConfirmation from "@/components/context/delete-modal";
import { Button, Skeleton } from "@/components/ui";
import { Deletebtn, Editbtn } from "@/components/reuseble/icon-list";
import { FieldValues, useForm } from "react-hook-form";
import Form from "@/components/reuseble/from";
import { FromInput } from "@/components/reuseble/from-input";
import ImgUpload from "@/components/reuseble/img-upload";
import { ImgBox } from "@/components/reuseble/img-box";
import { moodSchema } from "@/components/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useDeleteMoodsMutation,
  useGetMoodsQuery,
  useStoreMoodsMutation,
  useUpdateMoodsMutation,
} from "@/redux/api/moodsApi";
import { useModalState } from "@/components/hooks/useModalState";
import Modal2 from "@/components/reuseble/modal2";
import { CloseIcon } from "@/components/reuseble/btn-modal";
import RepeatCount from "@/components/reuseble/repeat-count/count";
import { NoItemData } from "@/components/reuseble/table-no-item";
import FavIcon from "@/icon/favIcon";
import { helpers } from "@/lib";
import { useEffect, useState } from "react";
import Image from "next/image";
import FromColorPicker from "@/components/reuseble/from-color";

const intImg = {
  ImgPreview: "",
  UpPreview: "",
};

const intState = {
  isStore: false,
  isUpdate: false,
};

export default function Moods() {
  const { confirm } = useConfirmation();
  const [state, updateState] = useModalState(intState);
  const [isImg, setIsImg] = useState<any>(intImg);
  const [isDetails, setIsDetails] = useState<any>({});
  const [updateMoods, { isLoading: updateLoading }] = useUpdateMoodsMutation();
  const [storeMoods, { isLoading: storeLoading }] = useStoreMoodsMutation();
  const { data: moodsItem, isLoading } = useGetMoodsQuery({});
  const [deleteMoods] = useDeleteMoodsMutation();
  //  == Store Moods ==
  const from = useForm({
    resolver: zodResolver(moodSchema),
    defaultValues: {
      icon: null,
      name: "",
      color: "#FF8787",
    },
  });

  const handleSubmit = async (value: FieldValues) => {
    try {
      const values = helpers.fromData(value);
      const res = await storeMoods(values).unwrap();
      if (res.success) {
        handleStoreReset();
      }
    } catch (err: any) {}
  };

  //  == update Moods ==
  const Updatefrom = useForm({
    defaultValues: {
      icon: null,
      name: "",
      color:""
    },
  });

  useEffect(() => {
    if (isDetails) {
      Updatefrom.reset({
        name: isDetails.name,
        color:isDetails.color
      });
    }
  }, [isDetails, Updatefrom]);

  const updateSubmit = async (values: FieldValues) => {
    const value = {
      ...values,
      ...(values.icon && { icon: values.icon }),
    };
    const id = isDetails._id;
    const data = helpers.fromData(value);
    const res = await updateMoods({ id, data }).unwrap();
    if (res.success) {
      hanldeUpdateReset();
    }
  };

  //  handleDelete
  const handleDelete = async (id: string) => {
    const con = await confirm({
      title: "You are going to delete this mood",
      subTitle: "Delete mood",
      description:
        "After deleting, users wont be able to find this mood in your app",
    });
    if (con) {
      await deleteMoods(id).unwrap();
    }
  };

  //  == Reset from ==
  const handleStoreReset = () => {
    updateState("isStore", false);
    from.reset();
    setIsImg(intImg);
  };

  const hanldeUpdateReset = () => {
    updateState("isUpdate", false);
    Updatefrom.reset();
    setIsImg(intImg);
    setIsDetails({});
  };

  return (
    <div>
      <ShadowBox>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl font-semibold">Moods</h1>
            <h1 className="text-base">
              Total Moods: {moodsItem?.data?.length || 0}
            </h1>
          </div>
          <Button
            onClick={() => updateState("isStore", true)}
            variant="primary"
            size="lg"
          >
            <Plus className="size-5" /> Add New Mood
          </Button>
        </div>
      </ShadowBox>
      <WapperBox>
        <div className="pt-4 flex gap-6 lg:gap-4  2xl:gap-6 flex-wrap">
          {isLoading ? (
            <RepeatCount count={16}>
              <Skeleton className="w-[200px]  h-[180px]" />
            </RepeatCount>
          ) : moodsItem?.data?.length > 0 ? (
            moodsItem?.data?.map((item: any, index: any) => (
              <div
                className="border h-fit w-[200px]  bg-card-figma rounded-xl p-5 flex flex-col justify-between"
                key={index}
              >
                <div className="mx-auto">
                  <Image
                    src={helpers.imgSource(item?.icon) || "/blur.png"}
                    alt="img"
                    width={60}
                    height={20}
                  />
                </div>
                <div className="text-center text-white text-lg  mt-1 mb-2 font-medium">
                  {item.name}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>
                    <Editbtn
                      onClick={() => {
                        setIsDetails(item);
                        setIsImg((prevState: any) => ({
                          ...prevState,
                          UpPreview: helpers.imgSource(item?.icon),
                        }));
                        updateState("isUpdate", true);
                      }}
                      className="border-1"
                    />
                  </span>
                  <span>
                    <Deletebtn
                      onClick={() => handleDelete(item._id)}
                      className="border-1"
                    />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <NoItemData className="w-full" title="No mood data available" />
          )}
        </div>
      </WapperBox>
      {/* ================= Create New Mood ================ */}
      <Modal2
        open={state.isStore}
        setIsOpen={(v) => updateState("isStore", v)}
        title="Create New Mood"
        titleStyle="text-center"
      >
        <CloseIcon onClose={() => handleStoreReset()} />
        <Form from={from} onSubmit={handleSubmit}>
          <div className="space-y-4">
            <ImgUpload
              onFileSelect={(file: File) => {
                setIsImg({
                  ...isImg,
                  ImgPreview: URL.createObjectURL(file),
                });
                from.setValue("icon", file, { shouldValidate: true });
              }}
            >
              <div>
                {isImg.ImgPreview ? (
                  <div className="mx-auto relative p-2 py-3 w-[170px]  h-fit rounded-md border-2 border-dashed">
                    <ImgBox
                      className="size-20 mx-auto"
                      src={isImg.ImgPreview}
                      alt="img"
                    />
                    <span className="absolute top-1 right-1 border p-[5px] rounded-sm">
                      {" "}
                      <FavIcon name="chnage" />
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="relative block w-fit h-fit p-5 mx-auto border-2 border-dashed rounded-2xl cursor-pointer transition-colors duration-200">
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="relative mb-4">
                          <FavIcon name="upload" />
                        </div>
                        <span className="text-white text-lg font-medium">
                          Upload Mood image
                        </span>
                      </div>
                    </div>
                    {from?.formState?.errors?.icon && (
                      <p className="text-red-400 justify-center mt-1 flex items-center gap-1 text-sm">
                        {from?.formState?.errors?.icon?.message as string}
                        <CircleAlert size={14} />
                      </p>
                    )}
                  </div>
                )}
              </div>
            </ImgUpload>

            <FromInput
              name="name"
              label="Mood name"
              placeholder="Enter Your Mood Name"
            />
            <FromColorPicker label="Color" name="color" />
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleStoreReset()}
                size="lg"
                type="button"
                className="bg-modal-figma hover:bg-modal-figma cursor-pointer  rounded-xl w-full"
              >
                <X className="size-5" />
                Cancel
              </Button>
              <Button
                disabled={storeLoading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {" "}
                <Plus className="size-5" />
                Create
              </Button>
            </div>
          </div>
        </Form>
      </Modal2>
      {/*=============== Edit Mood ====================*/}
      <Modal2
        open={state.isUpdate}
        setIsOpen={(v) => updateState("isUpdate", v)}
        title="Edit Mood"
        titleStyle="text-center"
      >
        <CloseIcon onClose={() => hanldeUpdateReset()} />
        <Form from={Updatefrom} onSubmit={updateSubmit}>
          <div className="space-y-4">
            <ImgUpload
              onFileSelect={(file: File) => {
                setIsImg({
                  ...isImg,
                  UpPreview: URL.createObjectURL(file),
                });
                Updatefrom.setValue("icon", file as any, {
                  shouldValidate: true,
                });
              }}
            >
              <div className="mx-auto relative p-2 py-3 w-[170px]  h-fit rounded-md border-2 border-dashed">
                <ImgBox
                  className="size-20 mx-auto"
                  src={isImg.UpPreview || "/blur.png"}
                  alt="img"
                />
                <span className="absolute top-1 right-1 border p-[5px] rounded-sm">
                  {" "}
                  <FavIcon name="chnage" />
                </span>
              </div>
            </ImgUpload>

            <FromInput name="name" label="Mood Name" />
            <FromColorPicker label="Color" name="color" />
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => hanldeUpdateReset()}
                size="lg"
                type="button"
                className="bg-modal-figma hover:bg-modal-figma cursor-pointer  rounded-xl w-full"
              >
                <X className="size-5" />
                Cancel
              </Button>
              <Button
                disabled={updateLoading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {" "}
                <FavIcon name="save" />
                Save Changes
              </Button>
            </div>
          </div>
        </Form>
      </Modal2>
    </div>
  );
}
