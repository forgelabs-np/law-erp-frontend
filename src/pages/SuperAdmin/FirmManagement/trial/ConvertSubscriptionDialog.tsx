import {
  Box,
  Button,
  HStack,
  NativeSelect,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import { useConvertSubscriptionMutation } from "@/api/firmSubscription";
import { usePlansQuery } from "@/api/planManagement";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/shared/components/ui";
import { BillingCycle, SubscriptionStatus } from "@/shared/types/plan";
import { priceWithComma } from "@/shared/utils/priceWithComma";

import { getActivePlanOptions, planOptionLabel } from "./trialUtils";

const BILLING_CYCLES: Array<{ value: BillingCycle; label: string }> = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
];

export const ConvertSubscriptionDialog = ({
  open,
  onClose,
  firmId,
  currentPlanCode,
  status,
}: {
  open: boolean;
  onClose: () => void;
  firmId: string;
  currentPlanCode?: string;
  status?: SubscriptionStatus;
}) => {
  const { data: plans = [], isLoading: isPlansLoading } = usePlansQuery({
    enabled: open,
  });
  const activePlans = useMemo(() => getActivePlanOptions(plans), [plans]);

  const [planCode, setPlanCode] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("MONTHLY");
  const [error, setError] = useState<string | null>(null);

  const { mutate: convert, isPending } = useConvertSubscriptionMutation();

  useEffect(() => {
    if (!open) return;
    setBillingCycle("MONTHLY");
    setError(null);

    const currentIsActive = activePlans.some(
      (plan) => plan.code === currentPlanCode
    );
    setPlanCode(
      currentIsActive ? (currentPlanCode ?? "") : (activePlans[0]?.code ?? "")
    );
  }, [open, activePlans, currentPlanCode]);

  const selectedPlan = activePlans.find((plan) => plan.code === planCode);

  const handleSubmit = () => {
    if (isPending) return;
    setError(null);

    if (!planCode) {
      setError("Select an active plan to convert to.");
      return;
    }

    // The plan may have been deactivated while this dialog was open.
    if (!activePlans.some((plan) => plan.code === planCode)) {
      setError("The selected plan is no longer active. Choose another plan.");
      return;
    }

    convert(
      { firmId, payload: { planCode, billingCycle } },
      { onSuccess: onClose }
    );
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={() => {
        if (!isPending) onClose();
      }}
      closeOnInteractOutside={false}
      closeOnEscape={!isPending}
    >
      <DialogBackdrop />
      <DialogContent borderRadius="2xl" maxW="lg">
        <DialogCloseTrigger disabled={isPending} />
        <DialogHeader>
          <DialogTitle fontSize="lg">Convert to paid subscription</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Stack gap={5}>
            <Text fontSize="sm" color="gray.600" lineHeight="1.7">
              {status === "ACTIVE"
                ? "This firm already has an active subscription."
                : "The trial ends and the selected plan becomes the firm's active subscription. Plan modules and limits are applied by the backend."}
            </Text>

            {isPlansLoading ? (
              <Stack gap={3}>
                <Skeleton height="40px" borderRadius="md" />
                <Skeleton height="40px" borderRadius="md" />
              </Stack>
            ) : (
              <>
                <Stack gap={1.5}>
                  <Text
                    fontSize="sm"
                    fontWeight="500"
                    color="system.field.label"
                  >
                    Plan
                  </Text>
                  <NativeSelect.Root
                    disabled={isPending || activePlans.length === 0}
                  >
                    <NativeSelect.Field
                      value={planCode}
                      onChange={(event) => {
                        setPlanCode(event.target.value);
                        setError(null);
                      }}
                    >
                      {activePlans.length === 0 && (
                        <option value="">No active plans</option>
                      )}
                      {activePlans.map((plan) => (
                        <option key={plan.id} value={plan.code}>
                          {planOptionLabel(plan)}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  {activePlans.length === 0 && (
                    <Text fontSize="xs" color="orange.700">
                      No active plans are available. Activate a plan first.
                    </Text>
                  )}
                </Stack>

                <Stack gap={1.5}>
                  <Text
                    fontSize="sm"
                    fontWeight="500"
                    color="system.field.label"
                  >
                    Billing cycle
                  </Text>
                  <HStack gap={1} p={1} bg="gray.50" borderRadius="lg">
                    {BILLING_CYCLES.map((cycle) => {
                      const isActive = billingCycle === cycle.value;
                      return (
                        <Button
                          key={cycle.value}
                          size="sm"
                          flex="1"
                          borderRadius="md"
                          aria-pressed={isActive}
                          variant={isActive ? "primary" : "ghost"}
                          color={isActive ? "white" : "gray.600"}
                          onClick={() => setBillingCycle(cycle.value)}
                          disabled={isPending}
                        >
                          {cycle.label}
                        </Button>
                      );
                    })}
                  </HStack>
                  {selectedPlan && (
                    <Text fontSize="xs" color="gray.500">
                      {billingCycle === "YEARLY"
                        ? selectedPlan.yearlyPrice === null
                          ? "This plan has no yearly fee listed."
                          : `${selectedPlan.currency} ${priceWithComma(
                              selectedPlan.yearlyPrice
                            )} for 12 months.`
                        : `${selectedPlan.currency} ${priceWithComma(
                            selectedPlan.monthlyPrice
                          )} per month.`}
                    </Text>
                  )}
                </Stack>
              </>
            )}

            <Box
              borderWidth="1px"
              borderColor="gray.200"
              bg="gray.50"
              borderRadius="lg"
              px={4}
              py={3}
            >
              <Text fontSize="xs" color="gray.600" lineHeight="1.7">
                This records the subscription and billing period only — no
                payment is collected and no invoice is created here.
              </Text>
            </Box>

            {error && (
              <Text fontSize="xs" color="red.600" role="alert">
                {error}
              </Text>
            )}
          </Stack>
        </DialogBody>

        <DialogFooter gap={3}>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={isPending}
            disabled={isPending || isPlansLoading || activePlans.length === 0}
            onClick={handleSubmit}
          >
            Convert to paid
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
