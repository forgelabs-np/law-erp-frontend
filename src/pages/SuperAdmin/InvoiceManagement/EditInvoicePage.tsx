import { Center, Spinner, Stack, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useInvoiceQuery,
  useUpdateInvoiceMutation,
} from "@/api/invoiceManagement";
import { UpdateInvoicePayload } from "@/shared/types/invoice";

import { InvoiceForm, InvoiceFormData } from "./components/InvoiceForm";

const EditInvoicePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: invoiceData, isLoading } = useInvoiceQuery(id || "");
  const { mutate: updateInvoice, isPending } = useUpdateInvoiceMutation();

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
        <Text color="gray.500">Invoice not found</Text>
      </Center>
    );
  }

  if (invoice.status !== "DRAFT") {
    return (
      <Center p={12}>
        <Stack gap={2} alignItems="center">
          <Text color="gray.500" textStyle="heading_5">
            Cannot Edit Invoice
          </Text>
          <Text color="gray.400">
            Only draft invoices can be edited. Current status: {invoice.status}
          </Text>
        </Stack>
      </Center>
    );
  }

  const initialData: InvoiceFormData & { invoiceNumber?: string; id?: string } =
    {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      firmId: invoice.firmId,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      taxRate: invoice.taxRate,
      paymentTerms: invoice.paymentTerms,
      notes: invoice.notes,
      items: invoice.items || [],
    };

  const handleSubmit = (data: InvoiceFormData) => {
    const payload: UpdateInvoicePayload = {
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      taxRate: data.taxRate,
      paymentTerms: data.paymentTerms,
      notes: data.notes,
      items: data.items.map((item) => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    };
    updateInvoice(
      { id: invoice.id, payload },
      {
        onSuccess: () => {
          navigate(`/super-admin/invoices/${invoice.id}`);
        },
      }
    );
  };

  return (
    <Stack gap={4} padding={2}>
      {/* Header */}
      <Stack gap={1}>
        <Text textStyle="heading_4">Edit Invoice {invoice.invoiceNumber}</Text>
        <Text textStyle="paragraph_regular" color="gray.500">
          Update invoice details and line items
        </Text>
      </Stack>

      {/* Form with Preview */}
      <InvoiceForm
        mode="edit"
        initialData={initialData}
        isSubmitting={isPending}
        onSubmit={handleSubmit}
      />
    </Stack>
  );
};

export default EditInvoicePage;
