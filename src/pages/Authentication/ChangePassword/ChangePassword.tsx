import { Box, Button, Image, Stack, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useChangePasswordMutation } from "@/api/auth";
import { Logo } from "@/assets/images";
import { FormProvider, PasswordInput } from "@/shared/components";
import { useTemporaryAuthStore } from "@/store/temporaryAuthStore";
import { CountdownTimer } from "@/shared/components/ui/CountdownTimer";
import { toastFail, toastSuccess } from "@/shared/toast";
import { ROUTES_CONFIG } from "@/shared/config";

const defaultValues = { newPassword: "", confirmPassword: "" };

const ChangePassword = () => {
  const navigate = useNavigate();
  const methods = useForm({ defaultValues });
  const { handleSubmit, setError } = methods;
  const { mutateAsync: changePassword, isPending } = useChangePasswordMutation();
  const authState = useTemporaryAuthStore();

  const onSubmitHandler = async (data: typeof defaultValues) => {
    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", { type: "manual", message: "Passwords do not match" });
      return;
    }

    try {
      const response = await changePassword({
        passwordChangeToken: authState.passwordChangeToken,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      const resData = response?.data?.data;
      if (!resData) return;

      if (resData.status === "MFA_SETUP_REQUIRED") {
        authState.setTemporaryAuth({
          status: "MFA_SETUP_REQUIRED",
          mfaToken: resData.mfaToken,
          mfaQrCodeUri: resData.mfaQrCodeUri,
          mfaManualKey: resData.mfaManualKey,
          expiresIn: resData.expiresIn,
        });
        toastSuccess("Password updated successfully. Continue setting up MFA.");
        navigate(ROUTES_CONFIG.AUTHENTICATION.MFA_SETUP);
      } else {
        authState.clearTemporaryAuth();
        toastSuccess("Password updated successfully. Please log in again.");
        navigate("/auth/login");
        // toastFail("Unexpected authentication state. Please try again.");
      }
    } catch {
      return;
    }
  };

  return (
    <Stack gap="8" justifyContent="center" py="2">
      <Box mx={{ base: "auto", md: 0 }}>
        <Image src={Logo} alt="Logo" height="72px" width="max-content" />
      </Box>

      <Stack gap="3">
        <Stack gap="1">
          <Text fontSize="xl" fontWeight="700" color="gray.900" lineHeight="1.2">
            Change Password
          </Text>
          <Text fontSize="sm" color="gray.500" lineHeight="1.6">
            Your password must be updated before continuing.
          </Text>
        </Stack>
        <CountdownTimer onExpire={() => { authState.clearTemporaryAuth(); navigate("/auth/login"); }} fontSize="sm" />
      </Stack>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack gap="6">
          <Stack gap="4">
            <PasswordInput
              name="newPassword"
              label="New Password"
              placeholder="Enter new password"
              required
            />
            <PasswordInput
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm new password"
              required
            />
          </Stack>

          <Button
            type="submit"
            variant="solid"
            loading={isPending}
            width="fit-content"
            px={8}
            bg="primary.500"
          >
            Update Password
          </Button>
        </Stack>
      </FormProvider>
    </Stack>
  );
};

export default ChangePassword;
