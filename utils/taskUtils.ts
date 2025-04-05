import { Task } from "@/lib/api";

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
