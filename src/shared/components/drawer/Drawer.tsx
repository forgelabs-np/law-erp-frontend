"use client";

import { Button } from "@chakra-ui/react";

import { CloseIcon } from "@/shared/assets";
import { DrawerProps } from "@/shared/types";

import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "../ui";

export const Drawer = ({
  size,
  open,
  onClose,
  children,
  title,
  closeOnEscape = true,
  closeOnInteractOutside = true,
  hasFooter = true,
}: DrawerProps) => {
  return (
    <DrawerRoot
      open={open}
      onOpenChange={onClose}
      size={size}
      closeOnEscape={closeOnEscape}
      closeOnInteractOutside={closeOnInteractOutside}
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>

          <CloseIcon className="close-icon" onClick={onClose} />
        </DrawerHeader>

        <DrawerBody>{children}</DrawerBody>

        {hasFooter && (
          <DrawerFooter>
            <DrawerActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerActionTrigger>
            <Button>Save</Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </DrawerRoot>
  );
};
