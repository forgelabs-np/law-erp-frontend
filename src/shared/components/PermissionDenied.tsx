import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { ShieldOff, ArrowLeft, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PermissionDeniedProps {
  /** Custom title (default: "Access Restricted") */
  title?: string;
  /** Custom description (default: generic message) */
  description?: string;
  /** Optional icon element override */
  icon?: React.ReactNode;
  /** Show a "Go Back" button (default: true) */
  showBack?: boolean;
  /** Show a "Go to Dashboard" button (default: true) */
  showDashboard?: boolean;
}

/**
 * Reusable permission-denied / forbidden page component.
 * Shown when a user navigates to a route they don't have permission for.
 * Professional, responsive, and consistent with the Law CRM design system.
 */
export function PermissionDenied({
  title = "Access Restricted",
  description = "You do not have the required permission to access this page. Please contact your administrator if you believe this is an error.",
  icon,
  showBack = true,
  showDashboard = true,
}: PermissionDeniedProps) {
  const navigate = useNavigate();

  return (
    <VStack
      gap={6}
      py={16}
      px={8}
      textAlign="center"
      justify="center"
      minH="60vh"
      w="100%"
    >
      <Box
        p={5}
        borderRadius="full"
        bg="red.50"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {icon || (
          <ShieldOff size={36} color="var(--chakra-colors-red-500, #ef4444)" />
        )}
      </Box>

      <VStack gap={2}>
        <Text fontSize="xl" fontWeight="semibold" color="gray.800">
          {title}
        </Text>
        <Text fontSize="sm" color="gray.500" maxW="md" lineHeight="relaxed">
          {description}
        </Text>
      </VStack>

      <VStack gap={3} direction={{ base: "column", sm: "row" }}>
        {showBack && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            gap={2}
          >
            <ArrowLeft size={14} />
            Go Back
          </Button>
        )}
        {showDashboard && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/")}
            gap={2}
          >
            <LayoutDashboard size={14} />
            Go to Dashboard
          </Button>
        )}
      </VStack>
    </VStack>
  );
}
