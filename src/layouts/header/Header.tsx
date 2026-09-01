import { useLocation } from "react-router-dom";
import { pathNames } from "../../constants/constants";
import AdminMenu from "./AdminMenu";

interface HeaderProps {
  setIsOpen?: (open: boolean) => void;
  isOpen?: boolean;
}

export const pathLabel = {
  DASHBOARD: "Dashboard",

  // Organization
  ORGANIZATION: "Organization",
  BRANCH: "Branch",
  SHIFT: "Shift",
  ADD_SHIFT: "Add Shift",
  DEPARTMENT: "Department",
  ADD_DEPARTMENT: "Add Department",
  DESIGNATION: "Designation",
  COMPANY_HIERARCHY: "Company Hierarchy",
  PEOPLE_HIERARCHY: "People Hierarchy",
  LEAVE: "Leave",
  HOLIDAYS: "Holidays",
  POLICY_CONFIGURATION: "Policy Configuration",
  ADD_POLICY: "Add Policy",

  // Workforce
  WORKFORCE: "Workforce",
  ALL_EMPLOYEES: "All Employees",
  EMPLOYEE_DETAILS: "Employee Details",
  ONBOARDING: "Onboarding",
  ONBOARDING_DETAILS: "Employee Details",
  ONBOARDING_DETAILS_ID: "Employee Details",
  ASSIGN_ROLES_RESPONSIBILITY: "Assign Roles & Responsibility",
  ASSIGN_ROLES_RESPONSIBILITY_ID: "Assign Roles & Responsibility",
  INVITE_EMPLOYEE_FORM: "Invite Employee",
  RESIGNED: "Resigned",
  RELIEVING_LETTER: "Relieving Letter",
  RELIEVING_LETTER_ID: "Relieving Letter",
  EXPERIENCE_LETTER: "Experience Letter",
  EXPERIENCE_LETTER_ID: "Experience Letter",
  FNF_LETTER: "Full & Final Letter",
  FNF_LETTER_ID: "Full & Final Letter",
  TERMINATION: "Termination",
  TERMINATION_LETTER: "Termination Letter",
  TERMINATION_LETTER_ID: "Termination Letter",
  PROMOTION: "Promotion",
  PROMOTION_LETTER: "Promotion Letter",
  PROMOTION_LETTER_ID: "Promotion Letter",

  // Performance
  PERFORMANCE: "Performance",
  ATTENDANCE: "Attendance",
  ATTENDANCE_DETAILS: "Employee Attendance Details",
  ATTENDANCE_DETAILS_ID: "Employee Attendance Details",
  LEAVE_REQUEST: "Leave Request",
  LEAVE_REQUEST_DETAILS: "Leave Request Details",
  LEAVE_REQUEST_DETAILS_ID: "Leave Request Details",
  ADD_LEAVE_REQUEST: "Add Leave Request",
  ADD_LEAVE_REQUEST_ID: "Add Leave Request",
  MANUAL_PUNCH_REQUEST: "Manual Punch Request",

  // Expense
  EXPENSE: "Expense",
  OVERALL_EXPENSE: "Overall Expense",
  REIMBURSEMENT: "Reimbursement",
  ADD_REIMBURSEMENT: "Add Reimbursement",
  REIMBURSEMENT_DETAILS: "Reimbursement Details",
  OFFICE_EXPENSE: "Office Expense",
  ADD_OFFICE_EXPENSE: "Add Office Expense",
  OFFICE_EXPENSE_DETAILS: "Office Expense Details",
  EMPLOYEE_PAYROLL: "Employee Payroll",
  EMPLOYEE_PAYROLL_PERFORMANCE: "Employee Payroll Performance",
  EMPLOYEE_PAYROLL_PERFORMANCE_ID: "Employee Payroll Performance",

  // Pay Slip
  PAY_SLIP: "Pay Slip",
  EARNING: "Earnings",
  PAY_SLIP_DISCLAIMER: "Pay Slip Disclaimer",
  DEDUCTION: "Deductions",
  ALL_EMPLOYEE_PAY_SLIP: "All Employee Pay Slip",
  EMPLOYEE_PAY_SLIP_DETAILS: "Employee Pay Slip Details",
  EMPLOYEE_PAY_SLIP_DETAILS_ID: "Employee Pay Slip Details",
  EMPLOYEE_PAY_SLIP_DOWNLOAD: "Pay Slip Download",
} as const;

export const getPathLabel = (pathname: string): string => {
  const matchedKey = (
    Object.keys(pathNames) as Array<keyof typeof pathNames>
  ).find((key) => {
    const path = pathNames[key];

    // Exact match
    if (pathname === path) {
      return true;
    }

    // Handle dynamic routes like /employee-details/:id
    if (path.includes("/:")) {
      const pathParts = path.split("/");
      const pathnameParts = pathname.split("/");

      if (pathParts.length !== pathnameParts.length) {
        return false;
      }

      return pathParts.every(
        (part, index) =>
          part.startsWith(":") || part === pathnameParts[index],
      );
    }

    return false;
  });

  return matchedKey
    ? pathLabel[matchedKey] || matchedKey
    : "";
};

const Header = ({ setIsOpen, isOpen }: HeaderProps) => {
  const location = useLocation();
  const pathName = getPathLabel(location.pathname);
  return (
    <header
      id="header"
      className={`
        sticky top-0 right-0 z-[999]
        flex h-[60px]
        items-center justify-between
        border-b border-[#ccc]
        bg-white
        px-[20px]
        transition-all duration-300

        lg:px-[20px]
        max-[991px]:left-0
        max-[991px]:w-full
        max-[991px]:px-[15px]

        ${isOpen ? "left-[250px] w-[calc(100%-250px)]" : "left-0 w-full"}
      `}
    >
      <div className="flex min-w-0 items-center">
        <div
          id="sidebarToggle"
          onClick={() => setIsOpen?.(!isOpen)}
          className="cursor-pointer p-[5px] text-[1.2rem] text-[#333]"
        >
          <i className="fas fa-bars" />
        </div>

        {/* Mobile Page Title */}

        <div className="ml-3 min-w-0 max-[991px]:block lg:hidden">
          <h1 className="truncate text-lg font-semibold text-black">{pathName}</h1>
        </div>
      </div>

      <div className="flex items-center">
        <AdminMenu />
      </div>
    </header>
  );
};

export default Header;
