import { documentEnum } from "../common-types";

export interface IPayslipBranch {
  _id: string;
  name: string;
}

export interface IPayslipShift {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface IPayslipDepartment {
  _id: string;
  name: string;
}

export interface IPayslipDesignation {
  _id: string;
  name: string;
}

export interface ICompany {
    _id: string;
    companyName: string;
    gstin: string;
    companyEmail: string;
    companyPhone: number;
    companyAddress: string;
    companyLogo: string;
}
export interface IPayslipUser {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  role: string;
  branchId?: IPayslipBranch | null;
  shiftId?: IPayslipShift | null;
  departmentId?: IPayslipDepartment | null;
  designationId?: IPayslipDesignation | null;
  companyId: ICompany;
}

export interface ISalaryMetadata {
  sourceId?: string;
  name?: string;
  value?: number;
  valueType?: string;
  overtimeMinutes?: number;
  lateSalaryCutDays?: number;
  sandwichDays?: number;
}

export interface ISalaryItem {
  _id: string;
  type: string;
  name: string;
  amount: number;
  isDeduction: boolean;
  calculation: string;
  source: string;
  metadata?: ISalaryMetadata;
}

export interface IAttendance {
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  weeklyOffDays: number;
  holidays: number;
  sandwichDays: number;
  paidLeaveDays: number;
  lateMinutes: number;
  earlyExitMinutes: number;
  overtimeMinutes: number;
  overtimeRate: number;
  lateCount: number;
  lateSalaryCutDays: number;
  unpaidLeaveDays: number;
}

export interface IPayrollTotals {
  salaryAmount: number;
  attendanceSalaryAmount: number;
  reimbursementsAmount: number;
  deductionsAmount: number;
  netPayAmount: number;
}

export interface IEmployeePayroll {
  _id: string;
  companyId: string;
  userId: string;
  payrollMonth: number;
  payrollYear: number;
  periodStart: string;
  periodEnd: string;
  status: string;
  attendance: IAttendance;
  salarySnapshot: ISalaryItem[];
  salaryBreakdown: ISalaryItem[];
  reimbursements: string[];
  totals: IPayrollTotals;
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IDocuments {
  card: documentEnum;
  cardNumber: number;
  front: string;
  back: string;
  _id: string;
}

export interface IBankDetails {
  bankName: string;
  accountNo: number;
  ifscCode: string;
  uanNo: string;
  esicNo: string;
  pfJoiningDate: string | null;
  esicJoiningDate: string | null;
}

export interface IUserDetails {
    bank: IBankDetails;
    _id: string;
    documents: IDocuments[];
  }

export interface IEmployeePayslipResponse {
  branches: IPayslipBranch[];
  shifts: IPayslipShift[];
  departments: IPayslipDepartment[];
  user: IPayslipUser;
  curruntSalary: number;
  payrolls: IEmployeePayroll[];
  userDetails: IUserDetails;
}

export interface PayslipProps {}
