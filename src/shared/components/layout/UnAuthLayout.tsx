import {
  Box,
  Flex,
  Grid,
  GridItem,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { PropsWithChildren, ReactNode } from "react";

import { AuthHeroCarousel } from "./AuthHeroCarousel";

/** Right-panel surface used by both auth layout variants. */
export const AUTH_HERO_SURFACE = "#F3F4F6";

// UnAuthLayoutAdmin.tsx - accept custom sideContent instead of only boolean
export const UnAuthLayoutAdmin = ({
  children,
  sideContent,
  variant = "center",
}: PropsWithChildren & {
  sideContent?: ReactNode;
  variant?: "center" | "split";
}) => {
  // The right-side hero is shared by every auth page. A caller may still pass
  // its own `sideContent` to override it (kept for API compatibility).
  const hero = sideContent ?? <AuthHeroCarousel />;

  const responsiveSide = useBreakpointValue({
    base: null,
    md: hero,
  });

  // Split layout variant for modern full-viewport design
  if (variant === "split") {
    return (
      <Flex
        minH="100vh"
        h={{ base: "auto", lg: "100dvh" }}
        width="100%"
        bg="white"
        p={{ base: 0, lg: 3 }}
        boxSizing="border-box"
        overflow={{ base: "auto", lg: "hidden" }}
      >
        {/* Left Panel - Form */}
        <Flex
          flex={{ base: "1", lg: "0.46" }}
          minW={0}
          flexDirection="column"
          px={{ base: 6, sm: 8, md: 12, lg: 14 }}
          py={{ base: 8, md: 10 }}
          bg="white"
          overflowY={{ lg: "auto" }}
        >
          <Box maxW="480px" width="100%" mx="auto" my="auto">
            {children}
          </Box>
        </Flex>

        {/* Right Panel - inset, rounded hero panel */}
        <Flex display={{ base: "none", lg: "flex" }} flex="0.54" minW={0} p={3}>
          <Box
            flex="1"
            minW={0}
            position="relative"
            overflow="hidden"
            borderRadius="3xl"
            bg={AUTH_HERO_SURFACE}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={{ base: 8, lg: 8 }}
          >
            {/* Hero Content */}
            <Box
              position="relative"
              zIndex={1}
              width="100%"
              maxW="900px"
              mx="auto"
            >
              {hero}
            </Box>
          </Box>
        </Flex>
      </Flex>
    );
  }

  // Center layout variant (default) - existing behavior
  return (
    <Flex
      minH="100vh"
      h={{ base: "auto", lg: "100dvh" }}
      position="relative"
      width="100%"
      backgroundSize="cover"
      justifyContent="center"
      alignItems="center"
      padding={{ base: 4, md: 8, lg: 10 }}
      boxSizing="border-box"
      overflow={{ base: "auto", lg: "hidden" }}
      // bg={"#0A1628"}
    >
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
        }}
        borderRadius="3xl"
        background="white"
        overflow="hidden"
        width={{ base: "100%", md: "740px", xl: "1020px" }}
        maxW="100%"
        h={{ base: "auto", lg: "100%" }}
        maxH="100%"
        p={{ base: 0, md: 2, lg: 3 }}
        gap={{ base: 0, md: 2, lg: 3 }}
        // boxShadow="0px 8px 80px 0px rgba(43, 103, 177, 0.11)"
        flexShrink={0}
        boxShadow={"xl"}
        border={"1px solid #E2E8F0"}
      >
        <GridItem
          paddingX={{ base: 6, md: 8, lg: 10 }}
          borderRight={"1px solid"}
          borderColor="gray.200"
          as={Stack}
          gap={0}
          paddingY={8}
          minH={0}
          overflowY={{ lg: "auto" }}
        >
          <Box width="100%" my="auto">
            {children}
          </Box>
        </GridItem>
        {responsiveSide ? (
          <GridItem
            bg={AUTH_HERO_SURFACE}
            minW={0}
            minH={0}
            overflow="hidden"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            padding={{ base: 6, md: 7, lg: 8 }}
          >
            {responsiveSide}
          </GridItem>
        ) : null}
      </Grid>
    </Flex>
  );
};
