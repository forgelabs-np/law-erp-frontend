import { ConditionalValue } from "@chakra-ui/react";
import React from "react";

interface DialogProps {
  title?: string;
  subHeading?: string;
  type?: string;
  children?: React.ReactNode;
  outlineButtonText?: string;
  primaryButtonText?: string;
  open: boolean;
  onClear?: () => void;
  onClose: () => void;
  isSubmitting?: boolean;
  handleSubmit?: () => void;
  hasCloseTrigger?: boolean;
  size?: ConditionalValue<"xs" | "sm" | "md" | "lg" | "xl" | "cover" | "full">;
  contentMinWidth?: ConditionalValue<string | number>;
  borderRadius?: ConditionalValue<string | number>;
  boldCrossButton?: boolean;
  primaryButtonDisabled?: boolean;
  maxHeight?: string;
}
interface DeleteDialogProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  handleSubmit?: () => void;
  borderRadius?: ConditionalValue<string | number>;
  submitActionPending?: boolean;
}
interface ConformationDialogProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  handleSubmit?: () => void;
  borderRadius?: ConditionalValue<string | number>;
  submitActionPending?: boolean;
  action: string;
}
export type { DeleteDialogProps, DialogProps, ConformationDialogProps };
