import { Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { useCreateInvoiceMutation } from "@/api/invoiceManagement";
import { CreateInvoicePayload } from "@/shared/types/invoice";

import { InvoiceForm, InvoiceFormData } from "./components/InvoiceForm";

const CreateInvoicePage = () => {
  const navigate = useNavigate();
  const { mutate: createInvoice, isPending } = useCreateInvoiceMutation();

  const handleSubmit = (data: InvoiceFormData) => {
    const payload: CreateInvoicePayload = {
      firmId: data.firmId,
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
    createInvoice(payload, {
      onSuccess: () => {
        navigate("/super-admin/invoices");
      },
    });
  };

  return (
    <Stack gap={4} padding={2}>
      {/* Header */}
      <Stack gap={1}>
        <Text textStyle="heading_4">Create Invoice</Text>
        <Text textStyle="paragraph_regular" color="gray.500">
          Create a new invoice for a law firm
        </Text>
      </Stack>

      {/* Form with Preview */}
      <InvoiceForm
        mode="create"
        isSubmitting={isPending}
        onSubmit={handleSubmit}
      />
    </Stack>
  );
};

export default CreateInvoicePage;
