"use client";
import ShadowBox from "@/components/common/shadow-box";
import WapperBox from "@/components/reuseble/wapper-box";
import { ImgBox } from "@/components/reuseble/img-box";
import Avatars from "@/components/reuseble/avater";
import { useGetPostQuery } from "@/redux/api/commonApi";
import { NoItemData } from "@/components/reuseble/table-no-item";
import RepeatCount from "@/components/reuseble/repeat-count/count";
import { Pagination } from "@/components/reuseble/pagination";
import { Skeleton } from "@/components/ui";
import { useState } from "react";
import { helpers, userVisibiliy } from "@/lib";
import Image from "next/image";
import LikeToggle from "@/components/reuseble/like-toggle";
import ModalOne from "@/components/reuseble/modal-one";

export default function Vibes() {
  const [isPage, setIsPage] = useState(1);
  const [isDetails, setIsDetails] = useState<any>({});
  const [isPreview, setIsPreview] = useState(false);
  const { data: vibes, isLoading } = useGetPostQuery({
    post_type: "vibes",
    page: isPage,
    limit: 16,
  });

  return (
    <div>
      <ShadowBox>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl font-semibold">Vibes</h1>
            <h1 className="text-base">
              Total Vibes: {vibes?.meta?.total || 0}
            </h1>
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
                  src={helpers.imgSource(item?.image?.[0]?.url) || "/blur.png"}
                  alt="img"
                  className="h-[190px] w-[200px] rounded-xl"
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.50) 100%)",
                    }}
                  ></div>
                  <div>
                    <div className="*:text-white flex items-center space-x-1 z-50 absolute left-1/2 -translate-x-1/2 bottom-3">
                      <Avatars
                        src={helpers.imgSource(item?.user?.avatar) || ""}
                        fallback={item?.user?.name || "N"}
                        alt="profile"
                        fallbackStyle="bg-[#cb4ec9]/70 text-white"
                      />
                      <div className="leading-5 w-max">
                        <h1 className="flex font-medium items-center">
                          {item?.user?.name || "N/A"}
                          <span className="ml-1">
                            {userVisibiliy[item.privacy] || "public"}
                          </span>
                        </h1>
                        <h1 className="text-secondery-figma flex  items-center">
                          <Image
                            src={
                              helpers.imgSource(item?.mood?.icon) || "/vide.png"
                            }
                            width={20}
                            height={20}
                            alt="img"
                          />
                          <span className="ml-1">
                            {item?.mood?.name || "N/A"}
                          </span>
                        </h1>
                      </div>
                    </div>
                  </div>
                </ImgBox>
              </div>
            ))
          ) : (
            <NoItemData className="w-full" title="No mood data available" />
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
        <ModalOne
          open={isPreview}
          setIsOpen={setIsPreview}
          className="sm:max-w-xs"
          headerStyle="pt-4 px-4 pb-0"
          profile={
            <>
              <Avatars
                src={helpers.imgSource(isDetails?.user?.avatar)}
                fallback={isDetails?.user?.name || "N/A"}
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
                      src={
                        helpers.imgSource(isDetails?.mood?.icon)
                      }
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
          </div>
        </ModalOne>
      </WapperBox>
    </div>
  );
}
