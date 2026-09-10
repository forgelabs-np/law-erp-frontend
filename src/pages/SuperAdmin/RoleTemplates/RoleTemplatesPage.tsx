import { Badge, Box, Button, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Eye, Lock, RefreshCw, Shield, Users } from "lucide-react";

import {
  RoleTemplateResponse,
  useRoleTemplatesQuery,
  useTemplateSyncJobQuery,
} from "@/api/roleTemplate";
import { Datatable } from "@/shared/components";
import { formatDate } from "@/pages/SuperAdmin/FirmModules/utils";

import { TemplatePermissionsDrawer } from "./components/TemplatePermissionsDrawer";
import { TemplateSyncJobStatus } from "./components/TemplateSyncJobStatus";

const IMMUTABLE_TEMPLATE_CODES = ["SUPER_ADMIN"];

const TypeBadge = ({ template }: { template: RoleTemplateResponse }) => {
  if (IMMUTABLE_TEMPLATE_CODES.includes(template.code)) {
    return (
      <HStack gap={1.5}>
        <Badge
          bg="purple.50"
          color="purple.700"
          px="2"
          py="1"
          borderRadius="md"
          fontSize="xs"
          fontWeight="600"
        >
          <HStack gap={1}>
            <Lock size={10} />
            <span>Immutable</span>
          </HStack>
        </Badge>
      </HStack>
    );
  }
  return (
    <Badge
      bg="blue.50"
      color="blue.700"
      px="2"
      py="1"
      borderRadius="md"
      fontSize="xs"
      fontWeight="600"
    >
      Editable
    </Badge>
  );
};

/**
 * Super Admin — System Role Template management.
 *
 * Templates are the permission ceiling for firm role clones:
 *   SUPER_ADMIN → System Role Templates → Firm Admin / Firm Role Clones → Employees
 * The SUPER_ADMIN template itself is immutable (view only).
 */
const RoleTemplatesPage = () => {
  const [selectedTemplate, setSelectedTemplate] =
    useState<RoleTemplateResponse | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSyncJobId, setActiveSyncJobId] = useState<string | null>(null);

  const {
    data: templates,
    isLoading,
    isError,
    refetch,
  } = useRoleTemplatesQuery();

  // Persistent banner: keep polling the latest sync job until terminal
  const { data: activeSyncJob } = useTemplateSyncJobQuery(activeSyncJobId);

  const columns: Array<ColumnDef<RoleTemplateResponse>> = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Role Name",
        cell: ({ row }) => (
          <Stack gap={1} minW="160px">
            <HStack gap={2}>
              <Shield size={14} color="gray" />
              <Text fontWeight="600" fontSize="sm">
                {row.original.name}
              </Text>
            </HStack>
            <Badge
              bg="gray.100"
              color="gray.600"
              px="2"
              py="0.5"
              borderRadius="md"
              fontSize="xs"
              fontFamily="mono"
              width="fit-content"
            >
              {row.original.code}
            </Badge>
          </Stack>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <Text
            fontSize="sm"
            color="gray.600"
            maxW="260px"
            lineClamp={2}
            title={row.original.description || undefined}
          >
            {row.original.description || "—"}
          </Text>
        ),
      },
      {
        id: "type",
        header: "Type",
        cell: ({ row }) => <TypeBadge template={row.original} />,
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            bg={row.original.isActive ? "green.100" : "gray.100"}
            color={row.original.isActive ? "green.700" : "gray.700"}
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
        id: "permissionCount",
        header: "Permissions",
        cell: ({ row }) => (
          <Text fontSize="sm" fontWeight="500">
            {row.original.permissions?.length ?? 0}
          </Text>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Last SA Edit",
        cell: ({ row }) => (
          <Text fontSize="sm">{formatDate(row.original.updatedAt)}</Text>
        ),
      },
      {
        id: "users",
        header: "Users",
        cell: ({ row }) => (
          <HStack gap={1.5}>
            <Users size={14} color="gray" />
            <Text fontSize="sm" fontWeight="500">
              {row.original.userCount ?? 0}
            </Text>
          </HStack>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const immutable = IMMUTABLE_TEMPLATE_CODES.includes(
            row.original.code
          );
          return (
            <HStack gap={2}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedTemplate(row.original);
                  setDrawerOpen(true);
                }}
              >
                <Eye size={14} />
                {immutable ? "View Permissions" : "Edit Permissions"}
              </Button>
            </HStack>
          );
        },
      },
    ],
    []
  );

  return (
    <Stack gap={6} padding={2}>
      {/* Page header */}
      <HStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={3}>
        <Stack gap={2}>
          <Text textStyle="heading_4">System Role Templates</Text>
          <Text textStyle="paragraph_regular" color="gray.500" maxW="720px">
            Templates define the permission ceiling for firm roles. Changes
            propagate to firm role clones after a review of the impact.
          </Text>
        </Stack>
        <IconButton
          aria-label="Refresh templates"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
        >
          <RefreshCw size={16} />
        </IconButton>
      </HStack>

      {/* Persistent sync-job banner */}
      {activeSyncJob && (
        <TemplateSyncJobStatus job={activeSyncJob} />
      )}

      {/* Templates list */}
      <Box overflowX="auto" pb={1}>
        {isLoading ? (
          <Datatable isLoading columns={columns} data={[]} />
        ) : isError ? (
          <Box
            textAlign="center"
            py={12}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <Text fontSize="lg" color="red.500" mb={4}>
              Failed to load role templates
            </Text>
            <Button onClick={() => refetch()} colorScheme="blue">
              Retry
            </Button>
          </Box>
        ) : (templates?.length ?? 0) === 0 ? (
          <Box
            p={12}
            textAlign="center"
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <HStack gap={4} justify="center">
              <Box bg="gray.100" borderRadius="full" p={6}>
                <Shield size={40} color="gray" />
              </Box>
              <Stack gap={1} align="flex-start">
                <Text fontSize="xl" fontWeight="600">
                  No role templates found
                </Text>
                <Text fontSize="md" color="gray.500">
                  System role templates will appear here once configured.
                </Text>
              </Stack>
            </HStack>
          </Box>
        ) : (
          <Datatable isLoading={false} columns={columns} data={templates ?? []} />
        )}
      </Box>

      {/* View / edit drawer */}
      <TemplatePermissionsDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedTemplate(null);
        }}
        templateId={selectedTemplate?.id ?? null}
        templateName={selectedTemplate?.name ?? ""}
        templateCode={selectedTemplate?.code ?? ""}
        immutable={
          !!selectedTemplate &&
          IMMUTABLE_TEMPLATE_CODES.includes(selectedTemplate.code)
        }
        onSyncJobStarted={(jobId) => setActiveSyncJobId(jobId)}
      />
    </Stack>
  );
};

export default RoleTemplatesPage;
