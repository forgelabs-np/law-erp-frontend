import { HStack, Stack, Text } from "@chakra-ui/react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
}

export const PageHeader = ({
  title,
  subtitle,
  breadcrumb = ["Cases"],
}: PageHeaderProps) => {
  return (
    <Stack gap={2} mb={8}>
      {/* Breadcrumb */}
      <HStack gap={2}>
        {breadcrumb.map((item, index) => (
          <HStack key={index} gap={2}>
            <Text fontSize="sm" color="gray.500">
              {item}
            </Text>
            {index < breadcrumb.length - 1 && (
              <Text fontSize="sm" color="gray.400">
                /
              </Text>
            )}
          </HStack>
        ))}
      </HStack>

      {/* Title */}
      <Text fontSize="32px" fontWeight="700" color="gray.900">
        {title}
      </Text>

      {/* Subtitle */}
      {subtitle && (
        <Text fontSize="16px" fontWeight="500" color="gray.600">
          {subtitle}
        </Text>
      )}
    </Stack>
  );
};
