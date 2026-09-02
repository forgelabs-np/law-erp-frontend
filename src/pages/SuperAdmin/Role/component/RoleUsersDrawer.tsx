import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {
  DrawerRoot,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseTrigger,
  DrawerTitle,
} from "@/shared/components/drawer";
import { Avatar } from "@/shared/components/ui/Avatar";
import { useRoleUsersQuery } from "@/api/roleSetup.ts";
import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";
import { InputGroup } from "@/shared/components/ui";
import { Input } from "@chakra-ui/react";
import { SearchIcon } from "@/shared/assets";

interface RoleUsersDrawerProps {
  roleId: string | null;
  roleName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RoleUsersDrawer = ({
  roleId,
  roleName,
  isOpen,
  onClose,
}: RoleUsersDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, refetch } = useRoleUsersQuery(
    roleId || "",
    isOpen && !!roleId
  );

  const users = useMemo(() => {
    const usersList = data?.content ?? [];
    if (!searchTerm) return usersList;
    const lower = searchTerm.toLowerCase();
    return usersList.filter(
      (user: any) =>
        user.fullName?.toLowerCase().includes(lower) ||
        user.username?.toLowerCase().includes(lower) ||
        user.email?.toLowerCase().includes(lower)
    );
  }, [data, searchTerm]);

  const totalUsers = data?.totalElements ?? 0;

  return (
    <DrawerRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size="md"
      placement="end"
    >
      <DrawerContent bg="gray.50" _dark={{ bg: "gray.900" }}>
        <DrawerHeader pb={4} w={"full"} borderBottomWidth="1px">
          <Flex justify="space-between" align="center" mb={2}>
            <Text
              fontSize="sm"
              color="gray.500"
              fontWeight="600"
              textTransform="uppercase"
            >
              Assigned Users
            </Text>
            <DrawerCloseTrigger position="relative" inset="auto" />
          </Flex>
          <DrawerTitle
            fontSize="24px"
            fontWeight="bold"
            color="gray.800"
            _dark={{ color: "white" }}
          >
            {roleName}
          </DrawerTitle>
          {data && totalUsers > 5 && (
            <Box mt={4}>
              <InputGroup startElement={<SearchIcon />}>
                <Input
                  placeholder="Search by name, username, or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg="white"
                  borderRadius="md"
                />
              </InputGroup>
            </Box>
          )}
        </DrawerHeader>

        <DrawerBody pt={4} px={4}>
          {isLoading ? (
            <VStack align="stretch" gap={4}>
              {[1, 2, 3].map((i) => (
                <Box
                  key={i}
                  p={4}
                  bg="white"
                  borderRadius="lg"
                  borderWidth="1px"
                >
                  <HStack gap={4}>
                    <Skeleton boxSize="48px" borderRadius="full" />
                    <VStack align="start" gap={2} flex="1">
                      <Skeleton height="16px" width="60%" />
                      <Skeleton height="14px" width="40%" />
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          ) : isError ? (
            <VStack gap={4} py={10}>
              <Text color="red.500" fontWeight="500">
                Failed to load assigned users
              </Text>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                Retry
              </Button>
            </VStack>
          ) : !data || totalUsers === 0 ? (
            <NoDataAvailable content="No users assigned to this role." />
          ) : users.length === 0 ? (
            <NoDataAvailable content="No matching users found." />
          ) : (
            <VStack align="stretch" gap={3}>
              {users.map((user: any) => (
                <Box
                  key={user.id}
                  p={4}
                  bg="white"
                  _dark={{ bg: "gray.800", borderColor: "gray.700" }}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="gray.200"
                  boxShadow="sm"
                >
                  <HStack gap={4} align="flex-start">
                    <Avatar
                      src={user.avatar}
                      name={user.fullName || user.username}
                      size="md"
                    />
                    <Box flex="1">
                      <HStack justify="space-between" mb={1}>
                        <Text
                          fontWeight="600"
                          color="gray.800"
                          _dark={{ color: "white" }}
                        >
                          {user.fullName || "—"}
                        </Text>
                        <Badge
                          bg={user.isActive ? "green.100" : "gray.100"}
                          color={user.isActive ? "green.700" : "gray.700"}
                          px={2}
                          py={0.5}
                          borderRadius="md"
                          fontSize="xs"
                          fontWeight="600"
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        @{user.username}
                      </Text>
                      {(user.email || user.mobileNumber) && (
                        <VStack align="start" gap={1} mt={2}>
                          {user.email && (
                            <Text fontSize="sm" color="gray.600">
                              {user.email}
                            </Text>
                          )}
                          {user.mobileNumber && (
                            <Text fontSize="sm" color="gray.600">
                              {user.mobileNumber}
                            </Text>
                          )}
                        </VStack>
                      )}
                    </Box>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </DrawerBody>
        <DrawerFooter
          borderTopWidth="1px"
          pt={4}
          pb={4}
          bg="white"
          _dark={{ bg: "gray.800" }}
        >
          <Flex w="100%" justify="space-between" align="center">
            <Text fontSize="sm" fontWeight="600" color="gray.600">
              {data ? `${totalUsers} Total Assigned Users` : ""}
            </Text>
            <Button variant="outline" onClick={onClose} borderRadius="8px">
              Close
            </Button>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};
