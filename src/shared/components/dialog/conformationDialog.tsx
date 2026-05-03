import { Button, Stack, Text } from "@chakra-ui/react";

import { ConformationDialogProps } from "@/shared/types/dialog";

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "../ui";

export const ConfirmationDialog = ({
  title,
  action,
  open,
  onClose,
  handleSubmit,
  borderRadius = "3xl",
  submitActionPending = false,
}: ConformationDialogProps) => {
  return (
    <DialogRoot
      open={open}
      onOpenChange={onClose}
      closeOnInteractOutside={false}
    >
      <DialogBackdrop />
      <DialogContent
        borderRadius={borderRadius}
        border="4px solid rgba(255, 255, 255, 0.20)"
        boxShadow="0px 0px 48px 0px rgba(0, 0, 0, 0.08)"
        minWidth="500px"
        p={0}
      >
        <DialogCloseTrigger color={"error.300"} />

        <DialogBody px={8} pt={10} pb={4} mb={0}>
          <Stack alignItems={"center"} gap={3}>
            <Text textStyle={"heading_6"} fontWeight={"600"} color={"gray.700"}>
              {title}
            </Text>
            <Text
              color={"gray.500"}
              textStyle={"paragraph_large"}
              textAlign={"center"}
            >
              You&apos;re going to {action}. Are you sure?
            </Text>
          </Stack>
        </DialogBody>
        <DialogFooter
          mt={4}
          px={8}
          pb={8}
          pt={0}
          alignItems={"center"}
          justifyContent={"center"}
          gap={4}
        >
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (handleSubmit) {
                handleSubmit();
              }
            }}
            minW={"112px"}
            textStyle={"subtitle_small"}
            type="button"
            borderRadius={"xl"}
            loading={submitActionPending}
            backgroundColor={"error.700"}
            _hover={{
              backgroundColor: "error.800",
            }}
          >
            Yes, {action}!
          </Button>
          <Button
            variant="surface"
            minW={"112px"}
            textStyle={"subtitle_small"}
            h={"44px"}
            onClick={() => onClose()}
            borderRadius={"xl"}
          >
            No, keep it
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
