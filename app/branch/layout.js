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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
