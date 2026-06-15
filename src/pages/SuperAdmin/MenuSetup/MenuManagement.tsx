import { Button, HStack, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import {
  ModuleMenuResponse,
  useGetModuleMenusQuery,
  useToggleModuleMenuMutation,
} from "@/api/menuSetup";
import { AddIcon } from "@/assets/svgs";
import { Datatable, TableActions } from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Switch } from "@/shared/components/ui";

import { AddEditMenu } from "./AddEditMenu";

const MenuManagement = () => {
  const [selectedId, setSelectedId] = useState<string>();
  const [menuToToggle, setMenuToToggle] = useState<{
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

  const { data: menuData } = useGetModuleMenusQuery();
  const { mutate: toggleMenu, isPending: isTogglePending } =
    useToggleModuleMenuMutation();

  const columns: Array<ColumnDef<ModuleMenuResponse>> = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "S.N.",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "name",
        header: "Menu Name",
      },
      {
        accessorKey: "code",
        header: "Menu Code",
      },

      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Switch
            checked={row.original.isActive ?? true}
            onCheckedChange={() => {
              setMenuToToggle({
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
      <AddEditMenu
        open={addEditOpen}
        onClose={onAddEditClose}
        id={selectedId}
        setId={setSelectedId}
      />
      <ConfirmationDialog
        open={toggleConfirmOpen}
        onClose={() => {
          onToggleConfirmClose();
          setMenuToToggle(null);
        }}
        title={menuToToggle?.active ? "Deactivate menu?" : "Activate menu?"}
        action={
          menuToToggle?.active ? "deactivate this menu" : "activate this menu"
        }
        handleSubmit={() => {
          if (menuToToggle) {
            toggleMenu(menuToToggle.id);
            onToggleConfirmClose();
            setMenuToToggle(null);
          }
        }}
        submitActionPending={isTogglePending}
      />
    </Stack>
  );
};

export default MenuManagement;
