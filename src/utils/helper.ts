import { IAssignment, IBaseEntity, IShift } from "../components/company/workforce/all-employees/employee-details";
import { ISalaryDetail } from "../components/company/workforce/onboarding/assign-roles-responsibility/SalaryDetails";
import { deductionEnum, salaryType, ValueType } from "../types/common-types";

export function getLocalStorageData(key: string): any | null {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error getting localStorage data:", error);
    return null;
  }
}

export function setLocalStorageData(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting localStorage data:", error);
  }
}

export function removeLocalStorageData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing localStorage data:", error);
  }
}

export function maskEmail(email: string) {
  const [username, domain] = email.split("@");

  if (!username || !domain) return email;

  const visiblePart = username.slice(0, 4);
  const maskedPart = "*".repeat(Math.max(username.length - 4, 0));

  return `${visiblePart}${maskedPart}@${domain}`;
}

export const calculateAmount = (
  salary: number,
  value: number,
  calculationType: ValueType,
) => {
  if (calculationType === ValueType.PERCENTAGE) {
    return (salary * value) / 100;
  }

  return value;
};

export const calculateSalaryBreakdown = (
  salary: number,
  components: ISalaryDetail[],
  isUan: boolean,
  isESIC: boolean,
) => {
  const earnings = [];
  const deductions = [];

  let totalEarnings = 0;
  let totalDeductions = 0;

  for (const component of components) {
    // Handle PF based on UAN
    if (
      component.type === salaryType.DEDUCTION &&
      component.name === deductionEnum.PROVIDENT_FUND &&
      !isUan
    ) {
      continue;
    }

    // Handle ESIC based on ESIC checkbox
    if (
      component.type === salaryType.DEDUCTION &&
      component.name === deductionEnum.ESIC &&
      !isESIC
    ) {
      continue;
    }

    const amount = calculateAmount(
      salary,
      component.value,
      component.valueType,
    );

    if (component.type === salaryType.EARNING) {
      earnings.push({
        ...component,
        amount,
      });

      totalEarnings += amount;
    } else {
      deductions.push({
        ...component,
        amount,
      });

      totalDeductions += amount;
    }
  }

  // Add remaining salary as Other Allowance
  const otherAmount = Math.max(0, salary - totalEarnings);

  earnings.push({
    _id: "other",
    name: "Other",
    value: otherAmount,
    valueType: ValueType.FIXED,
    type: salaryType.EARNING,
    amount: otherAmount,
  });

  const grossSalary = totalEarnings + otherAmount;

  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    earnings,
    deductions,
    grossSalary,
    netSalary,
  };
};

export function getFileNameByUrl(fileUrl: string) {
const data = fileUrl.split("/");
  return data[data?.length - 1]??"";
}

export const downloadFile = async (url: string, filename: string) => {
  const response = await fetch(url);
  const blob = await response.blob();

  const blobUrl = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(blobUrl);
};

// Get first character(s) of each word
// Casual Leave -> CL
// Leave Without Pay, 2 -> LW
// Leave Without Pay, 3 -> LWP
export const getFirstCharacter = (
  str: string,
  count: number = 2,
) => {
  const characters = str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase());

  return characters.slice(0, count).join("");
};


// format float vales like 
// 1234.00234 => 1234.00
export function getFloatValue(value: number | string, fractionDigits: number = 2,fallbackOnNull: string = "") {
  // Handle null/undefined
  if (value == null) {
    return fallbackOnNull;
  }

  // Handle strings: trim and detect blank
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return fallbackOnNull;
    }
    // Reassign to trimmed for parsing
    value = trimmed;
  }

  // Try to parse as float
  const num = typeof value === 'number' ? value : parseFloat(value);

  // If parsing failed or value is not a finite number, use fallback
  if (!Number.isFinite(num)) {
    return fallbackOnNull;
  }

  // Return integer as number; decimal as string with two places
  if (Number.isInteger(num)) {
    return num; // e.g., 2
  } else {
    return num.toFixed(fractionDigits); // e.g., "2.50"
  }
}

export const getBranches = (branches: IAssignment[]) => {
    const groupedAssignments = branches.reduce(
      (acc, assignment) => {
        const key = `${assignment.branchId._id}-${assignment.shiftId._id}`;

        if (!acc[key]) {
          acc[key] = {
            branch: assignment.branchId,
            shift: assignment.shiftId,
            departments: [],
          };
        }

        // Prevent duplicate departments
        if (
          !acc[key].departments.some(
            (d) => d._id === assignment.departmentId._id,
          )
        ) {
          acc[key].departments.push(assignment.departmentId);
        }

        return acc;
      },
      {} as Record<
        string,
        {
          branch: IBaseEntity;
          shift: IShift;
          departments: IBaseEntity[];
        }
      >,
    );
    return Object.values(groupedAssignments);
  };