"use client";
import ShadowBox from "@/components/common/shadow-box";
import { BackBtn } from "@/components/reuseble/back-btn";
import WapperBox from "@/components/reuseble/wapper-box";
import FavIcon from "@/icon/favIcon";
import { useState } from "react";
import Avatars from "@/components/reuseble/avater";
import ModalOne from "@/components/reuseble/modal-one";
import { helpers,userVisibiliy } from "@/lib";
import LikeToggle from "@/components/reuseble/like-toggle";
import useConfirmation from "@/components/context/delete-modal";
import MusicPlayer from "@/components/common/music-player";
import { useDeletePostMutation } from "@/redux/api/commonApi";
import { useGetPostIdQuery } from "@/redux/api/userApi";
import { useParams } from "next/navigation";
import { NoItemData } from "@/components/reuseble/table-no-item";
import RepeatCount from "@/components/reuseble/repeat-count/count";
import { Skeleton } from "@/components/ui";
import { Pagination } from "@/components/reuseble/pagination";

export default function MusicPosted() {
  const { id } = useParams();
  const { confirm } = useConfirmation();
  const [isPreview, setIsPreview] = useState(false);
  const [isPage, setIsPage] = useState(1);
  const [isDetails, setIsDetails] = useState<any>({});
  const [deletePost] = useDeletePostMutation();
  const { data: music, isLoading } = useGetPostIdQuery({
    id,
    arg: {
      post_type: "audio",
      page: isPage,
      limit: 16,
    },
  });

  const handleDelete = async (id: string) => {
    const con = await confirm({
      title: "You are going to delete this Music",
      subTitle: "Delete Music",
      description:
        "After deleting, users wont be able to find this music in your app",
    });
    if (con) {
      const res = await deletePost(id).unwrap();
      if (res.success) {
        setIsPreview(false);
      }
    }
  };

  return (
    <div>
      <ShadowBox>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div className="flex gap-2">
            <BackBtn />
            <div>
              <h1 className="text-2xl font-semibold">
                {music?.data[0]?.user?.name || "N/A"}
              </h1>
              <h1 className="text-base">
                {" "}
                {music?.meta?.total || 0} Music Posted
              </h1>
            </div>
          </div>
        </div>
      </ShadowBox>
      <WapperBox>
        <div className="pt-4 flex gap-6 lg:gap-4  2xl:gap-6 flex-wrap">
          {isLoading ? (
            <RepeatCount count={20}>
              <Skeleton className="w-[200px]  h-[180px]" />
            </RepeatCount>
          ) : music?.data?.length > 0 ? (
            music?.data?.map((item: any, idx: any) => (
              <div key={idx}>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPreview(true);
                    setIsDetails(item);
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
            ))
          ) : (
            <NoItemData className="w-full" title="No Music data available" />
          )}
        </div>
        <ul className="flex flex-wrap justify-end mt-20">
          <li className="font-medium">
            <Pagination
              onPageChange={(v: any) => setIsPage(v)}
              {...music?.meta}
            ></Pagination>
          </li>
        </ul>
      </WapperBox>
      {/* ================= Audio Modal ================= */}
      <ModalOne
        open={isPreview}
        setIsOpen={setIsPreview}
        className="sm:max-w-xs"
        headerStyle="pt-4 px-4 pb-0"
        profile={
          <>
            <Avatars
              src={helpers.imgSource(isDetails?.user?.avatar)}
              fallback={isDetails?.user?.name}
              alt="profile"
              fallbackStyle="bg-[#cb4ec9]/70 text-white"
            />
            <div className="leading-5">
              <h1 className="flex font-medium items-center">
                {isDetails?.user?.name}
                <span className="ml-2">
                  {" "}
                  {userVisibiliy[isDetails?.privacy] || "public"}
                </span>
              </h1>
              <div className="text-secondery-figma flex  items-center">
                <picture>
                  <img
                    className="size-6 mt-[2px]"
                    src={helpers.imgSource(isDetails?.mood?.icon)}
                    alt="img"
                  />
                </picture>
                <span className="ml-[2px]">
                  {helpers.capitalize(isDetails?.mood?.name)}
                </span>
              </div>
            </div>
          </>
        }
      >
        <div className="space-y-3">
          {isDetails?.audio?.map((item: any, idx: any) => (
            <div key={idx} className="space-y-2">
              <MusicPlayer idx={idx} audioSource={item?.url} />
            </div>
          ))}
          <p className="text-[#FFF]">{isDetails?.captions || "N/A"}</p>
          <div className="mt-4 flex justify-between items-center">
            <LikeToggle likes={isDetails?.likes} />
            <div
              onClick={() => handleDelete(isDetails?._id)}
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
