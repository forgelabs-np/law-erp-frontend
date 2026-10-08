import {
  Box,
  Button,
  Card,
  Field,
  HStack,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Eye, EyeOff, Shield } from "lucide-react";

interface AccountSecuritySectionProps {
  passwordForm: {
    currentPassword: "";
    newPassword: "";
    confirmPassword: "";
  } | {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordForm: React.Dispatch<
    React.SetStateAction<{
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }>
  >;
  passwordErrors: Record<string, string>;
  showPasswords: {
    current: boolean;
    new: boolean;
    confirm: boolean;
  };
  setShowPasswords: React.Dispatch<
    React.SetStateAction<{
      current: boolean;
      new: boolean;
      confirm: boolean;
    }>
  >;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

export const AccountSecuritySection = ({
  passwordForm,
  setPasswordForm,
  passwordErrors,
  showPasswords,
  setShowPasswords,
  onSubmit,
  isLoading,
}: AccountSecuritySectionProps) => {
  return (
    <Card.Root h="100%" border="1px solid" borderColor="gray.200" shadow="xs" borderRadius="xl">
      <Card.Header pb={4} borderBottom="1px solid" borderColor="gray.100">
        <HStack gap={3}>
          <Box
            p={2}
            bg="primary.50"
            color="primary.600"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Shield size={18} />
          </Box>
          <Box>
            <Heading size="md" fontWeight="600" color="gray.900">
              Account & Security
            </Heading>
            <Text fontSize="xs" color="gray.500" mt={0.5}>
              Update your password to keep your account secure.
            </Text>
          </Box>
        </HStack>
      </Card.Header>
      <Card.Body pt={6}>
        <Stack gap={5} w="100%">
          {/* Current Password */}
          <Field.Root invalid={!!passwordErrors.currentPassword}>
            <Field.Label fontWeight="500" fontSize="sm" color="gray.700">
              Current Password
            </Field.Label>
            <HStack gap={2}>
              <Input
                type={showPasswords.current ? "text" : "password"}
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                size="md"
                borderRadius="md"
              />
              <Button
                variant="outline"
                size="md"
                px={3}
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                aria-label={showPasswords.current ? "Hide password" : "Show password"}
              >
                {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </HStack>
            {passwordErrors.currentPassword && (
              <Text color="red.500" fontSize="xs" mt={1}>
                {passwordErrors.currentPassword}
              </Text>
            )}
          </Field.Root>

          {/* New Password */}
          <Field.Root invalid={!!passwordErrors.newPassword}>
            <Field.Label fontWeight="500" fontSize="sm" color="gray.700">
              New Password
            </Field.Label>
            <HStack gap={2}>
              <Input
                type={showPasswords.new ? "text" : "password"}
                placeholder="At least 8 characters"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                size="md"
                borderRadius="md"
              />
              <Button
                variant="outline"
                size="md"
                px={3}
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    new: !prev.new,
                  }))
                }
                aria-label={showPasswords.new ? "Hide password" : "Show password"}
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </HStack>
            {passwordErrors.newPassword && (
              <Text color="red.500" fontSize="xs" mt={1}>
                {passwordErrors.newPassword}
              </Text>
            )}
          </Field.Root>

          {/* Confirm New Password */}
          <Field.Root invalid={!!passwordErrors.confirmPassword}>
            <Field.Label fontWeight="500" fontSize="sm" color="gray.700">
              Confirm New Password
            </Field.Label>
            <HStack gap={2}>
              <Input
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Re-enter new password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                size="md"
                borderRadius="md"
              />
              <Button
                variant="outline"
                size="md"
                px={3}
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                aria-label={showPasswords.confirm ? "Hide password" : "Show password"}
              >
                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </HStack>
            {passwordErrors.confirmPassword && (
              <Text color="red.500" fontSize="xs" mt={1}>
                {passwordErrors.confirmPassword}
              </Text>
            )}
          </Field.Root>

          <Box pt={2}>
            <Button
              onClick={onSubmit}
              loading={isLoading}
              loadingText="Changing Password..."
              colorPalette="primary"
              size="md"
              px={6}
            >
              Change Password
            </Button>
          </Box>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
