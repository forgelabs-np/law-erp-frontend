import { Badge } from "@chakra-ui/react";

import {
  InvoiceStatus,
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_COLORS,
} from "@/shared/types/invoice";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export const InvoiceStatusBadge = ({ status }: InvoiceStatusBadgeProps) => {
  const colors = INVOICE_STATUS_COLORS[status] || INVOICE_STATUS_COLORS.DRAFT;
  const label = INVOICE_STATUS_LABELS[status] || status;

  return (
    <Badge
      bg={colors.bg}
      color={colors.color}
      px={2}
      py={0.5}
      borderRadius="md"
      fontSize="xs"
      fontWeight="500"
      textTransform="capitalize"
    >
      {label}
    </Badge>
  );
};
