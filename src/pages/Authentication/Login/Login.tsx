import { Box, Button, Image, Stack, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { type LoginType, useLoginMutation } from "@/api/auth";
import { Logo } from "@/assets/images";
import { FormProvider, TextFieldInput } from "@/shared/components";
import { ROUTES_CONFIG } from "@/shared/config";

const defaultValues = { username: "", password: "" };

const resolveLoginType = (pathname: string): LoginType => {
  if (pathname.includes("/super-admin")) return "super-admin";
  if (pathname.includes("/client")) return "client";
  return "solo";
};

const loginConfig: Record<LoginType, { title: string; subtitle: string }> = {
  solo: {
    title: "Welcome to Law Firm CRM",
    subtitle: "Secure access to manage operations.",
  },
  client: {
    title: "Client Portal",
    subtitle: "Sign in to your client account.",
  },
  "super-admin": {
    title: "Super Admin",
    subtitle: "Restricted access. Authorised personnel only.",
  },
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginType = resolveLoginType(location.pathname);
  const config = loginConfig[loginType];

  const methods = useForm({ defaultValues });
  const { handleSubmit } = methods;
  const { mutateAsync: login, isPending } = useLoginMutation(loginType);

  const onSubmitHandler = async (data: typeof defaultValues) => {
    try {
      const response = await login(data);
      if (response?.status === 200 || response?.status === 201) {
        if (loginType === "super-admin") navigate("/super-admin/dashboard");
        else if (loginType === "client")
          navigate(ROUTES_CONFIG.USER.CLIENT_DASHBOARD);
        else navigate(ROUTES_CONFIG.USER.SOLO_DASHBOARD);
      }
    } catch {
      return;
    }
  };

  return (
    <Stack gap="32px" justifyContent="center">
      <Stack gap="0">
        <Box mx={{ base: "auto", md: 0 }}>
          <Image src={Logo} alt="Logo" height="85px" width="max-content" />
        </Box>
        <Stack gap={1}>
          <Text textStyle="heading_5" fontWeight={700}>
            {config.title}
          </Text>
          <Text textStyle="paragraph_regular" opacity={0.64}>
            {config.subtitle}
          </Text>
        </Stack>
      </Stack>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack gap={8}>
          <Stack gap={5}>
            {loginType === "client" ? (
              <TextFieldInput
                name="username"
                label="Mobile Number"
                placeholder="Please provide mobile number"
                required
              />
            ) : (
              <TextFieldInput
                name="username"
                label="Username"
                placeholder="Please provide username"
                required
              />
            )}

            <TextFieldInput
              type="password"
              name="password"
              label="Password"
              placeholder="Please enter your password"
              required
            />
          </Stack>
          <Button type="submit" variant="danger" loading={isPending}>
            Sign in
          </Button>
        </Stack>
      </FormProvider>
    </Stack>
  );
};

export default Login;
