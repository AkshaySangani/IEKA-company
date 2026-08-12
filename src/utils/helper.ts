import { ISalaryDetail } from "../components/company/workforce/onboarding/assign-roles-responsibility/SalaryDetails";
import { salaryType, ValueType } from "../types/common-types";

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
) => {
  const earnings = [];
  const deductions = [];

  let totalEarnings = 0;
  let totalDeductions = 0;

  for (const component of components) {
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

  // Add Other Allowance as remaining amount
  const otherAmount = salary - totalEarnings;

  earnings.push({
    _id: "other",
    name: "Other",
    value: otherAmount,
    valueType: ValueType.FIXED,
    type: salaryType.EARNING,
    amount: otherAmount,
  });

  // Gross salary should always equal entered salary
  const grossSalary = totalEarnings += otherAmount;

  return {
    earnings,
    deductions,
    grossSalary,
    netSalary: grossSalary - totalDeductions,
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

// get first character of string like Casual Leave = CL
export const getFirstCharacter = (str: string) => {
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};