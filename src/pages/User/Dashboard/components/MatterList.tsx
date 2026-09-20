import { Badge, Box, HStack, Stack, Text } from "@chakra-ui/react";
import { ArrowRight, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";

import { DashboardMatterSummary } from "@/api/dashboard";
import { formatDate } from "@/pages/User/CaseManagement/utils/matterHelpers";
import { useModulePermissions } from "@/shared/hooks/usePermissions";

import { humanizeLabel } from "../utils";
import { EmptyState } from "./SectionCard";

const STATUS_TONE: Record<string, string> = {
  ACTIVE: "green",
  DORMANT: "orange",
  CLOSED: "gray",
  ARCHIVED: "gray",
};

const TYPE_TONE: Record<string, string> = {
  CIVIL: "blue",
  CRIMINAL: "red",
  FAMILY: "purple",
  CORPORATE: "teal",
  COMMERCIAL: "teal",
  LAND: "amber",
  LABOR: "orange",
};

interface MatterListProps {
  matters: DashboardMatterSummary[];
  emptyTitle?: string;
  emptyDescription?: string;
}

/**
 * Rows link into the existing matter route, but only when the user actually
 * has CASE_MANAGEMENT VIEW — otherwise the row stays read-only.
 */
export const MatterList = ({
  matters,
  emptyTitle = "No matters yet",
  emptyDescription = "Matters will appear here once they are created.",
}: MatterListProps) => {
  const { canView } = useModulePermissions("CASE_MANAGEMENT");

  if (matters.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<FolderOpen size={20} />}
      />
    );
  }

  return (
    <Stack gap={0}>
      {matters.map((matter, index) => {
        const status = matter.matterStatus?.toUpperCase() ?? "";
        const type = matter.matterType?.toUpperCase() ?? "";
        const canOpen = canView && Boolean(matter.matterNumber);
        const isLast = index === matters.length - 1;

        const content = (
          <HStack
            gap={3}
            py={3}
            align="center"
            borderBottom={isLast ? "none" : "1px solid"}
            borderColor="gray.100"
            _hover={canOpen ? { bg: "gray.50" } : undefined}
            borderRadius="md"
            px={1}
          >
            <Stack gap={0.5} flex={1} minW={0}>
              <HStack gap={2} flexWrap="wrap">
                <Text
                  fontSize="sm"
                  fontWeight={600}
                  color="gray.900"
                  lineClamp={1}
                >
                  {matter.matterTitle ??
                    matter.matterNumber ??
                    "Untitled matter"}
                </Text>
                {type && (
                  <Badge
                    colorPalette={TYPE_TONE[type] ?? "gray"}
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight={600}
                  >
                    {humanizeLabel(type)}
                  </Badge>
                )}
                {status && (
                  <Badge
                    colorPalette={STATUS_TONE[status] ?? "gray"}
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight={600}
                  >
                    {humanizeLabel(status)}
                  </Badge>
                )}
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {[matter.matterNumber, matter.courtName, matter.stage]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
            </Stack>

            {matter.nextEventDate && (
              <Text
                fontSize="xs"
                color="gray.500"
                whiteSpace="nowrap"
                flexShrink={0}
              >
                Next: {formatDate(matter.nextEventDate)}
              </Text>
            )}

            {canOpen && (
              <Box color="primary.600" flexShrink={0} display="flex">
                <ArrowRight size={14} />
              </Box>
            )}
          </HStack>
        );

        if (!canOpen) {
          return (
            <Box key={matter.matterId ?? matter.matterNumber ?? index}>
              {content}
            </Box>
          );
        }

        return (
          <Link
            key={matter.matterId ?? matter.matterNumber}
            to={`/cases/${matter.matterNumber}`}
          >
            {content}
          </Link>
        );
      })}
    </Stack>
  );
};
