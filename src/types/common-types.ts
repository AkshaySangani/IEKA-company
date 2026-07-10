export type FileType = | "pdf" | "xlsx";

export interface IOption {
    label: string;
    value: any;
}

export type AccountType = "SAVING" | "CURRENT";

export type StatusType = "ACTIVE" | "INACTIVE" | "DELETED";

export enum ValueType { 
  PERCENTAGE = "PERCENTAGE", 
  FIXED = "FIXED"
}

export enum statusEnum {
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED",
    PENDING = "PENDING",
}

export enum RoleEnum {
    EMPLOYEE = "EMPLOYEE",
    ADMIN = "ADMIN",
    OWNER = "OWNER",
}

export enum employeeDocuments {
  aadhaarCard = "Aadhaar Card",
  panCard = "Pan Card",
  drivingLicense = "Driving License"
}

export type BranchType = "HEAD_OFFICE" | "BRANCH";

export interface ObjectType {[key: string]: any};

export interface BankAccount {
  bankAccountNo: number;
  ifscCode: string;
  accountHolderName: string;
  accountType: AccountType;
}

export interface IEmployeeStats {
  active: number;
  inactive: number;
  deleted: number;
}

export interface FilterCardItem {
  id: string;
  title: string;
  count: number;
  activeColor?: string;
  textColor?: string;
  icon: React.ReactNode;
}