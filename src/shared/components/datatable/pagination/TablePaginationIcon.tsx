import { Grid } from "@chakra-ui/react";

import { ArrowLeftIcon } from "@/shared/assets";
import { TablePaginationIconProps } from "@/shared/types";

export const TablePaginationIcon = ({
  isDisabled,
  isRight,
}: TablePaginationIconProps) => {
  return (
    <Grid
      placeItems="center"
      borderRadius="full"
      height={{ base: "7", "2xl": "8" }}
      width={{ base: "7", "2xl": "8" }}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      transform={isRight ? "rotate(180deg)" : ""}
      opacity={isDisabled ? "0.3" : "1"}
      _hover={{
        background: "gray.50",
      }}
    >
      <ArrowLeftIcon />
    </Grid>
  );
};
