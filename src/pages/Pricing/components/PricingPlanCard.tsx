import { Badge, Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES_CONFIG } from "@/shared/config";
import { BillingCycle, Plan } from "@/shared/types/plan";
import { priceWithComma } from "@/shared/utils/priceWithComma";
import { formatStorageBytes } from "@/shared/utils/storage";

/** One column of the fee schedule. */
export const PricingPlanCard = ({
  plan,
  billingCycle,
}: {
  plan: Plan;
  billingCycle: BillingCycle;
}) => {
  // `yearlyPrice` is the total for a full year — never divide it to fake a
  // monthly figure. A null yearlyPrice means the plan is monthly-only.
  const showYearly = billingCycle === "YEARLY" && plan.yearlyPrice !== null;
  const amount = showYearly
    ? (plan.yearlyPrice ?? plan.monthlyPrice)
    : plan.monthlyPrice;
  const period = showYearly ? "year" : "month";
  const storage = formatStorageBytes(plan.maxStorageBytes);
  const modules = plan.modules ?? [];

  return (
    <Stack
      bg="white"
      p={{ base: 6, md: 7 }}
      gap={0}
      height="100%"
      position="relative"
    >
      <HStack justify="space-between" align="flex-start" gap={3}>
        <Text
          fontSize="xs"
          fontWeight="700"
          letterSpacing="0.14em"
          textTransform="uppercase"
          color="gray.900"
        >
          {plan.name}
        </Text>
        {plan.badge && plan.badge.trim() !== "" && (
          <Badge
            bg="gray.900"
            color="white"
            borderRadius="full"
            px={2.5}
            py={1}
            fontSize="10px"
            fontWeight="600"
            letterSpacing="0.06em"
            textTransform="uppercase"
            whiteSpace="nowrap"
          >
            {plan.badge}
          </Badge>
        )}
      </HStack>

      <Text mt={3} fontSize="sm" color="gray.500" lineHeight="1.6" minH="42px">
        {plan.tagline?.trim() || plan.description?.trim() || "\u00A0"}
      </Text>

      {/* ── Price ─────────────────────────────────────────────────────── */}
      <Box mt={6} pb={6} borderBottomWidth="1px" borderColor="gray.100">
        <Text
          fontSize="2xs"
          fontWeight="600"
          letterSpacing="0.16em"
          textTransform="uppercase"
          color="gray.400"
        >
          Fee per {period}
        </Text>

        <HStack alignItems="baseline" gap={2} mt={2}>
          <Text fontSize="sm" fontWeight="600" color="gray.500">
            {plan.currency}
          </Text>
          <Text
            fontSize={{ base: "4xl", md: "5xl" }}
            fontWeight="600"
            letterSpacing="-0.04em"
            lineHeight="1"
            color="gray.900"
            css={{ fontVariantNumeric: "tabular-nums" }}
          >
            {priceWithComma(amount)}
          </Text>
          <Text fontSize="sm" color="gray.500">
            /{period}
          </Text>
        </HStack>

        <Text mt={2} fontSize="xs" color="gray.500" minH="18px">
          {showYearly
            ? `Billed once for 12 months${plan.vatIncluded ? ", VAT included" : ", VAT excluded"}`
            : plan.yearlyPrice !== null
              ? `Or ${plan.currency} ${priceWithComma(plan.yearlyPrice)} per year`
              : "Monthly billing only"}
        </Text>

        <Text mt={1} fontSize="xs" color="gray.400">
          {plan.vatIncluded ? "VAT included" : "VAT excluded"}
        </Text>
      </Box>

      {/* ── Limits ────────────────────────────────────────────────────── */}
      <Stack mt={5} gap={2}>
        <HStack justify="space-between" gap={4}>
          <Text fontSize="sm" color="gray.500">
            Users
          </Text>
          <Text fontSize="sm" fontWeight="500" color="gray.800">
            {plan.maxUsers === null
              ? "Unlimited users"
              : `Up to ${plan.maxUsers} users`}
          </Text>
        </HStack>
        <HStack justify="space-between" gap={4}>
          <Text fontSize="sm" color="gray.500">
            Storage
          </Text>
          <Text fontSize="sm" fontWeight="500" color="gray.800">
            {storage ?? "Unlimited storage"}
          </Text>
        </HStack>
      </Stack>

      {/* ── Included modules ──────────────────────────────────────────── */}
      <Box
        mt={6}
        pt={5}
        borderTopWidth="1px"
        borderColor="gray.100"
        flex="1"
        display="flex"
        flexDirection="column"
      >
        <Text fontSize="2xs" fontWeight="600" letterSpacing="0.14em" textTransform="uppercase" color="gray.400">
          Included
        </Text>

        {modules.length === 0 ? (
          <Text mt={3} fontSize="sm" color="gray.500">
            Modules for this plan are yet to be listed.
          </Text>
        ) : (
          <Stack mt={3} gap={2}>
            {modules.map((module) => (
              <HStack key={module.moduleId} align="flex-start" gap={2}>
                <Box color="primary.500" mt="2px" flexShrink={0}>
                  <Check size={14} strokeWidth={2.5} />
                </Box>
                <Text fontSize="sm" color="gray.700" lineHeight="1.5">
                  {module.moduleName}
                </Text>
              </HStack>
            ))}
          </Stack>
        )}
      </Box>

      <Button asChild variant="primary" size="md" mt={7} w="full">
        <Link to={ROUTES_CONFIG.AUTHENTICATION.SIGNUP_SOLO}>
          Start free trial
        </Link>
      </Button>
    </Stack>
  );
};
