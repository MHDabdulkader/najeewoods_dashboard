"use client";
import ShadowBox from "@/components/common/shadow-box";
import WapperBox from "@/components/reuseble/wapper-box";
import { CircleAlert, EllipsisVertical, Plus, PlusIcon, X } from "lucide-react";
import FavIcon from "@/icon/favIcon";
import { useEffect, useState } from "react";
import Avatars from "@/components/reuseble/avater";
import ModalOne from "@/components/reuseble/modal-one";
import { helpers, userVisibiliy } from "@/lib";
import LikeToggle from "@/components/reuseble/like-toggle";
import useConfirmation from "@/components/context/delete-modal";
import MusicPlayer from "@/components/common/music-player";
import { Button } from "@/components/ui";
import { FieldValues, useForm } from "react-hook-form";
import Form from "@/components/reuseble/from";
import { FromTextArea } from "@/components/reuseble/from-textarea";
import { InputSelectField } from "@/components/reuseble/from-select";
import AudioUpload from "@/components/reuseble/audio-box";
import { zodResolver } from "@hookform/resolvers/zod";
import { musicSchema } from "@/components/schema";
import Modal2 from "@/components/reuseble/modal2";
import { CloseIcon } from "@/components/reuseble/btn-modal";
import {
  useDeletePostMutation,
  useGetPostQuery,
  useStoreMediaMutation,
  useStorePostMutation,
  useUpdateMediaMutation,
  useUpdatePostMutation,
} from "@/redux/api/commonApi";
import { toast } from "sonner";
import { NoItemData } from "@/components/reuseble/table-no-item";
import { Pagination } from "@/components/reuseble/pagination";
import { useGlobalState } from "@/components/hooks";
import { InputSelectMood } from "@/components/reuseble/mood-select";
import FromLocation from "@/components/reuseble/from-location";
import AudioMulUpload from "@/components/reuseble/mutiple-audio";
import { MusicSkeleton } from "@/components/common/skeleton-card";
import ProgressBox from "@/components/common/progress";

const intGlobal: any = {
  isPage: 1,
  isPreview: false,
  isStore: false,
  isUpdate: false,
  isShow: null,
  isDetails: {},
};

export default function Music() {
  const { confirm } = useConfirmation();
  const [audioPreview, setAudioPreview] = useState([]);
  const [global, updateGlobal] = useGlobalState(intGlobal);
  const [progress, setisPreogress] = useState(0);
  const [isActive, setIsActive] = useState("Owned");
  const [isEditItem, setIsEditItem] = useState<any>({});
  const [updateMusicList, setUpdateMusicList] = useState<any[]>([]);
  const [storePost, { isLoading }] = useStorePostMutation();
  const [storeMedia, { isLoading: mediaIsLoading }] = useStoreMediaMutation();
  const [updatePost, { isLoading: updateIsLoading }] = useUpdatePostMutation();
  const [updateMedia, { isLoading: updateMloading }] = useUpdateMediaMutation();
  const [deletePost] = useDeletePostMutation();
  const query = {
    post_type: "audio",
    page: global.isPage,
    get: isActive === "Owned" ? "owned" : "user",
    // limt:"10"
  };
  const { data: music, isLoading: postIsLoading } = useGetPostQuery({
    ...query,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".menu-container")) {
        updateGlobal("isShow", null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [updateGlobal]);

  // == store music ==
  const from = useForm({
    resolver: zodResolver(musicSchema),
    defaultValues: {
      audio: [],
      location: null,
      caption: "",
      mood: "",
      privacy: "",
    },
  });

  const handleSubmit = async (values: FieldValues) => {
    const fromData = helpers.fromData({ audio: values?.audio });
    const mediaRes = await storeMedia({
      data: fromData,
      onUploadProgress: (progressEvent: ProgressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setisPreogress(progress);
        }
      },
    }).unwrap();
    if (mediaRes?.success) {
      const musicIds = mediaRes?.data?.map((item: any) => item?._id);
      const value = {
        post_type: "audio",
        audio: musicIds,
        mood: values.mood,
        location: values?.location,
        captions: values?.caption,
        privacy: values?.privacy,
      };
      const res = await storePost(value).unwrap();
      if (res.success) {
        handleUploadReset();
        toast.success("Music uploaded successfully", {
          description: "Your Music has been uploaded successfully.",
        });
      }
    }
  };

  //  == update music ==
  const fromUpdate = useForm({
    defaultValues: {
      location: null,
      caption: "",
      mood: "",
      privacy: "",
    },
  });

  useEffect(() => {
    if (fromUpdate) {
      fromUpdate.reset({
        caption: isEditItem?.captions,
        mood: isEditItem?.mood?._id,
        privacy: isEditItem?.privacy,
        location: isEditItem?.location,
      });
    }
  }, [isEditItem, fromUpdate]);

  const handleUpdateMusic = async (values: FieldValues) => {
    if (updateMusicList?.length > 0) {
      updateMusicList.map(
        async (item) =>
          await updateMedia({
            id: item?.id,
            data: helpers.fromData({ audio: item?.file }),
            onUploadProgress: (progressEvent: ProgressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setisPreogress(progress);
              }
            },
          })
      );
    }
    const value = {
      post_type: "audio",
      mood: values.mood,
      privacy: values?.privacy,
      location: values?.location,
      captions: values?.caption,
    };
    const id = isEditItem._id;
    const res = await updatePost({ id, data: value }).unwrap();
    if (res.success) {
      handleUpdateReset();
      toast.success("Audio updated successfully", {
        description: "Your audio has been updated successfully.",
      });
    }
  };

  // Handle Delete Music
  const handleDelete = async (id: string) => {
    const con = await confirm({
      title: "You are going to delete this music",
      subTitle: "Delete Music",
      description: `After deleting, ${isActive} won't be able to find this music in your app`,
    });
    if (con) {
      const res = await deletePost(id).unwrap();
      if (res.success && global?.isPreview) {
        updateGlobal("isPreview", false);
      }
    }
  };

  // Reset form after successful upload
  const handleUploadReset = () => {
    from.reset();
    updateGlobal("isStore", false);
    setAudioPreview([]);
  };

  const handleUpdateReset = () => {
    fromUpdate.reset();
    setIsEditItem({});
    setUpdateMusicList([]);
    updateGlobal("isUpdate", false);
  };

  // handleFileSelect
  const handleFileSelect = (files: File[]) => {
    const fileUrls = files.map((file) => URL.createObjectURL(file));
    setAudioPreview((prev) => [...prev, ...fileUrls] as any);
    const currentAudio = from.getValues("audio");
    from.setValue("audio", [...currentAudio, ...files]);
  };

  return (
    <div>
      <ShadowBox>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl font-semibold">Music&apos;s</h1>
            <h1 className="text-base">
              Total music: {music?.meta?.total || 0}
            </h1>
          </div>
          <Button
            onClick={() => updateGlobal("isStore", true)}
            variant="primary"
            size="lg"
          >
            <Plus className="size-5" /> Upload
          </Button>
        </div>
      </ShadowBox>
      <WapperBox>
        <div className="flex items-center space-x-5 border-b-2 my-4">
          {["Owned", "Users"].map((item) => (
            <div
              key={item}
              onClick={() => setIsActive(item)}
              className="cursor-pointer font-medium text-lg"
            >
              <span className="px-6"> {item}</span>
              <div
                className={`${
                  isActive === item ? "bgOne" : "bg-transparent"
                } w-full h-1 rounded-t-md px-5`}
              ></div>
            </div>
          ))}
        </div>
        {isActive == "Owned" ? (
          <div className="pt-4">
            {postIsLoading ? (
              <MusicSkeleton />
            ) : music?.data?.length > 0 ? (
              <div className="flex gap-6 lg:gap-4  2xl:gap-6 flex-wrap">
                {music?.data?.map((item: any, index: any) => (
                  <div key={index}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        updateGlobal("isDetails", item);
                        updateGlobal("isPreview", true);
                      }}
                      className="h-[190px] w-[200px] bg-card-figma rounded-md p-5 flex flex-col justify-between"
                    >
                      <div className="flex justify-between relative items-center menu-container">
                        <FavIcon name="musicBers" />
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            updateGlobal("isShow", index);
                          }}
                          className="border cursor-pointer size-10 grid place-items-center rounded-full"
                        >
                          <EllipsisVertical />
                        </div>
                        {global.isShow === index && (
                          <div className="absolute py-2 w-[100px] space-y-2 blur-bg rounded-md overflow-hidden border top-5 right-3">
                            <h1
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsEditItem(item);
                                updateGlobal("isUpdate", true);
                              }}
                              className="flex items-center px-2 cursor-pointer"
                            >
                              <FavIcon name="edit" className="mr-2" /> Edit
                            </h1>
                            <h2 className="border-b my-1"></h2>
                            <h1
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item._id);
                              }}
                              className="flex items-center px-2 cursor-pointer"
                            >
                              <FavIcon name="delete" className="mr-2" /> Delete
                            </h1>
                          </div>
                        )}
                      </div>

                      <h1 className="text-center text-secondery-figma text-xl font-medium">
                        {item?.audio?.length} Music&apos;s
                      </h1>
                      {/* Progress bar */}
                      <div className="h-5 cursor-pointer flex flex-col items-center justify-center">
                        <div className="bg-secondery-figma relative w-full h-px">
                          <span className="bg-white h-px absolute inset-y-0 left-0"></span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="font-medium flex items-center">
                          <FavIcon name="like" className="mr-1 size-6" />
                          <span className="mt-px">{item?.likes}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoItemData title="No Owned Data Available" />
            )}
          </div>
        ) : (
          // ========= Users ==========
          <div className="pt-4">
            {postIsLoading ? (
              <MusicSkeleton />
            ) : music?.data?.length > 0 ? (
              <div className="flex gap-6 lg:gap-4  2xl:gap-6 flex-wrap">
                {music?.data?.map((item: any, index: any) => (
                  <div key={index}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        updateGlobal("isDetails", item);
                        updateGlobal("isPreview", true);
                      }}
                      className="h-[190px] w-[200px] bg-card-figma rounded-md p-5 flex flex-col justify-between"
                    >
                      <div className="flex justify-center relative items-center menu-container">
                        <FavIcon name="musicBers" />
                      </div>

                      <h1 className="text-center text-secondery-figma text-xl font-medium">
                        {item?.audio?.length} Music&apos;s
                      </h1>
                      {/* Progress bar */}
                      <div className="h-5 cursor-pointer flex flex-col items-center justify-center">
                        <div className="bg-secondery-figma relative w-full h-px">
                          <span className="bg-white h-px absolute inset-y-0 left-0"></span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="font-medium flex items-center">
                          <FavIcon name="like" className="mr-1 size-6" />
                          <span className="mt-px">{item?.likes}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoItemData title="No User Data Available" />
            )}
          </div>
        )}

        {/* Pagination */}
        <ul className="flex flex-wrap justify-end mt-10 lg:mt-20">
          <li className="font-medium">
            <Pagination
              onPageChange={(v: any) => updateGlobal("isPage", v)}
              {...music?.meta}
            />
          </li>
        </ul>
      </WapperBox>

      {/* ================= Upload music ================= */}
      <Modal2
        open={global.isStore}
        setIsOpen={(v) => updateGlobal("isStore", v)}
        title="Upload New Music"
        titleStyle="text-center"
      >
        <CloseIcon className="mt-2 mr-2" onClose={() => handleUploadReset()} />
        <Form from={from} onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              {audioPreview.length > 0 ? (
                <div className="space-y-3">
                  <div className={`mw-full h-fit grid  space-y-3 rounded-md`}>
                    {audioPreview.map((audioUrl: any, index: any) => (
                      <MusicPlayer
                        key={index}
                        audioSource={audioUrl}
                        custom={false}
                      />
                    ))}
                  </div>
                  <AudioMulUpload onFileSelect={handleFileSelect}>
                    <Button
                      size="sm"
                      className="rounded-full"
                      type="button"
                      variant="outline"
                    >
                      {" "}
                      <PlusIcon /> Audio{" "}
                    </Button>
                  </AudioMulUpload>
                </div>
              ) : (
                <AudioMulUpload onFileSelect={handleFileSelect}>
                  <div>
                    <div className="relative block w-fit h-fit p-5 mx-auto border-2 border-dashed rounded-2xl cursor-pointer transition-colors duration-200">
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="relative mb-4">
                          <FavIcon name="upload" />
                        </div>
                        <span className="text-white text-lg font-medium">
                          Upload Multiple Music
                        </span>
                      </div>
                    </div>
                    {from?.formState?.errors?.audio && (
                      <p className="text-red-400 justify-center mt-1 flex items-center gap-1 text-sm">
                        {from?.formState?.errors?.audio?.message as string}
                        <CircleAlert size={14} />
                      </p>
                    )}
                  </div>
                </AudioMulUpload>
              )}
            </div>
            <InputSelectMood
              label="Mood"
              name="mood"
              placeholder="Select hare"
              iconStyle="mt-1"
            />
            <FromLocation label="Location" name="location" />
            <FromTextArea
              label="Caption"
              name="caption"
              placeholder="Enter your Caption"
            />
            <InputSelectField
              items={[
                {
                  label: "Public",
                  value: "public",
                  icon: <FavIcon className="size-[18px]" name="internet" />,
                },
                {
                  label: "Solo",
                  value: "solo",
                  icon: <FavIcon className="size-[18px]" name="lock" />,
                },
              ]}
              label="Visibility"
              name="privacy"
              placeholder="Select hare"
              iconStyle="mr-2"
            />

            <div>
              {mediaIsLoading && (
                <ProgressBox className="mb-1" progress={progress} />
              )}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleUploadReset()}
                  disabled={isLoading || mediaIsLoading}
                  size="lg"
                  type="button"
                  className="bg-modal-figma hover:bg-modal-figma cursor-pointer  rounded-xl w-full"
                >
                  <X className="size-5" />
                  Cancel
                </Button>
                <Button
                  disabled={isLoading || mediaIsLoading}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  {" "}
                  <Plus className="size-5" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Modal2>

      {/* =================Update music ================= */}
      <Modal2
        open={global.isUpdate}
        setIsOpen={(v) => updateGlobal("isUpdate", v)}
        title="Edit music"
        titleStyle="text-center"
      >
        <CloseIcon className="mt-2 mr-2" onClose={() => handleUpdateReset()} />
        <Form from={fromUpdate} onSubmit={handleUpdateMusic}>
          <div className="space-y-5">
            <div className="space-y-3">
              {isEditItem?.audio?.map((item: any, idx: any) => {
                const updatedItem = updateMusicList.find(
                  (music) => music.id === item._id
                );
                return (
                  <div
                    key={idx}
                    className="flex justify-between items-center gap-3"
                  >
                    {updatedItem?.id ? (
                      <MusicPlayer
                        idx={updatedItem.randomId}
                        key={updatedItem.randomId}
                        custom={false}
                        audioSource={updatedItem?.preview}
                      />
                    ) : (
                      <MusicPlayer
                        key={item._id}
                        idx={idx}
                        audioSource={item.url}
                      />
                    )}
                    <AudioUpload
                      onFileSelect={(file) => {
                        const item_object = {
                          id: item._id,
                          randomId: helpers.randomString(),
                          preview: URL.createObjectURL(file),
                          file: file,
                        };
                        setUpdateMusicList((prevList) => {
                          const filteredList = prevList.filter(
                            (i) => i.id !== item_object.id
                          );
                          return [...filteredList, item_object];
                        });
                      }}
                    >
                      <h1 className="size-10 grid rounded-full bg-card-figma/40 place-items-center">
                        <FavIcon className="size-4" name="edit" />
                      </h1>
                    </AudioUpload>
                  </div>
                );
              })}
            </div>

            <InputSelectMood
              label="Mood"
              name="mood"
              placeholder="Select hare"
              iconStyle="mt-1"
            />
            <FromLocation label="Location" name="location" />
            <FromTextArea
              label="Caption"
              name="caption"
              placeholder="Enter your Caption"
            />
            <InputSelectField
              items={[
                {
                  label: "Public",
                  value: "public",
                  icon: <FavIcon className="size-[18px]" name="internet" />,
                },
                {
                  label: "Solo",
                  value: "solo",
                  icon: <FavIcon className="size-[18px]" name="lock" />,
                },
              ]}
              label="Visibility"
              name="privacy"
              placeholder="Select hare"
              iconStyle="mr-2"
            />
            <div>
              {updateMloading && (
                <ProgressBox className="mb-1" progress={progress} />
              )}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleUpdateReset()}
                  size="lg"
                  type="button"
                  className="bg-modal-figma hover:bg-modal-figma cursor-pointer  rounded-xl w-full"
                >
                  <X className="size-5" />
                  Cancel
                </Button>
                <Button
                  disabled={updateIsLoading}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  {" "}
                  <Plus className="size-5" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Modal2>

      {/* ================= Audio Modal ================= */}
      <ModalOne
        open={global.isPreview}
        setIsOpen={(v) => updateGlobal("isPreview", v)}
        className="sm:max-w-xs"
        headerStyle="pt-4 px-4 pb-0"
        profile={
          <>
            <Avatars
              src={helpers.imgSource(global?.isDetails?.user?.avatar?.url)}
              fallback={global?.isDetails?.user?.name}
              alt="profile"
              fallbackStyle="bg-[#cb4ec9]/70 text-white"
            />
            <div className="leading-5">
              <h1 className="flex font-medium items-center">
                {global?.isDetails?.user?.name}
                <span className="ml-2">
                  {" "}
                  {userVisibiliy[global?.isDetails?.privacy] || "public"}
                </span>
              </h1>
              <div className="text-secondery-figma flex  items-center">
                <picture>
                  <img
                    className="size-6 mt-[2px]"
                    src={helpers.imgSource(global?.isDetails?.mood?.icon)}
                    alt="img"
                  />
                </picture>
                <span className="ml-[2px]">
                  {helpers.capitalize(global?.isDetails?.mood?.name)}
                </span>
              </div>
            </div>
          </>
        }
      >
        <div className="space-y-3">
          {global?.isDetails?.audio?.map((item: any, idx: any) => (
            <div key={idx} className="space-y-2">
              <MusicPlayer idx={idx} audioSource={item?.url} />
            </div>
          ))}
          <p className="text-[#FFF]">{global?.isDetails?.captions || "N/A"}</p>
          <div className="mt-4 flex justify-between items-center">
            <LikeToggle likes={global?.isDetails?.likes} />
            <div
              onClick={() => handleDelete(global?.isDetails?._id)}
              className="border cursor-pointer size-10  grid place-items-center rounded-md"
            >
              <FavIcon name="delete" className="size-5" />
            </div>
          </div>
        </div>
      </ModalOne>
    </div>
  );
}
