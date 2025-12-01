"use client";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case "up":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "down":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "up":
        return "Online";
      case "down":
        return "Offline";
      default:
        return "Pending";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor()}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
      {getStatusText()}
    </span>
  );
}
