import * as Icons from "lucide-react";
import { AuditAction } from "../types";
import { getAuditActionStyle } from "../utils";

interface AuditLogIconProps {
  action: AuditAction;
  size?: number;
}

export const AuditLogIcon = ({ action, size = 16 }: AuditLogIconProps) => {
  const style = getAuditActionStyle(action);
  const Icon = Icons[style.icon as keyof typeof Icons] as React.ComponentType<{
    size?: number;
  }>;

  if (!Icon) {
    return <Icons.Activity size={size} />;
  }

  return <Icon size={size} />;
};
