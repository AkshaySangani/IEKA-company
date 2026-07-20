import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import UserAvatar from "../../assets/images/User-Image.png";
import Modal from "../../components/common/modal/Modal";
import Image from "../../components/common/image";

import { removeLocalStorageData } from "../../utils/helper";
import { storageKeys } from "../../constants/constants";
import { useAuthStore } from "../../store/auth-store";
import { logoutApi } from "../../apis/auth/auth.api";

const AdminMenu = () => {
  const { clearAuth, user, refreshToken } = useAuthStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [logoutOpen, setLogoutOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // handle logout
  const handleLogout = async () => {
    setLoading(true);
    const response = await logoutApi({
      refreshToken: refreshToken ?? "",
    });
    if (response.success) {
      removeLocalStorageData(storageKeys.authStorage);
      clearAuth();
      setLoading(false);
    }
  };

  const handleMenuOenClose = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      <div className="header-right" ref={dropdownRef}>
        <div className="relative cursor-pointer" id="profileDropdownContainer">
          <div
            id="userAvatar"
            onClick={handleMenuOenClose}
            className="flex cursor-pointer items-center"
          >
            <Image
              src={user?.profileImage}
              alt="User"
              fallbackSrc={UserAvatar}
              className="h-10 w-10 rounded-[24px] border border-[#ddd] object-cover"
            />

            <div className="ml-[10px] flex flex-col">
              <span className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </span>

              <span className="text-xs font-medium text-[#7e7e7e]">Admin</span>
            </div>
          </div>

          <div
            id="profileDropdown"
            className={`absolute right-0 top-[50px] z-[1050] w-[220px] rounded-md bg-white py-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 ${
              menuOpen
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-[10px] opacity-0"
            }`}
          >
            <div className="mt-[5px] px-[15px] pb-[5px] pt-[10px] text-xs uppercase text-[#adb5bd]">
              Account
            </div>

            <ul className="list-none p-0">
              <li>
                <NavLink
                  to="/my-profile"
                  onClick={handleMenuOenClose}
                  className="flex items-center px-[15px] py-[10px] text-sm text-[#333] hover:bg-[#faf8fa]"
                >
                  <i className="fas fa-user-circle mr-[10px] w-5 text-center text-sm text-[#6c757d]" />
                  My Profile
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/change-password"
                  onClick={handleMenuOenClose}
                  className="flex items-center px-[15px] py-[10px] text-sm text-[#333] hover:bg-[#faf8fa]"
                >
                  <i className="fas fa-lock mr-[10px] w-5 text-center text-sm text-[#6c757d]" />
                  Password Change
                </NavLink>
              </li>
            </ul>

            <ul className="mb-0 mt-[10px] list-none border-t border-[#e9ecef] p-0 pt-[10px]">
              <li
                onClick={() => {
                  handleMenuOenClose();
                  setLogoutOpen((prev) => !prev);
                }}
              >
                <div className="flex items-center px-[15px] py-[10px] text-sm text-[#e3342f] hover:bg-[#faf8fa]">
                  <i className="fas fa-sign-out-alt mr-[10px] w-5 text-center text-sm text-[#e3342f]" />
                  Logout
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Modal
        isOpen={logoutOpen}
        title="Logout"
        width="max-w-xl"
        onClose={() => setLogoutOpen((prev) => !prev)}
        handleOnConfirm={handleLogout}
        loading={loading}
      >
        <div className="px-6 py-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <i className="fas fa-sign-out-alt text-2xl text-red-500" />
          </div>

          <h4 className="mb-2 text-lg font-semibold text-gray-800">
            Are you sure you want to logout?
          </h4>

          <p className="text-sm text-gray-500">
            You are about to logout from your account. You will need to login
            again to access the system.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default AdminMenu;
