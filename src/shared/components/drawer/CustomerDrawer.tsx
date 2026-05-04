import {
  Box,
  Button,
  Drawer as ChakraDrawer,
  CloseButton,
  ConditionalValue,
  DrawerRoot,
  HStack,
  Separator,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";

import { CloseIcon, CrossCircleIcon } from "@/assets/svgs";

import { Dialog } from "../dialog";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui";

interface CustomDrawerProps {
  open: boolean;
  onClose: () => void;
  headerText?: string;
  title?: string;
  component: ReactNode;
  hasFooter?: boolean;
  noteMessage?: string | ReactNode;
  exitButtonText?: string;
  submitButtonText?: string;
  handleExit?: VoidFunction;
  handleSubmit?: () => void;
  resetButtonText?: string;
  handleReset?: () => void;
  askForClose?: boolean;
  isSubmitting?: boolean;
  disabled?: boolean;
  subHeading?: string;
  placement?: ConditionalValue<"bottom" | "start" | "end" | "top" | undefined>;
  size?: ConditionalValue<
    "sm" | "md" | "lg" | "xl" | "full" | "xs" | undefined
  >;
}

const DrawerCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraDrawer.CloseTriggerProps
>(function DrawerCloseTrigger(props, ref) {
  const { children, ...rest } = props;

  return (
    <Box position="absolute" top="6px" left="-5px" zIndex={10}>
      <ChakraDrawer.CloseTrigger {...rest} asChild>
        <CloseButton size="sm" ref={ref}>
          {children}
        </CloseButton>
      </ChakraDrawer.CloseTrigger>
    </Box>
  );
});
const Note = () => (
  <Text mb={5}>
    <Text fontWeight={"extrabold"} as={"span"}>
      Note:{" "}
    </Text>{" "}
    All fields marked with an asterisk (
    <Text color="red" as="span">
      *
    </Text>
    ) are required fields.
  </Text>
);
const CustomDrawer = ({
  open,
  onClose,
  headerText,
  title,
  component,
  hasFooter = true,
  noteMessage = <Note />,
  exitButtonText,
  submitButtonText,
  resetButtonText,
  handleReset,
  handleExit,
  handleSubmit,
  askForClose = true,
  isSubmitting = false,
  disabled = false,
  size = "full",
  placement = "end",
  subHeading,
}: CustomDrawerProps) => {
  const { open: dialogOpen, onOpen, onClose: onDialogClose } = useDisclosure();

  return (
    <DrawerRoot
      open={open}
      placement={placement}
      onOpenChange={() => {
        onClose();
      }}
      size={size}
      closeOnInteractOutside={false}
    >
      <DrawerBackdrop />
      <DrawerContent position={"relative"}>
        {headerText && (
          <DrawerHeader as={Stack} gap={8}>
            <DrawerTitle
              color="gray.400"
              textStyle="heading_6"
              fontWeight="600"
            >
              {headerText}
            </DrawerTitle>
            <Separator color={"gray.200"} />
          </DrawerHeader>
        )}
        <DrawerBody
          as={Stack}
          gap={3}
          p={{ base: 0, md: 6 }}
          pb={{ base: 6, md: 0 }}
        >
          <Box>
            {title && (
              <HStack
                justifyContent="space-between"
                alignItems="center"
                borderBottom="1px solid"
                borderColor="gray.200"
                p="4"
              >
                <Text color="gray.700" textStyle="heading_3" fontWeight="800">
                  {title}
                </Text>

                {placement === "top" && (
                  <DrawerCloseTrigger asChild>
                    <Box
                      as="button"
                      cursor="pointer"
                      p={1}
                      borderRadius="md"
                      _hover={{ bg: "gray.100" }}
                    >
                      <CrossCircleIcon
                        color="red"
                        height={"24px"}
                        width={"24px"}
                      />
                    </Box>
                  </DrawerCloseTrigger>
                )}
              </HStack>
            )}
            {subHeading && (
              <Text
                color="gray.500"
                textStyle={"paragraph_regular"}
                px="4"
                py="2"
                fontSize={"16px"}
              >
                {subHeading}
              </Text>
            )}
          </Box>
          {component}
        </DrawerBody>
        {hasFooter && (
          <DrawerFooter paddingTop={"10px"} flexDirection="column">
            <HStack
              paddingTop={5}
              width={"full"}
              justifyContent={"space-between"}
            >
              {exitButtonText && (
                <DrawerActionTrigger asChild={handleExit ? false : true}>
                  <Button
                    variant="outline"
                    textStyle="subtitle_small"
                    paddingX={11}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleExit?.();
                    }}
                  >
                    {exitButtonText}
                  </Button>
                </DrawerActionTrigger>
              )}
              <HStack paddingTop={1} w={"full"}>
                <Text textStyle={"paragraph_regular"} flex={1}>
                  {noteMessage}
                </Text>
                {resetButtonText && (
                  <Button
                    variant="solid"
                    textStyle="subtitle_small"
                    paddingX={11}
                    onClick={handleReset}
                  >
                    {resetButtonText}
                  </Button>
                )}

                {submitButtonText && (
                  <Button
                    variant="outline"
                    onClick={handleSubmit}
                    minW="112px"
                    h="44px"
                    textStyle="subtitle_small"
                    ml={2}
                    loading={isSubmitting}
                    disabled={disabled}
                  >
                    {submitButtonText}
                  </Button>
                )}
              </HStack>
            </HStack>
          </DrawerFooter>
        )}

        {placement != "bottom" ? (
          <Box
            position="absolute"
            top="6px"
            left="-40px"
            zIndex={10}
            cursor="pointer"
            onClick={askForClose ? onOpen : onClose}
          >
            <CloseButton size="sm">
              <CloseIcon color="white" />
            </CloseButton>
          </Box>
        ) : (
          <CloseButton
            position="absolute"
            top="12px"
            right="12px"
            size="sm"
            zIndex={10}
            onClick={askForClose ? onOpen : onClose}
          >
            <CloseIcon color="red" />
          </CloseButton>
        )}

        <Dialog
          open={dialogOpen}
          onClose={() => {
            onDialogClose();
          }}
          title="Discard Changes?"
          hasFooter={false}
        >
          <Stack gap="8">
            <Text textStyle={"paragraph_large"}>
              You have unsaved changes. Are you sure you want to discard them?
            </Text>
            <HStack justifyContent={"flex-end"}>
              <Button
                onClick={() => {
                  onDialogClose();
                }}
              >
                Cancel
              </Button>
              <Button
                variant={"errorOutline"}
                onClick={() => {
                  onDialogClose();
                  onClose();
                }}
              >
                Discard Changes
              </Button>
            </HStack>
          </Stack>
        </Dialog>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default CustomDrawer;
