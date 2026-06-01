

import { Box, Text, VStack, HStack, Badge } from "@chakra-ui/react";

import { useModulesContext } from "@/shared/context/ModulesContext";
import { useModules } from "@/shared/hooks";
import {
  hasModuleAccess,
  hasScope,
  hasAllScopes,
} from "@/shared/utils/permissionHelper";


export const ModuleDebugPanel = () => {
  const { moduleData, loading, error } = useModules();

  if (loading) return <Text>Loading modules...</Text>;
  if (error) return <Text color="red.500">Error: {error}</Text>;
  if (!moduleData) return <Text>No module data available</Text>;

  return (
    <VStack align="start" gap={4} p={4} bg="gray.50" borderRadius="md">
      <Text fontWeight="bold">📋 Loaded Modules</Text>

      {moduleData.modules.map((module) => (
        <Box key={module.id} p={2} bg="white" borderRadius="md" w="full">
          <HStack justifyContent="space-between">
            <Text fontWeight="600">{module.name}</Text>
            <Badge colorScheme={module.active ? "green" : "gray"}>
              {module.active ? "Active" : "Inactive"}
            </Badge>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            Code: {module.code}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Scopes: {module.scopes.map((s) => s.code).join(", ")}
          </Text>
          {module.subModules.length > 0 && (
            <VStack align="start" pl={4} mt={2} gap={1}>
              {module.subModules.map((sub) => (
                <Text key={sub.id} fontSize="xs" color="gray.600">
                  • {sub.name} ({sub.code})
                </Text>
              ))}
            </VStack>
          )}
        </Box>
      ))}
    </VStack>
  );
};

/**
 * Example 2: Using permission checking with context
 */
export const ProtectedFeature = ({ moduleCode, scopeCode }: ProtectedFeatureProps) => {
  const { hasPermission } = useModulesContext();

  if (!hasPermission(moduleCode, scopeCode ? [scopeCode] : undefined)) {
    return (
      <Box p={4} bg="red.50" borderRadius="md">
        <Text color="red.700">
          ❌ You don't have permission to access this feature
        </Text>
      </Box>
    );
  }

  return (
    <Box p={4} bg="green.50" borderRadius="md">
      <Text color="green.700">✅ Feature is available</Text>
    </Box>
  );
};

interface ProtectedFeatureProps {
  moduleCode: string;
  scopeCode?: string;
}

/**
 * Example 3: Using permission utilities
 */
export const PermissionCheckExample = () => {
  const { moduleData } = useModules();

  return (
    <VStack align="start" gap={3} p={4}>
      <Box>
        <Text fontWeight="bold">Dashboard Access:</Text>
        <Text color={hasModuleAccess(moduleData, "DASHBOARD") ? "green.600" : "red.600"}>
          {hasModuleAccess(moduleData, "DASHBOARD") ? "✅ Allowed" : "❌ Denied"}
        </Text>
      </Box>

      <Box>
        <Text fontWeight="bold">Can View Users:</Text>
        <Text
          color={
            hasScope(moduleData, "USER_MANAGEMENT", "VIEW") ? "green.600" : "red.600"
          }
        >
          {hasScope(moduleData, "USER_MANAGEMENT", "VIEW") ? "✅ Yes" : "❌ No"}
        </Text>
      </Box>

      <Box>
        <Text fontWeight="bold">Can Create & Delete Users:</Text>
        <Text
          color={
            hasAllScopes(moduleData, "USER_MANAGEMENT", ["CREATE", "DELETE"])
              ? "green.600"
              : "red.600"
          }
        >
          {hasAllScopes(moduleData, "USER_MANAGEMENT", ["CREATE", "DELETE"])
            ? "✅ Yes"
            : "❌ No"}
        </Text>
      </Box>
    </VStack>
  );
};

/**
 * Example 4: Custom hook for specific use cases
 */
export const useCanAccessUserManagement = () => {
  const { moduleData } = useModules();
  return hasModuleAccess(moduleData, "USER_MANAGEMENT");
};

export const useCanEditUsers = () => {
  const { moduleData } = useModules();
  return hasScope(moduleData, "USER_MANAGEMENT", "EDIT");
};

// Usage in component
export const UserManagementButton = () => {
  const canAccess = useCanAccessUserManagement();
  const canEdit = useCanEditUsers();

  if (!canAccess) return null;

  return (
    <button disabled={!canEdit}>
      {canEdit ? "Edit User" : "View Only"}
    </button>
  );
};

/**
 * Example 5: Complete feature component with all checks
 */
export const AdminDashboard = () => {
  const { sidebarItems, loading, error, refetch } = useModules();
  const { hasPermission } = useModulesContext();

  if (loading) {
    return <Text>Loading dashboard...</Text>;
  }

  if (error) {
    return (
      <VStack gap={2}>
        <Text color="red.500">Failed to load modules</Text>
        <Text
          as="button"
          onClick={() => refetch()}
          color="blue.500"
          textDecoration="underline"
        >
          Try again
        </Text>
      </VStack>
    );
  }

  return (
    <VStack align="stretch" gap={6} p={6}>
      <VStack align="start">
        <Text fontSize="2xl" fontWeight="bold">
          Admin Dashboard
        </Text>
        <Text color="gray.600">
          Total Modules: {sidebarItems.length}
        </Text>
      </VStack>

      {hasPermission("USER_MANAGEMENT", ["CREATE", "EDIT"]) && (
        <Box p={4} bg="blue.50" borderRadius="md">
          <Text fontWeight="bold">👥 User Management Available</Text>
          <Text fontSize="sm">You can create and edit users</Text>
        </Box>
      )}

      {hasPermission("DASHBOARD", ["VIEW"]) && (
        <Box p={4} bg="green.50" borderRadius="md">
          <Text fontWeight="bold">📊 Dashboard Available</Text>
          <Text fontSize="sm">You can view the dashboard</Text>
        </Box>
      )}
    </VStack>
  );
};
