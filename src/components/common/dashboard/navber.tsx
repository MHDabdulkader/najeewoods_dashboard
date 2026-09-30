"use client";
import React, { useState, useRef, useEffect } from "react";
import navbg from "@/assets/navber-bg.png";
import { ImgBox } from "@/components/reuseble/img-box";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu } from "lucide-react";
import { Button} from "@/components/ui";
import {helpers } from "@/lib";
import Link from "next/link";
import Image from "next/image";
import FavIcon from "@/icon/favIcon";
import { useAppSelector } from "@/redux/hooks";

export default function Navber({ sidebarOpen, setSidebarOpen }: any) {
  const contentRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current?.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

 
  const {user}=useAppSelector(state=>state.auth)
  

  return (
    <div>
      <div
        ref={navRef}
        className="h-23 lg:h-42 [transition:0.5s] relative w-full px-5 pt-5"
      >
        <Image src={navbg} alt="title" fill className="object-cover z-0" />
        <div className="relative lg:pl-[80px] z-10">
          <div className="flex justify-between items-center">
            <div
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="cursor-pointer block lg:hidden"
            >
              <Menu size={25} />
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center gap-x-1 blur-bg h-12 rounded-xl px-5 w-fit">
                <FavIcon name="calender" />
                {helpers.formatDate(new Date())}
              </div>
            </div>
            <div>
              <div className="flex gap-2 items-center">
                <Link href="/dashboard/notification">
                  <Button className="size-12 cursor-pointer blur-bg has-[>svg]:px-0 rounded-full">
                    <FavIcon className="size-5" name="noti" />
                  </Button>
                </Link>
                <div>
                  <button
                    className="flex space-x-2 cursor-pointer"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    <ImgBox
                      alt="profile"
                      className="size-12 rounded-full cursor-pointer"
                      src={helpers.imgSource(user?.avatar as any) || "/blur.png"}
                    />
                    <div className="text-start space-y-1 leading-5">
                      <h1 className="font-medium">
                        {user?.name}
                      </h1>
                      <h1>
                        {user?.email}
                      </h1>
                    </div>
                  </button>

                  {/* Show menu */}
                  <AnimatePresence initial={false}>
                    {dropdownOpen && (
                      <motion.div
                        ref={contentRef}
                        className="absolute z-[99] right-0 mt-4 flex w-[260px] flex-col text-white rounded-lg bg-[#1D1D1D]/20 backdrop-blur-3xl shadow-md transition-all"
                        initial={{ opacity: 0, scaleY: 0, originY: "top" }}
                        animate={{ opacity: 1, scaleY: 1, originY: "top" }}
                        exit={{ opacity: 0, scaleY: 0, originY: "top" }}
                      >
                        <div className="flex flex-col space-y-3 p-4">
                          <Link
                            href={`/dashboard/profile?tab=overview`}
                            className="bg-[#1D1D1D]/20 rounded-md h-10 flex items-center justify-between px-2"
                          >
                            <span className="flex gap-x-2 items-center">
                              <FavIcon className="size-5" name="admin" />
                              Admin profile
                            </span>
                            <ArrowUpRight className="size-5" />
                          </Link>
                          <Link
                            href={`/dashboard/profile?tab=password`}
                            className="bg-[#1D1D1D]/20 rounded-md h-10 flex items-center justify-between px-2"
                          >
                            <span className="flex gap-x-2 items-center">
                              <FavIcon className="size-5" name="password" />
                              Change password
                            </span>
                            <ArrowUpRight className="size-5" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
