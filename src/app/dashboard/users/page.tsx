"use client";
import { useGetUserQuery, useUserAcToggleMutation } from "@/redux/api/userApi";
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
import { ArrowUpRight } from "lucide-react";
import React, { useState } from "react";
import FavIcon from "@/icon/favIcon";
import { helpers } from "@/lib";
import Link from "next/link";

export default function Users() {
  const [isPreview, setIsPreview] = useState(false);
  const [isDetails, setIsDetails] = useState<any>({});
  const [isPage, setIsPage] = useState(1);
  const headers = [
    "Name",
    "Email",
    "Vibes",
    "Music",
    "Podcast",
    "Followers",
    "Action",
  ];
  const { data: users, isLoading } = useGetUserQuery({ page: isPage });
  const [userAcToggle, { isLoading: acIsLoading }] = useUserAcToggleMutation();

  return (
    <div>
      <ShadowBox>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl font-semibold">Users</h1>
            <h1 className="text-xl">Total users: {users?.meta?.total || 0}</h1>
          </div>
        </div>
      </ShadowBox>
      <WapperBox>
        <CustomTable headers={headers}>
          {isLoading ? (
            <TableSkeleton colSpan={headers?.length} tdStyle="!pl-2" />
          ) : users?.data?.length > 0 ? (
            users?.data?.map((item: any, index: any) => (
              <TableRow key={index} className="border">
                <TableCell className="relative">
                  <div className="flex items-center gap-3">
                    <Avatars
                      src={helpers.imgSource(item.avatar) || ""}
                      fallback={item.name}
                      alt="profile"
                      fallbackStyle="bg-[#cb4ec9]/70 text-white"
                    />
                    <span>{item.name}</span>
                  </div>
                </TableCell>

                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <span className="ml-2">{item.vibes}</span>
                </TableCell>
                <TableCell>
                  <span className="ml-2">{item.audio}</span>
                </TableCell>
                <TableCell>
                  <span className="ml-2"> {item.podcast}</span>
                </TableCell>
                <TableCell>
                  <span className="ml-4"> {item.followers}</span>
                </TableCell>

                <TableCell>
                  <ul className="flex gap-2">
                    <li>
                      <Previewbtn
                        onClick={() => {
                          setIsDetails(item);
                          setIsPreview(!isPreview);
                        }}
                      />
                    </li>
                    <li>
                      <button
                        onClick={async () => {
                          await userAcToggle(item._id).unwrap();
                        }}
                        disabled={acIsLoading}
                        className="size-10 bg-transparent border-2 grid place-items-center  rounded-lg cursor-pointer"
                      >
                        {item.status == "active" ? (
                          <FavIcon name="acitve" />
                        ) : (
                          <FavIcon name="inActive" />
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
              title="No users are available at the moment"
              tdStyle="!bg-background"
            />
          )}
        </CustomTable>
      </WapperBox>
      <ul className="flex flex-wrap justify-end my-7">
        <li className="font-medium">
          <Pagination
            onPageChange={(v: any) => setIsPage(v)}
            {...users?.meta}
          ></Pagination>
        </li>
      </ul>
      {/* preview */}
      <Modal
        open={isPreview}
        setIsOpen={setIsPreview}
        title="User Details"
        titleStyle="text-center"
        className="sm:max-w-2xl"
      >
        <div className="p-1 space-y-3">
          <div className="border flex justify-between rounded-lg p-2">
            <div className="flex items-center space-x-2">
              <Avatars
                src={helpers.imgSource(isDetails.avatar) || ""}
                fallback={isDetails.name}
                alt="profile"
                fallbackStyle="bg-[#cb4ec9]/70 text-white"
              />
              <div className="leading-5">
                <h1>{isDetails.name}</h1>
                <h1 className="text-secondery-figma">{isDetails.email}</h1>
              </div>
            </div>
            <button
              onClick={async () => {
                const res = await userAcToggle(isDetails._id).unwrap();
                setIsDetails((prevDetails: any) => ({
                  ...prevDetails,
                  status: res?.data?.status,
                }));
              }}
              disabled={acIsLoading}
              className="size-10 bg-transparent border-2 grid place-items-center  rounded-lg cursor-pointer"
            >
              {isDetails.status == "active" ? (
                <FavIcon name="acitve" />
              ) : (
                <FavIcon name="inActive" />
              )}
            </button>
          </div>
          <h1 className="text-2xl font-medium">Bio</h1>
          <div className="border p-3 rounded-md text-[#FFF]">
            {isDetails?.bio}
          </div>
          <div className="space-y-3 pt-2">
            <DetailsNav
              href={`/dashboard/users/vibe-posted/${isDetails._id}`}
              icon={<FavIcon name="vibePost" className="size-5" />}
              text="Vibe posted"
              value={isDetails?.vibes}
            />
            <DetailsNav
              href={`/dashboard/users/music-posted/${isDetails._id}`}
              icon={<FavIcon name="music" className="size-5" />}
              text="Music posted"
              value={isDetails?.audio}
            />
            <DetailsNav
              href={`/dashboard/users/podcast-posted/${isDetails._id}`}
              icon={<FavIcon name="padcostDetails" className="size-5" />}
              text="Podcast posted"
              value={isDetails?.podcast}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ======= DetailsNav ========
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
        <Button
          disabled={value > 0 ? false : true}
          className="h-11 w-12 disabled:opacity-70 disabled:cursor-default bgOne rounded-xl grid place-items-center cursor-pointer"
        >
          <ArrowUpRight className="size-[24px]" />
        </Button>
      </Link>
    </div>
  );
}
