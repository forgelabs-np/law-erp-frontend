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
import { yupResolver } from "@hookform/resolvers/yup";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import { type LoginType, useLoginMutation } from "@/api/auth";
import { useTemporaryAuthStore } from "@/store/temporaryAuthStore";
import { Logo } from "@/assets/images";
import TokenService from "@/shared/service/service-token";
import {
  AuthInputIcon,
  FormProvider,
  PasswordInput,
  TextFieldInput,
} from "@/shared/components";
import {
  AUTH_PILL_BUTTON_PROPS,
  AUTH_PILL_BUTTON_STYLE,
} from "@/shared/components/form/input/authPill";
import { ROUTES_CONFIG } from "@/shared/config";
import {
  loginSchema,
  superAdminLoginSchema,
  LoginSchemaType,
  SuperAdminLoginSchemaType,
} from "@/validations";
import {
  LuShieldCheck,
  LuLandmark,
  LuUser,
  LuCalendarCheck,
} from "react-icons/lu";

const defaultValues: LoginSchemaType = {
  lawFirmCode: "",
  username: "",
  password: "",
};

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

  const isSuperAdmin = loginType === "super-admin";
  const methods = useForm<LoginSchemaType | SuperAdminLoginSchemaType>({
    defaultValues,
    resolver: yupResolver(isSuperAdmin ? superAdminLoginSchema : loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { handleSubmit } = methods;
  const { mutateAsync: login, isPending } = useLoginMutation(loginType);

  const onSubmitHandler = async (
    data: LoginSchemaType | SuperAdminLoginSchemaType
  ) => {
    try {
      const response = await login(data);
      const resData = response?.data?.data;

      if (!resData) return;

      // if (loginType === "super-admin") {
      //   handleSuperAdminLogin(resData, navigate);
      //   return;
      // }
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
    <VStack gap={5} justifyContent="center" align="stretch">
      {/* Logo Area */}
      <HStack gap={3} align="center" mb={1}>
        <Box>
          <Image
            src={Logo}
            alt="Logo"
            height="42px"
            width="auto"
            objectFit="contain"
          />
        </Box>
        <Stack gap={0.5}>
          <Text
            fontSize="lg"
            fontWeight="800"
            color="gray.900"
            lineHeight="1.2"
          >
            Law Firm CRM
          </Text>
          <Text fontSize="xs" fontWeight="500" color="gray.400">
            Enterprise Practice Management
          </Text>
        </Stack>
      </HStack>

      {/* Header */}
      <Stack gap={3} mb={1}>
        {/* Access type badge */}
        <Box
          display="inline-flex"
          alignSelf="flex-start"
          px={3.5}
          py={1.5}
          borderRadius="full"
          bg="gray.100"
        >
          <Text
            fontSize="11px"
            fontWeight="700"
            color="gray.600"
            letterSpacing="0.08em"
            textTransform="uppercase"
          >
            {config.badge}
          </Text>
        </Box>

        <Stack gap={2}>
          <Text
            fontSize="4xl"
            fontWeight="800"
            color="gray.900"
            lineHeight="1.15"
            letterSpacing="-0.02em"
          >
            {config.title}
          </Text>
          <Text fontSize="md" color="gray.500" lineHeight="1.5">
            {config.subtitle}
          </Text>
        </Stack>
      </Stack>

      {/* Form */}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack gap={5}>
          <Stack gap={4}>
            {loginType !== "super-admin" && (
              <TextFieldInput
                name="lawFirmCode"
                label="Firm Code"
                placeholder="Firm code"
                required
                variant="authPill"
                endElement={<AuthInputIcon icon={<LuLandmark />} />}
                hideLabel={true}
              />
            )}
            <TextFieldInput
              name="username"
              label="Username"
              placeholder="Username"
              required
              variant="authPill"
              endElement={<AuthInputIcon icon={<LuUser />} />}
              hideLabel={true}
            />
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Password"
              required
              variant="authPill"
              hideLabel
            />
            {loginType !== "super-admin" && (
              <Text fontSize="xs" color="gray.400" mt={1}>
                Forgot your password?{" "}
                <Link color="primary.500" fontWeight="700" asChild>
                  <RouterLink to={ROUTES_CONFIG.AUTHENTICATION.FORGOT_PASSWORD}>
                    Reset here
                  </RouterLink>
                </Link>
              </Text>
            )}
          </Stack>

          <Button
            type="submit"
            variant="solid"
            loading={isPending}
            mt={1}
            {...AUTH_PILL_BUTTON_PROPS}
            css={AUTH_PILL_BUTTON_STYLE as never}
          >
            Sign in
          </Button>
        </Stack>
      </FormProvider>

      {/* Security Footer */}
      <HStack gap={2} justify="center" pt={3}>
        <LuShieldCheck color="#0052FF" size={15} />
        <Text
          fontSize="11px"
          fontWeight="700"
          letterSpacing="0.08em"
          color="gray.400"
          textTransform="uppercase"
        >
          Secured with enterprise-grade encryption
        </Text>
      </HStack>
    </VStack>
  );
};

export default Login;
