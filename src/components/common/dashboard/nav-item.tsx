"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import FavIcon from "@/icon/favIcon";
import { motion } from "framer-motion";
import Link from "next/link";

interface NavItem {
  icon: any;
  href?: string;
  submenu?: NavItem[];
  active_i: any;
  text?: string;
}

export default function NavItem({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const menuRefs = useRef<(HTMLUListElement | null)[]>([]);

  useEffect(() => {
    menuRefs.current.forEach((menu, index) => {
      if (menu) {
        menu.style.maxHeight =
          activeSubmenu === index ? `${menu.scrollHeight}px` : "0";
        menu.style.opacity = activeSubmenu === index ? "1" : "0";
      }
    });
  }, [activeSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setActiveSubmenu((prev) => (prev === index ? null : index));
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // /md:w-12 md:h-12
  return (
    <ul className="flex flex-col p-4 md:p-0 md:items-center space-y-4 md:space-y-5">
      {items?.map(({ icon, active_i, href, submenu, text }, parentIndex) => (
        <li key={parentIndex} className="group relative">
          {href ? (
            <Link
              href={href}
              className={`${
                isActive(href) ? "bgOne" : ""
              } w-full  md:w-12 h-12 flex items-center justify-start md:justify-center rounded-md md:rounded-xl transition-colors duration-200`}
            >
              {isActive(href) ? (
                <FavIcon  name={active_i} />
              ) : (
                <FavIcon  name={icon} />
              )}
              <span className="block  md:hidden">{text}</span>
            </Link>
          ) : (
            <div
              onClick={() => handleSubmenuToggle(parentIndex)}
              className="flex items-center px-3 py-2 relative justify-between cursor-pointer rounded-xl transition-colors duration-200"
            >
              <span className="flex items-center gap-x-2 font-medium">
                {isActive(href as string) ? (
                  <FavIcon name={active_i} />
                ) : (
                  <FavIcon name={icon} />
                )}
                <span className="block md:hidden">{text}</span>
              </span>
              <span className="md:absolute md:top-1/2 md:-translate-y-1/2 md:-right-3">
                {activeSubmenu === parentIndex ? (
                  <ChevronUp className="size-5 text-[#AFAFAF] font-extrabold transition-transform duration-200" />
                ) : (
                  <ChevronDown className="size-5 text-[#AFAFAF] font-extrabold transition-transform duration-200" />
                )}
              </span>
            </div>
          )}

          {submenu && (
            <motion.ul
              ref={(el) => {
                menuRefs.current[parentIndex] = el;
              }}
              initial={{ maxHeight: 0, opacity: 0 }}
              animate={{
                maxHeight:
                  activeSubmenu === parentIndex
                    ? `${menuRefs.current[parentIndex]?.scrollHeight}px`
                    : "0",
                opacity: activeSubmenu === parentIndex ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden transition-all space-y-1 pt-1 duration-300 ease-out max-h-0"
            >
              {submenu.map(({ href, icon, text, active_i }, subIndex) => (
                <li key={subIndex} className="ml-2 md:ml-0">
                  {href && (
                    <Link
                      href={href}
                      className={`${
                        isActive(href) ? "bgOne" : ""
                      } w-full   md:w-12 h-12 flex items-center justify-start md:justify-center rounded-xl transition-colors duration-200`}
                    >
                      {isActive(href) ? (
                        <FavIcon name={active_i} />
                      ) : (
                        <FavIcon name={icon} />
                      )}
                      <span className="block md:hidden">{text}</span>
                    </Link>
                  )}
                </li>
              ))}
            </motion.ul>
          )}
        </li>
      ))}
    </ul>
  );
}
