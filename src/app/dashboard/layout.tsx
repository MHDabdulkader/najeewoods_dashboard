"use client";
import Navber from "@/components/common/dashboard/navber";
import Sideber from "@/components/common/dashboard/sideber";
import { childrenProps } from "@/types";
import React, { useState } from "react";

export default function CommonLayout({ children }: childrenProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex overflow-hidden">
      {/* <!-- ===== Sidebar Start ===== --> */}
      <Sideber sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* <!-- ===== Content Area Start ===== --> */}
      <div className="relative flex  flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Navber sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}  />
        <div className="p-4 lg:p-6 lg:ml-[80px]">{children}</div>
      </div>
    </div>
  );
}
