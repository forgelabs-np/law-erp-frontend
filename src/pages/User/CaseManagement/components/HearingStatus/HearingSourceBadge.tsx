import { Badge } from "@chakra-ui/react";
import { HearingSource } from "@/shared/types/scraper.types";

interface HearingSourceBadgeProps {
  source: HearingSource;
}

export const HearingSourceBadge = ({ source }: HearingSourceBadgeProps) => {
  const getBadgeProps = () => {
    switch (source) {
      case "DAILY":
        return {
          bg: "blue.100",
          color: "blue.700",
          label: "Daily Cause List",
        };
      case "WEEKLY":
        return {
          bg: "purple.100",
          color: "purple.700",
          label: "Weekly Cause List",
        };
      default:
        return {
          bg: "gray.100",
          color: "gray.700",
          label: source,
        };
    }
  };

  const { bg, color, label } = getBadgeProps();

  return (
    <Badge
      bg={bg}
      color={color}
      px={3}
      py={1}
      borderRadius="full"
      fontSize="xs"
      fontWeight="600"
    >
      {label}
    </Badge>
  );
};
