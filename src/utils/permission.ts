import { menuItems, pathNames, roleBasePaths } from "../constants/constants";
import { RoleEnum } from "../types/common-types";
import { MenuItem } from "../types/sidebar-types";

export const hasPathAccess = (
  role: string = "",
  path: string,
): boolean => {
  return roleBasePaths?.[role]?.includes(path) || false;
};

export const getAccessibleMenus = (
  role: string = "",
): MenuItem[] => {
  return menuItems
    .map((menu) => {
      // Menu with submenu
      if (menu.submenu?.length) {
        const filteredSubmenu = menu.submenu.filter((subMenu) =>
          hasPathAccess(role, subMenu.path),
        );

        return {
          ...menu,
          submenu: filteredSubmenu,
        };
      }

      return menu;
    })
    .filter((menu) => {
      // Show menu if it has accessible submenu
      if (menu.submenu?.length) {
        return true;
      }

      // Show normal menu if user has access
      return hasPathAccess(role, menu.path??"");
    });
};

export const getDefaultRouteByRole = (role: string = ""): string => {
    return {
        [RoleEnum.OWNER]: pathNames.DASHBOARD,
        [RoleEnum.MANAGER]: pathNames.ALL_EMPLOYEES
    }[role]??pathNames.DASHBOARD;
};