import { Box, Grid, Stack, Text } from "@chakra-ui/react";

export const FirmHeroPanel = () => {
  return (
    <Stack gap={12}>
      {/* Hero Text */}
      <Stack gap={4}>
        <Text
          fontSize="xs"
          fontWeight="600"
          color="gray.400"
          letterSpacing="0.1em"
          textTransform="uppercase"
        >
          Legal Practice Management
        </Text>
        <Text fontSize="5xl" fontWeight="700" color="white" lineHeight="1.1">
          Modern Law Firm{" "}
          <Text as="span" color="primary.400">
            CRM
          </Text>
        </Text>
        <Text fontSize="lg" color="gray.300" lineHeight="1.7" maxW="600px">
          Manage clients, cases, documents, billing, and firm operations from
          one secure platform.
        </Text>
      </Stack>

      {/* Feature Cards */}
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        {/* Card 1 */}
        <Box
          bg="rgba(255, 255, 255, 0.05)"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
          borderRadius="xl"
          p={5}
          transition="all 0.3s ease"
          _hover={{
            bg: "rgba(255, 255, 255, 0.08)",
            borderColor: "rgba(255, 255, 255, 0.2)",
            transform: "translateY(-4px)",
          }}
        >
          <Stack gap={3}>
            <Box
              width="40px"
              height="40px"
              borderRadius="lg"
              bg="primary.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xl" color="white" fontWeight="700">
                📋
              </Text>
            </Box>
            <Text fontSize="sm" fontWeight="600" color="white">
              Case Management
            </Text>
            <Text fontSize="xs" color="gray.400" lineHeight="1.5">
              Manage cases and legal workflows efficiently.
            </Text>
          </Stack>
        </Box>

        {/* Card 2 */}
        <Box
          bg="rgba(255, 255, 255, 0.05)"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
          borderRadius="xl"
          p={5}
          transition="all 0.3s ease"
          _hover={{
            bg: "rgba(255, 255, 255, 0.08)",
            borderColor: "rgba(255, 255, 255, 0.2)",
            transform: "translateY(-4px)",
          }}
        >
          <Stack gap={3}>
            <Box
              width="40px"
              height="40px"
              borderRadius="lg"
              bg="purple.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xl" color="white" fontWeight="700">
                👥
              </Text>
            </Box>
            <Text fontSize="sm" fontWeight="600" color="white">
              Client Management
            </Text>
            <Text fontSize="xs" color="gray.400" lineHeight="1.5">
              Organize clients and communication in one place.
            </Text>
          </Stack>
        </Box>

        {/* Card 3 */}
        <Box
          bg="rgba(255, 255, 255, 0.05)"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
          borderRadius="xl"
          p={5}
          transition="all 0.3s ease"
          _hover={{
            bg: "rgba(255, 255, 255, 0.08)",
            borderColor: "rgba(255, 255, 255, 0.2)",
            transform: "translateY(-4px)",
          }}
        >
          <Stack gap={3}>
            <Box
              width="40px"
              height="40px"
              borderRadius="lg"
              bg="green.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xl" color="white" fontWeight="700">
                🔒
              </Text>
            </Box>
            <Text fontSize="sm" fontWeight="600" color="white">
              Enterprise Security
            </Text>
            <Text fontSize="xs" color="gray.400" lineHeight="1.5">
              Secure access with role-based permissions.
            </Text>
          </Stack>
        </Box>
      </Grid>
    </Stack>
  );
};
