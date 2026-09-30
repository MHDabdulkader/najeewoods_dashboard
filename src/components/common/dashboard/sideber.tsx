"use client";
import React from "react";
import logo from "@/assets/logo.svg";
import { navItems } from "./nav-data";
import FavIcon from "@/icon/favIcon";
import Navitem from "./nav-item";
import { Button } from "@/components/ui";
import { authKey, helpers } from "@/lib";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { clearUser } from "@/redux/feature/authSlice";

export default function Sideber({ sidebarOpen, setSidebarOpen }: any) {
  const router = useRouter();
  const dispatch=useAppDispatch()
  
  const handlelogout = () => {
    helpers.removeAuthCookie(authKey);
    dispatch(clearUser())
    router.push("/");
  };

  return (
    <div className="block">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 opacity-50"
          onClick={() => {
            setSidebarOpen(false);
          }}
        />
      )}
      <aside
        className={`w-[245px] md:w-20 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform transform duration-300 ease-linear overflow-y-scroll h-screen fixed left-0 top-0 z-60 scrollbar-hide border-r border-white/10  bg-sideber blur-bg backdrop-blur-2xl`}
      >
        <div className="flex flex-col relative">
          <div className="flex items-center justify-center h-[120px]  rounded-md">
            <span className="relative mb-3">
              <picture>
                <img src={logo.src} alt="Logo" className="p-3" />
              </picture>
            </span>
          </div>
          <div className="flex flex-col pb-10  justify-between overflow-y-scroll scrollbar-hide h-[calc(100vh-120px)]">
            <Navitem items={navItems} />
            <Button
              onClick={() => handlelogout()}
              className="bg-figma-primary cursor-pointer hover:bg-figma-primary  w-fit mx-auto md:bg-transparent md:hover:bg-transparent"
            >
              {" "}
              <FavIcon className="size-4 md:size-6" name="logout" />{" "}
              <span className="block md:hidden">Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
