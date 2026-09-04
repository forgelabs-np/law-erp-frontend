import { Box, Flex, HStack, Stack, Text } from "@chakra-ui/react";

import {
  InvoiceItem,
  computeSubtotal,
  computeTaxAmount,
  computeTotal,
  formatCurrency,
} from "@/shared/types/invoice";

interface InvoicePreviewProps {
  firmName: string;
  invoiceNumber?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number;
  paymentTerms: string;
  notes: string;
}

export const InvoicePreview = ({
  firmName,
  invoiceNumber,
  issueDate,
  dueDate,
  items,
  taxRate,
  paymentTerms,
  notes,
}: InvoicePreviewProps) => {
  const subtotal = computeSubtotal(items);
  const taxAmount = computeTaxAmount(subtotal, taxRate);
  const total = computeTotal(subtotal, taxRate);
  console.log(firmName, "nameeeee");

  return (
    <Box
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.200"
      p={6}
      w="100%"
      shadow="sm"
    >
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="flex-start" mb={6}>
        <Stack gap={1}>
          <Text textStyle="heading_5" fontWeight="700" color="brand.primary">
            INVOICE
          </Text>
          {invoiceNumber ? (
            <Text fontSize="sm" color="gray.600">
              {invoiceNumber}
            </Text>
          ) : (
            <Text fontSize="xs" color="gray.400" fontStyle="italic">
              Invoice number assigned after creation
            </Text>
          )}
        </Stack>
        <Text
          textStyle="heading_6"
          fontWeight="600"
          color="gray.800"
          textAlign="right"
        >
          {firmName || "—"}
        </Text>
      </Flex>

      <Box borderBottomWidth="1px" borderColor="gray.200" mb={4} />

      {/* Dates */}
      <HStack justifyContent="space-between" mb={6}>
        <Stack gap={1}>
          <Text fontSize="xs" color="gray.500" fontWeight="500">
            Issue Date
          </Text>
          <Text fontSize="sm" fontWeight="500">
            {issueDate
              ? new Date(issueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"}
          </Text>
        </Stack>
        <Stack gap={1} alignItems="flex-end">
          <Text fontSize="xs" color="gray.500" fontWeight="500">
            Due Date
          </Text>
          <Text fontSize="sm" fontWeight="500">
            {dueDate
              ? new Date(dueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"}
          </Text>
        </Stack>
      </HStack>

      {/* Line Items Table */}
      <Box mb={4} overflowX="auto">
        <Box as="table" w="100%" borderCollapse="collapse" fontSize="sm">
          <Box as="thead">
            <Box as="tr" bg="gray.50">
              <Box
                as="th"
                textAlign="left"
                p={2}
                fontWeight="600"
                fontSize="xs"
                color="gray.600"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                Description
              </Box>
              <Box
                as="th"
                textAlign="right"
                p={2}
                fontWeight="600"
                fontSize="xs"
                color="gray.600"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                Qty
              </Box>
              <Box
                as="th"
                textAlign="right"
                p={2}
                fontWeight="600"
                fontSize="xs"
                color="gray.600"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                Unit Price
              </Box>
              <Box
                as="th"
                textAlign="right"
                p={2}
                fontWeight="600"
                fontSize="xs"
                color="gray.600"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                Amount
              </Box>
            </Box>
          </Box>
          <Box as="tbody">
            {items.length === 0 ? (
              <Box as="tr">
                <td
                  colSpan={4}
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#A0AEC0",
                    fontStyle: "italic",
                  }}
                >
                  No line items yet
                </td>
              </Box>
            ) : (
              items.map((item, index) => {
                const amount = (item.quantity || 0) * (item.unitPrice || 0);
                return (
                  <Box as="tr" key={index}>
                    <Box
                      as="td"
                      p={2}
                      borderBottom="1px solid"
                      borderColor="gray.100"
                    >
                      {item.description || (
                        <Text color="gray.400" fontStyle="italic">
                          Untitled item
                        </Text>
                      )}
                    </Box>
                    <Box
                      as="td"
                      p={2}
                      textAlign="right"
                      borderBottom="1px solid"
                      borderColor="gray.100"
                    >
                      {item.quantity || 0}
                    </Box>
                    <Box
                      as="td"
                      p={2}
                      textAlign="right"
                      borderBottom="1px solid"
                      borderColor="gray.100"
                    >
                      {formatCurrency(item.unitPrice || 0)}
                    </Box>
                    <Box
                      as="td"
                      p={2}
                      textAlign="right"
                      fontWeight="500"
                      borderBottom="1px solid"
                      borderColor="gray.100"
                    >
                      {formatCurrency(amount)}
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
      </Box>

      {/* Totals */}
      <Flex justifyContent="flex-end" mb={4}>
        <Stack gap={1} minW="200px">
          <HStack justifyContent="space-between">
            <Text fontSize="sm" color="gray.500">
              Subtotal
            </Text>
            <Text fontSize="sm" fontWeight="500">
              {formatCurrency(subtotal)}
            </Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text fontSize="sm" color="gray.500">
              Tax ({taxRate}%)
            </Text>
            <Text fontSize="sm" fontWeight="500">
              {formatCurrency(taxAmount)}
            </Text>
          </HStack>
          <Box borderBottomWidth="1px" borderColor="gray.200" />
          <HStack justifyContent="space-between">
            <Text fontSize="md" fontWeight="700">
              Total
            </Text>
            <Text fontSize="md" fontWeight="700" color="brand.primary">
              {formatCurrency(total)}
            </Text>
          </HStack>
        </Stack>
      </Flex>

      <Box borderBottomWidth="1px" borderColor="gray.200" mb={4} />

      {/* Payment Terms & Notes */}
      {paymentTerms && (
        <Stack gap={1} mb={3}>
          <Text
            fontSize="xs"
            fontWeight="600"
            color="gray.500"
            textTransform="uppercase"
          >
            Payment Terms
          </Text>
          <Text fontSize="sm" color="gray.700">
            {paymentTerms}
          </Text>
        </Stack>
      )}
      {notes && (
        <Stack gap={1}>
          <Text
            fontSize="xs"
            fontWeight="600"
            color="gray.500"
            textTransform="uppercase"
          >
            Notes
          </Text>
          <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
            {notes}
          </Text>
        </Stack>
      )}
    </Box>
  );
};
