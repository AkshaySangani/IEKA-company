import React from "react";
import { Outlet } from "react-router-dom";
import LeftPanel from "../components/auth/LeftPannel/LeftPanel";
import AuthLogo from "../components/auth/AuthLogo/AuthLogo";

const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full flex-wrap lg:flex-nowrap">
      <LeftPanel />
      <div
        className="relative flex flex-1 flex-col justify-center bg-white
          px-6 py-10
          md:px-[5%]
          lg:px-[5%]
          max-lg:mx-auto
          max-lg:my-4
          max-lg:w-full
          max-lg:max-w-[500px]
          max-lg:py-[60px]"
      >
        <AuthLogo />
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
