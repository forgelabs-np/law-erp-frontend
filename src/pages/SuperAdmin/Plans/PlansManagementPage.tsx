import {
  Box,
  Button,
  HStack,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Pencil, Power, Settings, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  useChangePlanStatusMutation,
  usePlansQuery,
} from "@/api/planManagement";
import { AddIcon } from "@/assets/svgs";
import { Datatable } from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Switch } from "@/shared/components/ui";
import { ROUTES_CONFIG } from "@/shared/config";
import { Plan } from "@/shared/types/plan";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import { priceWithComma } from "@/shared/utils/priceWithComma";
import { formatStorageBytes } from "@/shared/utils/storage";

import { PlanStatusBadge, PlanVisibilityBadge } from "./components/PlanBadges";
import { PlanDeleteDialog } from "./components/PlanDeleteDialog";
import { PlanFormDialog } from "./components/PlanFormDialog";

const PlansManagementPage = () => {
  const { data: plans = [], isLoading, isError, error, refetch } =
    usePlansQuery();

  const {
    open: formOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const {
    open: deleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    open: statusOpen,
    onOpen: onStatusOpen,
    onClose: onStatusClose,
  } = useDisclosure();

  const [editPlanId, setEditPlanId] = useState<string | undefined>(undefined);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [planToToggle, setPlanToToggle] = useState<Plan | null>(null);

  const { mutate: changeStatus, isPending: isStatusPending } =
    useChangePlanStatusMutation();

  const handleCreate = () => {
    setEditPlanId(undefined);
    onFormOpen();
  };

  const handleEdit = useCallback(
    (plan: Plan) => {
      setEditPlanId(plan.id);
      onFormOpen();
    },
    [onFormOpen]
  );

  const columns: Array<ColumnDef<Plan>> = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Plan",
        cell: ({ row }) => (
          <Stack gap={0.5} opacity={row.original.isActive ? 1 : 0.55}>
            <Text fontSize="sm" fontWeight="600" color="gray.800">
              {row.original.name}
            </Text>
            <Text fontSize="xs" color="gray.500" letterSpacing="0.04em">
              {row.original.code}
            </Text>
          </Stack>
        ),
      },
      {
        accessorKey: "monthlyPrice",
        header: "Fees",
        cell: ({ row }) => {
          const plan = row.original;
          return (
            <Stack gap={0.5} opacity={plan.isActive ? 1 : 0.55}>
              <Text fontSize="sm" color="gray.800">
                {plan.currency} {priceWithComma(plan.monthlyPrice)}
                <Text as="span" fontSize="xs" color="gray.500">
                  {" "}
                  / month
                </Text>
              </Text>
              <Text fontSize="xs" color="gray.500">
                {plan.yearlyPrice === null
                  ? "No yearly fee"
                  : `${plan.currency} ${priceWithComma(plan.yearlyPrice)} / year`}
              </Text>
            </Stack>
          );
        },
      },
      {
        accessorKey: "maxUsers",
        header: "Users",
        cell: ({ row }) => (
          <Text
            fontSize="sm"
            color="gray.700"
            opacity={row.original.isActive ? 1 : 0.55}
          >
            {row.original.maxUsers === null
              ? "Unlimited"
              : row.original.maxUsers}
          </Text>
        ),
      },
      {
        accessorKey: "maxStorageBytes",
        header: "Storage",
        cell: ({ row }) => (
          <Text
            fontSize="sm"
            color="gray.700"
            opacity={row.original.isActive ? 1 : 0.55}
          >
            {formatStorageBytes(row.original.maxStorageBytes) ?? "Unlimited"}
          </Text>
        ),
      },
      {
        accessorKey: "modules",
        header: "Modules",
        cell: ({ row }) => (
          <Text
            fontSize="sm"
            color="gray.700"
            opacity={row.original.isActive ? 1 : 0.55}
          >
            {row.original.modules?.length ?? 0}
          </Text>
        ),
      },
      {
        accessorKey: "isPublic",
        header: "Visibility",
        cell: ({ row }) => (
          <PlanVisibilityBadge isPublic={row.original.isPublic} />
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <HStack gap={2}>
            <Switch
              checked={row.original.isActive}
              aria-label={`Toggle ${row.original.name}`}
              onCheckedChange={() => {
                setPlanToToggle(row.original);
                onStatusOpen();
              }}
            />
            <PlanStatusBadge isActive={row.original.isActive} />
          </HStack>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <MenuRoot positioning={{ placement: "right-start" }}>
            <MenuTrigger asChild>
              <Button size="sm" variant="ghost" aria-label="Plan actions">
                <Settings size={18} />
              </Button>
            </MenuTrigger>
            <Portal>
              <MenuPositioner>
                <MenuContent>
                  <MenuItem
                    cursor="pointer"
                    value="edit"
                    onClick={() => handleEdit(row.original)}
                  >
                    <HStack gap={2}>
                      <Pencil size={16} />
                      <Text>Edit</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    cursor="pointer"
                    value="status"
                    onClick={() => {
                      setPlanToToggle(row.original);
                      onStatusOpen();
                    }}
                  >
                    <HStack gap={2}>
                      <Power size={16} />
                      <Text>
                        {row.original.isActive ? "Deactivate" : "Activate"}
                      </Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    cursor="pointer"
                    value="delete"
                    onClick={() => {
                      setPlanToDelete(row.original);
                      onDeleteOpen();
                    }}
                  >
                    <HStack gap={2} color="red.600">
                      <Trash2 size={16} />
                      <Text>Delete</Text>
                    </HStack>
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </Portal>
          </MenuRoot>
        ),
      },
    ],
    [handleEdit, onDeleteOpen, onStatusOpen]
  );

  return (
    <>
      <Stack gap={6} padding={2} w="100%" maxW="100%" minW={0}>
        <HStack justifyContent="space-between" alignItems="center" gap={4}>
          <Stack gap={2}>
            <Text textStyle="heading_4">Plans &amp; Pricing</Text>
            <Text textStyle="paragraph_regular" color="gray.500">
              Manage plans, fees, limits and the modules each plan unlocks
            </Text>
          </Stack>

          <HStack gap={3}>
            <Button asChild variant="outline">
              <Link to={ROUTES_CONFIG.PUBLIC.PRICING} target="_blank">
                <HStack gap={2}>
                  <ExternalLink size={16} />
                  <Text>Public pricing</Text>
                </HStack>
              </Link>
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              <AddIcon color="white" />
              New plan
            </Button>
          </HStack>
        </HStack>

        {isError && (
          <Box
            borderWidth="1px"
            borderColor="red.200"
            bg="red.50"
            borderRadius="xl"
            px={4}
            py={3}
          >
            <HStack justify="space-between" gap={4} flexWrap="wrap">
              <Text fontSize="sm" color="gray.700">
                {getApiErrorMessage(error, "Plans could not be loaded.")}
              </Text>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            </HStack>
          </Box>
        )}

        <Datatable
          isLoading={isLoading}
          columns={columns}
          data={plans}
          itemName="PLANS"
        />

        <PlanFormDialog
          open={formOpen}
          onClose={() => {
            onFormClose();
            setEditPlanId(undefined);
          }}
          planId={editPlanId}
        />

        <ConfirmationDialog
          open={statusOpen}
          onClose={() => {
            onStatusClose();
            setPlanToToggle(null);
          }}
          title={planToToggle?.isActive ? "Deactivate plan?" : "Activate plan?"}
          action={
            planToToggle?.isActive ? "deactivate this plan" : "activate this plan"
          }
          handleSubmit={() => {
            if (!planToToggle) return;
            changeStatus(
              {
                planId: planToToggle.id,
                payload: { isActive: !planToToggle.isActive },
              },
              {
                onSuccess: () => {
                  onStatusClose();
                  setPlanToToggle(null);
                },
              }
            );
          }}
          submitActionPending={isStatusPending}
        />

        <PlanDeleteDialog
          open={deleteOpen}
          onClose={() => {
            onDeleteClose();
            setPlanToDelete(null);
          }}
          plan={planToDelete}
        />
      </Stack>
    </>
  );
};

export default PlansManagementPage;
