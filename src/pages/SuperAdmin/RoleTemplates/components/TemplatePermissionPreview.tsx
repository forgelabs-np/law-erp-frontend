import { Badge, Box, HStack, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  ChevronDown,
  ChevronRight,
  Layers,
  ShieldAlert,
  Users,
} from "lucide-react";

import { TemplatePermissionPreview } from "@/api/roleTemplate";

const StatBox = ({
  label,
  value,
  color = "gray.800",
}: {
  label: string;
  value: number | string;
  color?: string;
}) => (
  <Box
    p={3}
    bg="gray.50"
    borderRadius="md"
    borderWidth="1px"
    borderColor="gray.100"
    minW="120px"
    flex={1}
  >
    <Text fontSize="xs" color="gray.500" mb={1}>
      {label}
    </Text>
    <Text fontSize="lg" fontWeight="700" color={color}>
      {value}
    </Text>
  </Box>
);

const PermissionCodeList = ({
  codes,
  emptyText,
  color = "gray.700",
}: {
  codes: string[];
  emptyText: string;
  color?: string;
}) => {
  if (codes.length === 0) {
    return (
      <Text fontSize="sm" color="gray.400">
        {emptyText}
      </Text>
    );
  }
  return (
    <HStack flexWrap="wrap" gap={1.5}>
      {codes.map((code) => (
        <Badge
          key={code}
          bg="gray.100"
          color={color}
          fontFamily="mono"
          fontSize="xs"
          px="2"
          py="0.5"
          borderRadius="md"
        >
          {code}
        </Badge>
      ))}
    </HStack>
  );
};

const CloneImpactRow = ({
  clone,
}: {
  clone: TemplatePermissionPreview["firmImpacts"][number]["cloneImpacts"][number];
}) => {
  const hasDetails =
    clone.added.length > 0 ||
    clone.removed.length > 0 ||
    clone.skippedByCeiling.length > 0 ||
    clone.cascadeStripped.length > 0;

  return (
    <Box
      border="1px solid"
      borderColor="gray.100"
      borderRadius="md"
      px={3}
      py={2}
    >
      <HStack justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Text fontFamily="mono" fontSize="sm" fontWeight="600">
          {clone.roleCode}
        </Text>
        <HStack gap={2}>
          {clone.added.length > 0 && (
            <Badge colorScheme="green" fontSize="xs">
              +{clone.added.length} added
            </Badge>
          )}
          {clone.removed.length > 0 && (
            <Badge colorScheme="red" fontSize="xs">
              -{clone.removed.length} removed
            </Badge>
          )}
          {clone.skippedByCeiling.length > 0 && (
            <Badge colorScheme="orange" fontSize="xs">
              {clone.skippedByCeiling.length} skipped (ceiling)
            </Badge>
          )}
          {clone.cascadeStripped.length > 0 && (
            <Badge colorScheme="purple" fontSize="xs">
              {clone.cascadeStripped.length} cascade-stripped
            </Badge>
          )}
          {!hasDetails && (
            <Badge colorScheme="gray" fontSize="xs">
              No changes
            </Badge>
          )}
        </HStack>
      </HStack>

      {hasDetails && (
        <Stack gap={2} mt={2}>
          {clone.added.length > 0 && (
            <Box>
              <Text fontSize="xs" fontWeight="600" color="green.600" mb={1}>
                Added
              </Text>
              <PermissionCodeList codes={clone.added} emptyText="" />
            </Box>
          )}
          {clone.removed.length > 0 && (
            <Box>
              <Text fontSize="xs" fontWeight="600" color="red.600" mb={1}>
                Removed
              </Text>
              <PermissionCodeList codes={clone.removed} emptyText="" />
            </Box>
          )}
          {clone.skippedByCeiling.length > 0 && (
            <Box>
              <Text fontSize="xs" fontWeight="600" color="orange.600" mb={1}>
                Skipped by ceiling
              </Text>
              <PermissionCodeList codes={clone.skippedByCeiling} emptyText="" />
            </Box>
          )}
          {clone.cascadeStripped.length > 0 && (
            <Box>
              <Text fontSize="xs" fontWeight="600" color="purple.600" mb={1}>
                Cascade stripped
              </Text>
              <PermissionCodeList codes={clone.cascadeStripped} emptyText="" />
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
};

const FirmImpactSection = ({
  impact,
}: {
  impact: TemplatePermissionPreview["firmImpacts"][number];
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      overflow="hidden"
    >
      <HStack
        as="button"
        w="full"
        justifyContent="space-between"
        px={4}
        py={3}
        bg="gray.50"
        cursor="pointer"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <HStack gap={2}>
          {expanded ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
          <Building2 size={16} color="gray" />
          <Text fontWeight="600" fontSize="sm">
            {impact.firmCode || impact.firmId}
          </Text>
        </HStack>
        <HStack gap={2}>
          <Badge colorScheme="gray" fontSize="xs">
            {impact.cloneImpacts.length} role clone
            {impact.cloneImpacts.length !== 1 ? "s" : ""}
          </Badge>
        </HStack>
      </HStack>

      {expanded && (
        <Stack gap={3} p={4}>
          {impact.cloneImpacts.map((clone) => (
            <CloneImpactRow key={clone.roleId} clone={clone} />
          ))}

          {impact.cascadeTargets.length > 0 && (
            <Box
              border="1px solid"
              borderColor="purple.200"
              bg="purple.50"
              borderRadius="md"
              px={3}
              py={2}
            >
              <HStack gap={2} mb={1}>
                <Layers size={14} color="purple" />
                <Text fontSize="sm" fontWeight="600" color="purple.700">
                  Cascade targets
                </Text>
              </HStack>
              <Stack gap={1}>
                {impact.cascadeTargets.map((target) => (
                  <Text key={target.roleId} fontSize="xs" color="purple.700">
                    <Text as="span" fontFamily="mono" fontWeight="600">
                      {target.roleCode}
                    </Text>{" "}
                    — {target.permissionCodes.length} permission(s) would be
                    cascaded
                  </Text>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
};

/**
 * Renders the authoritative preview of a template permission change:
 * added/removed codes, chain validation, aggregate + per-firm impact,
 * cascade impact and employee-template strips.
 */
export const TemplatePermissionPreviewView = ({
  preview,
}: {
  preview: TemplatePermissionPreview;
}) => {
  const [showEmployeeStrips, setShowEmployeeStrips] = useState(false);

  const employeeStripEntries = Object.entries(
    preview.employeeTemplateStrips ?? {}
  );

  return (
    <Stack gap={5} w="full">
      {/* ── Chain validation ─────────────────────────────────────── */}
      {preview.wouldViolateChain && (
        <Box
          border="1px solid"
          borderColor="red.300"
          bg="red.50"
          borderRadius="lg"
          p={4}
        >
          <HStack gap={2} mb={2}>
            <ShieldAlert size={18} color="red" />
            <Text fontWeight="700" color="red.700">
              Delegation chain violation
            </Text>
          </HStack>
          <Text fontSize="sm" color="red.700" mb={2}>
            Permission changes cannot be applied because they violate the
            delegation chain. Narrow the dependent template(s) first, then
            retry.
          </Text>
          <PermissionCodeList
            codes={preview.chainValidationViolations}
            emptyText=""
            color="red.700"
          />
        </Box>
      )}

      {/* ── Permission changes ───────────────────────────────────── */}
      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        overflow="hidden"
      >
        <Box px={4} py={3} bg="gray.50" borderBottomWidth="1px">
          <HStack gap={2}>
            <AlertTriangle size={16} color="gray" />
            <Text fontWeight="600" fontSize="sm">
              Permission changes
            </Text>
          </HStack>
        </Box>
        <Stack gap={3} p={4}>
          <Box>
            <Text fontSize="xs" fontWeight="600" color="green.600" mb={1}>
              Added ({preview.addedPermissionCodes.length})
            </Text>
            <PermissionCodeList
              codes={preview.addedPermissionCodes}
              emptyText="No permissions will be added"
            />
          </Box>
          <Box>
            <Text fontSize="xs" fontWeight="600" color="red.600" mb={1}>
              Removed ({preview.removedPermissionCodes.length})
            </Text>
            <PermissionCodeList
              codes={preview.removedPermissionCodes}
              emptyText="No permissions will be removed"
            />
          </Box>
        </Stack>
      </Box>

      {/* ── Aggregate impact ─────────────────────────────────────── */}
      <Box>
        <HStack gap={2} mb={2}>
          <Users size={16} color="gray" />
          <Text fontWeight="600" fontSize="sm">
            Overall impact
          </Text>
        </HStack>
        <HStack gap={3} flexWrap="wrap" alignItems="stretch">
          <StatBox label="Firms affected" value={preview.firmsAffected} />
          <StatBox label="Clones synced" value={preview.clonesSynced} />
          <StatBox
            label="Clones skipped (ceiling)"
            value={preview.clonesSkippedByCeiling}
            color={preview.clonesSkippedByCeiling > 0 ? "orange.500" : "gray.800"}
          />
          <StatBox
            label="Cascade stripped from clones"
            value={preview.cascadeStrippedFromClones}
            color={
              preview.cascadeStrippedFromClones > 0 ? "purple.500" : "gray.800"
            }
          />
          <StatBox
            label="Cascade stripped from templates"
            value={preview.cascadeStrippedFromTemplates}
            color={
              preview.cascadeStrippedFromTemplates > 0
                ? "purple.500"
                : "gray.800"
            }
          />
        </HStack>
      </Box>

      {/* ── Per-firm impact ──────────────────────────────────────── */}
      {preview.firmImpacts.length > 0 && (
        <Box>
          <HStack gap={2} mb={2}>
            <Building2 size={16} color="gray" />
            <Text fontWeight="600" fontSize="sm">
              Firms impacted ({preview.firmImpacts.length})
            </Text>
          </HStack>
          <Stack gap={2} maxH="360px" overflowY="auto">
            {preview.firmImpacts.map((impact) => (
              <FirmImpactSection key={impact.firmId} impact={impact} />
            ))}
          </Stack>
        </Box>
      )}

      {/* ── Employee template strips ─────────────────────────────── */}
      {employeeStripEntries.length > 0 && (
        <Box
          border="1px solid"
          borderColor="orange.200"
          bg="orange.50"
          borderRadius="lg"
          p={4}
        >
          <HStack
            as="button"
            justifyContent="space-between"
            w="full"
            onClick={() => setShowEmployeeStrips((prev) => !prev)}
          >
            <HStack gap={2}>
              <AlertTriangle size={16} color="orange" />
              <Text fontWeight="600" fontSize="sm" color="orange.700">
                Employee template strips ({employeeStripEntries.length})
              </Text>
            </HStack>
            <Text fontSize="xs" color="orange.600">
              {showEmployeeStrips ? "Hide" : "Show"}
            </Text>
          </HStack>
          {showEmployeeStrips && (
            <Stack gap={2} mt={3}>
              {employeeStripEntries.map(([templateCode, stripped]) => (
                <Box key={templateCode}>
                  <Text
                    fontFamily="mono"
                    fontSize="sm"
                    fontWeight="600"
                    color="orange.700"
                  >
                    {templateCode}
                  </Text>
                  <PermissionCodeList codes={stripped} emptyText="" />
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Stack>
  );
};
