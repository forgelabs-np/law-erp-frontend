import {
  Box,
  Button,
  Flex,
  HStack,
  Stack,
  Text,
  VStack,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogTitle,
} from "@/shared/components/ui/Dialog";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  Edit2,
  X,
} from "lucide-react";
import { Hearing } from "../types/hearing.types";
import {
  getHearingStatusColor,
  getHearingTypeBadgeColor,
} from "@/utils/calendarHelpers";

interface HearingDetailsModalProps {
  hearing: Hearing | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (hearing: Hearing) => void;
  onCancel: (hearingId: string) => void;
}

export const HearingDetailsModal = ({
  hearing,
  isOpen,
  onClose,
  onEdit,
  onCancel,
}: HearingDetailsModalProps) => {
  if (!hearing) return null;

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
    >
      <DialogContent maxWidth="600px">
        <DialogHeader>
          <Flex justify="space-between" align="center">
            <DialogTitle>Hearing Details</DialogTitle>
            <DialogCloseTrigger />
          </Flex>
        </DialogHeader>

        <DialogBody>
          <VStack gap={6} align="stretch">
            {/* Status and Type Badges */}
            <HStack gap={3}>
              <Badge
                bg={getHearingStatusColor(hearing.status)}
                color="white"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
              >
                {hearing.status}
              </Badge>
              <Badge
                colorScheme={getHearingTypeBadgeColor(hearing.hearingType)}
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
              >
                {hearing.hearingType.replace("_", " ")}
              </Badge>
            </HStack>

            {/* Title */}
            <Box>
              <Text fontSize="lg" fontWeight="600">
                {hearing.title}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Case: {hearing.caseNumber}
              </Text>
            </Box>

            {/* Date and Time */}
            <HStack gap={6}>
              <HStack color="gray.600">
                <Calendar size={18} />
                <Text fontSize="sm" fontWeight="500">
                  {format(new Date(hearing.date), "MMM d, yyyy")}
                </Text>
              </HStack>
              <HStack color="gray.600">
                <Clock size={18} />
                <Text fontSize="sm" fontWeight="500">
                  {hearing.time} - {hearing.endTime}
                </Text>
              </HStack>
            </HStack>

            {/* Location */}
            <HStack color="gray.600">
              <MapPin size={18} />
              <Text fontSize="sm" fontWeight="500">
                {hearing.courtRoom}
              </Text>
            </HStack>

            {/* Judge */}
            {hearing.judgeName && (
              <HStack color="gray.600">
                <User size={18} />
                <Text fontSize="sm" fontWeight="500">
                  Judge: {hearing.judgeName}
                </Text>
              </HStack>
            )}

            {/* Outcome */}
            {hearing.outcome && (
              <Box bg="gray.50" p={3} borderRadius="md">
                <Text fontSize="sm" fontWeight="600" mb={1}>
                  Outcome
                </Text>
                <Text fontSize="sm">{hearing.outcome}</Text>
              </Box>
            )}

            {/* Notes */}
            {hearing.notes && (
              <Box>
                <Text fontSize="sm" fontWeight="600" mb={1}>
                  Notes
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {hearing.notes}
                </Text>
              </Box>
            )}

            {/* Attendees */}
            {hearing.attendees && (
              <Box>
                <Text fontSize="sm" fontWeight="600" mb={1}>
                  Attendees
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {hearing.attendees}
                </Text>
              </Box>
            )}

            {/* Metadata */}
            <Box borderTopWidth="1px" borderColor="gray.200" pt={4}>
              <Text fontSize="xs" color="gray.400">
                Created:{" "}
                {format(new Date(hearing.createdAt), "MMM d, yyyy HH:mm")}
              </Text>
              {hearing.updatedAt && hearing.updatedAt !== hearing.createdAt && (
                <Text fontSize="xs" color="gray.400">
                  Updated:{" "}
                  {format(new Date(hearing.updatedAt), "MMM d, yyyy HH:mm")}
                </Text>
              )}
            </Box>
          </VStack>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
          {hearing.status === "SCHEDULED" && (
            <>
              <Button
                variant="outline"
                mr={3}
                onClick={() => onCancel(hearing.id)}
                colorScheme="red"
              >
                Cancel Hearing
              </Button>
              <Button onClick={() => onEdit(hearing)} colorScheme="blue">
                <Edit2 size={16} style={{ marginRight: 8 }} />
                Edit
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
