import { Badge, Button, HStack, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import {
  Client,
  useGetClientsQuery,
  useTogglePortalAccessMutation,
} from "@/api/clientManagement";
import { AddIcon, EyeIcon } from "@/assets/svgs";
import { Datatable } from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Switch } from "@/shared/components/ui";


import {
  formatClientDate,
  formatMobileNumber,
  getPortalBadgeColor,
  getStatusBadgeColor,
} from "./utils";
import { AddClient } from "./AddClient";
import { ViewClient } from "./ViewClient";

const ClientManagement = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [portalToggle, setPortalToggle] = useState<{
    id: string;
    enabled: boolean;
  } | null>(null);

  const {
    open: addClientOpen,
    onOpen: onAddClientOpen,
    onClose: onAddClientClose,
  } = useDisclosure();

  const {
    open: viewClientOpen,
    onOpen: onViewClientOpen,
    onClose: onViewClientClose,
  } = useDisclosure();

  const {
    open: toggleConfirmOpen,
    onOpen: onToggleConfirmOpen,
    onClose: onToggleConfirmClose,
  } = useDisclosure();

  const { data: clientsData, isLoading } = useGetClientsQuery();
  const { mutate: togglePortalAccess, isPending: isTogglePending } =
    useTogglePortalAccessMutation();


  // Filter clients based on search query (client-side filtering)
  const filteredClients = clientsData?.content?.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.fullName?.toLowerCase().includes(query) ||
      client.username?.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.mobileNo?.includes(query)
    );
  });

  const columns: Array<ColumnDef<Client>> = useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: "Full Name",
        cell: ({ row }) => (
          <Text fontSize="sm" fontWeight="500">
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
        accessorKey: "mobileNo",
        header: "Mobile Number",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.700">
            {formatMobileNumber(row.original.mobileNo)}
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
        accessorKey: "portalAccessEnabled",
        header: "Portal Access",
        cell: ({ row }) => {
          const color = getPortalBadgeColor(row.original.portalAccessEnabled);
          return (
            <Badge
              bg={`${color}.100`}
              color={`${color}.700`}
              px="2"
              py="1"
              borderRadius="md"
              fontSize="xs"
              fontWeight="600"
            >
              {row.original.portalAccessEnabled ? "Enabled" : "Disabled"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const color = getStatusBadgeColor(row.original.isActive);
          return (
            <Badge
              bg={`${color}.100`}
              color={`${color}.700`}
              px="2"
              py="1"
              borderRadius="md"
              fontSize="xs"
              fontWeight="600"
            >
              {row.original.isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      // {
      //   accessorKey: "createdAt",
      //   header: "Created Date",
      //   cell: ({ row }) => {
      //     const { date, time } = formatClientDate(row.original.createdAt);
      //     return (
      //       <Stack gap="0">
      //         <Text fontSize="sm" fontWeight="500">
      //           {date}
      //         </Text>
      //         <Text fontSize="xs" color="gray.500">
      //           {time}
      //         </Text>
      //       </Stack>
      //     );
      //   },
      // },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <HStack gap={2}>

            <Switch
              checked={row.original.portalAccessEnabled}
              onCheckedChange={(details) => {
                setPortalToggle({
                  id: String(row.original.id),
                  enabled: details.checked,
                });
                onToggleConfirmOpen();
              }}
              disabled={isTogglePending}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedId(String(row.original.id));
                onViewClientOpen();
              }}
            >
              <EyeIcon />
            </Button>
          </HStack>
        ),
      },
    ],
    [isTogglePending, togglePortalAccess]
  );

  return (
    <Stack gap={6} padding={8}>
      <HStack justifyContent="space-between" alignItems="center">
        <Stack gap={2}>
          <Text textStyle="heading_4">Client Management</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Manage clients and their portal access
          </Text>
        </Stack>

        <Button
          variant="primary"
          onClick={() => {
            setSelectedId("");
            onAddClientOpen();
          }}
        >
          <AddIcon color="white" />
          Add Client
        </Button>
      </HStack>

      <Datatable
        isLoading={isLoading}
        columns={columns}
        data={filteredClients ?? []}
        header={{
          title: "All Clients",
          hasSearch: true,
          searchText: searchQuery,
          setSearchText: setSearchQuery,
        }}
      />

      <AddClient
        open={addClientOpen}
        onClose={() => {
          onAddClientClose();
          setSelectedId(undefined);
        }}
      />

      <ViewClient
        open={viewClientOpen}
        onClose={onViewClientClose}
        id={selectedId}
      />

      <ConfirmationDialog
        open={toggleConfirmOpen}
        onClose={() => {
          onToggleConfirmClose();
          setPortalToggle(null);
        }}
        title={
          portalToggle?.enabled
            ? "Enable portal access?"
            : "Disable portal access?"
        }
        action={
          portalToggle?.enabled
            ? "enable portal access"
            : "disable portal access"
        }
        handleSubmit={() => {
          if (portalToggle) {
            togglePortalAccess({
              id: portalToggle.id,
              enabled: portalToggle.enabled,
            });
            onToggleConfirmClose();
            setPortalToggle(null);
          }
        }}
        submitActionPending={isTogglePending}
      />
    </Stack>
  );
};

export default ClientManagement;
