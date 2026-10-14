import { Grid, Stack } from "@chakra-ui/react";
import React from "react";

interface CaseDashboardLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

/**
 * Responsive two-column dashboard layout adhering to the NepalCRM design direction.
 * Desktop: ~74% main content on the left, ~26% sidebar on the right.
 * Tablet / Mobile: Stacks gracefully vertically without horizontal viewport clipping.
 */
export const CaseDashboardLayout = ({
  leftContent,
  rightContent,
}: CaseDashboardLayoutProps) => {
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        xl: "minmax(0, 2.8fr) minmax(320px, 1fr)",
        "2xl": "minmax(0, 3fr) minmax(340px, 1fr)",
      }}
      gap={{ base: 6, lg: 6 }}
      alignItems="start"
      w="100%"
      maxW="100%"
      minW={0}
    >
      {/* Left Column: Case Positioning Toolbar + Table */}
      <Stack gap={5} minW={0} w="100%" maxW="100%">
        {leftContent}
      </Stack>

      {/* Right Column: Case Statistics + Court Events + Stale Matters + Contextual Card */}
      <Stack gap={5} minW={0} w="100%" maxW="100%">
        {rightContent}
      </Stack>
    </Grid>
  );
};
