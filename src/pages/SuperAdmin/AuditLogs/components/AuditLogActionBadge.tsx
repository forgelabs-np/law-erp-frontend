import { Badge } from "@chakra-ui/react";
import { AuditAction } from "../types";
import { getAuditActionStyle } from "../utils";

interface AuditLogActionBadgeProps {
  action: AuditAction;
}

export const AuditLogActionBadge = ({ action }: AuditLogActionBadgeProps) => {
  const style = getAuditActionStyle(action);

  return (
    <Badge
      bg={style.background}
      color={style.labelColor}
      px="2"
      py="1"
      borderRadius="md"
      fontSize="xs"
      fontWeight="600"
    >
      {action}
    </Badge>
  );
};
