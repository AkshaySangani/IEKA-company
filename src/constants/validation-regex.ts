export const regex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9]{10}$/,
  gstRegex: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  bankAccount: /^\d{9,18}$/,
  ifscCode: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  aadhaarCard: /^\d{12}$/,
  panCard: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  dlNumber: /^[A-Z]{2}-?\d{2}\d{11,13}$/
};