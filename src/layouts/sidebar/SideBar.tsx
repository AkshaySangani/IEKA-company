import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/images/ieka_logo.jpg";
import employeeManagementIcon from "../../assets/images/employee_management.png";

import { MenuItem, SubMenuItem } from "../../types/sidebar-types";
import { useAuthStore } from "../../store/auth-store";
import Image from "../../components/common/image";
import useWidthHeight from "../../hooks/useWidthHeight";
import { getAccessibleMenus } from "../../utils/permission";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const { isMobile } = useWidthHeight();
  const location = useLocation();
  const { user } = useAuthStore();
  const accessibleMenus = getAccessibleMenus(user?.role);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const activeParent = accessibleMenus.find((menu) =>
      menu.submenu?.some((sub) => location.pathname.startsWith(sub.path)),
    );

    if (activeParent) {
      setOpenMenus((prev) => ({
        ...prev,
        [activeParent.label]: true,
      }));
    }

    // eslint-disable-next-line
  }, [location.pathname]);

  const toggleMenu = (menuLabel: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuLabel]: !prev[menuLabel],
    }));
  };

  const handleMenuItemClick = (menuItem: MenuItem | SubMenuItem) => {
    navigate(menuItem.path!);

    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <aside
      id="sidebar"
      className={`
        fixed top-0 left-0
        z-[10000]
        h-full
        w-[250px]
        overflow-hidden
        bg-sidebarBg
        text-sidebarText
        transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo */}
      <div
        className="
          flex
          min-h-[59px]
          max-h-[59px]
          w-full
          items-center
          justify-center
          border-r
          border-borderPrimary
          bg-white
          px-2
          py-[1px]
        "
      >
        <NavLink to="/">
          <Image
            src={user?.company?.companyLogo || logo}
            alt="Logo"
            className="max-h-[50px] max-w-[150px] object-contain"
          />
        </NavLink>
      </div>

      {/* Menu Scroll Area */}
      <div
        className="
          menu-scroll-container
          h-[calc(100%_-_60px)]
          overflow-y-auto
          pb-5
          bg-sidebarBg
        "
      >
        <ul className="list-none p-0">
          {/* Module Header */}
          <li
            className="
              border-b border-[#334056]
              px-[10px]
              py-[15px]
              text-sm
              font-semibold
              uppercase
              text-sidebarText
            "
          >
            <div
              className="
                flex
                flex-col
                items-center
                no-underline
              "
              data-bs-toggle="modal"
              data-bs-target="#all_modules"
            >
              <img
                src={employeeManagementIcon}
                className="employee_manage"
                width="35"
                alt="Employee Management"
              />

              <span
                className="
                  mt-[6px]
                  text-[13px]
                  font-semibold
                  leading-[22px]
                  text-white
                "
              >
                Employee <span className="text-primary">Management</span>
              </span>
            </div>
          </li>

          {accessibleMenus.map((menu) =>
            menu.submenu ? (
              <li key={menu.label}>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMenu(menu.label);
                  }}
                  className={`
                    flex
                    cursor-pointer
                    items-center
                    px-3
                    py-[18px]
                    text-sm
                    text-sidebarText
                    transition-all
                    duration-200
                    hover:text-white
                     ${openMenus[menu.label] ? "text-white" : ""}
                  `}
                >
                  <i
                    className={`${menu.icon} mr-[10px] w-5 text-center text-md`}
                  />

                  <span>{menu.label}</span>

                  <i
                    className={`
                      fas fa-angle-right
                      ml-auto
                      transition-transform
                      duration-300
                      ${openMenus[menu.label] ? "rotate-90" : ""}
                    `}
                  />
                </div>

                <ul
                  className={`
                    overflow-hidden
                    bg-[#1a202a]
                    transition-all
                    duration-300
                    ${
                      openMenus[menu.label]
                        ? "max-h-[1000px] py-[10px]"
                        : "max-h-0"
                    }
                  `}
                >
                  {menu.submenu.map((subMenu) => {
                    const isActive = location.pathname.startsWith(subMenu.path);

                    return (
                      <li
                        key={subMenu.path}
                        className={`
                          ml-5
                          ${
                            isActive
                              ? `
                                border-l-[3px]
                                border-l-primary
                                bg-[linear-gradient(267deg,#3b6cbb,#2e466e)]
                                text-white
                              `
                              : ""
                          }
                        `}
                      >
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            handleMenuItemClick(subMenu);
                          }}
                          className="
                            relative
                            cursor-pointer
                            px-5
                            py-[15px]
                            text-sm
                            transition-all
                            duration-200
                            hover:text-white
                          "
                        >
                          {subMenu.label}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ) : (
              <li
                key={menu.path}
                className={`
                  ${
                    location.pathname === menu.path
                      ? `
                        border-l-[3px]
                        border-l-[var(--primary-color)]
                        bg-[linear-gradient(267deg,#457cd5,#2e466e)]
                        text-white
                        shadow-[rgb(25_25_32_/_34%)_1px_4px_11px_3px,rgba(0,0,0,0.3)_0px_2px_11px_-8px]
                      `
                      : ""
                  }
                `}
              >
                <div
                  onClick={() => {
                    setOpenMenus({});
                    handleMenuItemClick(menu);
                  }}
                  className={`
                    flex
                    cursor-pointer
                    items-center
                    px-3
                    py-[18px]
                    text-sm
                    text-sidebarText
                    transition-all
                    duration-200
                    hover:text-white
                    ${location.pathname === menu.path ? "text-white" : ""}
                  `}
                >
                  <i
                    className={`${menu.icon} mr-[10px] w-5 text-center text-[var(--font-md)]`}
                  />

                  <span>{menu.label}</span>
                </div>
              </li>
            ),
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
