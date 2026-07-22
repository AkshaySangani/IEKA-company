import React from "react";

export type FileType = "pdf" | "xlsx";

export interface IOption {
  label: string;
  value: any;
}

export type AccountType = "SAVING" | "CURRENT";

export enum ValueType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export enum salaryType {
  EARNING = "EARNING",
  DEDUCTION = "DEDUCTION",
}

export enum statusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CANCEL = "CANCEL",
  TERMINATE = "TERMINATE",
  HOLD = "HOLD"
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
  voterId = "VoterId Card",
}

export type BranchType = "HEAD_OFFICE" | "BRANCH";

export interface ObjectType {
  [key: string]: any;
}

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
  amount?: number | string;
}

export interface ExpenseCardItem {
  id: string;
  title: string;
  count: number;
  activeColor?: string;
  textColor?: string;
  trendDetails: {
    type: string;
    difference: number;
    percentage: number;
  } | null;
  amount?: number | string;
}

export enum documentEnum {
  adhar = "adhar",
  pan = "pan",
  voterId = "voterId",
  passport = "passport",
  drivingId = "drivingId",
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

export enum leaveEncashmentType {
  YEARLY = "YEARLY",
  FULL_FINAL = "FULL_FINAL",
}

export enum WeeklyOffEnum {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  FIRST_SATURDAY = "1stSATURDAY",
  SECOND_SATURDAY = "2ndSATURDAY",
  THIRD_SATURDAY = "3rdSATURDAY",
  FOURTH_SATURDAY = "4thSATURDAY",
  FIFTH_SATURDAY = "5thSATURDAY",
  SUNDAY = "SUNDAY",
}

export enum ExpenseCategoryEnum {
  ELECTRONICS_ITEM = "ELECTRONICS_ITEM",
  MACHINERY_AND_TOOLS = "MACHINERY_AND_TOOLS",
  BILL_AND_SUBSCRIPTIONS = "BILL_AND_SUBSCRIPTIONS",
  VEHICLE = "VEHICLE",
  MEDICAL_CARE = "MEDICAL_CARE",
}

export interface ExpenseCategoryOption {
  label: string;
  value: ExpenseCategoryEnum;
  icon: React.ReactNode;
  activeColor?: string;
  textColor?: string;
}
