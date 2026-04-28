import { Button } from "@chakra-ui/react";

import { CloseIcon } from "@/shared/assets";
import { DialogProps } from "@/shared/types";

import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../ui";

export const Dialog = ({
  size,
  open,
  onClose,
  title,
  children,
  scrollBehavior,
  closeOnEscape = true,
  closeOnInteractOutside = true,
  hasFooter = true,
}: DialogProps) => {
  return (
    <DialogRoot
      open={open}
      onOpenChange={onClose}
      size={size}
      scrollBehavior={scrollBehavior}
      closeOnEscape={closeOnEscape}
      closeOnInteractOutside={closeOnInteractOutside}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <CloseIcon className="close-icon" onClick={onClose} />
        </DialogHeader>

        <DialogBody>{children}</DialogBody>

        {hasFooter && (
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            <Button>Save</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  );
};
