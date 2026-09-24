import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { FormProvider, PasswordInput } from "@/shared/components";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "@/shared/components/ui/Dialog";
import { UserResponseType } from "@/api/userManagement";

const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must not exceed 50 characters")
    .optional(),
});

export type ResetPasswordSchemaType = yup.InferType<typeof resetPasswordSchema>;

interface ResetPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserResponseType | null;
  onSubmit: (newPassword?: string) => void;
  isPending: boolean;
}

export const ResetPasswordDialog = ({
  open,
  onClose,
  user,
  onSubmit,
  isPending,
}: ResetPasswordDialogProps) => {
  const formMethods = useForm<ResetPasswordSchemaType>({
    defaultValues: { newPassword: "" },
    resolver: yupResolver(resetPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (open) {
      formMethods.reset({ newPassword: "" });
    }
  }, [open, formMethods]);

  const handleSubmit = formMethods.handleSubmit((data) => {
    const trimmedPassword = data.newPassword?.trim();
    onSubmit(trimmedPassword || undefined);
  });

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
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
              Reset Password
            </Text>
            {user && (
              <Stack gap={2} textAlign="center">
                <Text color="gray.600" fontSize="sm">
                  You are about to reset the password for:
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
              The user's current password will be invalidated. You can
              optionally set a new password, or leave it empty to generate a
              temporary password.
            </Text>
            <Box>
              <FormProvider methods={formMethods}>
                <PasswordInput
                  name="newPassword"
                  label="New Password (Optional)"
                  placeholder="Leave empty to generate temporary password"
                  inputHeight="48px"
                  inputBorderRadius="lg"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Minimum 8 characters, maximum 50 characters
                </Text>
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
            backgroundColor="blue.600"
            color="white"
            _hover={{ backgroundColor: "blue.700" }}
            disabled={isPending}
          >
            Reset Password
          </Button>
          <Button
            variant="surface"
            minW="112px"
            textStyle="subtitle_small"
            h="44px"
            onClick={onClose}
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
