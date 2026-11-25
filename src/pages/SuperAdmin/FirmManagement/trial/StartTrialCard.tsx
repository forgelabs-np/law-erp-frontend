import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Input,
  NativeSelect,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { usePlansQuery } from "@/api/planManagement";
import { useStartTrialMutation } from "@/api/firmSubscription";

import { getActivePlanOptions, planOptionLabel } from "./trialUtils";

/** Shown when the firm has no trial or subscription yet (404 from the API). */
export const StartTrialCard = ({ firmId }: { firmId: string }) => {
  const { data: plans = [], isLoading: isPlansLoading } = usePlansQuery();
  const activePlans = getActivePlanOptions(plans);

  const [planCode, setPlanCode] = useState("");
  const [days, setDays] = useState("14");
  const [error, setError] = useState<string | null>(null);

  const { mutate: startTrial, isPending } = useStartTrialMutation();

  // Default to the first active plan; the Super Admin can still change it.
  useEffect(() => {
    if (!planCode && activePlans.length > 0) {
      setPlanCode(activePlans[0].code);
    }
  }, [activePlans, planCode]);

  const handleStart = () => {
    if (isPending) return;
    setError(null);

    const trimmedDays = days.trim();
    if (trimmedDays !== "") {
      const parsedDays = Number(trimmedDays);
      if (!Number.isInteger(parsedDays)) {
        setError("Trial length must be a whole number of days.");
        return;
      }
      if (parsedDays < 1 || parsedDays > 365) {
        setError("Trial length must be between 1 and 365 days.");
        return;
      }
    }

    if (!planCode) {
      setError("Select an active plan to start the trial.");
      return;
    }

    // The plan list may have refreshed while this card was open.
    if (!activePlans.some((plan) => plan.code === planCode)) {
      setError("The selected plan is no longer active. Choose another plan.");
      return;
    }

    startTrial({
      firmId,
      payload: {
        planCode,
        ...(trimmedDays !== "" ? { days: Number(trimmedDays) } : {}),
      },
    });
  };

  return (
    <Box
      bg="white"
      borderRadius="20px"
      borderWidth="1px"
      borderColor="gray.200"
      p={{ base: 5, md: 7 }}
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04)"
    >
      <Stack gap={1}>
        <Text textStyle="heading_6" fontWeight="600" color="gray.800">
          Start a trial
        </Text>
        <Text fontSize="sm" color="gray.500" lineHeight="1.6">
          This firm has no trial or subscription yet. Choose the plan it should
          evaluate and how long the trial runs.
        </Text>
      </Stack>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={4}
        mt={6}
        maxW="2xl"
      >
        <GridItem>
          <Stack gap={1.5}>
            <Text fontSize="sm" fontWeight="500" color="system.field.label">
              Plan
            </Text>
            <NativeSelect.Root
              disabled={isPlansLoading || isPending || activePlans.length === 0}
            >
              <NativeSelect.Field
                value={planCode}
                onChange={(event) => setPlanCode(event.target.value)}
              >
                {activePlans.length === 0 && (
                  <option value="">
                    {isPlansLoading ? "Loading plans…" : "No active plans"}
                  </option>
                )}
                {activePlans.map((plan) => (
                  <option key={plan.id} value={plan.code}>
                    {planOptionLabel(plan)}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Text fontSize="xs" color="gray.500">
              Only active plans can be trialled.
            </Text>
          </Stack>
        </GridItem>

        <GridItem>
          <Stack gap={1.5}>
            <Text fontSize="sm" fontWeight="500" color="system.field.label">
              Trial length (days)
            </Text>
            <Input
              type="number"
              min={1}
              max={365}
              value={days}
              disabled={isPending}
              onChange={(event) => {
                setDays(event.target.value);
                setError(null);
              }}
              placeholder="14"
            />
            <Text fontSize="xs" color="gray.500">
              Between 1 and 365 days. Defaults to 14 days.
            </Text>
          </Stack>
        </GridItem>
      </Grid>

      {activePlans.length === 0 && !isPlansLoading && (
        <Text fontSize="xs" color="orange.700" mt={4}>
          No active plans are available. Activate a plan before starting a
          trial.
        </Text>
      )}

      {error && (
        <Text fontSize="xs" color="red.600" mt={4} role="alert">
          {error}
        </Text>
      )}

      <HStack mt={6}>
        <Button
          variant="primary"
          loading={isPending}
          disabled={isPending || activePlans.length === 0 || isPlansLoading}
          onClick={handleStart}
        >
          Start trial
        </Button>
      </HStack>
    </Box>
  );
};
