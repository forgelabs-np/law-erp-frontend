import { Box, Button, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import { useConfirmMfaSetupMutation } from "@/api/auth";
import { Logo } from "@/assets/images";
import { useTemporaryAuthStore } from "@/store/temporaryAuthStore";
import { CountdownTimer } from "@/shared/components/ui/CountdownTimer";
import { OtpInput } from "@/shared/components/inputField/OtpInput";
import TokenService from "@/shared/service/service-token";
import { ROUTES_CONFIG } from "@/shared/config";

const MFASetup = () => {
  const navigate = useNavigate();
  const [totpCode, setTotpCode] = useState("");
  const { mutateAsync: confirmMfaSetup, isPending } = useConfirmMfaSetupMutation();
  const authState = useTemporaryAuthStore();

  const handleVerify = async () => {
    if (totpCode.length !== 6) return;

    try {
      const response = await confirmMfaSetup({
        mfaToken: authState.mfaToken,
        totpCode,
      });

      const resData = response?.data?.data;
      if (!resData) return;

      if (resData.status === "SUCCESS") {
        TokenService.setToken({
          access_token: resData.accessToken,
          refresh_token: resData.refreshToken,
        });
        const workspace = TokenService.getTokenDetails()?.workspace ?? "";
        localStorage.setItem("lastLoginRole", workspace);

        if (workspace === "super-admin") navigate("/super-admin/dashboard");
        else if (workspace === "client") navigate(ROUTES_CONFIG.USER.CLIENT_DASHBOARD);
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
            MFA Setup Required
          </Text>
          <Text fontSize="sm" color="gray.500" lineHeight="1.6">
            Scan the QR code with your authenticator app and enter the 6-digit code.
          </Text>
        </Stack>
        <CountdownTimer onExpire={() => { authState.clearTemporaryAuth(); navigate("/auth/login"); }} fontSize="sm" />
      </Stack>

      <VStack gap="6" align="center">
        {authState.mfaQrCodeUri && (
          <Box p={4} bg="white" borderRadius="md" shadow="sm" border="1px solid" borderColor="gray.200">
            <QRCodeSVG value={authState.mfaQrCodeUri} size={200} />
          </Box>
        )}

        {authState.mfaManualKey && (
          <Stack gap="1" align="center">
            <Text fontSize="sm" color="gray.500">Manual Entry Key</Text>
            <Text fontSize="sm" fontWeight="bold" userSelect="all" bg="gray.100" px={3} py={1} borderRadius="md">
              {authState.mfaManualKey}
            </Text>
          </Stack>
        )}

        <Stack gap="4" w="full">
          <OtpInput value={totpCode} onChange={setTotpCode} length={6} isDisabled={authState.isExpired()} />

          <Button
            onClick={handleVerify}
            variant="solid"
            loading={isPending}
            disabled={totpCode.length !== 6 || authState.isExpired()}
            width="full"
            bg="primary.500"
          >
            Verify & Setup
          </Button>
        </Stack>
      </VStack>
    </Stack>
  );
};

export default MFASetup;
