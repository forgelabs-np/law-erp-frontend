import { Box, Button, Stack, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormProvider } from "@/shared/components";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "@/shared/components/ui/Dialog";
import { UserResponseType } from "@/api/userManagement";

interface ResetMFADialogProps {
  open: boolean;
  onClose: () => void;
  user: UserResponseType | null;
  onSubmit: (reason: string) => void;
  isPending: boolean;
}

export const ResetMFADialog = ({
  open,
  onClose,
  user,
  onSubmit,
  isPending,
}: ResetMFADialogProps) => {
  const formMethods = useForm({
    defaultValues: { reason: "" },
  });

  const handleSubmit = () => {
    const reason = formMethods.getValues("reason");
    if (!reason || reason.trim() === "") {
      formMethods.setError("reason", {
        type: "required",
        message: "Reason is required",
      });
      return;
    }
    onSubmit(reason.trim());
  };

  const handleClose = () => {
    formMethods.reset();
    onClose();
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => !e.open && handleClose()}
      closeOnInteractOutside={false}
    >
      <DialogBackdrop />
      <DialogContent
        borderRadius="3xl"
        border="4px solid rgba(255, 255, 255, 0.20)"
        boxShadow="0px 0px 48px 0px rgba(0, 0, 0, 0.08)"
        minWidth="500px"
        p={0}
      >
        <DialogCloseTrigger />
        <DialogBody px={8} pt={10} pb={4}>
          <Stack gap={4}>
            <Text
              textStyle="heading_6"
              fontWeight="600"
              color="gray.700"
              textAlign="center"
            >
              Reset MFA
            </Text>
            {user && (
              <Stack gap={2} textAlign="center">
                <Text color="gray.600" fontSize="sm">
                  You are about to reset MFA for:
                </Text>
                <Text fontWeight="600" color="gray.800" fontSize="md">
                  {user.fullName || user.username}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  {user.email}
                </Text>
              </Stack>
            )}
            <Text
              color="gray.500"
              textStyle="paragraph_regular"
              textAlign="center"
            >
              This will remove the user's current authenticator configuration.
              They will need to configure MFA again on their next login.
            </Text>
            <Box>
              <FormProvider methods={formMethods}>
                <Textarea
                  name="reason"
                  placeholder="Please provide a reason for resetting MFA..."
                  required
                  resize="vertical"
                  minHeight="80px"
                  maxLength={500}
                />
                {formMethods.formState.errors.reason && (
                  <Text color="error.500" fontSize="xs" mt={1}>
                    {formMethods.formState.errors.reason.message as string}
                  </Text>
                )}
              </FormProvider>
            </Box>
          </Stack>
        </DialogBody>
        <DialogFooter
          mt={4}
          px={8}
          pb={8}
          pt={0}
          alignItems="center"
          justifyContent="center"
          gap={4}
        >
          <Button
            onClick={handleSubmit}
            minW="112px"
            textStyle="subtitle_small"
            borderRadius="xl"
            loading={isPending}
            type="button"
            backgroundColor="error.700"
            _hover={{ backgroundColor: "error.800" }}
            disabled={isPending}
          >
            Reset MFA
          </Button>
          <Button
            variant="surface"
            minW="112px"
            textStyle="subtitle_small"
            h="44px"
            onClick={handleClose}
            borderRadius="xl"
            disabled={isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
