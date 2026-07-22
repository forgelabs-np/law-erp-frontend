import { Box, Button, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { LoginType, useValidateMfaMutation } from "@/api/auth";
import { Logo } from "@/assets/images";
import { useTemporaryAuthStore } from "@/store/temporaryAuthStore";
import { CountdownTimer } from "@/shared/components/ui/CountdownTimer";
import { OtpInput } from "@/shared/components/inputField/OtpInput";
import TokenService from "@/shared/service/service-token";
import { ROUTES_CONFIG } from "@/shared/config";
import { FormProvider } from "@/shared/components";

const defaultValues = {
  totpCode: "",
};

const MFAVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: validateMfa, isPending } = useValidateMfaMutation();
  const authState = useTemporaryAuthStore();

  const methods = useForm({ defaultValues });
  const { handleSubmit, control, watch } = methods;
  const totpCode = watch("totpCode");

  const resolveLoginType = (pathname: string): LoginType => {
    if (pathname.includes("/super-admin")) return "super-admin";
    if (pathname.includes("/client")) return "client";
    return "solo";
  };

  const loginType = resolveLoginType(location.pathname);

  const handleVerify = async (data: typeof defaultValues) => {
    if (data.totpCode.length !== 6) return;

    try {
      const response = await validateMfa({
        mfaToken: authState.mfaToken,
        totpCode: data.totpCode,
      });

      const resData = response?.data?.data;
      if (!resData) return;

      if (resData.status === "SUCCESS") {
        TokenService.setToken({
          access_token: resData.accessToken,
          refresh_token: resData.refreshToken,
        });
        localStorage.setItem("lastLoginRole", loginType);

        if (loginType === "super-admin") navigate("/super-admin/dashboard");
        else if (loginType === "client") navigate(ROUTES_CONFIG.USER.CLIENT_DASHBOARD);
        else navigate(ROUTES_CONFIG.USER.SOLO_DASHBOARD);
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
            Two-Factor Authentication
          </Text>
          <Text fontSize="sm" color="gray.500" lineHeight="1.6">
            Enter the 6-digit code from your authenticator app.
          </Text>
        </Stack>
        <CountdownTimer onExpire={() => { authState.clearTemporaryAuth(); navigate("/auth/login"); }} fontSize="sm" />
      </Stack>

      <VStack gap="6" align="center">
        <FormProvider methods={methods} onSubmit={handleSubmit(handleVerify)}>
          <Stack gap="4" w="full">
            <Controller
              name="totpCode"
              control={control}
              render={({ field }) => (
                <OtpInput
                  value={field.value}
                  onChange={field.onChange}
                  length={6}
                  isDisabled={authState.isExpired()}
                />
              )}
            />

            <Button
              type="submit"
              variant="solid"
              loading={isPending}
              disabled={totpCode.length !== 6 || authState.isExpired()}
              width="full"
              bg="primary.500"
            >
              Verify Code
            </Button>
          </Stack>
        </FormProvider>
      </VStack>
    </Stack>
  );
};

export default MFAVerification;
