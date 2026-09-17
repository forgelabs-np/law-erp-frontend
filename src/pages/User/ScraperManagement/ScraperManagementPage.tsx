import {
  Badge,
  Box,
  Button,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Database, Download, RefreshCw, FileDown } from "lucide-react";
import { useState } from "react";

import { SectionCard } from "../CaseManagement/components/ui";
import {
  useManualScrape,
  useGenerateWeeklyExport,
  useCourtsByTypeQuery,
} from "@/shared/hooks/useScraper";
import { useModulePermissions } from "@/shared/hooks/usePermissions";
import {
  NepaliDatePicker,
  formatForApi,
} from "@/shared/components/NepaliDatePicker/NepaliDatePicker";
import { NepaliDateParts } from "@/utils/nepaliDateUtils";
import { Court } from "@/shared/types/scraper.types";

const ScraperManagementPage = () => {
  const { canCreate } = useModulePermissions("SCRAPER_MANAGEMENT");

  const { data: courts = [], isLoading: courtsLoading } = useCourtsByTypeQuery("DISTRICT");

  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);
  const [bsDate, setBsDate] = useState<NepaliDateParts | null>(null);
  const [scrapeResult, setScrapeResult] = useState<{
    rows: number;
    success: boolean;
  } | null>(null);
  const [exportResult, setExportResult] = useState<{
    success: boolean;
    timestamp?: string;
  } | null>(null);

  const manualScrapeMutation = useManualScrape();
  const generateWeeklyExportMutation = useGenerateWeeklyExport();

  const scrapeConfirmDisclosure = useDisclosure();
  const exportConfirmDisclosure = useDisclosure();

  const handleRunScrape = () => {
    if (!bsDate) {
      return;
    }
    scrapeConfirmDisclosure.onOpen();
  };

  const confirmScrape = () => {
    scrapeConfirmDisclosure.onClose();
    setScrapeResult(null);
    if (!bsDate || selectedCourtId === null) return;
    manualScrapeMutation.mutate(
      { courtId: selectedCourtId, dateBs: formatForApi(bsDate) },
      {
        onSuccess: (response) => {
          const data = response?.data?.data;
          if (data) {
            setScrapeResult({ rows: data.rows, success: data.success });
          }
        },
      }
    );
  };

  const handleGenerateExport = () => {
    exportConfirmDisclosure.onOpen();
  };

  const confirmExport = () => {
    exportConfirmDisclosure.onClose();
    setExportResult(null);
    generateWeeklyExportMutation.mutate(undefined, {
      onSuccess: () => {
        setExportResult({ success: true, timestamp: new Date().toISOString() });
      },
    });
  };

  const selectedCourt: Court | undefined = courts.find(
    (c) => c.courtId === selectedCourtId
  );

  return (
    <Stack gap={6} padding={4} bg="#F7F8F8" minH="100vh" rounded={12}>
      {/* Header */}
      <Box>
        <HStack gap={3} mb={2} align="center">
          <Database size={28} color="#0056FF" />
          <Text fontSize="2xl" fontWeight="700" color="#1F2937">
            Court Data Sync
          </Text>
          <Badge
            bg="#0056FF"
            color="white"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="600"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Box w="6px" h="6px" borderRadius="full" bg="white" />
            Scraper Active
          </Badge>
        </HStack>
        <Text fontSize="sm" color="#6B7280">
          Update and manage court hearing data used by case tracking.
        </Text>
      </Box>

      {/* Manual Court Sync */}
      <SectionCard title="Manual Court Sync" icon={RefreshCw}>
        <Text fontSize="sm" color="#6B7280" mb={6}>
          Run a cause-list sync for a specific court and Bikram Sambat date.
        </Text>

        <Stack gap={5}>
          {/* Court and Date Selectors - Horizontal on Desktop */}
          <HStack
            gap={6}
            align="flex-start"
            flexWrap="wrap"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Box flex={1} minW={{ base: "100%", md: "200px" }}>
              <Text
                fontSize="xs"
                fontWeight="600"
                color="#6B7280"
                textTransform="uppercase"
                mb={2}
              >
                Court
              </Text>
              <select
                value={selectedCourtId ?? ""}
                onChange={(e) =>
                  setSelectedCourtId(e.target.value ? Number(e.target.value) : null)
                }
                disabled={courtsLoading || courts.length === 0}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                  color: "#374151",
                  backgroundColor: "white",
                  cursor: courtsLoading || courts.length === 0 ? "not-allowed" : "pointer",
                  opacity: courtsLoading || courts.length === 0 ? 0.6 : 1,
                }}
              >
                <option value="">
                  {courtsLoading
                    ? "Loading courts..."
                    : courts.length === 0
                      ? "No courts available"
                      : "Select a court"}
                </option>
                {courts.map((court) => (
                  <option key={court.courtId} value={court.courtId}>
                    {court.courtNameEnglish}
                  </option>
                ))}
              </select>
            </Box>

            <Box flex={1} minW={{ base: "100%", md: "200px" }}>
              <Text
                fontSize="xs"
                fontWeight="600"
                color="#6B7280"
                textTransform="uppercase"
                mb={2}
              >
                Nepali Date
              </Text>
              <NepaliDatePicker
                value={bsDate}
                onChange={setBsDate}
                placeholder="Select BS date"
              />
            </Box>
          </HStack>

          {/* Run Sync Button */}
          {canCreate && (
            <Button
              bg="#0056FF"
              color="white"
              _hover={{ bg: "#0048D9" }}
              _active={{ bg: "#003AB3" }}
              onClick={handleRunScrape}
              loading={manualScrapeMutation.isPending}
              maxW="fit-content"
              disabled={!bsDate || selectedCourtId === null}
              _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
              aria-label="Run court data sync"
            >
              <HStack gap={2}>
                <RefreshCw size={16} />
                <Text>Run Court Sync</Text>
              </HStack>
            </Button>
          )}

          {/* Dynamic Sync Result */}
          {manualScrapeMutation.isPending && (
            <Box
              p={4}
              bg="#F3F4F6"
              borderRadius="lg"
              border="1px solid"
              borderColor="#E5E7EB"
            >
              <Text fontSize="sm" fontWeight="500" color="#6B7280">                  Syncing {selectedCourt?.courtNameEnglish} — Fetching cause-list data for{" "}
                {bsDate ? formatForApi(bsDate) : "..."}...
              </Text>
            </Box>
          )}

          {scrapeResult && !manualScrapeMutation.isPending && (
            <Box
              p={4}
              bg={scrapeResult.success ? "#F0FDF4" : "#FFFBEB"}
              borderRadius="lg"
              border="1px solid"
              borderColor={scrapeResult.success ? "#BBF7D0" : "#FDE68A"}
            >
              {scrapeResult.success ? (
                <>
                  <Text fontSize="sm" fontWeight="600" color="#166534" mb={1}>
                    Court data updated successfully
                  </Text>
                  <Text fontSize="sm" color="#15803D">
                    {scrapeResult.rows} hearing records processed.
                  </Text>
                </>
              ) : (
                <>
                  <Text fontSize="sm" fontWeight="600" color="#92400E" mb={1}>
                    No hearing records found
                  </Text>
                  <Text fontSize="sm" color="#B45309">
                    The court cause list may not have been available for the
                    selected date. Try another date or run the sync again.
                  </Text>
                </>
              )}
            </Box>
          )}
        </Stack>
      </SectionCard>

      {/* Weekly Hearing Snapshot */}
      <SectionCard title="Weekly Hearing Snapshot" icon={FileDown}>
        <Text fontSize="sm" color="#6B7280" mb={6}>
          Generate the completed week's hearing data as a CSV file.
        </Text>

        <Stack gap={4}>
          {/* Export Status */}
          <Box
            p={3}
            bg="#F3F4F6"
            borderRadius="md"
            border="1px solid"
            borderColor="#E5E7EB"
          >
            <Text fontSize="xs" fontWeight="500" color="#6B7280">
              {exportResult
                ? `Last export: Generated just now`
                : "Last export: Not generated yet"}
            </Text>
          </Box>

          {/* Generate Button */}
          <Button
            variant="outline"
            borderColor="#0056FF"
            color="#0056FF"
            _hover={{ bg: "#E3E7FC", borderColor: "#0048D9" }}
            onClick={handleGenerateExport}
            loading={generateWeeklyExportMutation.isPending}
            maxW="fit-content"
            aria-label="Generate weekly hearing report"
          >
            <HStack gap={2}>
              <Download size={16} />
              <Text>
                {generateWeeklyExportMutation.isPending
                  ? "Generating Report..."
                  : exportResult
                    ? "Download Again"
                    : "Generate Weekly Report"}
              </Text>
            </HStack>
          </Button>

          {/* Result */}
          {exportResult &&
            exportResult.success &&
            !generateWeeklyExportMutation.isPending && (
              <Box
                p={4}
                bg="#F0FDF4"
                borderRadius="lg"
                border="1px solid"
                borderColor="#BBF7D0"
              >
                <Text fontSize="sm" fontWeight="600" color="#166534" mb={1}>
                  Report generated successfully
                </Text>
                <Text fontSize="sm" color="#15803D">
                  Generated just now
                </Text>
              </Box>
            )}
        </Stack>
      </SectionCard>

      {/* Scrape Confirmation Modal */}
      {scrapeConfirmDisclosure.open && (
        <Box
          position="fixed"
          inset="0"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="modal"
        >
          <Box bg="white" borderRadius="xl" p={6} maxW="400px" w="full" mx={4}>
            <Text fontSize="lg" fontWeight="600" color="gray.900" mb={4}>
              Run court data sync?
            </Text>
            <Stack gap={3} mb={6}>
              <Box>
                <Text fontSize="xs" fontWeight="600" color="gray.500">
                  Court
                </Text>
                <Text fontSize="sm" color="gray.900">
                  {selectedCourt?.courtNameEnglish}
                </Text>
              </Box>
              <Box>
                <Text fontSize="xs" fontWeight="600" color="#6B7280">
                  Date
                </Text>
                <Text fontSize="sm" color="#1F2937" fontFamily="monospace">
                  {bsDate ? formatForApi(bsDate) : ""}
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.600">
                This will retrieve the court's daily cause list and update
                hearing records.
              </Text>
            </Stack>
            <HStack gap={3} justify="flex-end">
              <Button
                variant="outline"
                onClick={scrapeConfirmDisclosure.onClose}
              >
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={confirmScrape}>
                Run Scrape
              </Button>
            </HStack>
          </Box>
        </Box>
      )}

      {/* Export Confirmation Modal */}
      {exportConfirmDisclosure.open && (
        <Box
          position="fixed"
          inset="0"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="modal"
        >
          <Box bg="white" borderRadius="xl" p={6} maxW="400px" w="full" mx={4}>
            <Text fontSize="lg" fontWeight="600" color="gray.900" mb={4}>
              Generate weekly hearing snapshot?
            </Text>
            <Text fontSize="sm" color="gray.600" mb={6}>
              This will regenerate the previous completed Monday–Sunday export.
            </Text>
            <HStack gap={3} justify="flex-end">
              <Button
                variant="outline"
                onClick={exportConfirmDisclosure.onClose}
              >
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={confirmExport}>
                Generate Export
              </Button>
            </HStack>
          </Box>
        </Box>
      )}
    </Stack>
  );
};

export default ScraperManagementPage;
