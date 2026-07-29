import {
  Badge,
  Box,
  Button,
  HStack,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Eye, UserCog, UserX } from "lucide-react";
import { MdLockReset } from "react-icons/md";

import {
  UserResponseType,
  useGetUsersQuery,
  useResetPasswordMutation,
  useBulkRoleChangeMutation,
  useBulkDeactivateMutation,
} from "@/api/userManagement";
import { useGetRoleQuery } from "@/api/roleSetup.ts";
import {
  Datatable,
  FormProvider,
  ReactSelect,
  SearchInput,
} from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "@/shared/components/ui/Dialog";
import { Checkbox as UICheckbox, Tooltip } from "@/shared/components/ui";
import { ROUTES_CONFIG } from "@/shared/config";
import { useForm } from "react-hook-form";

interface BulkRoleDialogProps {
  open: boolean;
  onClose: () => void;
  userIds: string[];
  onSuccess: () => void;
}

const BulkRoleChangeDialog = ({
  open,
  onClose,
  userIds,
  onSuccess,
}: BulkRoleDialogProps) => {
  const { data: roles } = useGetRoleQuery();
  const [roleId, setRoleId] = useState("");
  const { mutate: bulkRoleChange, isPending } = useBulkRoleChangeMutation();
  const formMethods = useForm({ defaultValues: { roleId: "" } });

  const roleOptions =
    roles?.data?.map((role) => ({
      label: role.name,
      value: String(role.id),
    })) ?? [];

  const handleSubmit = () => {
    if (!roleId) return;
    bulkRoleChange(
      { userIds, roleId },
      {
        onSuccess: () => {
          onClose();
          onSuccess();
          setRoleId("");
        },
      }
    );
  };

  return (
    <FormProvider methods={formMethods}>
      <DialogRoot
        open={open}
        onOpenChange={() => {
          onClose();
          setRoleId("");
        }}
        closeOnInteractOutside={false}
      >
        <DialogBackdrop />
        <DialogContent
          borderRadius="3xl"
          border="4px solid rgba(255, 255, 255, 0.20)"
          boxShadow="0px 0px 48px 0px rgba(0, 0, 0, 0.08)"
          minWidth="500px"
          p={0}
        >
          <DialogCloseTrigger />
          <DialogBody px={8} pt={10} pb={4}>
            <Stack gap={4}>
              <Text
                textStyle="heading_6"
                fontWeight="600"
                color="gray.700"
                textAlign="center"
              >
                Change Role for {userIds.length} User
                {userIds.length > 1 ? "s" : ""}
              </Text>
              <Box>
                <ReactSelect
                  name="roleId"
                  label="Select New Role"
                  placeholder="Choose a role..."
                  options={roleOptions}
                  required
                  extraOnChange={(value) => setRoleId(value as string)}
                />
              </Box>
            </Stack>
          </DialogBody>
          <DialogFooter
            mt={4}
            px={8}
            pb={8}
            pt={0}
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <Button
              onClick={handleSubmit}
              minW="112px"
              textStyle="subtitle_small"
              borderRadius="xl"
              loading={isPending}
              type="button"
              backgroundColor="blue.600"
              color="white"
              _hover={{ backgroundColor: "blue.700" }}
            >
              Change Role
            </Button>
            <Button
              variant="surface"
              minW="112px"
              textStyle="subtitle_small"
              h="44px"
              onClick={() => {
                onClose();
                setRoleId("");
              }}
              borderRadius="xl"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </FormProvider>
  );
};

export const UserManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [roleIdFilter, setRoleIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [userToReset, setUserToReset] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const filterFormMethods = useForm({
    defaultValues: { userType: "", roleId: "", active: "" },
  });

  const {
    open: resetConfirmOpen,
    onOpen: onResetConfirmOpen,
    onClose: onResetConfirmClose,
  } = useDisclosure();

  const {
    open: bulkRoleOpen,
    onOpen: onBulkRoleOpen,
    onClose: onBulkRoleClose,
  } = useDisclosure();

  const {
    open: bulkDeactivateOpen,
    onOpen: onBulkDeactivateOpen,
    onClose: onBulkDeactivateClose,
  } = useDisclosure();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const { data: usersData, isLoading, isError, refetch } = useGetUsersQuery();
  const { data: rolesData } = useGetRoleQuery();
  const { mutate: resetPassword, isPending: isResetPending } =
    useResetPasswordMutation();
  const { mutate: bulkDeactivate, isPending: isDeactivatePending } =
    useBulkDeactivateMutation();

  const roleOptions =
    rolesData?.data?.map((role) => ({
      label: role.name,
      value: String(role.id),
    })) ?? [];

  const userTypeOptions = [
    { label: "All Types", value: "" },
    { label: "SUPER_ADMIN", value: "SUPER_ADMIN" },
    { label: "ADMIN", value: "ADMIN" },
    { label: "LAWYER", value: "LAWYER" },
    { label: "STAFF", value: "STAFF" },
    { label: "CLIENT", value: "CLIENT" },
  ];

  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  const filteredUsers = useMemo(() => {
    let data = usersData ?? [];

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      data = data.filter(
        (u) =>
          u.fullName?.toLowerCase().includes(query) ||
          u.username?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query)
      );
    }

    if (userTypeFilter) {
      data = data.filter((u) => u.userType === userTypeFilter);
    }

    if (roleIdFilter) {
      data = data.filter((u) => String(u.roleId) === roleIdFilter);
    }

    if (statusFilter) {
      const isActive = statusFilter === "true";
      data = data.filter((u) => u.isActive === isActive);
    }

    return data;
  }, [usersData, debouncedSearch, userTypeFilter, roleIdFilter, statusFilter]);

  const isAllSelected =
    filteredUsers.length > 0 && selectedIds.length === filteredUsers.length;
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < filteredUsers.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleBulkDeactivate = () => {
    bulkDeactivate(
      { userIds: selectedIds },
      {
        onSuccess: () => {
          onBulkDeactivateClose();
          setSelectedIds([]);
        },
      }
    );
  };

  const columns: Array<ColumnDef<UserResponseType>> = useMemo(
    () => [
      {
        id: "selection",
        header: () => (
          <UICheckbox
            checked={isIndeterminate ? "indeterminate" : isAllSelected}
            onCheckedChange={(details) => handleSelectAll(!!details.checked)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <UICheckbox
            checked={selectedIds.includes(row.original.id)}
            onCheckedChange={(details) =>
              handleSelectOne(row.original.id, !!details.checked)
            }
            aria-label={`Select ${row.original.fullName}`}
          />
        ),
      },
      {
        accessorKey: "fullName",
        header: "Full Name",
        cell: ({ row }) => (
          <Text
            fontSize="sm"
            fontWeight="500"
            color="blue.600"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
            onClick={() =>
              navigate(
                `${ROUTES_CONFIG.USER.USER_MANAGEMENT}/${row.original.id}/profile`
              )
            }
          >
            {row.original.fullName}
          </Text>
        ),
      },
      {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700">
            {row.original.username}
          </Text>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700">
            {row.original.email}
          </Text>
        ),
      },
      {
        accessorKey: "userType",
        header: "User Type",
        cell: ({ row }) => (
          <Badge
            bg="blue.100"
            color="blue.700"
            px="2"
            py="1"
            borderRadius="md"
            fontSize="xs"
            fontWeight="600"
          >
            {row.original.userType}
          </Badge>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            bg={row.original.isActive ? "green.100" : "red.100"}
            color={row.original.isActive ? "green.700" : "red.700"}
            px="2"
            py="1"
            borderRadius="md"
            fontSize="xs"
            fontWeight="600"
          >
            {row.original.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        accessorKey: "action",
        header: "Actions",
        cell: ({ row }) => (
          <HStack gap={2}>
            <Tooltip content="View Profile">
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  navigate(
                    `${ROUTES_CONFIG.USER.USER_MANAGEMENT}/${row.original.id}/profile`
                  )
                }
                aria-label="View Profile"
              >
                <Eye size={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Reset Password">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setUserToReset(String(row.original.id));
                  onResetConfirmOpen();
                }}
                aria-label="Reset Password"
              >
                <MdLockReset size={18} />
              </Button>
            </Tooltip>
          </HStack>
        ),
      },
    ],
    [selectedIds, isAllSelected, isIndeterminate, navigate, onResetConfirmOpen]
  );

  return (
    <Stack gap={6} padding={8}>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={4}
      >
        <Stack gap={2}>
          <Text textStyle="heading_4">User Management</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            View and manage all registered users
          </Text>
        </Stack>
        {selectedIds.length > 0 && (
          <HStack gap={3}>
            <Text fontSize="sm" color="gray.500" fontWeight="500">
              {selectedIds.length} selected
            </Text>
            <MenuRoot>
              <MenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <HStack gap={1}>
                    <Text>Bulk Actions</Text>
                    <ChevronDown size={14} />
                  </HStack>
                </Button>
              </MenuTrigger>
              <MenuContent>
                <MenuItem value="change-role" onClick={onBulkRoleOpen}>
                  <HStack gap={2}>
                    <UserCog size={16} />
                    <Text>Change Role</Text>
                  </HStack>
                </MenuItem>
                <MenuItem value="deactivate" onClick={onBulkDeactivateOpen}>
                  <HStack gap={2}>
                    <UserX size={16} />
                    <Text>Deactivate</Text>
                  </HStack>
                </MenuItem>
              </MenuContent>
            </MenuRoot>
          </HStack>
        )}
      </HStack>

      {/* Filters */}
      <Box
        bg="white"
        p={5}
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.200"
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
                placeholder="Search by name, email, or username..."
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
                name="roleId"
                label=""
                placeholder="All Roles"
                options={[{ label: "All Roles", value: "" }, ...roleOptions]}
                extraOnChange={(value) => setRoleIdFilter(value as string)}
              />
            </Box>
            <Box minW="140px">
              <ReactSelect
                name="active"
                label=""
                placeholder="All Status"
                options={statusOptions}
                extraOnChange={(value) => setStatusFilter(value as string)}
              />
            </Box>
            {(searchQuery ||
              userTypeFilter ||
              roleIdFilter ||
              statusFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setDebouncedSearch("");
                  setUserTypeFilter("");
                  setRoleIdFilter("");
                  setStatusFilter("");
                  setSelectedIds([]);
                  filterFormMethods.reset({
                    userType: "",
                    roleId: "",
                    active: "",
                  });
                }}
              >
                Reset
              </Button>
            )}
          </Stack>
        </FormProvider>
      </Box>

      {/* Error State */}
      {isError ? (
        <Box
          textAlign="center"
          py={12}
          bg="white"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <Text fontSize="lg" color="red.500" mb={4}>
            Failed to load users
          </Text>
          <Button onClick={() => refetch()} colorScheme="blue">
            Retry
          </Button>
        </Box>
      ) : (
        <Box mt={6}>
          <Datatable
            isLoading={isLoading}
            columns={columns}
            data={filteredUsers ?? []}
            revisionKey={selectedIds.join(",")}
            pagination={
              filteredUsers.length > 10
                ? {
                    pageSize: 10,
                    currentPage: 1,
                    pageCount: Math.ceil(filteredUsers.length / 10),
                    setPageSize: () => {},
                    onPaginationChange: () => {},
                  }
                : undefined
            }
          />
        </Box>
      )}

      <ConfirmationDialog
        open={resetConfirmOpen}
        onClose={() => {
          onResetConfirmClose();
          setUserToReset(null);
        }}
        title="Reset Password?"
        action="reset this user's password"
        handleSubmit={() => {
          if (userToReset) {
            resetPassword(userToReset);
            onResetConfirmClose();
            setUserToReset(null);
          }
        }}
        submitActionPending={isResetPending}
      />

      <BulkRoleChangeDialog
        open={bulkRoleOpen}
        onClose={onBulkRoleClose}
        userIds={selectedIds}
        onSuccess={() => setSelectedIds([])}
      />

      <ConfirmationDialog
        open={bulkDeactivateOpen}
        onClose={() => {
          onBulkDeactivateClose();
        }}
        title={`Deactivate ${selectedIds.length} User${selectedIds.length > 1 ? "s" : ""}?`}
        action="deactivate these users"
        handleSubmit={handleBulkDeactivate}
        submitActionPending={isDeactivatePending}
      />
    </Stack>
  );
};
