import { Badge } from "@chakra-ui/react";
import { Button, HStack, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import {
  EmployeeResponseType,
  useGetEmployeesQuery,
  useToggleEmployeeMutation,
} from "@/api/employeeManagement";
import { AddIcon } from "@/assets/svgs";
import { Datatable, TableActions } from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Switch } from "@/shared/components/ui";

import { AddEditEmployee } from "./AddEditEmployee";

const EmployeeManagementTable = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [employeeToToggle, setEmployeeToToggle] = useState<{
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

  const { data: employeesData, isLoading } = useGetEmployeesQuery();
  const { mutate: toggleEmployee, isPending: isTogglePending } =
    useToggleEmployeeMutation();

  const columns: Array<ColumnDef<EmployeeResponseType>> = useMemo(
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
        accessorKey: "designation",
        header: "Designation",
      },
      {
        accessorKey: "joiningDate",
        header: "Joining Date",
        cell: ({ row }) =>
          row.original.joiningDate
            ? new Date(row.original.joiningDate).toLocaleDateString()
            : "—",
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Switch
            checked={row.original.isActive ?? true}
            onCheckedChange={() => {
              setEmployeeToToggle({
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
              setSelectedId(String(row.original.id));
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
          <Text textStyle="heading_4">Employee Management</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Manage employees, their roles and details
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
          Add Employee
        </Button>
      </HStack>

      <Datatable
        isLoading={isLoading}
        columns={columns}
        data={employeesData ?? []}
      />

      <AddEditEmployee
        open={addEditOpen}
        onClose={() => {
          onAddEditClose();
          setSelectedId(undefined);
        }}
        id={selectedId}
        setId={setSelectedId}
      />

      <ConfirmationDialog
        open={toggleConfirmOpen}
        onClose={() => {
          onToggleConfirmClose();
          setEmployeeToToggle(null);
        }}
        title={
          employeeToToggle?.active ? "Deactivate employee?" : "Activate employee?"
        }
        action={
          employeeToToggle?.active
            ? "deactivate this employee"
            : "activate this employee"
        }
        handleSubmit={() => {
          if (employeeToToggle) {
            toggleEmployee(employeeToToggle.id);
            onToggleConfirmClose();
            setEmployeeToToggle(null);
          }
        }}
        submitActionPending={isTogglePending}
      />
    </Stack>
  );
};

export default EmployeeManagementTable;
