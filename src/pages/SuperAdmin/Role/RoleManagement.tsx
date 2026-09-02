import {
  Button,
  HStack,
  Stack,
  Text,
  Avatar,
  Badge,
  Box,
  Grid,
  Flex,
  IconButton,
  VStack,
  useBreakpointValue,
  Input,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  useSuperAdminUsersQuery,
  UserResponseType,
} from "@/api/userManagement";
import { useGetFirmsQuery, FirmResponse } from "@/api/firmManagement";
import {
  RefreshCw,
  Users,
  Shield,
  Building,
  Ban,
  ChevronRight,
  ShieldCheck,
  Users2Icon,
  ShieldBan,
  Building2Icon,
  BanIcon,
  Eye,
} from "lucide-react";
import {
  Datatable,
  FormProvider,
  ReactSelect,
  SearchInput,
} from "@/shared/components";
import { ROUTES_CONFIG } from "@/shared/config";
import { Tooltip } from "@/shared/components/ui";

// StatCard Component
interface StatCardProps {
  icon: React.ComponentType<{
    size?: number | string;
    color?: string;
    className?: string;
  }>;
  label: string;
  value: number;
  description: string;
  color: string;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
  color,
}: StatCardProps) => {
  const colorMap: Record<string, string> = {
    blue: "blue.500",
    purple: "purple.500",
    green: "green.500",
    red: "red.500",
  };

  const bgMap: Record<string, string> = {
    blue: "blue.50",
    purple: "purple.50",
    green: "red.50",
    red: "red.50",
  };

  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.800", borderColor: "gray.700" }}
      borderRadius="16px"
      borderWidth="1px"
      borderColor="gray.200"
      boxShadow="sm"
      _hover={{ boxShadow: "md", transition: "all 0.2s" }}
      transition="all 0.2s"
      p={3}
    >
      <Flex gap={4} align="center">
        <Box
          bg={bgMap[color] || "gray.50"}
          _dark={{ bg: colorMap[color] ? `${colorMap[color]}20` : "gray.800" }}
          borderRadius="full"
          p={3}
        >
          <Icon size={24} color={colorMap[color] || "gray"} />
        </Box>
        <Stack gap={1} flex="1">
          <Text fontSize="sm" color="gray.500" fontWeight="500">
            {label}
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {value}
          </Text>
          <Text fontSize="xs" color="gray.400">
            {description}
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
};

// Minimal layout since it's just a table of users now.
const RoleSetup = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [firmFilter, setFirmFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filterFormMethods = useForm({
    defaultValues: { userType: "", firm: "" },
  });

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useSuperAdminUsersQuery({
    page: currentPage,
    size: pageSize,
    q: searchQuery || undefined,
    userType: userTypeFilter || undefined,
    roleId: undefined,
    active: undefined,
  });

  const { data: firmsResponse } = useGetFirmsQuery();
  const firms: FirmResponse[] =
    (firmsResponse as any)?.data ||
    (Array.isArray(firmsResponse) ? firmsResponse : []);

  const userTypeOptions = [
    { label: "All Types", value: "" },
    { label: "SUPER_ADMIN", value: "SUPER_ADMIN" },
    { label: "FIRM_USER", value: "FIRM_USER" },
    { label: "CLIENT", value: "CLIENT" },
  ];

  const firmOptions = [
    { label: "All Firms", value: "" },
    ...firms.map((firm) => ({
      label: `${(firm as any).firmName || firm.name} (${(firm as any).firmCode || firm.lawFirmCode})`,
      value: (firm as any).firmCode || firm.lawFirmCode,
    })),
  ];

  const list: UserResponseType[] = usersData?.content ?? [];
  const totalRecords = usersData?.totalElements ?? 0;
  const pageCount = usersData?.totalPages ?? 1;
  const isFirstPage = usersData?.first ?? true;
  const isLastPage = usersData?.last ?? true;

  // Calculate statistics
  const totalUsers = totalRecords;
  const uniqueRoles = new Set(list.map((user) => user.roleName).filter(Boolean))
    .size;
  const uniqueFirms = new Set(list.map((user) => user.firmName).filter(Boolean))
    .size;
  const blockedUsers = list.filter((user) => user.isBlocked).length;

  const columns: Array<ColumnDef<UserResponseType>> = useMemo(
    () => [
      {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => (
          <HStack gap={3}>
            <Avatar.Root size="sm">
              <Avatar.Fallback name={row.original.fullName} />
            </Avatar.Root>
            <Stack gap={0}>
              <Text fontWeight="600" fontSize="md">
                {row.original.fullName}
              </Text>
              <Text fontSize="sm" color="gray.500">
                @{row.original.username}
              </Text>
              {row.original.isBlocked && (
                <Badge size="sm" colorPalette="red" mt={1}>
                  Blocked
                </Badge>
              )}
            </Stack>
          </HStack>
        ),
      },
      {
        accessorKey: "userType",
        header: "User Type",
        cell: ({ row }) => {
          const userTypeColorMap: Record<string, string> = {
            SUPER_ADMIN: "purple",
            FIRM_USER: "blue",
            CLIENT: "orange",
          };
          const color = userTypeColorMap[row.original.userType] || "gray";
          return (
            <Badge colorPalette={color} px={3} py={1} borderRadius="full">
              {row.original.userType}
            </Badge>
          );
        },
      },
      {
        accessorKey: "roleName",
        header: "Assigned Role",
        cell: ({ row }) => {
          const roleColorMap: Record<string, string> = {
            SUPER_ADMIN: "purple",
            FIRM_ADMIN: "indigo",
            LAWYER: "green",
            PARALEGAL: "orange",
            CLIENT: "gray",
          };
          const color = row.original.roleName
            ? roleColorMap[row.original.roleName] || "gray"
            : "gray";
          return row.original.roleName ? (
            <HStack gap={2}>
              {/* <ShieldCheck size={14} color={color === "gray" ? "gray" : undefined} /> */}
              <Badge colorPalette={color} px={3} py={1} borderRadius="full">
                {row.original.roleName}
              </Badge>
            </HStack>
          ) : (
            <Text color="gray.400">—</Text>
          );
        },
      },
      {
        accessorKey: "firmName",
        header: "Firm",
        cell: ({ row }) =>
          row.original.firmName ? (
            <Stack gap={0}>
              <Text fontWeight="600" fontSize="sm">
                {row.original.firmName}
              </Text>
              {row.original.firmCode && (
                <Text fontSize="xs" color="gray.500">
                  {row.original.firmCode}
                </Text>
              )}
            </Stack>
          ) : (
            <Text color="gray.400">—</Text>
          ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            colorPalette={row.original.isBlocked ? "red" : "green"}
            px={3}
            py={1}
            borderRadius="full"
          >
            {row.original.isBlocked ? "Blocked" : "Active"}
          </Badge>
        ),
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
          <Tooltip content="View Role">
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                navigate(
                  ROUTES_CONFIG.USER.ROLE_MANAGEMENT_DETAILS.replace(
                    ":userId",
                    row.original.id
                  ),
                  { state: { user: row.original } }
                )
              }
              aria-label="View Profile"
            >
              <Eye size={18} />
            </Button>
          </Tooltip>

          // <Button
          //   size="sm"
          //   variant="ghost"
          //   onClick={() => navigate(
          //     ROUTES_CONFIG.USER.ROLE_MANAGEMENT_DETAILS.replace(":userId", row.original.id),
          //     { state: { user: row.original } }
          //   )}
          // >
          //   <HStack gap={2}>
          //     <Text>View Role</Text>
          //     <ChevronRight size={16} />
          //   </HStack>
          // </Button>
        ),
      },
    ],
    [navigate]
  );

  return (
    <Stack gap={6} padding={2}>
      {/* Page Header */}
      <Flex justify="space-between" align="center">
        <Stack gap={2}>
          <Text textStyle="heading_4">Role Management</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Manage user roles and permissions
          </Text>
        </Stack>
        <IconButton
          aria-label="Refresh"
          variant="ghost"
          size="lg"
          onClick={() => refetch()}
          p={2}
        >
          <RefreshCw size={20} />
        </IconButton>
      </Flex>

      {/* Statistics Cards */}
      <Grid
        templateColumns={{ base: "1fr", md: "2fr 2fr", lg: "1fr 1fr 1fr 1fr" }}
        gap={4}
      >
        <StatCard
          icon={Users2Icon}
          label="Total Users"
          value={totalUsers}
          description="All registered users"
          color=""
        />
        <StatCard
          icon={ShieldBan}
          label="Unique Roles"
          value={uniqueRoles}
          description="System roles"
          color=""
        />
        <StatCard
          icon={Building2Icon}
          label="Firms"
          value={uniqueFirms}
          description="Registered firms"
          color=""
        />
        <StatCard
          icon={BanIcon}
          label="Blocked Users"
          value={blockedUsers}
          description="Currently blocked"
          color=""
        />
      </Grid>

      {/* Search & Filter Toolbar */}
      <Box
        bg="white"
        _dark={{ bg: "gray.800" }}
        borderRadius="16px"
        borderWidth="1px"
        borderColor="gray.200"
        p={4}
        zIndex={999999}
      >
        <FormProvider methods={filterFormMethods}>
          <Stack
            direction={{ base: "column", md: "row" }}
            gap={4}
            alignItems={{ md: "flex-end" }}
          >
            <Box flex={1}>
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search users by username..."
              />
            </Box>
            <Box minW="160px">
              <ReactSelect
                name="userType"
                label=""
                placeholder="All Types"
                options={userTypeOptions}
                extraOnChange={(value) => setUserTypeFilter(value as string)}
              />
            </Box>
            <Box minW="160px">
              <ReactSelect
                name="firm"
                label=""
                placeholder="All Firms"
                options={firmOptions}
                extraOnChange={(value) => setFirmFilter(value as string)}
              />
            </Box>
            <IconButton
              aria-label="Refresh"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              <RefreshCw size={16} />
            </IconButton>
            {(searchQuery || userTypeFilter || firmFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setUserTypeFilter("");
                  setFirmFilter("");
                  setCurrentPage(0);
                  filterFormMethods.reset({
                    userType: "",
                    firm: "",
                  });
                }}
              >
                Reset
              </Button>
            )}
          </Stack>
        </FormProvider>
      </Box>

      {/* Table Container */}
      <Box
        bg="white"
        _dark={{ bg: "gray.800" }}
        borderRadius="16px"
        borderWidth="1px"
        borderColor="gray.200"
        overflow="hidden"
      >
        {!isLoading && list.length === 0 ? (
          <Box p={12} textAlign="center">
            <VStack gap={4}>
              <Box
                bg="gray.100"
                _dark={{ bg: "gray.800" }}
                borderRadius="full"
                p={6}
              >
                <Users size={48} color="gray" />
              </Box>
              <Text fontSize="xl" fontWeight="600">
                No users found
              </Text>
              <Text fontSize="md" color="gray.500">
                No users match the selected filters.
              </Text>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setUserTypeFilter("");
                  setFirmFilter("");
                  setCurrentPage(0);
                  filterFormMethods.reset({
                    userType: "",
                    firm: "",
                  });
                }}
              >
                Reset Filters
              </Button>
            </VStack>
          </Box>
        ) : isMobile ? (
          <VStack gap={4} p={4}>
            {list.map((user: UserResponseType) => (
              <Box
                key={user.id}
                bg="gray.50"
                _dark={{ bg: "gray.900" }}
                borderRadius="12px"
                p={4}
                borderWidth="1px"
                borderColor="gray.200"
              >
                <Flex gap={3} mb={4}>
                  <Avatar.Root size="lg">
                    <Avatar.Fallback name={user.fullName} />
                  </Avatar.Root>
                  <Stack gap={1} flex="1">
                    <Text fontWeight="600" fontSize="md">
                      {user.fullName}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      @{user.username}
                    </Text>
                    {user.isBlocked && (
                      <Badge
                        size="sm"
                        colorPalette="red"
                        mt={1}
                        width="fit-content"
                      >
                        Blocked
                      </Badge>
                    )}
                  </Stack>
                </Flex>

                <VStack gap={3} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.500">
                      User Type
                    </Text>
                    <Badge
                      colorPalette={
                        user.userType === "SUPER_ADMIN"
                          ? "purple"
                          : user.userType === "FIRM_USER"
                            ? "blue"
                            : user.userType === "CLIENT"
                              ? "orange"
                              : "gray"
                      }
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                    >
                      {user.userType}
                    </Badge>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.500">
                      Role
                    </Text>
                    {user.roleName ? (
                      <HStack gap={1}>
                        <ShieldCheck size={12} color="gray" />
                        <Badge
                          colorPalette={
                            user.roleName === "SUPER_ADMIN"
                              ? "purple"
                              : user.roleName === "FIRM_ADMIN"
                                ? "indigo"
                                : user.roleName === "LAWYER"
                                  ? "green"
                                  : user.roleName === "PARALEGAL"
                                    ? "orange"
                                    : "gray"
                          }
                          px={2}
                          py={1}
                          borderRadius="full"
                          fontSize="xs"
                        >
                          {user.roleName}
                        </Badge>
                      </HStack>
                    ) : (
                      <Text color="gray.400" fontSize="sm">
                        —
                      </Text>
                    )}
                  </Flex>

                  {user.firmName && (
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        Firm
                      </Text>
                      <Text fontWeight="600" fontSize="sm">
                        {user.firmName}
                      </Text>
                      {user.firmCode && (
                        <Text fontSize="xs" color="gray.500">
                          {user.firmCode}
                        </Text>
                      )}
                    </Box>
                  )}

                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.500">
                      Status
                    </Text>
                    <Badge
                      colorPalette={user.isBlocked ? "red" : "green"}
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </Badge>
                  </Flex>

                  <Button
                    size="sm"
                    variant="ghost"
                    width="full"
                    mt={2}
                    onClick={() =>
                      navigate(
                        ROUTES_CONFIG.USER.ROLE_MANAGEMENT_DETAILS.replace(
                          ":userId",
                          user.id
                        ),
                        { state: { user } }
                      )
                    }
                  >
                    <HStack gap={2} justify="center">
                      <Text>View Role</Text>
                      <ChevronRight size={16} />
                    </HStack>
                  </Button>
                </VStack>
              </Box>
            ))}
          </VStack>
        ) : (
          <Datatable
            isLoading={isLoading}
            columns={columns}
            data={list}
            pagination={
              pageCount > 1
                ? {
                    pageSize: pageSize,
                    currentPage: currentPage + 1,
                    pageCount: pageCount,
                    setPageSize: (newSize: number) => {
                      setPageSize(newSize);
                      setCurrentPage(0);
                    },
                    onPaginationChange: (newPage: number) => {
                      setCurrentPage(newPage - 1);
                    },
                    isFirstPage: isFirstPage,
                    isLastPage: isLastPage,
                  }
                : undefined
            }
          />
        )}
      </Box>
    </Stack>
  );
};

export default RoleSetup;
