import { Button, HStack, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import {
  RoleResposeType,
  useDeleteRoleMutation,
  useGetRoleQuery,
  useToggleRoleMutation,
} from "@/api/roleSetup.ts";
import { AddIcon } from "@/assets/svgs";
import { Datatable, TableActions } from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Switch } from "@/shared/components/ui";

import { AddEditRole } from "./AddEditRole";

const RoleSetup = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<string>();
  const [roleToToggle, setRoleToToggle] = useState<{
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

  // const [payload, setPayload] = useState<FilterPayloadType>(() => ({
  //   page: 1,
  //   pageSize: DEFAULT_PAGE_SIZE,
  //   q: searchParams.get("q") || "",
  // }));

  // const MENU_CODES = useMenuCodes();

  // const createPermission = useHasRolePermission({
  //   menuCode: MENU_CODES.ROLE_SETUP,
  //   permission: ACTION_PERMISSION_NAMES.CREATE,
  // });

  // const updatePermission = useHasRolePermission({
  //   menuCode: MENU_CODES.ROLE_SETUP,
  //   permission: ACTION_PERMISSION_NAMES.UPDATE,
  // });

  // const togglePermission = useHasRolePermission({
  //   menuCode: MENU_CODES.MENU_SETUP,
  //   permission: ACTION_PERMISSION_NAMES.DELETE,
  // });

  const { data: roleData } = useGetRoleQuery();
  const { mutate: toggleRole, isPending: isTogglePending } =
    useToggleRoleMutation();

  const { mutate: deleteRole, isPending: isDeletePending } = useDeleteRoleMutation()

  const { open: deleteConfirmOpen, onOpen: onDeleteConfirmOpen, onClose: onDeleteConfirmClose } = useDisclosure()

  // const pageCount = roleData?.totalPages ?? 1;
  // const totalRecords = roleData?.totalRecords ?? 0;
  // const displayCount = roleData?.datalist?.length ?? 0;

  // const next = payload.page < pageCount;
  // const previous = payload.page > 1;

  const columns: Array<ColumnDef<RoleResposeType>> = useMemo(
    () => [
      // {
      //   accessorKey: "id",
      //   header: "S.N.",
      //   // cell: ({ row }) =>
      //   //   (payload.page - 1) * payload.pageSize + row.index + 1,
      // },
      {
        accessorKey: "id",
        header: "S.N.",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "name",
        header: "Role Name",
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Switch
            checked={row.original.isActive ?? true}
            onCheckedChange={() => {
              setRoleToToggle({
                id: String(row.original.id),
                active: row.original.isActive ?? true,
              });
              onToggleConfirmOpen();
            }}
          // disabled={!togglePermission}
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
            onDelete={() => {
              setSelectedId(row.original.id.toString());
              onDeleteConfirmOpen();
            }}
          />
        ),
      },
    ],
    [onToggleConfirmOpen, onAddEditOpen]
  );

  // const handleSearchChange = useDebouncedCallback((value: string) => {
  //   setPayload((prev) => ({
  //     ...prev,
  //     q: value,
  //     page: 1,
  //   }));

  //   const newParams = new URLSearchParams(searchParams);

  //   if (value) {
  //     newParams.set("q", value);
  //   } else {
  //     newParams.delete("q");
  //   }

  //   setSearchParams(newParams);
  // }, 500);

  return (
    <Stack gap={6} padding={8}>
      <HStack justifyContent="space-between" alignItems="center">
        <Stack gap={2}>
          <Text textStyle="heading_4">Role Setup</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Define roles and assign permissions{" "}
          </Text>
        </Stack>

        {/* {createPermission && ( */}
        <Button
          variant="primary"
          onClick={() => {
            setSelectedId("");
            onAddEditOpen();
          }}
        >
          <AddIcon color="white" />
          Add Role
        </Button>
        {/* )} */}
      </HStack>

      <Datatable
        // isLoading={isLoading}
        columns={columns}
        // payload={{
        //   ...payload,
        //   pageCount,
        //   count: totalRecords,
        //   display_count: displayCount,
        //   next,
        //   previous,
        // }}
        // setPayload={setPayload}
        data={roleData?.data ?? []}
      // onSearchChange={handleSearchChange}
      />
      <AddEditRole
        open={addEditOpen}
        onClose={onAddEditClose}
        id={selectedId}
        setId={setSelectedId}
      />
      <ConfirmationDialog
        open={toggleConfirmOpen}
        onClose={() => {
          onToggleConfirmClose();
          setRoleToToggle(null);
        }}
        title={roleToToggle?.active ? "Deactivate role?" : "Activate role?"}
        action={
          roleToToggle?.active ? "deactivate this role" : "activate this role"
        }
        handleSubmit={() => {
          if (roleToToggle) {
            toggleRole(roleToToggle.id);
            onToggleConfirmClose();
            setRoleToToggle(null);
          }
        }}
        submitActionPending={isTogglePending}
      />
      <ConfirmationDialog open={deleteConfirmOpen} onClose={onDeleteConfirmClose} title="Delete role?" action="delete this role" handleSubmit={() => {
        if (selectedId) {
          deleteRole(selectedId);
          onDeleteConfirmClose();
        }
      }} submitActionPending={isDeletePending} />
    </Stack>
  );
};

export default RoleSetup;
