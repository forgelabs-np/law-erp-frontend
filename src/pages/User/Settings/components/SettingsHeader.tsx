import { Box, Heading, Text } from "@chakra-ui/react";

export const SettingsHeader = () => {
  return (
    <Box mb={8}>
      <Heading size="xl" fontWeight="700" color="gray.900" letterSpacing="tight">
        Settings
      </Heading>
      <Text fontSize="sm" color="gray.500" mt={1}>
        Manage your account security, firm branding, and logo preferences.
      </Text>
    </Box>
  );
};
