import { Grid } from "@chakra-ui/react";

import { PhoneIcon } from "@/shared/assets";
import { MobileNumberInputProps } from "@/shared/types";

import { TextFieldInput } from "./TextField";

export const MobileNumberInput = (props: MobileNumberInputProps) => {
  return (
    <TextFieldInput
      {...props}
      startElement={
        <Grid
          placeItems="center"
          boxSize="10"
          color="system.inputGroup.element"
        >
          <PhoneIcon />
        </Grid>
      }
    />
  );
};
