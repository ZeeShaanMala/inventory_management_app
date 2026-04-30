export const validateIMEI = (imei) => {
  if (!imei) return "IMEI is required";
  if (imei.length < 10) return "Invalid IMEI";
  return null;
};

export const validateRequired = (value, field) => {
  if (!value) return `${field} is required`;
  return null;
};