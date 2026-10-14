import { Grid } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { TablePaginationIconProps } from "@/shared/types";

export const TablePaginationIcon = ({
  isDisabled,
  isRight,
}: TablePaginationIconProps) => {
  return (
    <Grid
      placeItems="center"
      borderRadius="8px"
      height="32px"
      width="32px"
      cursor={isDisabled ? "not-allowed" : "pointer"}
      opacity={isDisabled ? "0.3" : "1"}
      color="gray.500"
      transition="all 0.15s ease"
    >
      {isRight ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
    </Grid>
  );
};
