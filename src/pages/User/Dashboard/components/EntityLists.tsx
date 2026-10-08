import { Badge, Box, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { Banknote, RefreshCcw } from "lucide-react";

import {
  DashboardInvoiceItem,
  DashboardRenewalItem,
  RoleCountItem,
} from "@/api/dashboard";
import { formatDate } from "@/pages/User/CaseManagement/utils/matterHelpers";

import { formatAmount, humanizeLabel } from "../utils";
import { EmptyState } from "./SectionCard";

const ROW_BORDER = {
  borderBottom: "1px solid",
  borderColor: "gray.100",
} as const;

const INVOICE_TONE: Record<string, string> = {
  PAID: "green",
  PARTIAL: "amber",
  UNPAID: "orange",
  OVERDUE: "red",
  DRAFT: "gray",
  CANCELLED: "gray",
};

interface InvoiceListProps {
  invoices: DashboardInvoiceItem[];
  emptyTitle?: string;
  emptyDescription?: string;
}

/** Outstanding / overdue invoice rows. */
export const InvoiceList = ({
  invoices,
  emptyTitle = "No outstanding invoices",
  emptyDescription = "Billing will appear here when invoices are raised.",
}: InvoiceListProps) => {
  if (invoices.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<Banknote size={20} />}
      />
    );
  }

  return (
    <Stack gap={0}>
      {invoices.map((invoice, index) => {
        const status = invoice.status?.toUpperCase() ?? "";
        return (
          <HStack
            key={invoice.invoiceId ?? invoice.invoiceNumber ?? index}
            gap={3}
            py={3}
            align="center"
            {...(index === invoices.length - 1 ? {} : ROW_BORDER)}
            borderRadius="md"
            px={1}
          >
            <Stack gap={0.5} flex={1} minW={0}>
              <Text
                fontSize="sm"
                fontWeight={600}
                color="gray.900"
                lineClamp={1}
              >
                {invoice.invoiceNumber ?? "Invoice"}
              </Text>
              {invoice.clientName && (
                <Text fontSize="xs" color="gray.500" lineClamp={1}>
                  {invoice.clientName}
                </Text>
              )}
            </Stack>
            {invoice.dueDate && (
              <Text
                fontSize="xs"
                color="gray.500"
                whiteSpace="nowrap"
                flexShrink={0}
              >
                Due {formatDate(invoice.dueDate)}
              </Text>
            )}
            <Text
              fontSize="sm"
              fontWeight={600}
              color="gray.800"
              flexShrink={0}
            >
              {formatAmount(invoice.amount, invoice.currency ?? "NPR")}
            </Text>
            {status && (
              <Badge
                colorPalette={INVOICE_TONE[status] ?? "gray"}
                px={2}
                py={0.5}
                borderRadius="full"
                fontSize="xs"
                fontWeight={600}
                flexShrink={0}
              >
                {humanizeLabel(status)}
              </Badge>
            )}
          </HStack>
        );
      })}
    </Stack>
  );
};

interface RenewalListProps {
  renewals: DashboardRenewalItem[];
  emptyTitle?: string;
  emptyDescription?: string;
}

/** Upcoming renewal rows (project / licence renewals). */
export const RenewalList = ({
  renewals,
  emptyTitle = "No upcoming renewals",
  emptyDescription = "Renewals approaching their due date will appear here.",
}: RenewalListProps) => {
  if (renewals.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<RefreshCcw size={20} />}
      />
    );
  }

  return (
    <Stack gap={0}>
      {renewals.map((renewal, index) => {
        const dueValue = renewal.dueDate ?? renewal.expiryDate ?? null;
        return (
          <HStack
            key={renewal.renewalId ?? renewal.projectCode ?? index}
            gap={3}
            py={3}
            align="center"
            {...(index === renewals.length - 1 ? {} : ROW_BORDER)}
            borderRadius="md"
            px={1}
          >
            <Stack gap={0.5} flex={1} minW={0}>
              <Text
                fontSize="sm"
                fontWeight={600}
                color="gray.900"
                lineClamp={1}
              >
                {renewal.projectName ?? renewal.projectCode ?? "Renewal"}
              </Text>
              <Text fontSize="xs" color="gray.500" lineClamp={1}>
                {[renewal.renewalType, renewal.clientName, renewal.projectCode]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
            </Stack>
            {dueValue && (
              <Text
                fontSize="xs"
                color="gray.500"
                whiteSpace="nowrap"
                flexShrink={0}
              >
                Due {formatDate(dueValue)}
              </Text>
            )}
            {renewal.status && (
              <Badge
                colorPalette="amber"
                px={2}
                py={0.5}
                borderRadius="full"
                fontSize="xs"
                fontWeight={600}
                flexShrink={0}
              >
                {humanizeLabel(renewal.status)}
              </Badge>
            )}
          </HStack>
        );
      })}
    </Stack>
  );
};

interface RoleCountListProps {
  roles: RoleCountItem[];
}

/** Simple distribution bars used by the super admin user overview. */
export const RoleCountList = ({ roles }: RoleCountListProps) => {
  if (roles.length === 0) return null;

  const max = Math.max(...roles.map((role) => role.value), 1);

  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3} mt={1}>
      {roles.map((role) => (
        <Stack key={role.label} gap={1}>
          <HStack justify="space-between">
            <Text fontSize="xs" color="gray.500">
              {humanizeLabel(role.label)}
            </Text>
            <Text fontSize="xs" fontWeight={700} color="gray.800">
              {role.value}
            </Text>
          </HStack>
          <Box
            h="6px"
            w="100%"
            bg="gray.100"
            borderRadius="full"
            overflow="hidden"
          >
            <Box
              h="100%"
              w={`${Math.round((role.value / max) * 100)}%`}
              bg="primary.500"
              borderRadius="full"
            />
          </Box>
        </Stack>
      ))}
    </SimpleGrid>
  );
};
