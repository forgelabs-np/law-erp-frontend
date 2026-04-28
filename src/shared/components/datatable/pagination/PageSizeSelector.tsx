import { Box, HStack, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { ROWS_OPTIONS } from "@/shared/constants";
import { PageSizeSelectorProps } from "@/shared/types";

import { FormProvider, ReactSelect } from "../../form";

export const PageSizeSelector = ({
  pageSize,
  setPageSize,
}: PageSizeSelectorProps) => {
  const methods = useForm({
    defaultValues: {
      rows: pageSize.toString(),
    },
  });

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(() => {})}>
      <HStack whiteSpace="nowrap" color="gray.700">
        <Text>Showing</Text>

        <Box width="20">
          <ReactSelect
            name="rows"
            options={ROWS_OPTIONS}
            extraOnChange={(value) => setPageSize(Number(value as string))}
            isSearchable={false}
          />
        </Box>

        <Text>per page</Text>
      </HStack>
    </FormProvider>
  );
};
