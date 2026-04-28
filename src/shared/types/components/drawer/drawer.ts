import { DrawerRootProps } from "@chakra-ui/react";
import React from "react";

export type DrawerProps = Pick<
  DrawerRootProps,
  "size" | "closeOnEscape" | "closeOnInteractOutside"
> & {
  open: boolean;
  onClose: VoidFunction;
  children: React.ReactNode;

  title?: string;
  hasFooter?: boolean;
};
