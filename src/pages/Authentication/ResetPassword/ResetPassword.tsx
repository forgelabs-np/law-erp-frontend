import {
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LuArrowLeft, LuShieldCheck } from "react-icons/lu";

import { useResetPasswordMutation } from "@/api/auth";
import { Logo } from "@/assets/images";
import {
  FormProvider,
  PasswordInput,
  TextFieldInput,
} from "@/shared/components";
import { ROUTES_CONFIG } from "@/shared/config";
import { resetPasswordSchema, ResetPasswordSchemaType } from "@/validations";
import { LucideCheckCircle2 } from "lucide-react";

const defaultValues: ResetPasswordSchemaType = {
  token: "",
  newPassword: "",
  confirmPassword: "",
};

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  const initialToken =
    searchParams.get("token") || searchParams.get("otp") || "";

  const methods = useForm<ResetPasswordSchemaType>({
    defaultValues: {
      ...defaultValues,
      token: initialToken,
    },
    resolver: yupResolver(resetPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { handleSubmit, setValue } = methods;
  const { mutateAsync: resetPassword, isPending } = useResetPasswordMutation();

  useEffect(() => {
    if (initialToken) {
      setValue("token", initialToken);
    }
  }, [initialToken, setValue]);

  const onSubmitHandler = async (data: ResetPasswordSchemaType) => {
    try {
      await resetPassword({
        token: data.token.trim(),
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setIsResetSuccess(true);
    } catch {
      // Error notification is handled by the mutation error callback
      return;
    }
  };

  return (
    <VStack gap={5} justifyContent="center" py={1} align="stretch">
      {/* Logo Area */}
      <HStack gap={2} align="flex-start">
        <Box>
          <Image src={Logo} alt="Logo" height="40px" width="max-content" />
        </Box>
        <Stack gap={0.5}>
          <Text fontSize="sm" fontWeight="600" color="gray.600">
            Law Firm CRM
          </Text>
          <Text fontSize="xs" color="gray.400">
            Enterprise Practice Management
          </Text>
        </Stack>
      </HStack>

      {/* Header */}
      <Stack gap={4}>
        <Box
          display="inline-flex"
          alignSelf="flex-start"
          px={3}
          py={1}
          borderRadius="full"
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
        >
          <Text
            fontSize="xs"
            fontWeight="600"
            color="gray.600"
            letterSpacing="0.05em"
            textTransform="uppercase"
          >
            Security
          </Text>
        </Box>

        <Stack gap={2}>
          <Text
            fontSize="3xl"
            fontWeight="700"
            color="gray.900"
            lineHeight="1.1"
          >
            {isResetSuccess ? "Password Reset Successful" : "Reset Password"}
          </Text>
          <Text fontSize="md" color="gray.500" lineHeight="1.6">
            {isResetSuccess
              ? "Your password has been reset successfully. You can now log in with your new password."
              : "Enter your reset token and choose a new secure password."}
          </Text>
        </Stack>
      </Stack>

      {/* Form or Success State */}
      {!isResetSuccess ? (
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <Stack gap={4}>
            <Stack gap={4}>
              <TextFieldInput
                name="token"
                label="Reset Token / OTP"
                placeholder="Enter reset token received in email"
                required
                inputHeight="48px"
                inputBorderRadius="lg"
              />
              <PasswordInput
                name="newPassword"
                label="New Password"
                placeholder="Enter new password (min. 6 characters)"
                required
                inputHeight="48px"
                inputBorderRadius="lg"
              />
              <PasswordInput
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter your new password"
                required
                inputHeight="48px"
                inputBorderRadius="lg"
              />
            </Stack>

            <Button
              type="submit"
              variant="solid"
              loading={isPending}
              width="full"
              height="48px"
              borderRadius="lg"
              fontSize="md"
              fontWeight="600"
              bg="primary.500"
              _hover={{ bg: "primary.600" }}
              _active={{ bg: "primary.700" }}
            >
              Reset Password
            </Button>
          </Stack>
        </FormProvider>
      ) : (
        <VStack gap={4} align="stretch" pt={2}>
          <Box
            p={4}
            borderRadius="lg"
            bg="green.50"
            border="1px solid"
            borderColor="green.200"
            display="flex"
            gap={3}
            alignItems="flex-start"
          >
            <Box color="green.600" pt={0.5}>
              <LucideCheckCircle2 size={20} />
            </Box>
            <Text fontSize="sm" color="green.800" lineHeight="1.5">
              Your password update is complete. All previous sessions have been
              invalidated.
            </Text>
          </Box>

          <Button
            onClick={() =>
              navigate(ROUTES_CONFIG.AUTHENTICATION.LOGIN, { replace: true })
            }
            variant="solid"
            width="full"
            height="48px"
            borderRadius="lg"
            fontSize="md"
            fontWeight="600"
            bg="primary.500"
            _hover={{ bg: "primary.600" }}
            _active={{ bg: "primary.700" }}
          >
            Go to Login
          </Button>
        </VStack>
      )}

      {/* Navigation Links */}
      <HStack justify="space-between" pt={2} fontSize="sm">
        <Link
          to={ROUTES_CONFIG.AUTHENTICATION.LOGIN}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#2563EB",
            fontWeight: 600,
          }}
        >
          <LuArrowLeft size={16} />
          Back to Login
        </Link>
        {!isResetSuccess && (
          <Link
            to={ROUTES_CONFIG.AUTHENTICATION.FORGOT_PASSWORD}
            style={{
              color: "#6B7280",
              fontWeight: 500,
            }}
          >
            Request new link
          </Link>
        )}
      </HStack>

      {/* Security Footer */}
      <HStack gap={2} justify="center" pt={2}>
        <LuShieldCheck />
        <Text fontSize="xs" color="gray.400">
          Secured with enterprise-grade encryption
        </Text>
      </HStack>
    </VStack>
  );
};

export default ResetPassword;
