import {
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { LuArrowLeft, LuShieldCheck } from "react-icons/lu";

import { useForgotPasswordMutation } from "@/api/auth";
import { Logo } from "@/assets/images";
import { FormProvider, TextFieldInput } from "@/shared/components";
import { ROUTES_CONFIG } from "@/shared/config";
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "@/validations";
import { LucideCheckCircle2 } from "lucide-react";

const defaultValues: ForgotPasswordSchemaType = {
  lawFirmCode: "",
  username: "",
};

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const methods = useForm<ForgotPasswordSchemaType>({
    defaultValues,
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { handleSubmit } = methods;
  const { mutateAsync: forgotPassword, isPending } =
    useForgotPasswordMutation();

  const onSubmitHandler = async (data: ForgotPasswordSchemaType) => {
    try {
      await forgotPassword({
        lawFirmCode: data.lawFirmCode.trim(),
        username: data.username.trim(),
      });
      setIsSubmittedSuccess(true);
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
            Password Recovery
          </Text>
        </Box>

        <Stack gap={2}>
          <Text
            fontSize="3xl"
            fontWeight="700"
            color="gray.900"
            lineHeight="1.1"
          >
            {isSubmittedSuccess ? "Check Your Email" : "Forgot Password?"}
          </Text>
          <Text fontSize="md" color="gray.500" lineHeight="1.6">
            {isSubmittedSuccess
              ? "If the account details are valid, we've sent password recovery instructions and a reset token to the registered email address."
              : "Enter your law firm code and username below to request a password recovery token."}
          </Text>
        </Stack>
      </Stack>

      {/* Form or Success Screen */}
      {!isSubmittedSuccess ? (
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <Stack gap={4}>
            <Stack gap={4}>
              <TextFieldInput
                name="lawFirmCode"
                label="Firm Code"
                placeholder="Enter your firm code"
                required
                inputHeight="48px"
                inputBorderRadius="lg"
              />
              <TextFieldInput
                name="username"
                label="Username"
                placeholder="Enter your username"
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
              Send Reset Link
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
              Please check your inbox. You can use the token provided in the email to reset your password.
            </Text>
          </Box>

          <Button
            onClick={() => navigate(ROUTES_CONFIG.AUTHENTICATION.RESET_PASSWORD)}
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
            Enter Reset Token
          </Button>

          <Button
            onClick={() => setIsSubmittedSuccess(false)}
            variant="outline"
            width="full"
            height="44px"
            borderRadius="lg"
            fontSize="sm"
            fontWeight="600"
          >
            Resend Request
          </Button>
        </VStack>
      )}

      {/* Back to Login Link */}
      <HStack justify="center" pt={2}>
        <Link
          to={ROUTES_CONFIG.AUTHENTICATION.LOGIN}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#2563EB",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          <LuArrowLeft size={16} />
          Back to Login
        </Link>
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

export default ForgotPassword;
