import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/SideBar";
import Header from "./header/Header";
import useWidthHeight from "../hooks/useWidthHeight";

const AppLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const {isMobile} = useWidthHeight();

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <>
          <Header setIsOpen={setIsOpen} isOpen={isOpen} />

          <main
            className={`main-content overflow-hidden relative flex flex-col flex-1 ${isOpen ? "sidebar-open" : "ml-0"}`}
            id="mainContent"
          >
            <Outlet />
          </main>
        </>
      </div>

      <div
        onClick={() => setIsOpen(false)}
        className={`
          fixed inset-0 z-[999]
          bg-black/50
          transition-all duration-300 ease-in-out
          lg:hidden
          ${
            isMobile && isOpen
              ? "visible opacity-100"
              : "invisible opacity-0 pointer-events-none"
          }
        `}
      />
    </>
  );
};

export default AppLayout;
