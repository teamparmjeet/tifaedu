"use client";
import { Roboto } from 'next/font/google';
import "./globals.css";
import Header from './component/Header';
import Sidebar from './component/Sidebar';
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      // setIsLgScreen(isLargeScreen);
      setIsSidebarOpen(isLargeScreen && pathname !== "/main/page/allquery"); // Sidebar open by default on large screens, closed on /allquery
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname]);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    // Automatically close sidebar when on "/main/page/allquery"
    if (pathname === "/main/page/allquery") {
      setIsSidebarOpen(false);
      // setIsLgScreen(true)
    }
  }, [pathname]);
  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <html lang="en">
      <body className={roboto.className}>
        <div className="h-screen flex flex-col">
         
          <Header />

          <div className="flex flex-1 overflow-hidden">
           
            <Sidebar onToggleSidebar={handleSidebarToggle} />

         
            <div
              className={`flex-1 transition-all duration-300 overflow-auto ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}
            >
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
