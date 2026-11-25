import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { usePublicPlansQuery } from "@/api/planManagement";
import { LogoImage } from "@/shared/assets";
import { ROUTES_CONFIG } from "@/shared/config";
import { BillingCycle } from "@/shared/types/plan";
import { getApiErrorMessage } from "@/shared/utils/apiError";

import { BillingCycleToggle } from "./components/BillingCycleToggle";
import { PricingPlanCard } from "./components/PricingPlanCard";

const PublicPricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("MONTHLY");
  const { data: plans = [], isLoading, isError, error, refetch } =
    usePublicPlansQuery();

  // Never offer a cycle the catalogue cannot price.
  const hasYearlyPricing = plans.some((plan) => plan.yearlyPrice !== null);
  const activeCycle: BillingCycle = hasYearlyPricing
    ? billingCycle
    : "MONTHLY";

  return (
    <Box minH="100vh" bg="transparent" pb={16}>
      {/* ── Top bar ───────────────────────────────────────────────────── */}
      <Flex
        as="header"
        bg="white"
        borderBottomWidth="1px"
        borderColor="gray.200"
        px={{ base: 4, md: 8 }}
        py={3.5}
        justify="space-between"
        align="center"
        gap={4}
      >
        <HStack gap={3} minW={0}>
          <Image src={LogoImage} boxSize="7" alt="Tarikh" />
          <Text fontWeight="700" fontSize="md" color="gray.900">
            Tarikh
          </Text>
          <Box
            w="1px"
            h="18px"
            bg="gray.200"
            display={{ base: "none", sm: "block" }}
          />
          <Text
            fontSize="sm"
            color="gray.500"
            display={{ base: "none", sm: "block" }}
            whiteSpace="nowrap"
          >
            Plans &amp; pricing
          </Text>
        </HStack>

        <HStack gap={{ base: 3, md: 5 }}>
          <Text
            asChild
            fontSize="sm"
            color="gray.600"
            _hover={{ color: "primary.600" }}
          >
            <Link to={ROUTES_CONFIG.AUTHENTICATION.LOGIN}>Sign in</Link>
          </Text>
          <Button asChild variant="outline" size="sm">
            <Link to={ROUTES_CONFIG.AUTHENTICATION.SIGNUP_SOLO}>
              Start free trial
            </Link>
          </Button>
        </HStack>
      </Flex>

      <Container maxW="1200px" px={{ base: 4, md: 8 }}>
        {/* ── Introduction ────────────────────────────────────────────── */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={8}
          justify="space-between"
          align={{ base: "flex-start", md: "flex-end" }}
          pt={{ base: 10, md: 16 }}
          pb={{ base: 8, md: 10 }}
        >
          <Stack gap={3} maxW="2xl">
            <Text
              fontSize="2xs"
              fontWeight="600"
              letterSpacing="0.2em"
              textTransform="uppercase"
              color="primary.600"
            >
              Fee schedule
            </Text>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="600"
              letterSpacing="-0.035em"
              lineHeight="1.08"
              color="gray.900"
            >
              Fees your firm can plan around.
            </Heading>
            <Text fontSize="md" color="gray.500" maxW="xl" lineHeight="1.7">
              One platform for matters, clients, documents and billing. Choose
              the plan that matches the size of your practice today — every fee
              is listed here, in full.
            </Text>
          </Stack>

          {hasYearlyPricing && (
            <Stack
              gap={2}
              align={{ base: "flex-start", md: "flex-end" }}
              flexShrink={0}
            >
              <BillingCycleToggle
                value={activeCycle}
                onChange={setBillingCycle}
              />
              <Text fontSize="xs" color="gray.500">
                Yearly fees cover twelve months, billed once.
              </Text>
            </Stack>
          )}
        </Flex>

        {/* ── Catalogue ───────────────────────────────────────────────── */}
        {isLoading ? (
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, minmax(0, 1fr))" }}
            gap="1px"
            bg="gray.200"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="20px"
            overflow="hidden"
          >
            {[0, 1, 2].map((index) => (
              <Stack key={index} bg="white" p={{ base: 6, md: 7 }} gap={5}>
                <Skeleton height="14px" width="40%" />
                <Skeleton height="12px" width="80%" />
                <Skeleton height="52px" width="60%" />
                <Skeleton height="12px" width="70%" />
                <Stack gap={2} mt={4}>
                  <Skeleton height="12px" />
                  <Skeleton height="12px" />
                  <Skeleton height="12px" width="80%" />
                </Stack>
                <Skeleton height="40px" mt={6} />
              </Stack>
            ))}
          </Grid>
        ) : isError ? (
          <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="20px"
            px={{ base: 6, md: 10 }}
            py={{ base: 10, md: 14 }}
            textAlign="center"
          >
            <Stack align="center" gap={3} maxW="lg" mx="auto">
              <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900">
                Plans could not be loaded
              </Heading>
              <Text fontSize="sm" color="gray.500" lineHeight="1.7">
                {getApiErrorMessage(
                  error,
                  "The pricing catalogue is unavailable right now."
                )}
              </Text>
              <Button variant="outline" size="sm" mt={2} onClick={() => refetch()}>
                Try again
              </Button>
            </Stack>
          </Box>
        ) : plans.length === 0 ? (
          <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="20px"
            px={{ base: 6, md: 10 }}
            py={{ base: 10, md: 14 }}
            textAlign="center"
          >
            <Stack align="center" gap={3} maxW="lg" mx="auto">
              <Heading as="h2" fontSize="xl" fontWeight="600" color="gray.900">
                No plans are published yet
              </Heading>
              <Text fontSize="sm" color="gray.500" lineHeight="1.7">
                Pricing for this platform has not been published. Please check
                back shortly.
              </Text>
            </Stack>
          </Box>
        ) : (
          <Box
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="20px"
            overflow="hidden"
            bg="gray.200"
            boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04)"
          >
            <Grid
              templateColumns={{
                base: "1fr",
                md: `repeat(${Math.min(plans.length, 3)}, minmax(0, 1fr))`,
              }}
              gap="1px"
            >
              {plans.map((plan) => (
                <PricingPlanCard
                  key={plan.id}
                  plan={plan}
                  billingCycle={activeCycle}
                />
              ))}
            </Grid>
          </Box>
        )}

        {/* ── Small print ─────────────────────────────────────────────── */}
        <Box mt={8} borderTopWidth="1px" borderColor="gray.200" pt={5}>
          <Text fontSize="xs" color="gray.500" lineHeight="1.7" maxW="3xl">
            Fees are shown in each plan&apos;s billing currency. Unless a plan
            states that VAT is included, applicable taxes are charged on top of
            the listed fee. A free trial is time-limited and does not start a
            paid subscription — converting to a paid plan is a separate step.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default PublicPricingPage;
