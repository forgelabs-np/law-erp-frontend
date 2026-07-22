import { Badge } from "@chakra-ui/react";
import { Button, HStack, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FirmResponse,
  useGetFirmsQuery,
  useToggleFirmMutation,
} from "@/api/firmManagement";
import { AddIcon } from "@/assets/svgs";
import { Datatable, TableActions } from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Switch } from "@/shared/components/ui";
import { ROUTES_CONFIG } from "@/shared/config";

import { AddEditFirm } from "./AddEditFirm";

const FirmManagement = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>();
  const [firmToToggle, setFirmToToggle] = useState<{
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

  const { data: firmsData, isLoading } = useGetFirmsQuery();
  const { mutate: toggleFirm, isPending: isTogglePending } =
    useToggleFirmMutation();

  const columns: Array<ColumnDef<FirmResponse>> = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "S.N.",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "firmName",
        header: "Firm Name",
      },
      {
        accessorKey: "firmCode",
        header: "Firm Code",
      },
      // {
      //   accessorKey: "firmType",
      //   header: "Type",
      //   cell: ({ row }) => (
      //     <Badge
      //       colorScheme={row.original.firmType === "SOLO" ? "blue" : "purple"}
      //       borderRadius="md"
      //       px={2}
      //       py={0.5}
      //       fontSize="xs"
      //       textTransform="capitalize"
      //     >
      //       {row.original.firmType}
      //     </Badge>
      //   ),
      // },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "mobileNo",
        header: "Phone",
      },
      {
        accessorKey: "fullName",
        header: "Admin",
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Switch
            checked={row.original.isActive ?? true}
            onCheckedChange={() => {
              setFirmToToggle({
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
          <HStack gap={2}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigate(
                  `${ROUTES_CONFIG.USER.FIRM_MANAGEMENT}/${row.original.firmId}/modules`
                );
              }}
            >
              Manage Modules
            </Button>
            <TableActions
              onEdit={() => {
                setSelectedId(row.original.firmId.toString());
                onAddEditOpen();
              }}
            />
          </HStack>
        ),
      },
    ],
    [onToggleConfirmOpen, onAddEditOpen, navigate]
  );

  return (
    <Stack gap={6} padding={8}>
      <HStack justifyContent="space-between" alignItems="center">
        <Stack gap={2}>
          <Text textStyle="heading_4">Firm Management</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Manage law firms and their admin accounts
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
          Add Firm
        </Button>
      </HStack>

      <Datatable
        isLoading={isLoading}
        columns={columns}
        data={firmsData?.data ?? []}
      />

      <AddEditFirm
        open={addEditOpen}
        onClose={() => {
          onAddEditClose();
          setSelectedId(undefined); // Clear the selected ID when closing
        }}
        id={selectedId}
        setId={setSelectedId}
      />

      <ConfirmationDialog
        open={toggleConfirmOpen}
        onClose={() => {
          onToggleConfirmClose();
          setFirmToToggle(null);
        }}
        title={firmToToggle?.active ? "Deactivate firm?" : "Activate firm?"}
        action={
          firmToToggle?.active ? "deactivate this firm" : "activate this firm"
        }
        handleSubmit={() => {
          if (firmToToggle) {
            toggleFirm(firmToToggle.id);
            onToggleConfirmClose();
            setFirmToToggle(null);
          }
        }}
        submitActionPending={isTogglePending}
      />
    </Stack>
  );
};

export default FirmManagement;
