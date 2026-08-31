import {
  documentEnum,
  employeeDocuments,
  EmploymentTypeEnum,
  IOption,
  leaveEncashmentType,
  ObjectType,
  RoleEnum,
  statusEnum,
  ValueType,
} from "../types/common-types";
import { MenuItem } from "../types/sidebar-types";

export const storageKeys = {
  authStorage: "authStorage",
};

export const roleNames: any = {
  [RoleEnum.OWNER]: "COO",
  [RoleEnum.MANAGER]: "Manager",
  [RoleEnum.EMPLOYEE]: "Employee",
};

export const pathNames = {
  DASHBOARD: "/",

  // Organization
  ORGANIZATION: "/organization",
  BRANCH: "/organization/branch",
  SHIFT: "/organization/shift",
  ADD_SHIFT: "/organization/shift/add-shift",
  DEPARTMENT: "/organization/department",
  ADD_DEPARTMENT: "/organization/department/add-department",
  DESIGNATION: "/organization/designation",
  COMPANY_HIERARCHY: "/organization/company-hierarchy",
  PEOPLE_HIERARCHY: "/organization/people-hierarchy",
  LEAVE: "/organization/leave",
  HOLIDAYS: "/organization/holidays",
  POLICY_CONFIGURATION: "/organization/policy-configuration",
  ADD_POLICY: "/organization/policy-configuration/add-policy",

  // Workforce
  WORKFORCE: "/workforce",
  ALL_EMPLOYEES: "/workforce/all-employees",
  EMPLOYEE_DETAILS: "/workforce/all-employees/employee_details",
  ONBOARDING: "/workforce/onboarding",
  ONBOARDING_DETAILS: "/workforce/onboarding/employee-details",
  ONBOARDING_DETAILS_ID: "/workforce/onboarding/employee-details/:id",
  ASSIGN_ROLES_RESPONSIBILITY:
    "/workforce/onboarding/assign-roles-responsibility",
  ASSIGN_ROLES_RESPONSIBILITY_ID:
    "/workforce/onboarding/assign-roles-responsibility/:id",
  INVITE_EMPLOYEE_FORM: "/invite_employee_form",
  RESIGNED: "/workforce/resigned",
  RELIEVING_LETTER: "/workforce/resigned/relieving-letter",
  RELIEVING_LETTER_ID: "/workforce/resigned/relieving-letter/:id",
  EXPERIENCE_LETTER: "/workforce/resigned/experience-letter",
  EXPERIENCE_LETTER_ID: "/workforce/resigned/experience-letter/:id",
  FNF_LETTER: "/workforce/resigned/fool-and-final-letter",
  FNF_LETTER_ID: "/workforce/resigned/fool-and-final-letter/:id",
  TERMINATION: "/workforce/termination",
  TERMINATION_LETTER: "/workforce/termination/termination-letter",
  TERMINATION_LETTER_ID: "/workforce/termination/termination-letter/:id",
  PROMOTION: "/workforce/promotion",
  PROMOTION_LETTER: "/workforce/promotion/promotion-letter",
  PROMOTION_LETTER_ID: "/workforce/promotion/promotion-letter/:id",

  // Performance
  PERFORMANCE: "/performance",
  ATTENDANCE: "/performance/attendance",
  ATTENDANCE_DETAILS_ID:
    "/performance/attendance/employee-attendance-details/:id",
  ATTENDANCE_DETAILS: "/performance/attendance/employee-attendance-details",
  LEAVE_REQUEST: "/performance/leave-request",
  LEAVE_REQUEST_DETAILS: "/performance/leave-request-details",
  LEAVE_REQUEST_DETAILS_ID: "/performance/leave-request-details/:id",
  ADD_LEAVE_REQUEST: "/performance/leave-request/add-leave-request",
  ADD_LEAVE_REQUEST_ID: "/performance/leave-request/add-leave-request/:id",
  MANUAL_PUNCH_REQUEST: "/performance/manual-punch-request",

  // Expense
  EXPENSE: "/expense",
  OVERALL_EXPENSE: "/expense/overall-expense",
  REIMBURSEMENT: "/expense/reimbursement",
  ADD_REIMBURSEMENT: "/expense/reimbursement/add-reimbursement",
  REIMBURSEMENT_DETAILS: "/expense/reimbursement/reimbursement-details",
  OFFICE_EXPENSE: "/expense/office-expense",
  ADD_OFFICE_EXPENSE: "/expense/office-expense/add-expense",
  OFFICE_EXPENSE_DETAILS: "/expense/office-expense/expense-details",
  EMPLOYEE_PAYROLL: "/expense/payroll",
  EMPLOYEE_PAYROLL_PERFORMANCE_ID: "/expense/payroll/employee-payroll-performance/:id",
  EMPLOYEE_PAYROLL_PERFORMANCE: "/expense/payroll/employee-payroll-performance",

  // Pay Slip
  PAY_SLIP: "/pay-slip",
  EARNING: "/pay-slip/earnings",
  PAY_SLIP_DISCLAIMER: "/pay-slip/earnings/payslip-disclaimer",
  DEDUCTION: "/pay-slip/deductions",
  ALL_EMPLOYEE_PAY_SLIP: "/pay-slip/all-employee-pay-slip",
  EMPLOYEE_PAY_SLIP_DETAILS_ID: "/pay-slip/all-employee-pay-slip/employee-pay-slip-details/:id",
  EMPLOYEE_PAY_SLIP_DETAILS: "/pay-slip/all-employee-pay-slip/employee-pay-slip-details",
  EMPLOYEE_PAY_SLIP_DOWNLOAD: "/pay-slip/all-employee-pay-slip/pay-slip-download"
} as const;

  // =========================
  // Employee Routes
  // =========================
export const employeePathNames = {
  DASHBOARD: "/",
  PERFORMANCE: "/performance",
  ATTENDANCE: "/performance/attendance",
  LEAVE_REQUEST: "/performance/leave-request",
  ADD_LEAVE_REQUEST: "/performance/leave-request/add-leave-request",
  ADD_LEAVE_REQUEST_ID: "/performance/leave-request/add-leave-request/:id",
  MANUAL_PUNCH_REQUEST: "/performance/manual-punch-request",
  REIMBURSEMENT: "/reimbursement",
  ADD_REIMBURSEMENT: "/reimbursement/add-reimbursement",
  REIMBURSEMENT_DETAILS: "/reimbursement/reimbursement-details",
  RESIGNATION: "/resignation",
  PAY_SLIP: "/pay_slip",
  PAY_SLIP_DOWNLOAD: "/pay_slip/pay-slip-download"
}

export const roleBasePaths: ObjectType = {
  [RoleEnum.MANAGER]: [
    // dashboard
    pathNames.DASHBOARD,
    // Workforce
    pathNames.WORKFORCE,
    pathNames.ALL_EMPLOYEES,
    pathNames.EMPLOYEE_DETAILS,
    pathNames.RESIGNED,
    pathNames.TERMINATION,
    pathNames.TERMINATION_LETTER_ID,
    pathNames.TERMINATION_LETTER,
    pathNames.PROMOTION,

    // Performance
    pathNames.PERFORMANCE,
    pathNames.ATTENDANCE,
    pathNames.ATTENDANCE_DETAILS_ID,
    pathNames.ATTENDANCE_DETAILS,
    pathNames.LEAVE_REQUEST,
    pathNames.ADD_LEAVE_REQUEST,
    pathNames.ADD_LEAVE_REQUEST_ID,
    pathNames.MANUAL_PUNCH_REQUEST,

    // Expense
    pathNames.EXPENSE,
    pathNames.REIMBURSEMENT,
    pathNames.ADD_REIMBURSEMENT,
    pathNames.REIMBURSEMENT_DETAILS,
    pathNames.OFFICE_EXPENSE,
    pathNames.ADD_OFFICE_EXPENSE,
    pathNames.OFFICE_EXPENSE_DETAILS,

    // pay-slip
    employeePathNames.PAY_SLIP,
    employeePathNames.PAY_SLIP_DOWNLOAD
  ],

  [RoleEnum.OWNER]: Object.values(pathNames),

  [RoleEnum.EMPLOYEE]: Object.values(employeePathNames),
};
export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: "fa-solid fa-chart-pie",
    path: pathNames.DASHBOARD,
  },
  {
    label: "Organization",
    icon: "fa-solid fa-building",
    path: pathNames.ORGANIZATION,
    submenu: [
      {
        label: "Branch",
        path: pathNames.BRANCH,
      },
      {
        label: "Shift",
        path: pathNames.SHIFT,
      },
      {
        label: "Department",
        path: pathNames.DEPARTMENT,
      },
      {
        label: "Designation",
        path: pathNames.DESIGNATION,
      },
      {
        label: "Company Hierarchy",
        path: pathNames.COMPANY_HIERARCHY,
      },
      {
        label: "People Hierarchy",
        path: pathNames.PEOPLE_HIERARCHY,
      },
      {
        label: "Leave",
        path: pathNames.LEAVE,
      },
      {
        label: "Holidays",
        path: pathNames.HOLIDAYS,
      },
      {
        label: "Policy Configuration",
        path: pathNames.POLICY_CONFIGURATION,
      },
    ],
  },
  {
    label: "Workforce",
    icon: "fa-solid fa-people-group",
    path: pathNames.WORKFORCE,
    submenu: [
      {
        label: "All Employees",
        path: pathNames.ALL_EMPLOYEES,
      },
      {
        label: "Onboarding",
        path: pathNames.ONBOARDING,
      },
      {
        label: "Resigned",
        path: pathNames.RESIGNED,
      },
      {
        label: "Termination",
        path: pathNames.TERMINATION,
      },
      {
        label: "Promotion",
        path: pathNames.PROMOTION,
      },
    ],
  },
  {
    label: "Performance",
    icon: "fa-solid fa-user-plus",
    path: pathNames.PERFORMANCE,
    submenu: [
      {
        label: "Attendance",
        path: pathNames.ATTENDANCE,
      },
      {
        label: "Leave Request",
        path: pathNames.LEAVE_REQUEST,
      },
      {
        label: "Manual Punch Request",
        path: pathNames.MANUAL_PUNCH_REQUEST,
      },
    ],
  },
  {
    label: "Expense",
    icon: "fa-solid fa-road-circle-check",
    path: pathNames.EXPENSE,
    submenu: [
      {
        label: "Overall Expense",
        path: pathNames.OVERALL_EXPENSE,
      },
      {
        label: "Reimbursement",
        path: pathNames.REIMBURSEMENT,
      },
      {
        label: "Office Expense",
        path: pathNames.OFFICE_EXPENSE,
      },
      {
        label: "Employee Payroll",
        path: pathNames.EMPLOYEE_PAYROLL,
      },
    ],
  },
  {
    label: "Pay slip",
    icon: "fa-solid fa-calculator",
    path: pathNames.PAY_SLIP,
    submenu: [
      {
        label: "Earnings",
        path: pathNames.EARNING,
      },
      {
        label: "Deductions",
        path: pathNames.DEDUCTION,
      },
      {
        label: "Employee Payslip",
        path: pathNames.ALL_EMPLOYEE_PAY_SLIP,
      },
    ],
  },
];

export const manageExtraMenuItems: MenuItem[] = [
  {
    label: "Pay slip",
    icon: "fa-solid fa-file-circle-check",
    path: employeePathNames.PAY_SLIP,
  },
]
export const employeeMenuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: "fas fa-chart-bar",
    path: employeePathNames.DASHBOARD,
  },
  {
    label: "Performance",
    icon: "fa-solid fa-user-plus",
    path: employeePathNames.PERFORMANCE,
    submenu: [
      {
        label: "Attendance",
        path: employeePathNames.ATTENDANCE,
      },
      {
        label: "Apply Leave",
        path: employeePathNames.LEAVE_REQUEST,
      },
      {
        label: "Manual Punch Requests",
        path: employeePathNames.MANUAL_PUNCH_REQUEST,
      },
    ],
  },
  {
    label: "Apply Reimbursement",
    icon: "fa-solid fa-road-circle-check",
    path: employeePathNames.REIMBURSEMENT
  },
  {
    label: "Pay slip",
    icon: "fa-solid fa-file-circle-check",
    path: employeePathNames.PAY_SLIP,
  },
  {
    label: "Apply Resignation",
    icon: "fa-solid fa-person-circle-xmark",
    path: employeePathNames.RESIGNATION,
  },
];

export const statusMessage: { [key: string]: string } = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  DELETED: "Deleted",
  ACCEPTED: "Accepted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PENDING: "Pending",
  CANCEL: "Cancel",
  TERMINATE: "Terminate",
  PROMOTED: "Promoted",
  HOLD: "Hold",
  PRESENT: "Present",
  HALF_DAY: "Half Day",
  ABSENT: "Absent",
  HOLIDAY: "Holiday",
  LEAVE: "Leave",
  WEEK_OFF: "Week Off",
};

export const statusColor: { [key: string]: string } = {
  ACTIVE: "text-success",
  INACTIVE: "text-warning",
  DELETED: "text-danger",
  ACCEPTED: "text-success",
  REJECTED: "text-danger",
  PENDING: "text-pending",
  APPROVED: "text-success",
  CANCEL: "text-danger",
  TERMINATE: "text-success",
  PROMOTED: "text-success",
  HOLD: "text-warning",
};

export const statusBgColor: { [key: string]: string } = {
  ACTIVE: "bg-success",
  INACTIVE: "bg-warning",
  DELETED: "bg-danger",
  ACCEPTED: "bg-success",
  REJECTED: "bg-danger",
  PENDING: "bg-pending",
  APPROVED: "bg-success",
  CANCEL: "bg-danger",
  TERMINATE: "bg-success",
  PROMOTED: "bg-success",
  HOLD: "bg-warning",
};

export const moduleEnum: ObjectType = {
  EMPLOYEE: "EMPLOYEE",
  PRODUCTION: "PRODUCTION",
};

export const companyModules: ObjectType = {
  employee: moduleEnum.EMPLOYEE,
  production: moduleEnum.PRODUCTION,
};

export const gender: ObjectType = {
  male: "Male",
  female: "Female",
  other: "Other",
};

export const bankAccount: ObjectType = {
  SAVING: "Saving",
  CURRENT: "Current",
};

export const bankAccountEnum: ObjectType = {
  SAVING: "SAVING",
  CURRENT: "CURRENT",
};

export const branchEnum: {
  HEAD_OFFICE: "HEAD_OFFICE";
  BRANCH: "BRANCH";
} = {
  HEAD_OFFICE: "HEAD_OFFICE",
  BRANCH: "BRANCH",
};

export const leaveTypeEnum: {
  PAID: "PAID";
  UNPAID: "UNPAID";
} = {
  PAID: "PAID",
  UNPAID: "UNPAID",
};

export const branch: ObjectType = {
  HEAD_OFFICE: "Head Office",
  BRANCH: "Branch Office",
};

export const genderOptions: IOption[] = [
  {
    label: gender.male,
    value: "male",
  },
  {
    label: gender.female,
    value: "female",
  },
  {
    label: gender.other,
    value: "other",
  },
];
export const roles = {
  [RoleEnum.MANAGER]: "Manager",
  [RoleEnum.EMPLOYEE]: "Employee",
};
export const roleOptions: IOption[] = [
  {
    label: roles.MANAGER,
    value: RoleEnum.MANAGER,
  },
  {
    label: roles.EMPLOYEE,
    value: RoleEnum.EMPLOYEE,
  },
];

export const bloodGroupOptions: IOption[] = [
  {
    label: "A+",
    value: "A+",
  },
  {
    label: "A-",
    value: "A-",
  },
  {
    label: "B+",
    value: "B+",
  },
  {
    label: "B-",
    value: "B-",
  },
  {
    label: "AB+",
    value: "AB+",
  },
  {
    label: "AB-",
    value: "AB-",
  },
  {
    label: "O+",
    value: "O+",
  },
  {
    label: "O-",
    value: "O-",
  },
];

export const maritalStatusOptions: IOption[] = [
  {
    label: "Single",
    value: "single",
  },
  {
    label: "Married",
    value: "married",
  },
  // {
  //   label: "Divorced",
  //   value: "divorced",
  // },
];

export const accountOptions: IOption[] = [
  {
    label: bankAccount.SAVING,
    value: bankAccountEnum.SAVING,
  },
  {
    label: bankAccount.CURRENT,
    value: bankAccountEnum.CURRENT,
  },
];

export const leaveTypeOptions: IOption[] = [
  {
    label: leaveTypeEnum.PAID,
    value: leaveTypeEnum.PAID,
  },
  {
    label: leaveTypeEnum.UNPAID,
    value: leaveTypeEnum.UNPAID,
  },
];

export const accountStatusOptions: IOption[] = [
  {
    label: statusMessage.ACTIVE,
    value: statusEnum.ACTIVE,
  },
  {
    label: statusMessage.INACTIVE,
    value: statusEnum.INACTIVE,
  },
];

export const leavePeriodOptions = [
  {
    label: "Yearly",
    value: leaveEncashmentType.YEARLY,
  },
  {
    label: "Full and Final only",
    value: leaveEncashmentType.FULL_FINAL,
  },
];

export const yesNoEnum: {
  YES: "YES";
  NO: "NO";
} = {
  YES: "YES",
  NO: "NO",
};

export const yesNo: ObjectType = {
  YES: "Yes",
  NO: "No",
};
export const yesNoOption: IOption[] = [
  {
    label: yesNo.YES,
    value: yesNoEnum.YES,
  },
  {
    label: yesNo.NO,
    value: yesNoEnum.NO,
  },
];

export const branchOptions: IOption[] = [
  {
    label: branch.HEAD_OFFICE,
    value: branchEnum.HEAD_OFFICE,
  },
  {
    label: branch.BRANCH,
    value: branchEnum.BRANCH,
  },
];

export const statusOptions: IOption[] = [
  {
    label: statusMessage.ACTIVE,
    value: statusEnum.ACTIVE,
  },
  {
    label: statusMessage.INACTIVE,
    value: statusEnum.INACTIVE,
  },
  {
    label: statusMessage.DELETED,
    value: statusEnum.DELETED,
  },
];

export const expenseStatusOptions: IOption[] = [
  {
    label: statusMessage.APPROVED,
    value: statusEnum.APPROVED,
  },
  {
    label: statusMessage.PENDING,
    value: statusEnum.PENDING,
  },
  {
    label: statusMessage.REJECTED,
    value: statusEnum.REJECTED,
  },
];

export const acceptStatusOptions: IOption[] = [
  {
    label: statusMessage.ACCEPTED,
    value: statusEnum.ACCEPTED,
  },
  {
    label: statusMessage.PENDING,
    value: statusEnum.PENDING,
  },
  {
    label: statusMessage.REJECTED,
    value: statusEnum.REJECTED,
  },
];

export const terminationStatusOptions: IOption[] = [
  {
    label: statusMessage.TERMINATE,
    value: statusEnum.TERMINATE,
  },
  {
    label: statusMessage.HOLD,
    value: statusEnum.HOLD,
  },
  {
    label: statusMessage.CANCEL,
    value: statusEnum.CANCEL,
  },
];

export const promotionStatusOptions: IOption[] = [
  {
    label: statusMessage.PROMOTED,
    value: statusEnum.PROMOTED,
  },
  {
    label: statusMessage.HOLD,
    value: statusEnum.HOLD,
  },
  {
    label: statusMessage.CANCEL,
    value: statusEnum.CANCEL,
  },
];

export const payValueType = {
  [ValueType.FIXED]: "₹",
  [ValueType.PERCENTAGE]: "%",
};

export const documentType: any = {
  [documentEnum.adhar]: employeeDocuments.aadhaarCard,
  [documentEnum.drivingId]: employeeDocuments.drivingLicense,
  [documentEnum.pan]: employeeDocuments.panCard,
  [documentEnum.passport]: employeeDocuments.passport,
  [documentEnum.voterId]: employeeDocuments.voterId,
};

export const payValueTypeOptions = [
  {
    label: payValueType[ValueType.FIXED],
    value: ValueType.FIXED,
  },
  {
    label: payValueType[ValueType.PERCENTAGE],
    value: ValueType.PERCENTAGE,
  },
];

export const employmentType = {
  [EmploymentTypeEnum.PERMANENT]: "Permanent",
  [EmploymentTypeEnum.CONTRACT]: "Contract",
  [EmploymentTypeEnum.INTERN]: "Intern",
  [EmploymentTypeEnum.CONSULTANT]: "Consultant",
};

export const employmentTypeOptions = [
  {
    label: employmentType[EmploymentTypeEnum.PERMANENT],
    value: EmploymentTypeEnum.PERMANENT,
  },
  {
    label: employmentType[EmploymentTypeEnum.CONTRACT],
    value: EmploymentTypeEnum.CONTRACT,
  },
  {
    label: employmentType[EmploymentTypeEnum.INTERN],
    value: EmploymentTypeEnum.INTERN,
  },
  {
    label: employmentType[EmploymentTypeEnum.CONSULTANT],
    value: EmploymentTypeEnum.CONSULTANT,
  },
];

export const probationPeriodOptions = Array.from({ length: 7 }, (_, index) => ({
  label: `${index} Month${index !== 1 ? "s" : ""}`,
  value: index,
}));

export const currency = {
  INR: "₹",
};
