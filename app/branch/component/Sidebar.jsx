"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, Home, Store, Users, Workflow, Group, Trash, List } from "lucide-react";
import { Menulist } from "@/constants/Menu";

export default function Sidebar({ onToggleSidebar }) {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isLgScreen, setIsLgScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLgScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = (id) => {
    if (isLgScreen) setOpenSubmenu(id);
  };

  const handleMouseLeave = () => {
    if (isLgScreen) setOpenSubmenu(null);
  };

  const handleClick = (id) => {
    if (!isLgScreen) {
      setOpenSubmenu(openSubmenu === id ? null : id);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    onToggleSidebar(!isSidebarOpen);
  };

  return (
    <>
      <div className="absolute md:top-5 top-1 left-2 md:left-5">
        <button
          className={`cursor-pointer duration-150 p-1 rounded-lg ${
            isSidebarOpen ? "bg-[#6cb049] text-white" : "bg-gray-200 text-black hover:bg-[#6cb049] hover:text-white"
          }`}
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>
      <div>
        <div
          className={`absolute md:top-[70px] top-[40px] bottom-0 left-0 w-64 bg-white z-40 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform bottom-0 absolute border bg-white duration-300 ease-in-out`}
        >
          <div className="relative h-full flex flex-col">
            <ul>
              <li className="cursor-pointer border-b hover:bg-[#6cb049] text-gray-700 hover:text-white rounded-md px-4 py-2 duration-150 flex items-center gap-x-2">
                <Home size={15} />
                Home
              </li>
              <li className="cursor-pointer border-b hover:bg-[#6cb049] text-gray-700 hover:text-white rounded-md px-4 py-2 duration-150 flex items-center gap-x-2">
                <Store size={15} />
                Outlets
              </li>
              <li className="cursor-pointer border-b hover:bg-[#6cb049] text-gray-700 hover:text-white rounded-md px-4 py-2 duration-150 flex items-center gap-x-2">
                <Users size={15} />
                Team
              </li>
              <li className="cursor-pointer border-b hover:bg-[#6cb049] text-gray-700 hover:text-white rounded-md px-4 py-2 duration-150 flex items-center gap-x-2">
                <Workflow size={15} />
                Projects
              </li>
            </ul>

            <ul className="flex flex-col xl:hidden overflow-y-auto" style={{ maxHeight: "calc(100vh - 120px)" }}>
              {Menulist.map((item) => (
                <li key={item.id} className="relative">
                  <div
                    className={`cursor-pointer border-b px-4 py-2 duration-150 flex items-center rounded-md text-gray-700 hover:bg-[#6cb049] gap-x-2 hover:text-white ${
                      openSubmenu === item.id ? "bg-[#6cb049] text-white" : ""
                    } `}
                    onClick={() => handleClick(item.id)}
                  >
                    <List />
                    {item.title}
                  </div>
                  {openSubmenu === item.id && item.submenu && (
                    <ul className="shadow-lg p-2 rounded-lg mt-2 ml-2 transition-all duration-300 ease-in-out">
                      {item.submenu.map((submenuItem, index) => (
                        <li
                          key={index}
                          className="cursor-pointer border-b hover:bg-[#d2e8c9] text-gray-700 hover:text-[#6cb049] rounded-md px-4 py-2 duration-150 flex items-center gap-x-2"
                        >
                          <submenuItem.icon size={15} /> {submenuItem.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-auto p-2 border-t">
              <div className="flex flex-col">
                <div className="cursor-pointer border-b hover:bg-[#6cb049] text-gray-700 hover:text-white rounded-md px-4 py-2 duration-150 flex items-center gap-x-2">
                  <Group size={15} />
                  Create a team
                </div>
                <div className="cursor-pointer border-b hover:bg-[#6cb049] text-gray-700 hover:text-white rounded-md px-4 py-2 duration-150 flex items-center gap-x-2">
                  <Trash size={15} />
                  Trash
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
