import { Box, Button, Grid, HStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FormProvider, ReactSelect, TextFieldInput } from "@/shared/components";
import { ACTION_OPTIONS } from "../utils";

interface AuditLogsFiltersProps {
  onReset: () => void;
  onApply: () => void;
  onFilterChange: (field: string, value: string) => void;
  actionValue?: string;
  fromDateValue?: string;
  toDateValue?: string;
}

export const AuditLogsFilters = ({
  onReset,
  onApply,
  onFilterChange,
  actionValue,
  fromDateValue,
  toDateValue,
}: AuditLogsFiltersProps) => {
  const methods = useForm({
    defaultValues: {
      action: actionValue || "",
      fromDate: fromDateValue || "",
      toDate: toDateValue || "",
    },
  });

  useEffect(() => {
    methods.reset({
      action: actionValue || "",
      fromDate: fromDateValue || "",
      toDate: toDateValue || "",
    });
  }, [actionValue, fromDateValue, toDateValue, methods]);

  return (
    <FormProvider methods={methods} onSubmit={onApply}>
      <Box
        bg="white"
        p="6"
        borderRadius="lg"
        border="1px"
        borderColor="gray.200"

      >
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} >
          <Box zIndex={10}
          >

            <ReactSelect
              name="action"
              label="Action"
              placeholder="Select action"
              options={ACTION_OPTIONS}
              extraOnChange={(value) => onFilterChange("action", value as string)}
            />
          </Box>
          <TextFieldInput
            name="fromDate"
            type="date"
            label="From Date"
            placeholder="Select from date"
            onChange={(value) => onFilterChange("fromDate", value)}
          />
          <TextFieldInput
            name="toDate"
            type="date"
            label="To Date"
            placeholder="Select to date"
            onChange={(value) => onFilterChange("toDate", value)}
          />
        </Grid>
        <HStack justify="flex-end" mt={4} gap={3}>
          <Button variant="outline" onClick={onReset}>
            Reset Filters
          </Button>
          <Button type="submit" colorScheme="blue">
            Apply Filters
          </Button>
        </HStack>
      </Box>
    </FormProvider>
  );
};
