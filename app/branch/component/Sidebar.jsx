"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, CopyPlus, ListTodo, Rocket, Gauge, LayoutDashboard, Users, LayoutList, Trash2, FileLineChart } from "lucide-react";
import { Menulist } from "@/constants/BranchMenu";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Sidebar({ onToggleSidebar }) {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isLgScreen, setIsLgScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to true on large screens
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      setIsLgScreen(isLargeScreen);
      setIsSidebarOpen(isLargeScreen); // Sidebar open by default on large screens, closed on smaller
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (id) => {
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (onToggleSidebar) {
      onToggleSidebar(!isSidebarOpen);
    }
  };

  const isActiveLink = (href) => pathname === href;

  return (
    <>
      <div className="absolute md:top-5 top-5 left-2 md:left-5">
        <button
          className={`cursor-pointer duration-150 p-1 rounded-lg ${isSidebarOpen ? "bg-[#6cb049] text-white" : "bg-gray-200 text-black hover:bg-[#6cb049] hover:text-white"
            }`}
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>
      <div>
        <div
          className={`absolute md:top-[70px] top-[70px] bottom-0 left-0 w-64 bg-white z-40 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform bottom-0 absolute border bg-white duration-300 ease-in-out`}
        >
          <div className="relative h-full flex flex-col px-2">
            <ul className="h-full ">
              <Link href="/branch">
                <li
                  className={`cursor-pointer text-sm px-4 py-3 duration-150 flex items-center gap-x-2 rounded-md ${isActiveLink("/branch") ? "bg-[#6cb049] text-white" : "hover:bg-gray-100 text-gray-700 "
                    }`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </li>
              </Link>

              <Link href="/branch/page/allquery">
                <li
                  className={`cursor-pointer text-sm px-4 py-3 duration-150 flex items-center gap-x-2 rounded-md ${isActiveLink("/branch/page/allquery") ? "bg-[#6cb049] text-white" : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  <LayoutList size={18} />
                  All Queries
                </li>
              </Link>


              <Link href="/branch/page/importquery">
                <li
                  className={`cursor-pointer text-sm px-4 py-3 duration-150 flex items-center gap-x-2 rounded-md ${isActiveLink("/branch/page/importquery") ? "bg-[#6cb049] text-white" : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  <FileLineChart size={18} />
                  Import Query
                </li>
              </Link>


              <Link href="/branch/page/addquery">
                <li
                  className={`cursor-pointer text-sm px-4 py-3 duration-150 flex items-center gap-x-2 rounded-md ${isActiveLink("/branch/page/addquery") ? "bg-[#6cb049] text-white" : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  <CopyPlus size={18} />
                  Add Query
                </li>
              </Link>

              <Link href="/branch/page/assigned">
                <li
                  className={`cursor-pointer text-sm px-4 py-3 duration-150 flex items-center gap-x-2 rounded-md ${isActiveLink("") ? "bg-[#6cb049] text-white" : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  <ListTodo size={18} />
                  Assigned Query
                </li>
              </Link>
              <li
                className={`cursor-pointer text-sm px-4 py-3 duration-150 flex items-center gap-x-2 rounded-md ${isActiveLink("") ? "bg-[#6cb049] text-white" : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <Rocket size={18} />
                Important Queries
              </li>

              <Link href="/branch/page/staff">
                <li
                  className={`cursor-pointer text-sm px-4 py-3 duration-150 flex items-center gap-x-2 rounded-md ${isActiveLink("/branch/page/staff") ? "bg-[#6cb049] text-white" : "hover:bg-gray-100 text-gray-700"
                    }`}>
                  <Users size={18} />
                  Team
                </li>
              </Link>
              <li className="cursor-pointer text-sm px-4 py-3 duration-150 flex items-center gap-x-2 rounded-md hover:bg-gray-100 text-gray-700">
                <Gauge size={18} />
                Daily Report
              </li>
            </ul>

            <ul className="flex h-full flex-col relative xl:hidden overflow-y-auto" style={{ maxHeight: "calc(100vh - 120px)" }}>
              {Menulist.map((item) => (
                <li key={item.id} className="relative">
                  <div
                    className={`cursor-pointer text-sm px-4 py-3 duration-150 flex items-center rounded-md text-gray-700 gap-x-2 ${openSubmenu === item.id ? "bg-[#6cb049] text-white" : ""
                      }`}
                    onClick={() => handleClick(item.id)}
                  >

                    <item.icon size={18} />{item.title}
                  </div>
                  {openSubmenu === item.id && item.submenu && (
                    <ul className="shadow-lg mt-2 transition-all duration-300 ease-in-out">
                      {item.submenu.map((submenuItem, index) => (
                        <Link key={index} href={submenuItem.href}>
                          <li

                            className={`${isActiveLink(`${submenuItem.href}`) ? "bg-[#6cb049] text-white" : "hover:bg-gray-100 text-gray-700"} cursor-pointer text-sm border-b  text-gray-700  px-4 py-2 duration-150 flex items-center gap-x-2`}
                          >
                            <submenuItem.icon size={15} /> {submenuItem.name}
                          </li>
                        </Link>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-auto p-2 border-t">
              <div className="flex flex-col">
                <Link href="/branch/page/trash">
                  <div className={`cursor-pointer text-sm px-4 py-3 duration-150 flex items-center gap-x-2  rounded-md ${isActiveLink("/branch/page/trash") ? "bg-red-600 text-white " : "hover:bg-red-600 hover:text-white"
                    }`}>
                    <Trash2 size={18} />
                    Trash
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
