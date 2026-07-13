export const formatClientDate = (dateString: string): { date: string; time: string } => {
  const date = new Date(dateString);
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  
  return {
    date: date.toLocaleDateString("en-GB", dateOptions),
    time: date.toLocaleTimeString("en-US", timeOptions),
  };
};

export const formatMobileNumber = (mobileNo: string): string => {
  if (!mobileNo) return "-";
  
  // Remove any non-numeric characters
  const cleaned = mobileNo.replace(/\D/g, "");
  
  // Format based on length (assuming standard formats)
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  return mobileNo;
};

export const getPortalBadgeColor = (enabled: boolean): string => {
  return enabled ? "green" : "red";
};

export const getStatusBadgeColor = (isActive: boolean): string => {
  return isActive ? "green" : "gray";
};
