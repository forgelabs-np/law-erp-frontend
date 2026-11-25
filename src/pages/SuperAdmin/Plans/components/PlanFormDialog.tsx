import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Skeleton,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  useActiveModulesQuery,
  useCreatePlanMutation,
  usePlanQuery,
  useUpdatePlanMutation,
} from "@/api/planManagement";
import {
  FormProvider,
  TextFieldInput,
} from "@/shared/components";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  Switch,
} from "@/shared/components/ui";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import { planSchema, PlanFormValues } from "@/validations";

import {
  buildModuleTree,
  buildPlanCreatePayload,
  buildPlanUpdatePayload,
  emptyPlanFormValues,
  planToFormValues,
} from "../planHelpers";
import { PlanModuleSelector } from "./PlanModuleSelector";

const ToggleField = ({
  name,
  label,
  hint,
  disabled,
}: {
  name:
    | "vatIncluded"
    | "unlimitedUsers"
    | "unlimitedStorage"
    | "isPublic"
    | "isActive";
  label: string;
  hint?: string;
  disabled?: boolean;
}) => {
  const { control } = useFormContext<PlanFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <HStack
          justify="space-between"
          gap={3}
          px={3}
          py={2.5}
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="lg"
          height="full"
        >
          <Stack gap={0}>
            <Text fontSize="sm" fontWeight="500" color="gray.700">
              {label}
            </Text>
            {hint && (
              <Text fontSize="xs" color="gray.500" lineHeight="1.4">
                {hint}
              </Text>
            )}
          </Stack>
          <Switch
            checked={Boolean(field.value)}
            disabled={disabled}
            onCheckedChange={(event) => field.onChange(Boolean(event.checked))}
          />
        </HStack>
      )}
    />
  );
};

const DescriptionField = ({ disabled }: { disabled?: boolean }) => {
  const { control } = useFormContext<PlanFormValues>();

  return (
    <Controller
      name="description"
      control={control}
      render={({ field }) => (
        <Stack gap={1.5}>
          <Text fontSize="sm" fontWeight="500" color="system.field.label">
            Description
          </Text>
          <Textarea
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            rows={3}
            placeholder="Longer copy shown on the pricing page"
            borderRadius="lg"
            _placeholder={{ color: "gray.400" }}
          />
        </Stack>
      )}
    />
  );
};

export const PlanFormDialog = ({
  open,
  onClose,
  planId,
}: {
  open: boolean;
  onClose: () => void;
  /** Present when editing; absent when creating. */
  planId?: string;
}) => {
  const isEdit = Boolean(planId);

  const methods = useForm<PlanFormValues>({
    defaultValues: emptyPlanFormValues,
    resolver: yupResolver(planSchema),
    context: { isEdit },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { handleSubmit, reset, watch } = methods;

  const unlimitedUsers = watch("unlimitedUsers");
  const unlimitedStorage = watch("unlimitedStorage");

  const {
    data: planDetail,
    isLoading: isPlanLoading,
    isError: isPlanError,
    error: planError,
    refetch: refetchPlan,
  } = usePlanQuery(planId ?? "", { enabled: open && isEdit });

  const {
    data: rawModules = [],
    isLoading: isModulesLoading,
    isError: isModulesError,
    error: modulesError,
  } = useActiveModulesQuery({ enabled: open });

  const rootModules = useMemo(
    () => buildModuleTree(rawModules),
    [rawModules]
  );

  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);
  const [modulesTouched, setModulesTouched] = useState(false);
  const initialisedFor = useRef<string | null>(null);

  // Populate the form once per opened plan (not on every render), so loading
  // the module tree never overwrites what the Super Admin has typed.
  useEffect(() => {
    if (!open) {
      initialisedFor.current = null;
      return;
    }

    const key = planId ?? "new";
    if (initialisedFor.current === key) return;
    if (isModulesLoading) return;

    if (isEdit) {
      if (!planDetail) return;
      reset(planToFormValues(planDetail));
      const rootIds = new Set(rootModules.map((module) => module.id));
      setSelectedModuleIds(
        (planDetail.modules ?? [])
          .map((module) => module.moduleId)
          .filter((moduleId) => rootIds.has(moduleId))
      );
    } else {
      reset(emptyPlanFormValues);
      setSelectedModuleIds([]);
    }

    setModulesTouched(false);
    initialisedFor.current = key;
  }, [
    open,
    planId,
    isEdit,
    planDetail,
    isModulesLoading,
    rootModules,
    reset,
  ]);

  const createMutation = useCreatePlanMutation();
  const updateMutation = useUpdatePlanMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  // Guards against a second submit before the pending state re-renders.
  const submitLock = useRef(false);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleModuleToggle = (moduleId: string, selected: boolean) => {
    setModulesTouched(true);
    setSelectedModuleIds((previous) =>
      selected
        ? previous.includes(moduleId)
          ? previous
          : [...previous, moduleId]
        : previous.filter((id) => id !== moduleId)
    );
  };

  const onSubmit = (values: PlanFormValues) => {
    if (isSubmitting || submitLock.current) return;
    submitLock.current = true;

    const settle = () => {
      submitLock.current = false;
    };

    if (isEdit) {
      if (!planId) {
        settle();
        return;
      }
      updateMutation.mutate(
        {
          planId,
          payload: buildPlanUpdatePayload(
            values,
            modulesTouched ? selectedModuleIds : undefined
          ),
        },
        { onSuccess: handleClose, onSettled: settle }
      );
      return;
    }

    createMutation.mutate(buildPlanCreatePayload(values, selectedModuleIds), {
      onSuccess: handleClose,
      onSettled: settle,
    });
  };

  const isBusy = isSubmitting || (isEdit && isPlanLoading);

  return (
    <DialogRoot
      open={open}
      onOpenChange={handleClose}
      closeOnInteractOutside={false}
      closeOnEscape={!isSubmitting}
      size="xl"
    >
      <DialogBackdrop />
      <DialogContent borderRadius="2xl" maxW="3xl">
        <DialogCloseTrigger disabled={isSubmitting} />
        <DialogHeader>
          <DialogTitle fontSize="lg">
            {isEdit ? "Edit plan" : "Create plan"}
          </DialogTitle>
          <Text fontSize="sm" color="gray.500">
            {isEdit
              ? "Changes replace the plan's editable details. The plan code cannot be changed."
              : "Define the plan's fee, limits and the modules it unlocks."}
          </Text>
        </DialogHeader>

        <DialogBody maxH="70vh" overflowY="auto" pb={4}>
          {isEdit && isPlanError ? (
            <Box
              borderWidth="1px"
              borderColor="red.200"
              bg="red.50"
              borderRadius="xl"
              p={4}
            >
              <Text fontSize="sm" color="gray.700" mb={3}>
                {getApiErrorMessage(planError, "This plan could not be loaded.")}
              </Text>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetchPlan()}
              >
                Try again
              </Button>
            </Box>
          ) : isEdit && isPlanLoading ? (
            <Stack gap={4}>
              {[0, 1, 2, 3, 4].map((index) => (
                <Skeleton key={index} height="42px" borderRadius="md" />
              ))}
            </Stack>
          ) : (
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack gap={5}>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <TextFieldInput
                      name="code"
                      label="Plan code"
                      placeholder="PROFESSIONAL"
                      required={!isEdit}
                      disabled={isEdit || isSubmitting}
                      maxLength={30}
                    />
                    {isEdit && (
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Plan codes are immutable after creation.
                      </Text>
                    )}
                  </GridItem>

                  <GridItem>
                    <TextFieldInput
                      name="name"
                      label="Plan name"
                      placeholder="Professional"
                      maxLength={60}
                      required
                      disabled={isSubmitting}
                    />
                  </GridItem>

                  <GridItem colSpan={2}>
                    <TextFieldInput
                      name="tagline"
                      label="Tagline"
                      placeholder="Everything a growing firm needs."
                      disabled={isSubmitting}
                    />
                  </GridItem>

                  <GridItem colSpan={2}>
                    <DescriptionField disabled={isSubmitting} />
                  </GridItem>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <TextFieldInput
                      name="monthlyPrice"
                      label="Monthly price"
                      placeholder="4999"
                      type="number"
                      required
                      disabled={isSubmitting}
                    />
                  </GridItem>

                  <GridItem>
                    <TextFieldInput
                      name="yearlyPrice"
                      label="Yearly price"
                      placeholder="49990"
                      type="number"
                      disabled={isSubmitting}
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Total for a full year. Leave blank for a monthly-only
                      plan.
                    </Text>
                  </GridItem>

                  <GridItem>
                    <TextFieldInput
                      name="currency"
                      label="Currency"
                      placeholder="NPR"
                      maxLength={3}
                      required
                      disabled={isSubmitting}
                    />
                  </GridItem>

                  <GridItem>
                    <TextFieldInput
                      name="sortOrder"
                      label="Sort order"
                      placeholder="0"
                      type="number"
                      required
                      disabled={isSubmitting}
                    />
                  </GridItem>

                  <GridItem colSpan={2}>
                    <TextFieldInput
                      name="badge"
                      label="Badge"
                      placeholder="Most popular"
                      disabled={isSubmitting}
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Optional ribbon shown on the pricing page.
                    </Text>
                  </GridItem>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem colSpan={2}>
                    <ToggleField
                      name="vatIncluded"
                      label="VAT included"
                      hint="Show prices as VAT-inclusive on the pricing page"
                      disabled={isSubmitting}
                    />
                  </GridItem>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <ToggleField
                      name="unlimitedUsers"
                      label="Unlimited users"
                      hint="Off means the plan has a fixed user limit"
                      disabled={isSubmitting}
                    />
                  </GridItem>
                  <GridItem>
                    {unlimitedUsers ? (
                      <HStack height="full" px={1} align="center">
                        <Text fontSize="xs" color="gray.500">
                          No user limit will be sent to the backend.
                        </Text>
                      </HStack>
                    ) : (
                      <TextFieldInput
                        name="maxUsers"
                        label="Maximum users"
                        placeholder="15"
                        type="number"
                        required
                        disabled={isSubmitting}
                      />
                    )}
                  </GridItem>

                  <GridItem>
                    <ToggleField
                      name="unlimitedStorage"
                      label="Unlimited storage"
                      hint="Off means the plan has a fixed storage quota"
                      disabled={isSubmitting}
                    />
                  </GridItem>
                  <GridItem>
                    {unlimitedStorage ? (
                      <HStack height="full" px={1} align="center">
                        <Text fontSize="xs" color="gray.500">
                          No storage quota will be sent to the backend.
                        </Text>
                      </HStack>
                    ) : (
                      <TextFieldInput
                        name="maxStorageGb"
                        label="Storage limit (GB)"
                        placeholder="25"
                        type="number"
                        required
                        disabled={isSubmitting}
                      />
                    )}
                  </GridItem>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <ToggleField
                      name="isPublic"
                      label="Public plan"
                      hint="Listed on the public pricing page"
                      disabled={isSubmitting}
                    />
                  </GridItem>
                  <GridItem>
                    <ToggleField
                      name="isActive"
                      label="Active"
                      hint="Inactive plans cannot be sold or used for trials"
                      disabled={isSubmitting}
                    />
                  </GridItem>
                </Grid>

                <Stack gap={2}>
                  <Text fontSize="sm" fontWeight="600" color="gray.700">
                    Included modules
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Select whole modules — their sub-modules are included
                    automatically.{" "}
                    {isEdit && !modulesTouched
                      ? "The current selection is kept unless you change it."
                      : "Clearing every module removes them from the plan."}
                  </Text>
                  <PlanModuleSelector
                    modules={rootModules}
                    selectedIds={selectedModuleIds}
                    onToggle={handleModuleToggle}
                    isLoading={isModulesLoading}
                    disabled={isSubmitting}
                    errorMessage={
                      isModulesError
                        ? getApiErrorMessage(
                            modulesError,
                            "The module catalogue could not be loaded."
                          )
                        : null
                    }
                  />
                </Stack>
              </Stack>
            </FormProvider>
          )}
        </DialogBody>

        <DialogFooter gap={3}>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={isSubmitting}
            disabled={isBusy || (isEdit && isPlanError)}
            onClick={handleSubmit(onSubmit)}
          >
            {isEdit ? "Save changes" : "Create plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
