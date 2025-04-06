export const getStatusIcon = (status: number) => {
  switch (status) {
    case 1:
      return "clock";
    case 2:
      return "check-circle";
    case 3:
      return "close-circle";
    default:
      return "help-circle";
  }
};

export const getStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return "#FFA000";
    case 2:
      return "#4CAF50";
    case 3:
      return "#F44336";
    default:
      return "#9E9E9E";
  }
};

export const formatTime = (time: string) => {
  try {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return time; // Return original time if parsing fails
  }
};
