"use client";
import { Roboto } from 'next/font/google';
import "./globals.css";
import Header from './component/Header';
import Sidebar from './component/Sidebar';
import { useState, useEffect } from "react";

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export default function BranchLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  if (!isMounted) {
   
    return null;
  }

  return (
    <html lang="en">
      <body className={roboto.className}>
        <Header />
        <div className="flex">
          <Sidebar onToggleSidebar={handleSidebarToggle} />
          <div
            className={`transition-all duration-300 ${
              isSidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
            }`}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
