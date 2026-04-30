import { Box, Button, Image, Stack, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { type RegisterType, useSignupMutation } from "@/api/auth";
import { Logo } from "@/assets/images";
import { FormProvider, TextFieldInput } from "@/shared/components";

const defaultValues = {
  fullName: "",
  email: "",
  mobileNo: "",
  username: "",
  password: "",
  barCouncilNumber: "",
  address: "",
  panNumber: "",
};

const resolveRegisterType = (pathname: string): RegisterType => {
  if (pathname.includes("/super-admin")) return "super-admin";
  if (pathname.includes("/client")) return "client";
  return "solo";
};

const registerConfig: Record<
  RegisterType,
  { title: string; subtitle: string }
> = {
  solo: {
    title: "Register as Solo Lawyer",
    subtitle: "Create your solo practitioner account.",
  },
  client: {
    title: "Register as Client",
    subtitle: "Create your client account to get started.",
  },
  "super-admin": {
    title: "Super Admin Registration",
    subtitle: "One-time super admin setup.",
  },
};

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registerType = resolveRegisterType(location.pathname);
  const config = registerConfig[registerType];

  // barCouncilNumber only relevant for solo lawyers
  const isSolo = registerType === "solo";

  const methods = useForm({ defaultValues });
  const { handleSubmit } = methods;
  const { mutateAsync: signup, isPending } = useSignupMutation(registerType);

  const onSubmitHandler = async (data: typeof defaultValues) => {
    try {
      const response = await signup(data);
      if (response?.status === 200 || response?.status === 201) {
        if (registerType === "client") navigate("/auth/client/login");
        else navigate("/auth/login");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
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
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={5}>
            <TextFieldInput name="fullName" label="Full Name" required />
            <TextFieldInput name="email" label="Email" required />
            <TextFieldInput name="mobileNo" label="Mobile Number" required />
            <TextFieldInput name="username" label="Username" required />
            <TextFieldInput
              type="password"
              name="password"
              label="Password"
              required
            />
            {isSolo && (
              <TextFieldInput
                name="barCouncilNumber"
                label="Bar Council Number"
                required
              />
            )}
            <TextFieldInput name="panNumber" label="PAN Number" required />
            <TextFieldInput name="address" label="Address" required />
          </Box>
          <Button type="submit" size="lg" loading={isPending}>
            Sign up
          </Button>
        </Stack>
      </FormProvider>
    </Stack>
  );
};

export default Signup;
