import { employeeMenuItems, employeePathNames, menuItems, pathNames, roleBasePaths } from "../constants/constants";
import { RoleEnum, ViewModeEnum } from "../types/common-types";
import { MenuItem } from "../types/sidebar-types";

import { matchPath } from "react-router-dom";

export const hasPathAccess = (
  role: RoleEnum,
  path: string,
  viewMode?: ViewModeEnum
): boolean => {
  const allowedPaths = getAllowedPaths(role,viewMode);

  return allowedPaths.some((allowedPath: any) =>
    matchPath({ path: allowedPath, end: true }, path)
  );
};

export const getAllowedPaths = (
  role: RoleEnum,
  viewMode?: ViewModeEnum,
) => {
  if (role === RoleEnum.MANAGER && viewMode) {
      return roleBasePaths?.[viewMode]
  }

  return roleBasePaths?.[role];
};

export const getAccessibleMenus = (
  role: RoleEnum,
): MenuItem[] => {
  if(role === RoleEnum.EMPLOYEE){
    return employeeMenuItems;
  }
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

export const getDefaultRouteByRole = (role: RoleEnum, viewMode: ViewModeEnum | null): string => {
    return {
        [RoleEnum.OWNER]: pathNames.DASHBOARD,
        [RoleEnum.MANAGER]: viewMode ? employeePathNames.DASHBOARD : pathNames.DASHBOARD,
        [RoleEnum.EMPLOYEE]: employeePathNames.DASHBOARD
    }[role];
};