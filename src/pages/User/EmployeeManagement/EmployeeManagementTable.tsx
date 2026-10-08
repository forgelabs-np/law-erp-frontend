import { Badge } from "@chakra-ui/react";
import { Button, HStack, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import {
  EmployeeResponseType,
  useGetEmployeesQuery,
  useToggleEmployeeMutation,
} from "@/api/employeeManagement";
import { AddIcon } from "@/assets/svgs";
import { Datatable, TableActions } from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Switch } from "@/shared/components/ui";
import { useModulePermissions } from "@/shared/hooks/usePermissions";

import { AddEditEmployee } from "./AddEditEmployee";
import { EmployeeDetailsModal } from "./EmployeeDetailsModal";
import { ColumnToggle } from "./components/ColumnToggle";

// Simplified column config — only important optional columns
const COLUMN_CONFIG = [
  { id: "employee", label: "Employee", isDefault: true, order: 0 },
  { id: "email", label: "Email", isDefault: true, order: 1 },
  { id: "mobileNo", label: "Mobile Number", isDefault: true, order: 2 },
  { id: "roleName", label: "Role", isDefault: true, order: 3 },
  // Optional — only important ones
  { id: "employeeCode", label: "Employee Code", isDefault: false, order: 10 },
  { id: "designation", label: "Designation", isDefault: false, order: 11 },
  { id: "joiningDate", label: "Joining Date", isDefault: false, order: 12 },
  {
    id: "specialization",
    label: "Specialization",
    isDefault: false,
    order: 13,
  },
  // Always visible (end)
  { id: "isActive", label: "Status", isDefault: true, order: 90 },
  { id: "action", label: "Actions", isDefault: true, order: 100 },
];

const EmployeeManagementTable = () => {
  const { canCreate, canEdit, canView } = useModulePermissions("EMPLOYEE");
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [viewEmployeeId, setViewEmployeeId] = useState<string | undefined>();
  const [employeeToToggle, setEmployeeToToggle] = useState<{
    id: string;
    active: boolean;
  } | null>(null);

  // Column visibility state — optional columns hidden by default
  const INITIAL_COLUMN_VISIBILITY: VisibilityState = {
    employeeCode: false,
    designation: false,
    joiningDate: false,
    specialization: false,
  };
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    INITIAL_COLUMN_VISIBILITY
  );

  const handleColumnVisibilityChange = useCallback(
    (
      updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
    ) => {
      setColumnVisibility(updater);
    },
    []
  );

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

  const {
    open: viewModalOpen,
    onOpen: onViewModalOpen,
    onClose: onViewModalClose,
  } = useDisclosure();

  const { data: employeesData, isLoading } = useGetEmployeesQuery();
  const { mutate: toggleEmployee, isPending: isTogglePending } =
    useToggleEmployeeMutation();

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "—";
    }
  };

  const columns: Array<ColumnDef<EmployeeResponseType>> = useMemo(
    () => [
      {
        id: "employee",
        header: "Employee",
        cell: ({ row }) => (
          <Stack gap={0}>
            <Text fontSize="sm" fontWeight="500" color="gray.800">
              {row.original.fullName || "—"}
            </Text>
            {row.original.username && (
              <Text fontSize="xs" color="gray.500">
                @{row.original.username}
              </Text>
            )}
          </Stack>
        ),
        meta: { width: "200px" },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.600">
            {row.original.email || "—"}
          </Text>
        ),
      },
      {
        accessorKey: "mobileNo",
        header: "Mobile Number",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.600">
            {row.original.mobileNo || "—"}
          </Text>
        ),
      },
      {
        id: "roleName",
        header: "Role",
        cell: ({ row }) => (
          <Badge size="sm" variant="subtle" colorPalette="blue">
            {row.original.roleName || "—"}
          </Badge>
        ),
      },
      // Optional columns
      {
        id: "employeeCode",
        header: "Employee Code",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.600">
            {row.original.employeeCode || "—"}
          </Text>
        ),
      },
      {
        id: "designation",
        header: "Designation",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.600">
            {row.original.designation || "—"}
          </Text>
        ),
      },
      {
        id: "joiningDate",
        header: "Joining Date",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.600">
            {formatDate(row.original.joiningDate)}
          </Text>
        ),
      },
      {
        id: "specialization",
        header: "Specialization",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.600">
            {row.original.specialization || "—"}
          </Text>
        ),
      },
      // Always visible (end)
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            size="sm"
            variant="subtle"
            colorPalette={row.original.isActive ? "green" : "red"}
          >
            {row.original.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        accessorKey: "action",
        header: "Actions",
        cell: ({ row }) => (
          <TableActions
            onEdit={
              canEdit
                ? () => {
                    setSelectedId(String(row.original.id));
                    onAddEditOpen();
                  }
                : undefined
            }
            onView={
              canView
                ? () => {
                    setViewEmployeeId(String(row.original.id));
                    onViewModalOpen();
                  }
                : undefined
            }
          />
        ),
      },
    ],
    [onAddEditOpen, canEdit, canView]
  );

  // Map columns to visibility configuration
  const columnToggleConfig = useMemo(
    () =>
      COLUMN_CONFIG.map((col) => ({
        id: col.id,
        label: col.label,
        isDefault: col.isDefault,
      })),
    []
  );

  return (
    <Stack
      gap={6}
      padding={2}
      width="100%"
      minWidth={0}
      maxWidth="100%"
      overflow="hidden"
      height="100%"
    >
      <HStack justifyContent="space-between" alignItems="center">
        <Stack gap={2}>
          <Text textStyle="heading_4">Employee Management</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Manage employees, their roles and details
          </Text>
        </Stack>

        <HStack gap={3}>
          <ColumnToggle
            columns={columnToggleConfig}
            visibility={columnVisibility}
            onVisibilityChange={handleColumnVisibilityChange}
          />
          {canCreate && (
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
          )}
        </HStack>
      </HStack>

      {/* Table scroll container — contains horizontal overflow */}
      <Box
        width="100%"
        minWidth={0}
        maxWidth="100%"
        overflowX="auto"
        flex="1"
        minHeight={0}
      >
        <Datatable
          isLoading={isLoading}
          columns={columns}
          data={employeesData?.content ?? []}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={handleColumnVisibilityChange}
        />
      </Box>

      <AddEditEmployee
        open={addEditOpen}
        onClose={() => {
          onAddEditClose();
          setSelectedId(undefined);
        }}
        id={selectedId}
        setId={setSelectedId}
      />

      <EmployeeDetailsModal
        open={viewModalOpen}
        onClose={() => {
          onViewModalClose();
          setViewEmployeeId(undefined);
        }}
        id={viewEmployeeId}
      />

      <ConfirmationDialog
        open={toggleConfirmOpen}
        onClose={() => {
          onToggleConfirmClose();
          setEmployeeToToggle(null);
        }}
        title={
          employeeToToggle?.active
            ? "Deactivate employee?"
            : "Activate employee?"
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
