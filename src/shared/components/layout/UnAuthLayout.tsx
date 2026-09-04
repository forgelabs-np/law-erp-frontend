import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  ComponentType,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import UnauthLayoutDocs from "@/assets/images/UnauthLayoutDocs.jpg";
const SlickSlider = Slider as unknown as ComponentType<{
  children?: React.ReactNode;
  [key: string]: unknown;
}>;
const LayoutSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    appendDots: (dots: ReactElement) => (
      <Box
        bottom={"-40px"}
        css={{
          "& li": {
            margin: 0,
          },
          "& .slick-active button::before": {
            fontSize: "10px !important",
            color: "primary.500 !important",
            opacity: "100% !important",
          },
          "&  button::before": {
            fontSize: "10px !important",
            color: "primary.500 !important",
            opacity: "20% !important",
          },
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </Box>
    ),
  };
  return (
    <GridItem
      padding={{ base: "24px", md: "40px" }}
      minW={0}
      display={"flex"}
      alignItems={"center"}
    >
      <Box
        className="slider-container"
        css={{
          "& .slick-list": {
            padding: "0px !important",
            width: "full !important",
          },
          "& .slick-slide": {},
        }}
        minW={0}
      >
        <SlickSlider {...settings}>
          <Stack display={"flex !important"} gap={6} alignItems={"center"}>
            <Image
              src={UnauthLayoutDocs}
              height={"160px"}
              width={"160px"}
              alignSelf={"center"}
            />
            <Stack alignItems={"center"}>
              <Text textStyle={"heading_5"}>
                Simplifying your Financial Solution
              </Text>
              <Text
                textStyle={"paragraph_regular"}
                textAlign={"center"}
                opacity={0.64}
              >
                We make managing your finances easy & stress-free. Our solutions
                help you save, invest, and plan with confidence.
              </Text>
            </Stack>
          </Stack>
          <Stack display={"flex !important"} gap={6} alignItems={"center"}>
            <Image
              src={UnauthLayoutDocs}
              height={"160px"}
              width={"160px"}
              alignSelf={"center"}
            />
            <Stack alignItems={"center"}>
              <Text textStyle={"heading_5"}>
                Simplifying your Financial Solution
              </Text>
              <Text
                textStyle={"paragraph_regular"}
                textAlign={"center"}
                opacity={0.64}
              >
                We make managing your finances easy & stress-free. Our solutions
                help you save, invest, and plan with confidence.
              </Text>
            </Stack>
          </Stack>
          <Stack display={"flex !important"} gap={6} alignItems={"center"}>
            <Image
              src={UnauthLayoutDocs}
              height={"160px"}
              width={"160px"}
              alignSelf={"center"}
            />
            <Stack alignItems={"center"}>
              <Text textStyle={"heading_5"}>
                Simplifying your Financial Solution
              </Text>
              <Text
                textStyle={"paragraph_regular"}
                textAlign={"center"}
                opacity={0.64}
              >
                We make managing your finances easy & stress-free. Our solutions
                help you save, invest, and plan with confidence.
              </Text>
            </Stack>
          </Stack>
        </SlickSlider>
      </Box>
    </GridItem>
  );
};

// UnAuthLayoutAdmin.tsx - accept custom sideContent instead of only boolean
export const UnAuthLayoutAdmin = ({
  children,
  sideContent,
  variant = "center",
}: PropsWithChildren & {
  sideContent?: ReactNode;
  variant?: "center" | "split";
}) => {
  const hasSideContent = !!sideContent;

  const responsiveSide = useBreakpointValue({
    base: null,
    md: sideContent ?? <LayoutSlider />, // falls back to original slider if no custom content
  });

  // Split layout variant for modern full-viewport design
  if (variant === "split") {
    return (
      <Flex minH="100vh" width="100%" bg="white">
        {/* Left Panel - Form */}
        <Flex
          flex={{ base: "1", lg: "0.45" }}
          flexDirection="column"
          justifyContent="center"
          px={{ base: 4, md: 8, lg: 12 }}
          py={{ base: 6, md: 8 }}
          bg="white"
        >
          <Box maxW="480px" width="100%" mx="auto">
            {children}
          </Box>
        </Flex>

        {/* Right Panel - Hero */}
        <Flex
          display={{ base: "none", lg: "flex" }}
          flex="0.55"
          flexDirection="column"
          justifyContent="center"
          px={{ base: 8, lg: 12 }}
          py={{ base: 6, md: 8 }}
          position="relative"
          overflow="hidden"
          bg="gray.900"
        >
          {/* Background gradient overlay */}
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)"
          />

          {/* Decorative blurred circles */}
          <Box
            position="absolute"
            top="-20%"
            right="-10%"
            width="400px"
            height="400px"
            bg="primary.500"
            opacity="0.1"
            filter="blur(100px)"
            borderRadius="full"
          />
          <Box
            position="absolute"
            bottom="-20%"
            left="-10%"
            width="350px"
            height="350px"
            bg="purple.500"
            opacity="0.1"
            filter="blur(80px)"
            borderRadius="full"
          />

          {/* Hero Content */}
          <Box position="relative" zIndex={1} width="100%">
            {sideContent}
          </Box>
        </Flex>
      </Flex>
    );
  }

  // Center layout variant (default) - existing behavior
  return (
    <Flex
      minH="100vh"
      position="relative"
      width="100%"
      backgroundSize="cover"
      justifyContent="center"
      alignItems="center"
      padding={{ base: 4, md: 8, lg: 12 }}
      py={{ base: 4, md: 8 }}
      bg={"#0A1628"}
    >
      <Grid
        templateColumns={{
          base: "1fr",
          md: hasSideContent ? "repeat(2, 1fr)" : "1fr",
        }}
        borderRadius="2xl"
        background="white"
        overflow="hidden"
        width={{ base: "100%", md: "740px", xl: "1020px" }}
        boxShadow="0px 8px 80px 0px rgba(43, 103, 177, 0.11)"
        flexShrink={0}
      >
        <GridItem
          paddingX={8}
          borderRight={hasSideContent ? "1px solid" : "none"}
          borderColor="gray.200"
          as={Stack}
          gap={0}
          paddingY={6}
        >
          {children}
        </GridItem>
        {responsiveSide}
      </Grid>
    </Flex>
  );
};
