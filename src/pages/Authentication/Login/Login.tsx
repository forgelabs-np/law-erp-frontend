import { Box, Button, Image, Stack, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { type LoginType, useLoginMutation } from "@/api/auth";
import { useTemporaryAuthStore } from "@/store/temporaryAuthStore";
import { Logo } from "@/assets/images";
import TokenService from "@/shared/service/service-token";
import {
  FormProvider,
  PasswordInput,
  TextFieldInput,
} from "@/shared/components";
import { ROUTES_CONFIG } from "@/shared/config";

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

const handleSuperAdminLogin = (resData: any, navigate: ReturnType<typeof useNavigate>) => {
  // Extract tokens regardless of the status property
  if (resData.accessToken && resData.refreshToken) {
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
  const setTemporaryAuth = useTemporaryAuthStore((state) => state.setTemporaryAuth);

  const methods = useForm({ defaultValues });
  const { handleSubmit } = methods;
  const { mutateAsync: login, isPending } = useLoginMutation(loginType);

  const onSubmitHandler = async (data: typeof defaultValues) => {
    try {
      const response = await login(data);
      const resData = response?.data?.data;

      if (!resData) return;

      if (loginType === "super-admin") {
        handleSuperAdminLogin(resData, navigate);
        return;
      }

      switch (resData.status) {
        case "SUCCESS":
          TokenService.setToken({
            access_token: resData.accessToken,
            refresh_token: resData.refreshToken,
          });
          localStorage.setItem(
            "lastLoginRole",
            TokenService.getTokenDetails()?.workspace ?? ""
          );

          if (loginType === "client") {
            navigate(ROUTES_CONFIG.USER.CLIENT_DASHBOARD);
          } else {
            navigate(ROUTES_CONFIG.USER.SOLO_DASHBOARD);
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
    <Stack gap="8" justifyContent="center" py="2">
      {/* Logo */}
      <Box mx={{ base: "auto", md: 0 }}>
        <Image src={Logo} alt="Logo" height="72px" width="max-content" />
      </Box>

      {/* Header */}
      <Stack gap="3">
        {/* Access type badge */}
        <Box
          display="inline-flex"
          alignSelf={{ base: "center", md: "flex-start" }}
          px="2.5"
          py="0.5"
          borderRadius="sm"
          bg="gray.100"
          border="1px solid"
          borderColor="gray.200"
        >
          <Text
            fontSize="xs"
            fontWeight="500"
            color="gray.500"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            {config.badge}
          </Text>
        </Box>

        <Stack gap="1">
          <Text
            fontSize="xl"
            fontWeight="700"
            color="gray.900"
            lineHeight="1.2"
          >
            {config.title}
          </Text>
          <Text fontSize="sm" color="gray.500" lineHeight="1.6">
            {config.subtitle}
          </Text>
        </Stack>
      </Stack>

      {/* Form */}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack gap="6">
          <Stack gap="4">
            {loginType !== "super-admin" && (
              <TextFieldInput
                name="lawFirmCode"
                label="Firm Code"
                placeholder="Enter your firm code"
                required
              />
            )}
            <TextFieldInput
              name="username"
              label="Username"
              placeholder="Enter your username"
              required
            />
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Enter your password"
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
            Sign in
          </Button>
        </Stack>
      </FormProvider>
    </Stack>
  );
};

export default Login;
