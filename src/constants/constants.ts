import { documentEnum, employeeDocuments, EmploymentTypeEnum, IOption, leaveEncashmentType, ObjectType, RoleEnum, statusEnum, ValueType } from "../types/common-types";
import { MenuItem } from "../types/sidebar-types";

export const storageKeys = {
  authStorage: "authStorage",
};



export const roleNames: any = {
  [RoleEnum.OWNER]: "Owner",
  [RoleEnum.MANAGER]: "Manager",
  [RoleEnum.EMPLOYEE]: "Employee"
}

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
  ONBOARDING: "/workforce/onboarding",
  EMPLOYEE_DETAILS: "/workforce/onboarding/employee-details",
  ASSIGN_ROLES_RESPONSIBILITY: "/workforce/onboarding/assign-roles-responsibility",
  INVITE_EMPLOYEE_FORM: "/invite_employee_form",
  RESIGNED: "/workforce/resigned",
  TERMINATION: "/workforce/termination",
  PROMOTION: "/workforce/promotion",

  // Performance
  PERFORMANCE: "/performance",
  ATTENDANCE: "/performance/attendance",
  LEAVE_REQUEST: "/performance/leave-request",
  MANUAL_PUNCH_REQUEST: "/performance/manual-punch-request",

  // Expense
  EXPENSE: "/expense",
  OVERALL_EXPENSE: "/expense/overall-expense",
  REIMBURSEMENT: "/expense/reimbursement",
  ADD_REIMBURSEMENT: "/expense/reimbursement/add-reimbursement",
  REIMBURSEMENT_DETAILS: "/expense/reimbursement/reimbursement-details",
  OFFICE_EXPENSE: "/expense/office-expense",
  PAYROLL: "/expense/payroll",

  // Pay Slip
  PAY_SLIP: "/pay-slip",
  EARNING: "/pay-slip/earnings",
  PAY_SLIP_DISCLAIMER: "/pay-slip/earnings/payslip-disclaimer",
  DEDUCTION: "/pay-slip/deductions",
  PAY_SLIP_ANNUAL_SHEET: "/pay-slip/pay-slip-annual-sheet",
  ALL_EMPLOYEE_PAY_SLIP: "/pay-slip/all-employee-pay-slip",
} as const;

export const roleBasePaths: ObjectType = {
  [RoleEnum.MANAGER]: [
    // Workforce
    pathNames.WORKFORCE,
    pathNames.ALL_EMPLOYEES,
    pathNames.RESIGNED,
    pathNames.TERMINATION,
    pathNames.PROMOTION,

    // Performance
    pathNames.PERFORMANCE,
    pathNames.ATTENDANCE,
    pathNames.LEAVE_REQUEST,
    pathNames.MANUAL_PUNCH_REQUEST,

    // Expense
    pathNames.EXPENSE,
    pathNames.REIMBURSEMENT,
    pathNames.OFFICE_EXPENSE,

    // Pay Slip
    pathNames.PAY_SLIP,
    pathNames.ALL_EMPLOYEE_PAY_SLIP,
  ],

  [RoleEnum.OWNER]: Object.values(pathNames)
};
export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: "fas fa-users",
    path: pathNames.DASHBOARD,
  },
  {
    label: "Organization",
    icon: "fas fa-file",
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
    icon: "fa-solid fa-money-bill",
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
    icon: "fas fa-briefcase",
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
    icon: "fas fa-briefcase",
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
        label: "Payroll",
        path: pathNames.PAYROLL,
      },
    ],
  },
  {
    label: "Pay slip",
    icon: "fas fa-briefcase",
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
        label: "Pay slip & Annual Sheet",
        path: pathNames.PAY_SLIP_ANNUAL_SHEET,
      },
      {
        label: "All Employee Pay slip",
        path: pathNames.ALL_EMPLOYEE_PAY_SLIP,
      },
    ],
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
};

export const statusColor: { [key: string]: string } = {
  ACTIVE: "text-success",
  INACTIVE: "text-warning",
  DELETED: "text-danger",
  ACCEPTED: "text-success",
  REJECTED: "text-danger",
  PENDING: "text-pending",
  APPROVED: "text-success",
};

export const moduleEnum: ObjectType = {
  EMPLOYEE: "EMPLOYEE",
  PRODUCTION: "PRODUCTION"
} 

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
  BRANCH: "BRANCH"
}

export const leaveTypeEnum: {
  PAID: "PAID";
  UNPAID: "UNPAID";
} = {
  PAID: "PAID",
  UNPAID: "UNPAID",
}

export const branch: ObjectType = {
  HEAD_OFFICE: "Head Office",
  BRANCH: "Branch Office"
}

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
  [RoleEnum.EMPLOYEE]: "Employee"
}
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
  YES: "YES",
  NO: "NO"
} = {
  "YES": "YES",
  "NO": "NO"
}

export const yesNo: ObjectType = {
  "YES": "Yes",
  "NO": "No"
}
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

export const payValueType = {
  [ValueType.FIXED]: "₹",
  [ValueType.PERCENTAGE]: "%"
}

export const documentType: any = {
  [documentEnum.adhar]: employeeDocuments.aadhaarCard,
  [documentEnum.drivingId]: employeeDocuments.drivingLicense,
  [documentEnum.pan]: employeeDocuments.panCard,
  [documentEnum.passport]: employeeDocuments.passport,
  [documentEnum.voterId]: employeeDocuments.voterId
}

export const payValueTypeOptions = [
  {
    label: payValueType[ValueType.FIXED],
    value: ValueType.FIXED
  },
  {
    label: payValueType[ValueType.PERCENTAGE],
    value: ValueType.PERCENTAGE
  }
]

export const employmentType = {
  [EmploymentTypeEnum.PERMANENT]: "Permanent",
  [EmploymentTypeEnum.CONTRACT]: "Contract",
  [EmploymentTypeEnum.INTERN]: "Intern",
  [EmploymentTypeEnum.CONSULTANT]: "Consultant",
}

export const employmentTypeOptions = [
  {
    label: employmentType[EmploymentTypeEnum.PERMANENT],
    value: EmploymentTypeEnum.PERMANENT
  },
  {
    label: employmentType[EmploymentTypeEnum.CONTRACT],
    value: EmploymentTypeEnum.CONTRACT
  },
  {
    label: employmentType[EmploymentTypeEnum.INTERN],
    value: EmploymentTypeEnum.INTERN
  },
  {
    label: employmentType[EmploymentTypeEnum.CONSULTANT],
    value: EmploymentTypeEnum.CONSULTANT
  },
];

export const probationPeriodOptions = Array.from({ length: 7 }, (_, index) => ({
  label: `${index} Month${index !== 1 ? "s" : ""}`,
  value: index,
}));

export const currency = {
 INR: "₹" 
}
