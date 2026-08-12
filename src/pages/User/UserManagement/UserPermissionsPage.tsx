import {
  Badge,
  Box,
  Button,
  HStack,
  Input,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Search, Shield, ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useUserPermissionsQuery } from "@/api/userManagement";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/shared/components/ui/Accordion";
import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";
import { ROUTES_CONFIG } from "@/shared/config";
import { InputGroup } from "@/shared/components/ui/InputGroup";

export const UserPermissionsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: permissions,
    isLoading,
    isError,
    refetch,
  } = useUserPermissionsQuery(userId ?? "");

  const groupedPermissions = useMemo(() => {
    if (!permissions || !Array.isArray(permissions)) return {};

    const groups = permissions.reduce<Record<string, any[]>>(
      (acc, perm: any) => {
        const moduleName = perm.moduleName || perm.module || "General";
        if (!acc[moduleName]) acc[moduleName] = [];
        acc[moduleName].push(perm);
        return acc;
      },
      {}
    );

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered: Record<string, any[]> = {};
      Object.entries(groups).forEach(([module, perms]) => {
        const filteredPerms = perms.filter(
          (p: any) =>
            (p.permissionType || p.name || p.permission || "")
              .toLowerCase()
              .includes(query) || module.toLowerCase().includes(query)
        );
        if (filteredPerms.length > 0) {
          filtered[module] = filteredPerms;
        }
      });
      return filtered;
    }

    return groups;
  }, [permissions, searchQuery]);

  const totalPermissions = Object.values(groupedPermissions).flat().length;
  const totalModules = Object.keys(groupedPermissions).length;

  if (isError) {
    return (
      <Stack gap={6} p={8}>
        <Button
          variant="ghost"
          alignSelf="flex-start"
          onClick={() => navigate(ROUTES_CONFIG.USER.USER_MANAGEMENT)}
          size="sm"
          // leftIcon={<ArrowLeft size={16} />}
        >
          Back to Users
        </Button>
        <Box textAlign="center" py={12}>
          <Text fontSize="lg" color="red.500" mb={4}>
            Failed to load permissions
          </Text>
          <Button onClick={() => refetch()} colorScheme="blue">
            Retry
          </Button>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack gap={6} p={8}>
      <Button
        variant="ghost"
        alignSelf="flex-start"
        onClick={() => navigate(ROUTES_CONFIG.USER.USER_MANAGEMENT)}
        size="sm"
        // leftIcon={<ArrowLeft size={16} />}
      >
        Back to Users
      </Button>

      {/* Header */}
      <Box
        bg="white"
        borderRadius="2xl"
        border="1px solid"
        borderColor="gray.200"
        p={6}
      >
        <HStack
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={4}
        >
          <Stack gap={1}>
            <Text textStyle="heading_4">User Permissions</Text>
            <Text textStyle="paragraph_regular" color="gray.500">
              View all permissions assigned to this user
            </Text>
          </Stack>
          <HStack gap={3}>
            <Box bg="blue.50" px={3} py={2} borderRadius="lg">
              <Text fontSize="sm" fontWeight="600" color="blue.700">
                {totalPermissions} Permissions
              </Text>
            </Box>
            <Box bg="purple.50" px={3} py={2} borderRadius="lg">
              <Text fontSize="sm" fontWeight="600" color="purple.700">
                {totalModules} Modules
              </Text>
            </Box>
          </HStack>
        </HStack>
      </Box>

      {/* Search */}
      <Box
        bg="white"
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.200"
        p={4}
      >
        <InputGroup
          startElement={
            <Box pl={2} color="gray.400">
              <Search size={16} />
            </Box>
          }
          width="full"
        >
          <Input
            placeholder="Search permissions or modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Box>

      {/* Permissions Content */}
      {isLoading ? (
        <Stack gap={3}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="56px" borderRadius="lg" />
          ))}
        </Stack>
      ) : Object.keys(groupedPermissions).length === 0 ? (
        <Box
          bg="white"
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.200"
          p={12}
        >
          <NoDataAvailable
            content={
              searchQuery
                ? "No permissions match your search"
                : "No permissions found for this user"
            }
          />
        </Box>
      ) : (
        <Box
          bg="white"
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.200"
          p={6}
        >
          <AccordionRoot
            multiple
            defaultValue={Object.keys(groupedPermissions).slice(0, 3)}
          >
            {Object.entries(groupedPermissions).map(([module, perms]) => (
              <AccordionItem key={module} value={module}>
                <AccordionItemTrigger>
                  <HStack gap={3} flex={1} justify="space-between">
                    <HStack gap={3}>
                      <Box bg="purple.50" borderRadius="md" p={2}>
                        <Shield size={16} color="purple.600" />
                      </Box>
                      <Text fontWeight="500" fontSize="sm">
                        {module}
                      </Text>
                    </HStack>
                    <Badge
                      bg="gray.100"
                      color="gray.600"
                      px="2"
                      py="0.5"
                      borderRadius="full"
                      fontSize="xs"
                    >
                      {perms.length}
                    </Badge>
                  </HStack>
                </AccordionItemTrigger>
                <AccordionItemContent>
                  <Stack gap={2} py={3} px={2}>
                    <HStack gap={2} flexWrap="wrap">
                      {perms.map((perm: any, idx: number) => {
                        const permName =
                          perm.permissionType ||
                          perm.name ||
                          perm.permission ||
                          "VIEW";
                        const colorMap: Record<string, string> = {
                          VIEW: "blue",
                          CREATE: "green",
                          UPDATE: "orange",
                          DELETE: "red",
                        };
                        const color = colorMap[permName] || "gray";
                        return (
                          <Badge
                            key={perm.id || idx}
                            bg={`${color}.50`}
                            color={`${color}.700`}
                            px="3"
                            py="1.5"
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="500"
                            border="1px solid"
                            borderColor={`${color}.200`}
                          >
                            {permName}
                          </Badge>
                        );
                      })}
                    </HStack>
                  </Stack>
                </AccordionItemContent>
              </AccordionItem>
            ))}
          </AccordionRoot>
        </Box>
      )}
    </Stack>
  );
};
