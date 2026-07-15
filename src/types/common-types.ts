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

export enum salaryType { 
  EARNING = "EARNING", 
  DEDUCTION = "DEDUCTION"
}

export enum statusEnum {
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED",
    PENDING = "PENDING",
}

export enum RoleEnum {
    EMPLOYEE = "EMPLOYEE",
    MANAGER = "MANAGER",
    ADMIN = "ADMIN",
    OWNER = "OWNER",
}

export enum EmploymentTypeEnum {
  PERMANENT = "PERMANENT",
  CONTRACT = "CONTRACT",
  INTERN = "INTERN",
  CONSULTANT = "CONSULTANT",
}

export enum employeeDocuments {
  aadhaarCard = "Aadhaar Card",
  panCard = "Pan Card",
  drivingLicense = "Driving License",
  passport = "Passport",
  voterId = "VoterId Card"
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

export enum documentEnum {
  adhar = "adhar",
  pan = "pan",
  voterId = "voterId",
  passport = "passport",
  drivingId = "drivingId"
}

export enum employmentTypeType {
  PERMANENT = "PERMANENT",
  CONTRACT = "CONTRACT",
  INTERN = "INTERN",
  CONSULTANT = "CONSULTANT",
}

export enum BloodGroupEnum {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
}

export enum GenderEnum {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}