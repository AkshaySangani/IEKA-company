import React from "react";
import Image from "../common/image";

import IekaLogo from "../../assets/images/ieka_logo.png";

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center text-center">
        <Image
          fallbackSrc={IekaLogo}
          alt="App Logo"
          className="h-24 w-24 animate-pulse object-contain"
        />

        <h1 className="mt-5 text-xl font-medium text-secondary">
          IEKA
        </h1>

        <h3 className="text-secondary">Manage your workforce</h3>

        <p className="mt-2 text-sm text-secondary/60">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;