import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  NativeSelect,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

import { useGetFirmsQuery } from "@/api/firmManagement";
import { DatePicker } from "@/shared/components/ui/DatePicker";
import {
  InvoiceItem,
  computeSubtotal,
  computeTaxAmount,
  computeTotal,
  formatCurrency,
} from "@/shared/types/invoice";

import { InvoicePreview } from "./InvoicePreview";

export interface InvoiceFormData {
  firmId: string;
  issueDate: string;
  dueDate: string;
  taxRate: number;
  paymentTerms: string;
  notes: string;
  items: InvoiceItem[];
}

export interface InvoiceFormProps {
  mode: "create" | "edit";
  initialData?: InvoiceFormData & { invoiceNumber?: string; id?: string };
  isSubmitting: boolean;
  onSubmit: (data: InvoiceFormData) => void;
}

const PAYMENT_TERMS_OPTIONS = [
  "Net 15",
  "Net 30",
  "Net 45",
  "Net 60",
  "Due on Receipt",
  "Custom",
];

const emptyItem: InvoiceItem = {
  description: "",
  quantity: 1,
  unitPrice: 0,
};

export const InvoiceForm = ({
  mode,
  initialData,
  isSubmitting,
  onSubmit,
}: InvoiceFormProps) => {
  const navigate = useNavigate();
  const { data: firmsData } = useGetFirmsQuery();

  const [firmId, setFirmId] = useState(initialData?.firmId || "");
  const [issueDate, setIssueDate] = useState(initialData?.issueDate || "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [taxRate, setTaxRate] = useState(
    String(initialData?.taxRate ?? 0)
  );
  const [paymentTerms, setPaymentTerms] = useState(
    initialData?.paymentTerms || "Net 30"
  );
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [items, setItems] = useState<InvoiceItem[]>(
    initialData?.items?.length
      ? initialData.items
      : [{ ...emptyItem }]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFirmId(initialData.firmId || "");
      setIssueDate(initialData.issueDate || "");
      setDueDate(initialData.dueDate || "");
      setTaxRate(String(initialData.taxRate ?? 0));
      setPaymentTerms(initialData.paymentTerms || "Net 30");
      setNotes(initialData.notes || "");
      if (initialData.items?.length) {
        setItems(initialData.items);
      }
    }
  }, [initialData]);

  const firms = firmsData?.data ?? [];
  const selectedFirm = firms.find((f) => f.firmId === firmId);
  const parsedTaxRate = parseFloat(taxRate) || 0;
  const subtotal = computeSubtotal(items);
  const total = computeTotal(subtotal, parsedTaxRate);


  // ─── Validation ──────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firmId) newErrors.firmId = "Please select a firm";
    if (!issueDate) newErrors.issueDate = "Issue date is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";
    if (issueDate && dueDate && dueDate < issueDate) {
      newErrors.dueDate = "Due date cannot be earlier than issue date";
    }

    const parsedTax = parseFloat(taxRate);
    if (isNaN(parsedTax) || parsedTax < 0) {
      newErrors.taxRate = "Tax rate must be 0 or greater";
    }
    if (parsedTax > 100) {
      newErrors.taxRate = "Tax rate cannot exceed 100%";
    }

    if (items.length === 0) {
      newErrors.items = "At least one line item is required";
    }

    items.forEach((item, index) => {
      if (!item.description?.trim()) {
        newErrors[`item_${index}_description`] = "Description is required";
      }
      if (!item.quantity || item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = "Quantity must be greater than 0";
      }
      if (item.unitPrice < 0) {
        newErrors[`item_${index}_unitPrice`] = "Unit price cannot be negative";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      firmId,
      issueDate,
      dueDate,
      taxRate: parsedTaxRate,
      paymentTerms,
      notes,
      items: items.map((item, index) => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        sortOrder: index,
      })),
    });
  };

  // ─── Line Item Handlers ──────────────────────────────────────────────────
  const addItem = () => {
    setItems((prev) => [...prev, { ...emptyItem }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <Stack direction={{ base: "column", lg: "row" }} gap={6} w="100%">
      {/* Form */}
      <Box flex={1} minW={0}>
        <Stack gap={4}>
          {/* Firm Selection */}
          <Stack gap={1}>
            <Text fontSize="sm" fontWeight="500">
              Firm <Text as="span" color="red.500">*</Text>
            </Text>
            <NativeSelect.Root size="sm" disabled={mode === "edit"}>
              <NativeSelect.Field
                bg="white"
                borderRadius="lg"
                borderColor="gray.200"
                value={firmId}
                onChange={(e) => {
                  setFirmId(e.target.value);
                  if (errors.firmId) setErrors((p) => ({ ...p, firmId: "" }));
                }}
              >
                <option value="">Select a firm</option>
                {firms.map((firm) => (
                  <option key={firm.firmId} value={firm.firmId}>
                    {firm?.fullName}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            {errors.firmId && (
              <Text fontSize="xs" color="red.500">
                {errors.firmId}
              </Text>
            )}
          </Stack>

          {/* Dates */}
          <HStack gap={4} flexWrap="wrap">
            <Stack gap={1} flex={1} minW="180px">
              <Text fontSize="sm" fontWeight="500">
                Issue Date <Text as="span" color="red.500">*</Text>
              </Text>
              <DatePicker
                value={issueDate}
                onChange={(val) => {
                  setIssueDate(val);
                  if (errors.issueDate)
                    setErrors((p) => ({ ...p, issueDate: "" }));
                }}
                placeholder="Select issue date"
              />
              {errors.issueDate && (
                <Text fontSize="xs" color="red.500">
                  {errors.issueDate}
                </Text>
              )}
            </Stack>
            <Stack gap={1} flex={1} minW="180px">
              <Text fontSize="sm" fontWeight="500">
                Due Date <Text as="span" color="red.500">*</Text>
              </Text>
              <DatePicker
                value={dueDate}
                onChange={(val) => {
                  setDueDate(val);
                  if (errors.dueDate)
                    setErrors((p) => ({ ...p, dueDate: "" }));
                }}
                placeholder="Select due date"
                minDate={issueDate}
              />
              {errors.dueDate && (
                <Text fontSize="xs" color="red.500">
                  {errors.dueDate}
                </Text>
              )}
            </Stack>
          </HStack>

          {/* Tax Rate & Payment Terms */}
          <HStack gap={4} flexWrap="wrap">
            <Stack gap={1} flex={1} minW="150px">
              <Text fontSize="sm" fontWeight="500">
                Tax Rate (%)
              </Text>
              <Input
                size="sm"
                borderRadius="lg"
                borderColor="gray.200"
                type="number"
                min={0}
                max={100}
                step={0.01}
                value={taxRate}
                onChange={(e) => {
                  setTaxRate(e.target.value);
                  if (errors.taxRate)
                    setErrors((p) => ({ ...p, taxRate: "" }));
                }}
              />
              {errors.taxRate && (
                <Text fontSize="xs" color="red.500">
                  {errors.taxRate}
                </Text>
              )}
            </Stack>
            <Stack gap={1} flex={1} minW="150px">
              <Text fontSize="sm" fontWeight="500">
                Payment Terms
              </Text>
              <NativeSelect.Root size="sm">
                <NativeSelect.Field
                  bg="white"
                  borderRadius="lg"
                  borderColor="gray.200"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                >
                  {PAYMENT_TERMS_OPTIONS.map((term) => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Stack>
          </HStack>

          {/* Notes */}
          <Stack gap={1}>
            <Text fontSize="sm" fontWeight="500">
              Notes
            </Text>
            <Textarea
              size="sm"
              borderRadius="lg"
              borderColor="gray.200"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes or special instructions..."
              rows={3}
              resize="vertical"
            />
          </Stack>

          {/* Line Items */}
          <Stack gap={2}>
            <HStack justifyContent="space-between">
              <Text fontSize="sm" fontWeight="600">
                Line Items
              </Text>
              <Button
                size="xs"
                variant="outline"
                onClick={addItem}
              >
                <Plus size={12} /> Add Item
              </Button>
            </HStack>
            {errors.items && (
              <Text fontSize="xs" color="red.500">
                {errors.items}
              </Text>
            )}

            <Stack gap={3}>
              {items.map((item, index) => (
                <Box
                  key={index}
                  p={3}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.200"
                  bg="gray.50"
                >
                  <Stack gap={2}>
                    <HStack justifyContent="space-between">
                      <Text fontSize="xs" fontWeight="500" color="gray.500">
                        Item {index + 1}
                      </Text>
                      {items.length > 1 && (
                        <IconButton
                          aria-label="Remove item"
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 size={12} />
                        </IconButton>
                      )}
                    </HStack>
                    <Input
                      size="sm"
                      borderRadius="lg"
                      borderColor="gray.200"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                    />
                    {errors[`item_${index}_description`] && (
                      <Text fontSize="xs" color="red.500">
                        {errors[`item_${index}_description`]}
                      </Text>
                    )}
                    <HStack gap={2}>
                      <Stack gap={1} flex={1}>
                        <Text fontSize="xs" color="gray.500">
                          Quantity
                        </Text>
                        <Input
                          size="sm"
                          borderRadius="lg"
                          borderColor="gray.200"
                          type="number"
                          min={0}
                          step={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                        {errors[`item_${index}_quantity`] && (
                          <Text fontSize="xs" color="red.500">
                            {errors[`item_${index}_quantity`]}
                          </Text>
                        )}
                      </Stack>
                      <Stack gap={1} flex={1}>
                        <Text fontSize="xs" color="gray.500">
                          Unit Price
                        </Text>
                        <Input
                          size="sm"
                          borderRadius="lg"
                          borderColor="gray.200"
                          type="number"
                          min={0}
                          step={0.01}
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "unitPrice",
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                        {errors[`item_${index}_unitPrice`] && (
                          <Text fontSize="xs" color="red.500">
                            {errors[`item_${index}_unitPrice`]}
                          </Text>
                        )}
                      </Stack>
                      <Stack gap={1} flex={1}>
                        <Text fontSize="xs" color="gray.500">
                          Amount
                        </Text>
                        <Input
                          size="sm"
                          borderRadius="lg"
                          borderColor="gray.200"
                          value={formatCurrency(
                            (item.quantity || 0) * (item.unitPrice || 0)
                          )}
                          readOnly
                          bg="gray.50"
                        />
                      </Stack>
                    </HStack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Stack>

          {/* Actions */}
          <HStack gap={3} justifyContent="flex-end" pt={2}>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              {mode === "create" ? "Create Invoice" : "Update Invoice"}
            </Button>
          </HStack>
        </Stack>
      </Box>

      {/* Live Preview */}
      <Box
        flex={1}
        minW={0}
        position={{ base: "static", lg: "sticky" }}
        top={4}
        alignSelf="flex-start"
      >
        <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" mb={2}>
          Live Preview
        </Text>
        <InvoicePreview
          firmName={selectedFirm?.fullName || ""}
          invoiceNumber={initialData?.invoiceNumber}
          issueDate={issueDate}
          dueDate={dueDate}
          items={items}
          taxRate={parsedTaxRate}
          paymentTerms={paymentTerms}
          notes={notes}
        />
      </Box>
    </Stack>
  );
};
