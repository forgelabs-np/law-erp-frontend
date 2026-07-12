import { HStack, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import {
  UserResponseType,
  useGetUsersQuery,
  useResetPasswordMutation,
} from "@/api/userManagement";
import { Datatable, TableActions } from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Switch } from "@/shared/components/ui";

export const UserManagement = () => {
  const [userToReset, setUserToReset] = useState<string | null>(null);

  const {
    open: resetConfirmOpen,
    onOpen: onResetConfirmOpen,
    onClose: onResetConfirmClose,
  } = useDisclosure();

  const { data: usersData, isLoading } = useGetUsersQuery();
  const { mutate: resetPassword, isPending: isResetPending } =
    useResetPasswordMutation();

  const columns: Array<ColumnDef<UserResponseType>> = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "S.N.",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "fullName",
        header: "Full Name",
      },
      {
        accessorKey: "username",
        header: "Username",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Switch checked={row.original.isActive ?? true} disabled />
        ),
      },
      {
        accessorKey: "action",
        header: "Actions",
        cell: ({ row }) => (
          <TableActions
            onView={() => {
              setUserToReset(String(row.original.id));
              onResetConfirmOpen();
            }}
          />
        ),
      },
    ],
    [onResetConfirmOpen]
  );

  return (
    <Stack gap={6} padding={8}>
      <HStack justifyContent="space-between" alignItems="center">
        <Stack gap={2}>
          <Text textStyle="heading_4">User Management</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            View and manage all registered users
          </Text>
        </Stack>
      </HStack>

      <Datatable
        isLoading={isLoading}
        columns={columns}
        data={usersData ?? []}
      />

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
    </Stack>
  );
};
