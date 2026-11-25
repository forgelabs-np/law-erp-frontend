import {
  Badge,
  Box,
  Button,
  Grid,
  HStack,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";

import {
  isNoTrialError,
  useFirmTrialQuery,
} from "@/api/firmSubscription";
import {
  useFirmByIdQuery,
} from "@/api/firmManagement";
import { ROUTES_CONFIG } from "@/shared/config";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import { priceWithComma } from "@/shared/utils/priceWithComma";
import { formatStorageBytes } from "@/shared/utils/storage";

import { ConvertSubscriptionDialog } from "./trial/ConvertSubscriptionDialog";
import { ExtendTrialDialog } from "./trial/ExtendTrialDialog";
import { StartTrialCard } from "./trial/StartTrialCard";
import {
  formatServerDate,
  SUBSCRIPTION_STATUS_META,
} from "./trial/trialUtils";

const SummaryItem = ({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) => (
  <Stack gap={1}>
    <Text
      fontSize="2xs"
      fontWeight="600"
      letterSpacing="0.1em"
      textTransform="uppercase"
      color="gray.400"
    >
      {label}
    </Text>
    <Text fontSize="sm" color="gray.800" fontWeight="500">
      {value}
    </Text>
  </Stack>
);

const FirmTrialSubscriptionPage = () => {
  const { firmId = "" } = useParams<{ firmId: string }>();

  const {
    open: extendOpen,
    onOpen: onExtendOpen,
    onClose: onExtendClose,
  } = useDisclosure();
  const {
    open: convertOpen,
    onOpen: onConvertOpen,
    onClose: onConvertClose,
  } = useDisclosure();

  const { data: firm } = useFirmByIdQuery(firmId);

  const {
    data: trial,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFirmTrialQuery(firmId);

  // A firm that never had a trial answers 404 "No trial or subscription" —
  // that is the empty state, not a failure.
  const hasNoTrial = isError && isNoTrialError(error);
  const firmName = firm?.firmName || firm?.name || "";

  const canExtendTrial =
    trial?.status === "TRIAL" || trial?.status === "EXPIRED";
  const canConvert = trial !== undefined && trial.status !== "ACTIVE";
  const statusMeta = trial ? SUBSCRIPTION_STATUS_META[trial.status] : null;

  return (
    <Stack gap={6} padding={2} w="100%" maxW="100%" minW={0}>
      <HStack gap={2} align="center">
        <Button asChild variant="ghost" size="sm" color="gray.600">
          <Link to={ROUTES_CONFIG.USER.FIRM_MANAGEMENT}>
            <HStack gap={2}>
              <ArrowLeft size={16} />
              <Text>Firm Management</Text>
            </HStack>
          </Link>
        </Button>
      </HStack>

      <Stack gap={1}>
        <Text textStyle="heading_4">Trial &amp; Subscription</Text>
        <Text textStyle="paragraph_regular" color="gray.500">
          {firmName
            ? `Plan, trial and billing state for ${firmName}`
            : "Plan, trial and billing state for this firm"}
        </Text>
      </Stack>

      {isLoading ? (
        <Box
          bg="white"
          borderRadius="20px"
          borderWidth="1px"
          borderColor="gray.200"
          p={{ base: 5, md: 7 }}
        >
          <Stack gap={5}>
            <Skeleton height="24px" width="30%" />
            <Skeleton height="18px" width="50%" />
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <Skeleton key={index} height="34px" />
              ))}
            </Grid>
          </Stack>
        </Box>
      ) : hasNoTrial ? (
        <StartTrialCard firmId={firmId} />
      ) : isError || !trial ? (
        <Box
          bg="white"
          borderRadius="20px"
          borderWidth="1px"
          borderColor="gray.200"
          px={{ base: 6, md: 10 }}
          py={{ base: 8, md: 10 }}
        >
          <Stack gap={3} maxW="xl">
            <Text textStyle="heading_6" fontWeight="600" color="gray.800">
              Trial and subscription could not be loaded
            </Text>
            <Text fontSize="sm" color="gray.500" lineHeight="1.7">
              {getApiErrorMessage(
                error,
                "The firm's subscription details are unavailable right now."
              )}
            </Text>
            <HStack mt={2}>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </HStack>
          </Stack>
        </Box>
      ) : (
        <Box
          bg="white"
          borderRadius="20px"
          borderWidth="1px"
          borderColor="gray.200"
          p={{ base: 5, md: 7 }}
          boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04)"
        >
          <Stack gap={6}>
            <HStack
              justify="space-between"
              align="flex-start"
              gap={4}
              flexWrap="wrap"
            >
              <Stack gap={2}>
                <HStack gap={3} flexWrap="wrap">
                  {statusMeta && (
                    <Badge
                      px={2.5}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="600"
                      bg={statusMeta.bg}
                      color={statusMeta.color}
                    >
                      {statusMeta.label}
                    </Badge>
                  )}
                  <Text fontSize="xs" color="gray.500">
                    {trial.planCode}
                  </Text>
                </HStack>
                <Text fontSize="xl" fontWeight="600" color="gray.900">
                  {trial.planName}
                </Text>
              </Stack>

              <HStack gap={3}>
                {canExtendTrial && (
                  <Button variant="outline" onClick={onExtendOpen}>
                    Extend trial
                  </Button>
                )}
                {canConvert && (
                  <Button variant="primary" onClick={onConvertOpen}>
                    Convert to paid
                  </Button>
                )}
              </HStack>
            </HStack>

            <Box borderTopWidth="1px" borderColor="gray.100" />

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={{ base: 5, md: 6 }}
            >
              <SummaryItem
                label="Monthly fee"
                value={
                  trial.monthlyPrice === null
                    ? "—"
                    : `${trial.currency} ${priceWithComma(trial.monthlyPrice)}`
                }
              />
              <SummaryItem
                label="Yearly fee"
                value={
                  trial.yearlyPrice === null
                    ? "No yearly fee"
                    : `${trial.currency} ${priceWithComma(trial.yearlyPrice)}`
                }
              />
              <SummaryItem
                label="Users"
                value={
                  trial.maxUsers === null
                    ? "Unlimited"
                    : `Up to ${trial.maxUsers}`
                }
              />
              <SummaryItem
                label="Storage"
                value={
                  formatStorageBytes(trial.maxStorageBytes) ?? "Unlimited"
                }
              />
              <SummaryItem
                label="Trial days granted"
                value={trial.trialDays === null ? "—" : trial.trialDays}
              />
              <SummaryItem
                label="Days remaining"
                value={trial.daysRemaining === null ? "—" : trial.daysRemaining}
              />
            </Grid>

            <Box borderTopWidth="1px" borderColor="gray.100" />

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={{ base: 5, md: 6 }}
            >
              <SummaryItem
                label="Trial started"
                value={formatServerDate(trial.trialStartedAt)}
              />
              <SummaryItem
                label="Trial ends"
                value={formatServerDate(trial.trialEndsAt)}
              />
              <SummaryItem
                label="Access continues until"
                value={formatServerDate(trial.graceEndsAt)}
              />
              {trial.endsAt && (
                <SummaryItem
                  label="Subscription ends"
                  value={formatServerDate(trial.endsAt)}
                />
              )}
            </Grid>

            {trial.trialEndsAt && trial.graceEndsAt && (
              <Box
                borderWidth="1px"
                borderColor="blue.100"
                bg="blue.50"
                borderRadius="lg"
                px={4}
                py={3}
              >
                <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                  {trial.status === "EXPIRED"
                    ? "The trial ended on"
                    : "The trial ends on"}{" "}
                  <Text as="span" fontWeight="600">
                    {formatServerDate(trial.trialEndsAt)}
                  </Text>
                  . You can continue using the platform until{" "}
                  <Text as="span" fontWeight="600">
                    {formatServerDate(trial.graceEndsAt)}
                  </Text>
                  .
                </Text>

                {trial.status === "TRIAL" && trial.daysRemaining === 0 && (
                  <Text fontSize="xs" color="gray.600" mt={1.5}>
                    The trial window has closed; access continues through the
                    grace period and is stopped by the daily backend check.
                  </Text>
                )}

                {trial.status === "EXPIRED" && (
                  <Text fontSize="xs" color="gray.600" mt={1.5}>
                    Extend the trial to restore access, or convert the firm to a
                    paid plan.
                  </Text>
                )}
              </Box>
            )}

            {trial.status === "ACTIVE" && trial.endsAt && (
              <Box
                borderWidth="1px"
                borderColor="green.100"
                bg="green.50"
                borderRadius="lg"
                px={4}
                py={3}
              >
                <Text fontSize="sm" color="gray.700">
                  Paid subscription active until{" "}
                  <Text as="span" fontWeight="600">
                    {formatServerDate(trial.endsAt)}
                  </Text>
                  .
                </Text>
              </Box>
            )}

            {isFetching && (
              <Text fontSize="xs" color="gray.400">
                Refreshing subscription details…
              </Text>
            )}
          </Stack>
        </Box>
      )}

      <ExtendTrialDialog
        open={extendOpen}
        onClose={onExtendClose}
        firmId={firmId}
        trial={trial ?? null}
      />

      <ConvertSubscriptionDialog
        open={convertOpen}
        onClose={onConvertClose}
        firmId={firmId}
        currentPlanCode={trial?.planCode}
        status={trial?.status}
      />
    </Stack>
  );
};

export default FirmTrialSubscriptionPage;
