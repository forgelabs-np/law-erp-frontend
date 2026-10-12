import { Box, Stack } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";

import { CasePositioning, TodayEvent } from "../../types/dashboard.types";
import { CasePositioningTable } from "./CasePositioningTable";
import { CasePositioningToolbar } from "./CasePositioningToolbar";

interface CasePositioningSectionProps {
  matters: CasePositioning[];
  todayEvents?: TodayEvent[];
  isLoading?: boolean;
}

export const CasePositioningSection = ({
  matters,
  todayEvents = [],
  isLoading = false,
}: CasePositioningSectionProps) => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const hasActiveFilters =
    statusFilter !== "ALL" || typeFilter !== "ALL" || searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setSearchQuery("");
  };

  const filteredMatters = useMemo(() => {
    return matters.filter((m) => {
      // Status filter
      if (statusFilter !== "ALL") {
        const s = (m.matterStatus || m.caseStatus || "").toUpperCase();
        if (s !== statusFilter.toUpperCase()) return false;
      }

      // Type filter
      if (typeFilter !== "ALL") {
        const t = (m.matterType || "").toUpperCase();
        if (t !== typeFilter.toUpperCase()) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (m.matterTitle || "").toLowerCase().includes(q);
        const matchNumber = (m.matterNumber || "").toLowerCase().includes(q);
        const matchRef = (m.ourCourtCaseRef || "").toLowerCase().includes(q);
        const matchCourt = (m.courtName || "").toLowerCase().includes(q);
        if (!matchTitle && !matchNumber && !matchRef && !matchCourt) {
          return false;
        }
      }

      return true;
    });
  }, [matters, statusFilter, typeFilter, searchQuery]);

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="20px"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04)"
      overflow="hidden"
      w="100%"
      minW={0}
    >
      <CasePositioningToolbar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        totalCount={matters.length}
        filteredCount={filteredMatters.length}
        isInsideCard={true}
      />

      <CasePositioningTable
        matters={filteredMatters}
        todayEvents={todayEvents}
        isLoading={isLoading}
        isInsideCard={true}
      />
    </Box>
  );
};
