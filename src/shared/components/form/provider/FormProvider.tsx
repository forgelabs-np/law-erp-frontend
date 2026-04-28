import { Box } from "@chakra-ui/react";
import {
  FieldValues,
  FormProvider as ReactHookFormProvider,
} from "react-hook-form";

import { FormProviderProps } from "@/shared/types";

export const FormProvider = <TFieldValues extends FieldValues>({
  children,
  methods,
  onSubmit,
}: FormProviderProps<TFieldValues>) => {
  return (
    <ReactHookFormProvider {...methods}>
      <Box as="form" onSubmit={onSubmit} height="full">
        {children}
      </Box>
    </ReactHookFormProvider>
  );
};
