import { Box } from "@chakra-ui/react";
import React from "react";

/**
 * Trailing, non-interactive icon rendered inside the pill inputs used on the
 * authentication screens. Sized and spaced so it never overlaps the input text.
 */
export const AuthInputIcon = ({
  icon,
  children,
}: {
  /** The icon element to render, e.g. `<MdAccountBalance />`. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <Box
    display="grid"
    placeItems="center"
    width="10"
    height="full"
    me="6"
    color="gray.500"
    aria-hidden="true"
    css={{
      "& > svg": {
        boxSize: "6",
      },
    }}    >
      {icon ?? children}
    </Box>
);