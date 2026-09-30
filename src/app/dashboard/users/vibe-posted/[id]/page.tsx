"use client";
import ShadowBox from "@/components/common/shadow-box";
import { BackBtn } from "@/components/reuseble/back-btn";
import { ImgBox } from "@/components/reuseble/img-box";
import WapperBox from "@/components/reuseble/wapper-box";
import Avatars from "@/components/reuseble/avater";
import ModalOne from "@/components/reuseble/modal-one";
import { helpers, userVisibiliy } from "@/lib";
import LikeToggle from "@/components/reuseble/like-toggle";
import useConfirmation from "@/components/context/delete-modal";
import { Pagination } from "@/components/reuseble/pagination";
import { NoItemData } from "@/components/reuseble/table-no-item";
import RepeatCount from "@/components/reuseble/repeat-count/count";
import { Skeleton } from "@/components/ui";
import { useGetPostIdQuery } from "@/redux/api/userApi";
import { useParams } from "next/navigation";
import FavIcon from "@/icon/favIcon";
import { useState } from "react";
import { useDeletePostMutation } from "@/redux/api/commonApi";

export default function VidePost() {
  const { id } = useParams();
  const { confirm } = useConfirmation();
  const [isPreview, setIsPreview] = useState(false);
  const [isPage, setIsPage] = useState(1);
  const [isDetails, setIsDetails] = useState<any>({});
  const [deletePost] = useDeletePostMutation();
  const { data: vibes, isLoading } = useGetPostIdQuery({
    id,
    arg: {
      post_type: "vibes",
      page: isPage,
      limit: 16,
    },
  });

  console.log(vibes);

  const handleDelete = async (id: string) => {
    const con = await confirm({
      title: "You are going to delete this vibe",
      subTitle: "Delete Vibe",
      description:
        "After deleting, users wont be able to find this vibe in your app",
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
                {vibes?.data[0]?.user?.name || "N/A"}
              </h1>
              <h1 className="text-base">
                {vibes?.meta?.total || 0} Vibes Posted
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
          ) : vibes?.data?.length > 0 ? (
            vibes?.data?.map((item: any, index: any) => (
              <div
                className="cursor-pointer"
                key={index}
                onClick={() => {
                  setIsDetails(item);
                  setIsPreview(!isPreview);
                }}
              >
                <ImgBox
                  src={helpers.imgSource(item?.image[0]?.url) || "/blur.png"}
                  alt="ff"
                  className="h-[200px] w-[200px]"
                >
                  <div className="absolute bottom-3 left-3 text-lg font-medium flex gap-x-2 items-center">
                    <FavIcon name="like" /> {item?.likes || 0}
                  </div>
                </ImgBox>
              </div>
            ))
          ) : (
            <NoItemData className="w-full" title="No Vibe data available" />
          )}
        </div>
        <ul className="flex flex-wrap justify-end mt-20">
          <li className="font-medium">
            <Pagination
              onPageChange={(v: any) => setIsPage(v)}
              {...vibes?.meta}
            ></Pagination>
          </li>
        </ul>
      </WapperBox>
      {/* modal custom */}
      <ModalOne
        open={isPreview}
        setIsOpen={setIsPreview}
        className="sm:max-w-xs"
        headerStyle="pt-4 px-4 pb-0"
        profile={
          <>
            <Avatars
              src={helpers.imgSource(isDetails?.user?.avatar) || "/blur.png"}
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
        <ImgBox
          src={helpers.imgSource(isDetails?.image?.[0]?.url) || "/blur.png"}
          className="w-full h-[300px]"
          alt="img"
        ></ImgBox>
        <div className="mt-4 flex justify-between items-center">
          <LikeToggle likes={isDetails?.likes} />
          <div
            onClick={() => handleDelete(isDetails._id)}
            className="border cursor-pointer size-10  grid place-items-center rounded-md"
          >
            <FavIcon name="delete" className="size-5" />
          </div>
        </div>
      </ModalOne>
    </div>
  );
}
