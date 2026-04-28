import { DialogRootProps } from "@chakra-ui/react";
import React from "react";

export type DialogProps = Pick<
  DialogRootProps,
  "size" | "scrollBehavior" | "closeOnEscape" | "closeOnInteractOutside"
> & {
  open: boolean;
  onClose: VoidFunction;
  title: string;
  children: React.ReactNode;

  hasFooter?: boolean;
};
