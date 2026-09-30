"use client";

import { TableCell, TableRow } from "@/components/ui";
import {
  useGetAllReportsQuery,
  useReportActionsMutation,
} from "@/redux/api/reportApi";
import {
  AlertTriangle,
  CheckCircle2,
  EyeOff,
  MapPin,
  Trash2,
  Type,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

import ShadowBox from "@/components/common/shadow-box";
import { Previewbtn } from "@/components/reuseble/icon-list";
import Modal from "@/components/reuseble/modal";
import { Pagination } from "@/components/reuseble/pagination";
import { CustomTable } from "@/components/reuseble/table";
import { TableNoItem } from "@/components/reuseble/table-no-item";
import { TableSkeleton } from "@/components/reuseble/table-skeleton";
import WapperBox from "@/components/reuseble/wapper-box";
import { helpers } from "@/lib";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function ReportManagement() {
  const [isDetails, setIsDetails] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPage, setIsPage] = useState(1);

  const { data: reportData, isLoading } = useGetAllReportsQuery({
    page: isPage,
  });
  const [actionsReport, { isLoading: isUpdating }] = useReportActionsMutation();

  const headers = [
    "User",
    "Post Type",
    "Report Type",
    "Reports",
    "Status",
    "Action",
  ];

  const handleAction = async (id: string, actionType: string) => {
    try {
      const res = await actionsReport({
        id,
        data: { action: actionType },
      }).unwrap();
      setIsModalOpen(false);

      if (res.success) {
        toast.success(res.message, {
          description: "Action successfully performed.",
        });
      }
    } catch (error: any) {
      console.error("Action failed", error);
      toast.error(error?.data?.message || "Action failed. Please try again.");
    }
  };

  return (
    <div>
      <ShadowBox>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl font-semibold">Content Reports</h1>
            <h1 className="text-xl text-muted-foreground">
              Total reports pending review: {reportData?.meta?.total || 0}
            </h1>
          </div>
        </div>
      </ShadowBox>

      <WapperBox>
        <CustomTable headers={headers}>
          {isLoading ? (
            <TableSkeleton colSpan={headers.length} />
          ) : reportData?.data?.length > 0 ? (
            reportData?.data?.map((item: any) => (
              <TableRow key={item._id} className="border">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      width={40}
                      height={40}
                      src={helpers.imgSource(item.user_id?.avatar)}
                      alt={item.user_id?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.user_id?.name || "Unknown User"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.user_id?.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="capitalize">
                  <span className="bg-yellow-900 text-gray-100 px-2 py-1 rounded text-xs">
                    {item.post_id?.post_type || "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.type?.map((t: string, i: number) => (
                      <span
                        key={i}
                        className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs border border-red-500/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-red-500 font-bold">{item.count}</span>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs uppercase px-2 py-1 rounded-full border ${
                      item.status === "pending"
                        ? "border-yellow-500 text-yellow-500"
                        : item.status === "active_post"
                          ? "border-green-500 text-green-500"
                          : item.status === "delete_post"
                            ? "border-red-500 text-red-500"
                            : item.status === "ban_user"
                              ? "border-red-900 text-red-900"
                              : item.status === "hide_post"
                                ? "border-orange-500 text-orange-500"
                                : item.status === "active_user"
                                  ? "border-blue-500 text-blue-500"
                                  : "border-red-500 text-red-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Previewbtn
                    onClick={() => {
                      setIsDetails(item);
                      setIsModalOpen(true);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableNoItem
              colSpan={headers.length}
              title="Clean slate! No reports found."
            />
          )}
        </CustomTable>
      </WapperBox>

      <div className="flex justify-end my-7">
        <Pagination
          onPageChange={(v: any) => setIsPage(v)}
          {...reportData?.meta}
        />
      </div>

      <Modal
        open={isModalOpen}
        setIsOpen={setIsModalOpen}
        title="Report Investigation"
        className="sm:max-w-4xl"
      >
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Info Card (Reported User) */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <UserCheck size={18} /> Reported User
              </h3>
              <div className="flex items-center gap-4">
                <Image
                  src={helpers.imgSource(isDetails?.user_id?.avatar)}
                  alt={isDetails?.user_id?.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-md object-cover"
                />
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-400">Name:</span>{" "}
                    {isDetails?.user_id?.name}
                  </p>
                  <p>
                    <span className="text-gray-400">Email:</span>{" "}
                    {isDetails?.user_id?.email}
                  </p>
                  <p>
                    <span className="text-gray-400">Role:</span>{" "}
                    <span className="text-yellow-500 uppercase font-bold">
                      {isDetails?.user_id?.role}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Post Content Summary */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Type size={18} /> Post Content
              </h3>
              <p className="text-sm italic mb-2 line-clamp-3">
                {isDetails?.post_id?.captions || "No captions available."}
              </p>
              <div className="flex items-start gap-2 text-xs text-gray-400">
                <MapPin size={14} className="mt-0.5" />
                <span>
                  {isDetails?.post_id?.location?.address || "Location N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Appeal Message Section */}
          {isDetails?.appeal_message && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl">
              <h4 className="text-yellow-500 text-sm font-bold flex items-center gap-2 mb-1">
                <AlertTriangle size={16} /> User Appeal
              </h4>
              <p className="text-sm italic text-gray-200">
                {isDetails.appeal_message}
              </p>
            </div>
          )}

          {/* Logs & Reporters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Report Descriptions Log */}
            <div className="space-y-2">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-400" />
                Report Log ({isDetails?.count})
              </h4>
              <div className="max-h-52 overflow-y-auto bg-black/40 rounded-lg p-3 text-sm space-y-2 border border-white/5">
                {isDetails?.description?.map((desc: string, i: number) => (
                  <p
                    key={i}
                    className="border-b border-white/5 pb-1 last:border-0 text-gray-300"
                  >
                    • {desc}
                  </p>
                ))}
              </div>
            </div>

            {/* Reporter Users List */}
            <div className="space-y-2">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Users size={16} className="text-blue-400" />
                Reported By ({isDetails?.report_users?.length || 0})
              </h4>
              <div className="max-h-52 overflow-y-auto bg-black/40 rounded-lg p-3 space-y-3 border border-white/5">
                {isDetails?.report_users?.length > 0 ? (
                  isDetails?.report_users?.map((reporter: any) => (
                    <div
                      key={reporter._id}
                      className="flex items-center gap-3 border-b border-white/5 pb-2 last:border-0"
                    >
                      <Image
                        src={helpers.imgSource(reporter.avatar)}
                        alt={reporter.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border border-white/20"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-200">
                          {reporter.name}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {reporter.email}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    No reporter data found.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Administrative Controls */}
          <div className="pt-4 border-t border-white/10">
            <h4 className="text-lg font-medium mb-4 text-center">
              Administrative Controls
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <AdminActionBtn
                label="Delete Post"
                icon={<Trash2 size={18} />}
                variant="bg-red-600"
                onClick={() => handleAction(isDetails?._id, "delete_post")}
                disabled={isUpdating}
              />
              <AdminActionBtn
                label="Hide Post"
                icon={<EyeOff size={18} />}
                variant="bg-orange-600"
                onClick={() => handleAction(isDetails?._id, "hide_post")}
                disabled={isUpdating}
              />
              <AdminActionBtn
                label="Active Post"
                icon={<CheckCircle2 size={18} />}
                variant="bg-green-600"
                onClick={() => handleAction(isDetails?._id, "active_post")}
                disabled={isUpdating}
              />
              <AdminActionBtn
                label="Ban User"
                icon={<UserX size={18} />}
                variant="bg-red-900"
                onClick={() => handleAction(isDetails?._id, "ban_user")}
                disabled={isUpdating}
              />
              <AdminActionBtn
                label="Active User"
                icon={<UserCheck size={18} />}
                variant="bg-blue-600"
                onClick={() => handleAction(isDetails?._id, "active_user")}
                disabled={isUpdating}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Reusable Internal Button
function AdminActionBtn({ label, icon, variant, onClick, disabled }: any) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ${variant}`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase text-white whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}
