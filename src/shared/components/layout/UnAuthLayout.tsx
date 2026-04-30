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
    <GridItem padding={"56px"} minW={0} display={"flex"} alignItems={"center"}>
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
          <Stack display={"flex !important"} gap={8} alignItems={"center"}>
            <Image
              src={UnauthLayoutDocs}
              height={"200px"}
              width={"200px"}
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
          <Stack display={"flex !important"} gap={8} alignItems={"center"}>
            <Image
              src={UnauthLayoutDocs}
              height={"200px"}
              width={"200px"}
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
          <Stack display={"flex !important"} gap={8} alignItems={"center"}>
            <Image
              src={UnauthLayoutDocs}
              height={"200px"}
              width={"200px"}
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
}: PropsWithChildren & { sideContent?: ReactNode }) => {
  const hasSideContent = !!sideContent;

  const responsiveSide = useBreakpointValue({
    base: null,
    md: sideContent ?? <LayoutSlider />, // falls back to original slider if no custom content
  });

  return (
    <Flex
      minH="100vh"
      position="relative"
      width="100%"
      backgroundSize="cover"
      justifyContent="center"
      alignItems="center"
      padding={{ base: 4, md: 10, lg: 20 }}
      py={{ base: 0, md: 20 }}
      bg={"#08272B"}
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
        paddingY={10}
        boxShadow="0px 8px 80px 0px rgba(43, 103, 177, 0.11)"
        flexShrink={0}
      >
        <GridItem
          paddingX={10}
          borderRight={hasSideContent ? "1px solid" : "none"}
          borderColor="gray.200"
          as={Stack}
          gap={0}
        >
          {children}
        </GridItem>
        {responsiveSide}
      </Grid>
    </Flex>
  );
};
