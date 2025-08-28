import { useNotificationStore } from "../store/notificationStore";

export default function Notification({ className = "" }) {
  const { show, message, type } = useNotificationStore();

  if (!show || !message) return null;

  // Default styles based on type
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-success text-white-txt";
      case "error":
        return "bg-error text-white-txt";
      default:
        return "bg-gray-500 text-white-txt";
    }
  };

  const defaultStyles = getTypeStyles();
  const finalClassName = `relative px-4 py-2 text-center rounded-md shadow-md ${defaultStyles} ${className}`;

  return <div className={finalClassName}>{message}</div>;
}
