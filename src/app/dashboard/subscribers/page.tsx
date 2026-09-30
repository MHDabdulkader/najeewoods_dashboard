"use client";
import ShadowBox from "@/components/common/shadow-box";
import Avatars from "@/components/reuseble/avater";
import { Previewbtn } from "@/components/reuseble/icon-list";
import Modal from "@/components/reuseble/modal";
import { Pagination } from "@/components/reuseble/pagination";
import { CustomTable } from "@/components/reuseble/table";
import { TableNoItem } from "@/components/reuseble/table-no-item";
import { TableSkeleton } from "@/components/reuseble/table-skeleton";
import WapperBox from "@/components/reuseble/wapper-box";
import { Button, TableCell, TableRow } from "@/components/ui";
import {
  useGetSubscribersQuery,
  useSubAcToggleMutation,
} from "@/redux/api/subscribersApi";
import { ArrowUpRight } from "lucide-react";
import React, { useState } from "react";
import FavIcon from "@/icon/favIcon";
import { helpers } from "@/lib";
import Link from "next/link";

export default function Subscribers() {
  const [isDetails, setIsDetails] = useState<any>({});
  const [isUser, setIsUser] = useState(false);
  const [isPage, setIsPage] = useState(1);
  const { data: s_user, isLoading } = useGetSubscribersQuery({ page: isPage });
  const [subAcToggle] = useSubAcToggleMutation();
  const headers = [
    "Name",
    "Subscriber type",
    "Starting date",
    "Ending date",
    "Action",
  ];

  return (
    <div>
      <ShadowBox>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl font-semibold">Subscribers</h1>
            <h1 className="text-xl">
              Total subscribers: {s_user?.meta?.total}
            </h1>
          </div>
          <Link href={"/dashboard/plan-management"}>
            <Button size={"lg"} variant={"primary"}>
              <FavIcon name="dubbleSetting" />
              Plan management
            </Button>
          </Link>
        </div>
      </ShadowBox>
      <WapperBox>
        <CustomTable headers={headers}>
          {isLoading ? (
            <TableSkeleton colSpan={headers?.length} tdStyle="!pl-2" />
          ) : s_user?.data?.length > 0 ? (
            s_user?.data?.map((item: any, index: any) => (
              <TableRow key={index} className="border">
                <TableCell className="relative">
                  <div className="flex items-center gap-3">
                    <Avatars
                      src={helpers.imgSource(item?.user?.avatar)}
                      fallback={item.user?.name || "N/A"}
                      alt="profile"
                      fallbackStyle="bg-[#cb4ec9]/70 text-white"
                    />
                    <span>{item?.user?.name || "N/A"}</span>
                  </div>
                </TableCell>

                <TableCell>{item.plan?.name || "N/A"}</TableCell>
                <TableCell>
                  {helpers.formatDate(item?.current_period_start) || "N/A"}
                </TableCell>
                <TableCell>
                  {helpers.formatDate(item?.current_period_end) || "N/A"}
                </TableCell>
                <TableCell>
                  <ul className="flex gap-2">
                    <li>
                      <Previewbtn
                        onClick={() => {
                          setIsUser(!isUser);
                          setIsDetails(item);
                        }}
                      />
                    </li>
                    <li>
                      <button
                        onClick={async () => await subAcToggle(item?.id)}
                        className="size-10 bg-transparent border-2 grid place-items-center  rounded-lg cursor-pointer"
                      >
                        {item.subscription_status === "active" ? (
                          <FavIcon name="on" />
                        ) : (
                          <FavIcon name="off" />
                        )}
                      </button>
                    </li>
                  </ul>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableNoItem
              colSpan={headers?.length}
              title="No Subscribers at the moment"
              tdStyle="!bg-background"
            />
          )}
        </CustomTable>
      </WapperBox>
      <ul className="flex flex-wrap justify-end my-7">
        <li className="font-medium">
          <Pagination
            onPageChange={(v: any) => setIsPage(v)}
            {...s_user?.meta}
          ></Pagination>
        </li>
      </ul>
      {/* =============users=========== */}
      <Modal
        open={isUser}
        setIsOpen={setIsUser}
        title="User Details"
        titleStyle="text-center"
        className="sm:max-w-3xl"
      >
        <div className="p-1  space-y-3">
          <div className="border flex justify-between rounded-lg p-2">
            <div className="flex items-center space-x-2">
              <Avatars
                src={helpers.imgSource(isDetails?.user?.avatar)}
                fallback={isDetails?.user?.name || "N/A"}
                alt="profile"
                fallbackStyle="bg-[#cb4ec9]/70 text-white"
              />
              <div className="leading-5">
                <h1>{isDetails?.user?.name || "N/A"}</h1>
                <h1 className="text-secondery-figma">
                  {isDetails?.user?.email || "N/A"}
                </h1>
              </div>
            </div>
            <button
              onClick={async () => {
                const res = await subAcToggle(isDetails?.id);
                if (res?.data?.data?.subscription_status) {
                  setIsDetails((prev: any) => ({
                    ...prev,
                    subscription_status: res?.data?.data?.subscription_status,
                  }));
                }
              }}
              className="size-10 bg-transparent border-2 grid place-items-center  rounded-lg cursor-pointer"
            >
              {isDetails?.subscription_status === "active" ? (
                <FavIcon name="on" />
              ) : (
                <FavIcon name="off" />
              )}
            </button>
          </div>
          <h1 className="text-2xl font-medium">Bio</h1>
          <div className="border p-3 rounded-md text-[#FFF]">
            {isDetails?.user?.bio || "N/A"}
          </div>
          <div className="space-y-3 pt-2">
            <DetailsNav
              href={`/dashboard/users/vibe-posted/${isDetails?.user?._id}`}
              icon={<FavIcon name="vibePost" className="size-5" />}
              text="Vibe posted"
              value={isDetails?.user?.vibes}
            />
            <DetailsNav
              href={`/dashboard/users/music-posted/${isDetails?.user?._id}`}
              icon={<FavIcon name="music" className="size-5" />}
              text="Music posted"
              value={isDetails?.user?.audio}
            />
            <DetailsNav
              href={`/dashboard/users/podcast-posted/${isDetails?.user?._id}`}
              icon={<FavIcon name="padcostDetails" className="size-5" />}
              text="Podcast posted"
              value={isDetails?.user?.podcast}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

// DetailsNav
function DetailsNav({ href, icon, text, value }: any) {
  const url = value > 0 ? href : "#";

  return (
    <div className="flex justify-between space-x-3 h-11">
      <div className="w-full  flex justify-between items-center border rounded-xl px-3">
        <span className="flex gap-x-2 items-center">
          {icon} {text}:
        </span>
        <span>{value}</span>
      </div>

      <Link href={url}>
        <Button disabled={value > 0 ? false : true} className="h-11 disabled:opacity-70 disabled:cursor-not-allowed! w-12 bgOne rounded-xl grid place-items-center cursor-pointer">
          <ArrowUpRight className="size-[24px]" />
        </Button>
      </Link>
    </div>
  );
}
