import {
  Box,
  Button,
  HStack,
  Image,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { type LoginType, useLoginMutation } from "@/api/auth";
import { useTemporaryAuthStore } from "@/store/temporaryAuthStore";
import { Logo } from "@/assets/images";
import { KeyIcon } from "@/assets/svgs";
import TokenService from "@/shared/service/service-token";
import {
  FormProvider,
  PasswordInput,
  TextFieldInput,
} from "@/shared/components";
import { ROUTES_CONFIG } from "@/shared/config";
import { MdSafetyCheck, MdSecurityUpdate } from "react-icons/md";
import { LuShieldCheck } from "react-icons/lu";

const defaultValues = { username: "", password: "" };

const resolveLoginType = (pathname: string): LoginType => {
  if (pathname.includes("/super-admin")) return "super-admin";
  if (pathname.includes("/client")) return "client";
  return "solo";
};

const loginConfig: Record<
  LoginType,
  { title: string; subtitle: string; badge: string }
> = {
  solo: {
    badge: "Firm Access",
    title: "Welcome back",
    subtitle: "Sign in to manage your firm's operations.",
  },
  client: {
    badge: "Client Portal",
    title: "Client Sign In",
    subtitle: "Access your case files and documents.",
  },
  "super-admin": {
    badge: "Restricted",
    title: "Administrator Access",
    subtitle: "Authorised personnel only.",
  },
};

const handleSuperAdminLogin = (
  resData: any,
  navigate: ReturnType<typeof useNavigate>
) => {
  // Extract tokens regardless of the status property
  if (resData.accessToken && resData.refreshToken) {
    // Clear any stale tokens before setting new ones
    TokenService.clearToken();
    
    TokenService.setToken({
      access_token: resData.accessToken,
      refresh_token: resData.refreshToken,
    });
    localStorage.setItem(
      "lastLoginRole",
      TokenService.getTokenDetails()?.workspace ?? ""
    );
    navigate("/super-admin/dashboard");
  }
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginType = resolveLoginType(location.pathname);
  const config = loginConfig[loginType];
  const setTemporaryAuth = useTemporaryAuthStore(
    (state) => state.setTemporaryAuth
  );

  const methods = useForm({ defaultValues });
  const { handleSubmit } = methods;
  const { mutateAsync: login, isPending } = useLoginMutation(loginType);

  const onSubmitHandler = async (data: typeof defaultValues) => {
    try {
      const response = await login(data);
      const resData = response?.data?.data;

      if (!resData) return;

      // if (loginType === "super-admin") {
      //   handleSuperAdminLogin(resData, navigate);
      //   return;
      // }
      console.log(loginType, "typpe");

      switch (resData.status) {
        case "SUCCESS":
          // Clear any stale tokens before setting new ones
          TokenService.clearToken();
          
          TokenService.setToken({
            access_token: resData.accessToken,
            refresh_token: resData.refreshToken,
          });
          

          if (loginType === "super-admin") {
            handleSuperAdminLogin(resData, navigate);
            return;
          }
          if (loginType === "client") {
            navigate(ROUTES_CONFIG.USER.GLOBAL_DASHBOARD);
          } else {
            navigate(ROUTES_CONFIG.USER.GLOBAL_DASHBOARD);
          }
          break;

        case "PASSWORD_CHANGE_REQUIRED":
          setTemporaryAuth(resData);
          navigate(ROUTES_CONFIG.AUTHENTICATION.CHANGE_PASSWORD);
          break;

        case "MFA_SETUP_REQUIRED":
          setTemporaryAuth(resData);
          navigate(ROUTES_CONFIG.AUTHENTICATION.MFA_SETUP);
          break;

        case "MFA_REQUIRED":
          setTemporaryAuth(resData);
          navigate(ROUTES_CONFIG.AUTHENTICATION.MFA_VERIFICATION);
          break;

        default:
          break;
      }
    } catch {
      return;
    }
  };

  return (
    <VStack gap={8} justifyContent="center" py={2} align="stretch">
      {/* Logo Area */}
      <HStack gap={2} align="flex-start">
        <Box>
          <Image src={Logo} alt="Logo" height="48px" width="max-content" />
        </Box>
        <Stack gap={1}>
          <Text fontSize="sm" fontWeight="600" color="gray.600">
            Law Firm CRM
          </Text>
          <Text fontSize="xs" color="gray.400">
            Enterprise Practice Management
          </Text>
        </Stack>
      </HStack>

      {/* Header */}
      <Stack gap={6}>
        {/* Access type badge */}
        <Box
          display="inline-flex"
          alignSelf="flex-start"
          px={3}
          py={1.5}
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
            {config.badge}
          </Text>
        </Box>

        <Stack gap={3}>
          <Text
            fontSize="3xl"
            fontWeight="700"
            color="gray.900"
            lineHeight="1.1"
          >
            {config.title}
          </Text>
          <Text fontSize="md" color="gray.500" lineHeight="1.6">
            {config.subtitle}
          </Text>
        </Stack>
      </Stack>

      {/* Form */}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack gap={6}>
          <Stack gap={5}>
            {loginType !== "super-admin" && (
              <TextFieldInput
                name="lawFirmCode"
                label="Firm Code"
                placeholder="Enter your firm code"
                required
                inputHeight="52px"
                inputBorderRadius="lg"
              />
            )}
            <TextFieldInput
              name="username"
              label="Username"
              placeholder="Enter your username"
              required
              inputHeight="52px"
              inputBorderRadius="lg"
            />
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Enter your password"
              required
              inputHeight="52px"
              inputBorderRadius="lg"
            />
            {loginType !== "super-admin" && (
              <Text
                fontSize="xs"
                color="gray.400"
                justifyContent="end"
                width="full"
              >
                Forgot your password?{" "}
                <Link
                  href="/forgot-password"
                  color="primary.500"
                  fontWeight="600"
                >
                  Reset here
                </Link>
              </Text>
            )}
          </Stack>

          <Button
            type="submit"
            variant="solid"
            loading={isPending}
            width="full"
            height="52px"
            borderRadius="lg"
            fontSize="md"
            fontWeight="600"
            bg="primary.500"
            _hover={{ bg: "primary.600" }}
            _active={{ bg: "primary.700" }}
          >
            Sign in
          </Button>
        </Stack>
      </FormProvider>

      {/* Security Footer */}
      <HStack gap={2} justify="center" pt={4}>
        <LuShieldCheck />
        <Text fontSize="xs" color="gray.400">
          Secured with enterprise-grade encryption
        </Text>
      </HStack>

      {/* Bottom Links */}
      <Stack gap={3} pt={2}>
        <HStack gap={5} justify="center" fontSize="xs" color="gray.400">
          <Text>Need help?</Text>
          <Text
            as="span"
            color="primary.500"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
          >
            Contact Support
          </Text>
          <HStack gap={3} justify="center" fontSize="xs" color="gray.400">
            <Text>•</Text>

            <Text
              as="span"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              Privacy Policy
            </Text>
            <Text>•</Text>
            <Text
              as="span"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              Terms of Service
            </Text>
          </HStack>
        </HStack>
      </Stack>
    </VStack>
  );
};

export default Login;
