import { Box, Button, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

import { LoginType, useValidateMfaMutation } from "@/api/auth";
import { Logo } from "@/assets/images";
import { useTemporaryAuthStore } from "@/store/temporaryAuthStore";
import { CountdownTimer } from "@/shared/components/ui/CountdownTimer";
import {
  OtpCodeInput,
  OtpCodeInputStatus,
} from "@/shared/components/inputField/OtpCodeInput";
import TokenService from "@/shared/service/service-token";
import { ROUTES_CONFIG } from "@/shared/config";
import { FormProvider } from "@/shared/components";
import {
  mfaVerificationSchema,
  MfaVerificationSchemaType,
} from "@/validations";

const defaultValues: MfaVerificationSchemaType = {
  totpCode: "",
};

const MFAVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: validateMfa, isPending } = useValidateMfaMutation();
  const authState = useTemporaryAuthStore();

  const methods = useForm<MfaVerificationSchemaType>({
    defaultValues,
    resolver: yupResolver(mfaVerificationSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { handleSubmit, control, watch } = methods;
  const totpCode = watch("totpCode");

  // Visual state for the code input only. The request, loading state, API error
  // message (toast) and success navigation all stay owned by the mutation.
  const [codeStatus, setCodeStatus] = useState<OtpCodeInputStatus>("idle");

  // Guards against duplicate verification: one request at a time, and the same
  // completed code is never auto-verified twice without the user editing it.
  const isVerifyingRef = useRef(false);
  const autoVerifiedCodeRef = useRef<string | null>(null);

  const resolveLoginType = (pathname: string): LoginType => {
    if (pathname.includes("/super-admin")) return "super-admin";
    if (pathname.includes("/client")) return "client";
    return "solo";
  };

  const loginType = resolveLoginType(location.pathname);

  /**
   * The single verification path used by both the Verify button and the
   * auto-submit on a completed code. Endpoint, payload and success handling are
   * unchanged; only the OTP component's visual status is added.
   */
  const verifyCode = async (totpCodeValue: string) => {
    isVerifyingRef.current = true;

    try {
      const response = await validateMfa({
        mfaToken: authState.mfaToken,
        totpCode: totpCodeValue,
      });

      const resData = response?.data?.data;
      if (!resData) {
        setCodeStatus("idle");
        return;
      }

      if (resData.status === "SUCCESS") {
        setCodeStatus("success");

        // Clear any stale tokens before setting new ones
        TokenService.clearToken();

        TokenService.setToken({
          access_token: resData.accessToken,
          refresh_token: resData.refreshToken,
        });
        localStorage.setItem("lastLoginRole", loginType);

        if (loginType === "super-admin") navigate("/super-admin/dashboard");
        else navigate(ROUTES_CONFIG.USER.GLOBAL_DASHBOARD);
      } else {
        setCodeStatus("error");
      }
    } catch {
      // The mutation already surfaced the API message; only mirror the state.
      setCodeStatus("error");
    } finally {
      isVerifyingRef.current = false;
    }
  };

  const handleVerify = async (data: MfaVerificationSchemaType) => {
    if (isVerifyingRef.current || authState.isExpired()) return;
    await verifyCode(data.totpCode);
  };

  /** Auto-submit once when the code is complete — never twice for one code. */
  const handleCodeComplete = (code: string) => {
    if (isVerifyingRef.current || authState.isExpired()) return;
    if (autoVerifiedCodeRef.current === code) return;

    autoVerifiedCodeRef.current = code;
    void verifyCode(code);
  };

  const handleCodeChange = (_nextCode: string) => {
    // Editing clears the previous verdict and re-arms auto-submit.
    if (codeStatus !== "idle") setCodeStatus("idle");
    autoVerifiedCodeRef.current = null;
  };

  return (
    <Stack gap="8" justifyContent="center" py="2">
      <Box mx={{ base: "auto", md: 0 }}>
        <Image src={Logo} alt="Logo" height="72px" width="max-content" />
      </Box>

      <Stack gap="3">
        <Stack gap="1">
          <Text
            fontSize="xl"
            fontWeight="700"
            color="gray.900"
            lineHeight="1.2"
          >
            Two-Factor Authentication
          </Text>
          <Text fontSize="sm" color="gray.500" lineHeight="1.6">
            Enter the 6-digit code from your authenticator app.
          </Text>
        </Stack>
        {/* <CountdownTimer
          onExpire={() => {
            authState.clearTemporaryAuth();
            navigate("/auth/login");
          }}
          fontSize="sm"
        /> */}
      </Stack>

      <VStack gap="6" align="center">
        <FormProvider methods={methods} onSubmit={handleSubmit(handleVerify)}>
          <Stack gap="4" w="full">
            <Controller
              name="totpCode"
              control={control}
              render={({ field }) => (
                <OtpCodeInput
                  value={field.value}
                  onChange={(nextCode) => {
                    handleCodeChange(nextCode);
                    field.onChange(nextCode);
                  }}
                  onComplete={handleCodeComplete}
                  length={6}
                  status={codeStatus}
                  disabled={authState.isExpired()}
                  autoFocus
                  ariaLabel="6-digit authentication code"
                  name="totpCode"
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
