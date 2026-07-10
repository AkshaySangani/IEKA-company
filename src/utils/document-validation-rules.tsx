import { regex } from "../constants/validation-regex";

export const documentValidationRules: Record<
  string,
  {
    pattern: RegExp;
    message: string;
  }
> = {
  "Aadhaar Card": {
    pattern: regex.aadhaarCard,
    message: "Aadhaar number must contain exactly 12 digits.",
  },

  "Pan Card": {
    pattern: regex.panCard,
    message: "PAN number format should be ABCDE1234F.",
  },

  "Driving License": {
    pattern: regex.dlNumber,
    message: "Driving license format should be DL-1420110012345.",
  },
};