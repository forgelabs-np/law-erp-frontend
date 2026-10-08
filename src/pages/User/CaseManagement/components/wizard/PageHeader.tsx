import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
  /** Optional trailing content (badges, actions) rendered under the subtitle. */
  children?: React.ReactNode;
}

export const PageHeader = ({
  title,
  subtitle,
  breadcrumb = ["Cases"],
  children,
}: PageHeaderProps) => {
  return (
    <Stack gap={3} mb={7}>
      {/* Breadcrumb */}
      <HStack gap={1.5} flexWrap="wrap">
        {breadcrumb.map((item, index) => {
          const isLast = index === breadcrumb.length - 1;
          return (
            <HStack key={index} gap={1.5}>
              <Text
                fontSize="12px"
                fontWeight={isLast ? "600" : "500"}
                color={isLast ? "gray.600" : "gray.400"}
                letterSpacing="0.01em"
              >
                {item}
              </Text>
              {!isLast && <ChevronRight size={13} color="#9CA3AF" />}
            </HStack>
          );
        })}
      </HStack>

      {/* Title + subtitle */}
      <Box>
        <Text
          fontSize={{ base: "23px", md: "27px" }}
          fontWeight="700"
          color="gray.900"
          lineHeight="1.2"
          letterSpacing="-0.02em"
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            fontSize={{ base: "14px", md: "15px" }}
            color="gray.500"
            mt={2}
            maxW="660px"
            lineHeight="1.6"
          >
            {subtitle}
          </Text>
        )}
      </Box>

      {children}
    </Stack>
  );
};
