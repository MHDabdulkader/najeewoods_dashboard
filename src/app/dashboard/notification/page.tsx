"use client";
import ShadowBox from "@/components/common/shadow-box";
import WapperBox from "@/components/reuseble/wapper-box";
import FavIcon from "@/icon/favIcon";
import { Button, Skeleton } from "@/components/ui";
import {
  useGetNotificationQuery,
  useReadNotificationMutation,
} from "@/redux/api/notificationsApi";
import { helpers } from "@/lib";
import { Pagination } from "@/components/reuseble/pagination";
import { useState } from "react";
import RepeatCount from "@/components/reuseble/repeat-count/count";
import { NoItemData } from "@/components/reuseble/table-no-item";

export default function Notifications() {
  const [isPage, setIsPage] = useState(1);
  const { data: notification, isLoading } = useGetNotificationQuery({
    page: isPage,
  });
  const [readNotification] = useReadNotificationMutation();

  const hanldeRead = async (id: string) => {
    await readNotification(id).unwrap();
  };

  return (
    <div>
      <ShadowBox>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl  font-semibold">Notifications</h1>
            <h1 className="text-base">
              {notification?.meta?.total || 0} notifications
            </h1>
          </div>
          <Button
            onClick={async() => await readNotification("").unwrap()}
            variant="primary"
            size="lg"
          >
            <FavIcon color="#ffffff" name="messageRead" /> Read all
          </Button>
        </div>
      </ShadowBox>
      <WapperBox>
        <div className="mt-4">
          <div className="space-y-8 py-5">
            {isLoading ? (
              <RepeatCount count={10}>
                <Skeleton className="w-full h-[60px]" />
              </RepeatCount>
            ) : notification?.data?.length > 0 ? (
              notification?.data?.map((item: any, index: any) => (
                <div
                  key={index}
                  className={`${
                    item?.isRead ? "bg-modal-figma" : "bg-[#202020]"
                  } text-white border-l-4  p-3 grid grid-cols-1 lg:grid-cols-3 rounded-md`}
                  onClick={() => hanldeRead(item._id)}
                >
                  <div className="mb-2 md:mb-0">
                    <h3 className="lg:text-base xl:text-xl font-semibold ">
                      {item.title}
                    </h3>
                    <p className="text-sm ">{item.message}</p>
                  </div>
                  <ul className="md:left-1/2 relative space-y-2 *:text-secondery-figma">
                    <li className="flex items-center gap-1">
                      <FavIcon
                        name="calender"
                        color="#AFAFAF"
                        className="size-4"
                      />
                      <span className="text-sm">
                        {helpers.formatDate(item.createdAt)}
                      </span>
                    </li>
                    <li className="flex items-center gap-1">
                      <FavIcon name="time" className="size-4" />
                      <span className="text-sm">
                        {helpers.formatTime(item.createdAt)}
                      </span>
                    </li>
                  </ul>

                  <div className="text-gray-500  items-center hidden md:flex md:justify-end">
                    {item?.isRead ? (
                      <FavIcon color="#ffffff" name="messageRead" className="size-4"  />
                    ) : (
                      <FavIcon name="messageUnRead" className="size-4" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <NoItemData title="No Notification Found" />
            )}

            <ul className="flex flex-wrap justify-end my-7">
              <li className="font-medium">
                <Pagination
                  onPageChange={(v: any) => setIsPage(v)}
                  {...notification?.meta}
                ></Pagination>
              </li>
            </ul>
          </div>
        </div>
      </WapperBox>
    </div>
  );
}
