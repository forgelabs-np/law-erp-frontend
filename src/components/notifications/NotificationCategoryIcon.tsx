import { Box } from "@chakra-ui/react";
import {
  Info,
  AlertTriangle,
  Megaphone,
  BellRing,
  CalendarClock,
  AlertCircle,
  FileText,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_CONFIG: Record<
  string,
  { icon: LucideIcon; color: string; bg: string }
> = {
  SYSTEM: { icon: Info, color: "blue.600", bg: "blue.50" },
  ALERT: { icon: AlertTriangle, color: "orange.600", bg: "orange.50" },
  BROADCAST: { icon: Megaphone, color: "purple.600", bg: "purple.50" },
};

const TYPE_CONFIG: Record<
  string,
  { icon: LucideIcon; color: string; bg: string }
> = {
  CASE_ASSIGNED: { icon: FileText, color: "blue.600", bg: "blue.50" },
  INVOICE_STATUS: { icon: FileText, color: "teal.600", bg: "teal.50" },
  APPEAL_LAPSED: { icon: AlertCircle, color: "red.600", bg: "red.50" },
  HEARING_REMINDER: {
    icon: CalendarClock,
    color: "orange.600",
    bg: "orange.50",
  },
  APPEAL_DEADLINE: { icon: AlertTriangle, color: "red.600", bg: "red.50" },
  ANNOUNCEMENT: { icon: Megaphone, color: "purple.600", bg: "purple.50" },
};

interface NotificationCategoryIconProps {
  type: string;
  category: string;
  size?: number;
}

export const NotificationCategoryIcon = ({
  type,
  category,
  size = 18,
}: NotificationCategoryIconProps) => {
  const config = TYPE_CONFIG[type] ??
    CATEGORY_CONFIG[category] ?? {
      icon: BellRing,
      color: "gray.600",
      bg: "gray.50",
    };
  const Icon = config.icon;

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      width={`${size + 12}px`}
      height={`${size + 12}px`}
      borderRadius="lg"
      bg={config.bg}
      color={config.color}
      flexShrink={0}
    >
      <Icon size={size} />
    </Box>
  );
};
