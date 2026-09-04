import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  NativeSelect,
  Portal,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Send,
  Download,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";

import {
  useInvoiceQuery,
  useDeleteInvoiceMutation,
  useSendInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useDownloadInvoicePdfMutation,
} from "@/api/invoiceManagement";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import {
  Invoice,
  InvoiceStatus,
  INVOICE_STATUS_LABELS,
  formatCurrency,
  canEditInvoice,
  canDeleteInvoice,
} from "@/shared/types/invoice";

import { InvoicePreview } from "./components/InvoicePreview";
import { InvoiceStatusBadge } from "./components/InvoiceStatusBadge";

const STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "CANCELED", label: "Canceled" },
];

const InvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: invoiceData, isLoading } = useInvoiceQuery(id || "");
  const { mutate: deleteInvoice, isPending: isDeletePending } =
    useDeleteInvoiceMutation();
  const { mutate: sendInvoice, isPending: isSendPending } =
    useSendInvoiceMutation();
  const { mutate: updateStatus, isPending: isStatusPending } =
    useUpdateInvoiceStatusMutation();
  const { mutate: downloadPdf, isPending: isPdfPending } =
    useDownloadInvoicePdfMutation();

  const {
    open: deleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    open: sendOpen,
    onOpen: onSendOpen,
    onClose: onSendClose,
  } = useDisclosure();

  const invoice = invoiceData?.data;

  if (isLoading) {
    return (
      <Center p={12}>
        <Spinner size="lg" color="brand.primary" />
      </Center>
    );
  }

  if (!invoice) {
    return (
      <Center p={12}>
        <Stack gap={2} alignItems="center">
          <Text color="gray.500" textStyle="heading_5">
            Invoice Not Found
          </Text>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/super-admin/invoices")}
          >
            Back to Invoices
          </Button>
        </Stack>
      </Center>
    );
  }

  const isDraft = canEditInvoice(invoice);

  const handleStatusChange = (newStatus: string) => {
    updateStatus({
      id: invoice.id,
      payload: { status: newStatus as InvoiceStatus },
    });
  };

  return (
    <Stack gap={4} padding={2}>
      {/* Header */}
      <HStack justifyContent="space-between" alignItems="center">
        <HStack gap={3}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/super-admin/invoices")}
          >
            <ArrowLeft size={16} />
          </Button>
          <Stack gap={0}>
            <HStack gap={2}>
              <Text textStyle="heading_4">{invoice.invoiceNumber}</Text>
              <InvoiceStatusBadge status={invoice.status} />
            </HStack>
            <Text textStyle="paragraph_regular" color="gray.500">
              {invoice.firmName}
            </Text>
          </Stack>
        </HStack>

        <HStack gap={2}>
          {/* Status Change */}
          {/* {isDraft && ( */}
          <NativeSelect.Root size="sm" w="140px" disabled={isStatusPending}>
            <NativeSelect.Field
              bg="white"
              borderRadius="lg"
              borderColor="gray.200"
              value={invoice.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          {/* )} */}

          {/* Actions Menu */}
          <MenuRoot positioning={{ placement: "bottom-end" }}>
            <MenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal size={16} /> Actions
              </Button>
            </MenuTrigger>
            <Portal>
              <MenuPositioner>
                <MenuContent
                  minW="200px"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  {isDraft && (
                    <MenuItem
                      value="edit"
                      onClick={() =>
                        navigate(`/super-admin/invoices/${invoice.id}/edit`)
                      }
                    >
                      <Pencil size={14} />
                      Edit Invoice
                    </MenuItem>
                  )}
                  <MenuItem
                    value="send"
                    onClick={onSendOpen}
                    disabled={isSendPending}
                  >
                    <Send size={14} />
                    Send Invoice
                  </MenuItem>
                  <MenuItem
                    value="download"
                    onClick={() => downloadPdf(invoice.id)}
                    disabled={isPdfPending}
                  >
                    <Download size={14} />
                    Download PDF
                  </MenuItem>
                  {isDraft && (
                    <MenuItem
                      value="delete"
                      color="red.600"
                      onClick={onDeleteOpen}
                    >
                      <Trash2 size={14} />
                      Delete Invoice
                    </MenuItem>
                  )}
                </MenuContent>
              </MenuPositioner>
            </Portal>
          </MenuRoot>
        </HStack>
      </HStack>

      {/* Invoice Preview */}
      <InvoicePreview
        firmName={invoice.firmName}
        invoiceNumber={invoice.invoiceNumber}
        issueDate={invoice.issueDate}
        dueDate={invoice.dueDate}
        items={invoice.items || []}
        taxRate={invoice.taxRate}
        paymentTerms={invoice.paymentTerms}
        notes={invoice.notes}
      />

      {/* Metadata */}
      <Box
        p={4}
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.200"
        bg="gray.50"
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          <Stack gap={1}>
            <Text fontSize="xs" color="gray.500" fontWeight="500">
              Created By
            </Text>
            <Text fontSize="sm" fontWeight="500">
              {invoice.createdBy || "—"}
            </Text>
          </Stack>
          <Stack gap={1}>
            <Text fontSize="xs" color="gray.500" fontWeight="500">
              Created At
            </Text>
            <Text fontSize="sm" fontWeight="500">
              {new Date(invoice.createdAt).toLocaleString()}
            </Text>
          </Stack>
          <Stack gap={1}>
            <Text fontSize="xs" color="gray.500" fontWeight="500">
              Invoice ID
            </Text>
            <Text fontSize="xs" color="gray.400" fontFamily="mono">
              {invoice.id}
            </Text>
          </Stack>
        </SimpleGrid>
      </Box>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={deleteOpen}
        onClose={onDeleteClose}
        title={`Delete "${invoice.invoiceNumber}"?`}
        action="delete this invoice"
        handleSubmit={() => {
          deleteInvoice(invoice.id, {
            onSuccess: () => {
              onDeleteClose();
              navigate("/super-admin/invoices");
            },
          });
        }}
        submitActionPending={isDeletePending}
      />

      {/* Send Confirmation */}
      <ConfirmationDialog
        open={sendOpen}
        onClose={onSendClose}
        title={`Send "${invoice.invoiceNumber}"?`}
        action="send this invoice via email to the firm admin"
        handleSubmit={() => {
          sendInvoice(invoice.id, {
            onSuccess: () => onSendClose(),
          });
        }}
        submitActionPending={isSendPending}
      />
    </Stack>
  );
};

export default InvoiceDetailPage;
