import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
  Badge,
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
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  ArrowRight,
} from "lucide-react";

import { CourtEvent } from "../types/matter.types";
import {
  formatDate,
  formatTime,
  outcomeTypeLabel,
} from "../utils/matterHelpers";
import { CourtEventStatusBadge, CourtEventTypeBadge } from "./MatterBadges";

interface CourtEventDetailsModalProps {
  event: CourtEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: CourtEvent) => void;
  onCancel: (eventId: string) => void;
  onMarkHeld: (event: CourtEvent) => void;
}

export const CourtEventDetailsModal = ({
  event,
  isOpen,
  onClose,
  onEdit,
  onCancel,
  onMarkHeld,
}: CourtEventDetailsModalProps) => {
  if (!event) return null;

  const canEditOrCancel = event.status === "SCHEDULED";
  const canMarkHeld =
    event.status === "SCHEDULED" || event.status === "ADJOURNED";

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
    >
      <DialogContent maxW="600px">
        <DialogHeader>
          <Flex justify="space-between" align="center">
            <DialogTitle>Court Event Details</DialogTitle>
            <DialogCloseTrigger />
          </Flex>
        </DialogHeader>

        <DialogBody>
          <VStack gap={5} align="stretch">
            <HStack gap={3}>
              <CourtEventTypeBadge type={event.eventType} />
              <CourtEventStatusBadge status={event.status} />
            </HStack>

            <HStack gap={6} flexWrap="wrap">
              <HStack color="gray.600">
                <Calendar size={18} />
                <Text fontSize="sm" fontWeight="500">
                  {formatDate(event.scheduledDate)}
                </Text>
              </HStack>
              {event.scheduledTime && (
                <HStack color="gray.600">
                  <Clock size={18} />
                  <Text fontSize="sm" fontWeight="500">
                    {formatTime(event.scheduledTime)}
                    {event.endTime ? ` – ${formatTime(event.endTime)}` : ""}
                  </Text>
                </HStack>
              )}
            </HStack>

            {event.courtRoom && (
              <HStack color="gray.600">
                <MapPin size={18} />
                <Text fontSize="sm" fontWeight="500">
                  {event.courtRoom}
                </Text>
              </HStack>
            )}

            {event.judgeName && (
              <HStack color="gray.600">
                <User size={18} />
                <Text fontSize="sm" fontWeight="500">
                  Judge: {event.judgeName}
                </Text>
              </HStack>
            )}

            {event.attendingAdvocateId && (
              <HStack color="gray.600">
                <User size={18} />
                <Text fontSize="sm" fontWeight="500">
                  Advocate assigned
                </Text>
              </HStack>
            )}

            {event.outcome && (
              <Box bg="gray.50" p={3} borderRadius="md">
                <Text fontSize="sm" fontWeight="600" mb={1}>
                  Outcome
                  {event.outcomeType
                    ? ` · ${outcomeTypeLabel(event.outcomeType)}`
                    : ""}
                </Text>
                <Text fontSize="sm">{event.outcome}</Text>
              </Box>
            )}

            {event.nextEventId && (
              <HStack color="blue.600" gap={2}>
                <ArrowRight size={16} />
                <Text fontSize="sm" fontWeight="500">
                  Next event scheduled (follow-up hearing)
                </Text>
              </HStack>
            )}

            {event.notes && (
              <Box>
                <HStack mb={1} color="gray.600">
                  <FileText size={16} />
                  <Text fontSize="sm" fontWeight="600">
                    Notes
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  {event.notes}
                </Text>
              </Box>
            )}
          </VStack>
        </DialogBody>

        <DialogFooter>
          {canMarkHeld ? (
            <Button
              variant="outline"
              colorScheme="green"
              mr="auto"
              onClick={() => onMarkHeld(event)}
            >
              Mark Held
            </Button>
          ) : (
            <Badge colorScheme="gray" mr="auto" px={2} py={1}>
              {event.status === "CANCELED"
                ? "Cancelled — cannot be edited"
                : "Held — cannot be cancelled"}
            </Badge>
          )}

          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
          {canEditOrCancel && (
            <>
              <Button
                variant="outline"
                colorScheme="red"
                mr={3}
                onClick={() => onCancel(event.id)}
              >
                Cancel Event
              </Button>
              <Button onClick={() => onEdit(event)}>Edit</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
