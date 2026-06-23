import { Button, HStack, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import {
  PermissionResponse,
  useGetPermissionsQuery,
  useTogglePermissionMutation,
} from "@/api/permissionSetup";
import { AddIcon } from "@/assets/svgs";
import { Datatable, TableActions } from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Switch } from "@/shared/components/ui";

import { AddorEditPermissions } from "./AddorEditPermissions";

const PermissionManagementTable = () => {
  const [selectedId, setSelectedId] = useState<string>();
  const [permissionToToggle, setPermissionToToggle] = useState<{
    id: string;
    active: boolean;
  } | null>(null);

  const {
    open: addEditOpen,
    onOpen: onAddEditOpen,
    onClose: onAddEditClose,
  } = useDisclosure();

  const {
    open: toggleConfirmOpen,
    onOpen: onToggleConfirmOpen,
    onClose: onToggleConfirmClose,
  } = useDisclosure();

  const { data: menuData } = useGetPermissionsQuery();
  const { mutate: toggleMenu, isPending: isTogglePending } =
    useTogglePermissionMutation();

  const columns: Array<ColumnDef<PermissionResponse>> = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "S.N.",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "action",
        header: "Permission Name",
      },
      {
        accessorKey: "code",
        header: "Permission Code",
      },

      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Switch
            checked={row.original.isActive ?? true}
            onCheckedChange={() => {
              setPermissionToToggle({
                id: String(row.original.id),
                active: row.original.isActive ?? true,
              });
              onToggleConfirmOpen();
            }}
          />
        ),
      },
      {
        accessorKey: "action",
        header: "Actions",
        cell: ({ row }) => (
          <TableActions
            onEdit={() => {
              setSelectedId(row.original.id.toString());
              onAddEditOpen();
            }}
          />
        ),
      },
    ],
    [onToggleConfirmOpen, onAddEditOpen]
  );

  return (
    <Stack gap={6} padding={8}>
      <HStack justifyContent="space-between" alignItems="center">
        <Stack gap={2}>
          <Text textStyle="heading_4">Menu Setup</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Define menus, sub-menus and their actions
          </Text>
        </Stack>

        <Button
          variant="primary"
          onClick={() => {
            setSelectedId("");
            onAddEditOpen();
          }}
        >
          <AddIcon color="white" />
          Add Menu
        </Button>
      </HStack>

      <Datatable columns={columns} data={menuData?.data ?? []} />
      <AddorEditPermissions
        open={addEditOpen}
        onClose={onAddEditClose}
        id={selectedId}
        setId={setSelectedId}
      />
      <ConfirmationDialog
        open={toggleConfirmOpen}
        onClose={() => {
          onToggleConfirmClose();
          setPermissionToToggle(null);
        }}
        title={
          permissionToToggle?.active
            ? "Deactivate permission?"
            : "Activate permission?"
        }
        action={
          permissionToToggle?.active
            ? "deactivate this permission"
            : "activate this permission"
        }
        handleSubmit={() => {
          if (permissionToToggle) {
            toggleMenu(permissionToToggle.id);
            onToggleConfirmClose();
            setPermissionToToggle(null);
          }
        }}
        submitActionPending={isTogglePending}
      />
    </Stack>
  );
};

export default PermissionManagementTable;
