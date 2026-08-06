import {
  Box,
  Flex,
  Text,
  Button,
  Badge,
  VStack,
  HStack,
  IconButton,
  Grid,
  Stack,
} from "@chakra-ui/react";
import {
  DrawerRoot,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseTrigger,
  DrawerTitle,
} from "@/shared/components/drawer";
import { Task } from "../../types/Task";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  CheckCircle,
  Trash2,
  Edit2,
  MapPin,
  MoreHorizontal,
  FileText,
  Scale
} from "lucide-react";
import { getTaskColor } from "../../utils/calendarHelpers";

interface TaskDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onComplete: (task: Task) => void;
}

export const TaskDrawer = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onComplete,
}: TaskDrawerProps) => {
  if (!task) return null;

  const color = getTaskColor(task.taskType, task.status);

  const cardStyles = {
    bg: "white",
    _dark: { bg: "gray.800", borderColor: "gray.700" },
    p: 4,
    borderRadius: "16px",
    borderWidth: "1px",
    borderColor: "gray.200",
    boxShadow: "sm",
  };

  return (
    <DrawerRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size="md"
      placement="end"
    >
      <DrawerContent bg="gray.50" _dark={{ bg: "gray.900" }}>
        <DrawerHeader pb={6} w={"full"}>
          <Stack>

            {/* </Stack> */}
            <Flex justify="space-between" align="flex-start" mb={4}>
              <Badge
                bg={`${color}`}
                color={"white"}
                _dark={{ bg: `${color}`, color: `${color}` }}
                px={3}
                py={1.5}
                borderRadius="full"
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wide"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Scale size={14} />
                {task.taskType}
              </Badge>
              <DrawerCloseTrigger position="relative" inset="auto" />
            </Flex>

            <DrawerTitle fontSize="32px" fontWeight="bold" lineHeight="tight" color="gray.800" _dark={{ color: "white" }}>
              {task.title}
            </DrawerTitle>

            <HStack mt={6} gap={3}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(task)}
                bg="white"
                _dark={{ bg: "gray.800" }}
                borderRadius="8px"
              >
                <HStack gap={2}>
                  <Edit2 size={16} />
                  <Text fontWeight="600">Edit</Text>
                </HStack>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(task.id)}
                bg="white"
                _dark={{ bg: "gray.800" }}
                borderRadius="8px"
                borderColor="red.200"
                color="red.600"
                _hover={{ bg: "red.50" }}
              >
                <HStack gap={2}>
                  <Trash2 size={16} />
                  <Text fontWeight="600">Delete</Text>
                </HStack>
              </Button>
              <Button
                variant="outline"
                size="sm"
                bg="white"
                _dark={{ bg: "gray.800" }}
                borderRadius="8px"
              >
                <HStack gap={2}>
                  <MoreHorizontal size={16} />
                  <Text fontWeight="600">More</Text>
                </HStack>
              </Button>
            </HStack>
          </Stack>

        </DrawerHeader>

        <DrawerBody pt={5}>
          <VStack align="stretch" gap={6}>
            {/* Date & Time Cards */}
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
              <Box {...cardStyles}>
                <HStack mb={2}>
                  <Calendar size={18} color="gray" />
                  <Text fontSize="sm" color="gray.500" fontWeight="500">
                    Date
                  </Text>
                </HStack>
                <Text fontSize="md" fontWeight="600" mt={1}>
                  {format(new Date(task.startDate), "MMM d, yyyy")}
                </Text>
              </Box>
              <Box {...cardStyles}>
                <HStack mb={2}>
                  <Clock size={18} color="gray" />
                  <Text fontSize="sm" color="gray.500" fontWeight="500">
                    Time
                  </Text>
                </HStack>
                <HStack mt={1}>
                  <Text fontSize="md" fontWeight="600">
                    {format(new Date(task.startDate), "h:mm a")} -{" "}
                    {format(new Date(task.endDate), "h:mm a")}
                  </Text>
                  <Badge bg="gray.100" color="gray.600" fontSize="2xs" borderRadius="md">NPT</Badge>
                </HStack>
              </Box>
            </Grid>

            {/* Description */}
            <Box px={2}>
              <Text fontSize="sm" color="gray.500" fontWeight="600" mb={1}>
                Description
              </Text>
              <Text fontSize="md" fontWeight="600" color="gray.800" _dark={{ color: "gray.200" }}>
                {task.description || "No description available."}
              </Text>
            </Box>

            {/* Lawyer & Client Card */}
            <Box {...cardStyles}>
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
                <Box borderRightWidth={{ base: "0", sm: "1px" }} borderBottomWidth={{ base: "1px", sm: "0" }} borderColor="gray.100" _dark={{ borderColor: "gray.700" }} pb={{ base: 4, sm: 0 }}>
                  <HStack mb={2}>
                    <User size={16} color="gray" />
                    <Text fontSize="sm" color="gray.500" fontWeight="500">
                      Assigned Lawyer
                    </Text>
                  </HStack>
                  <Text fontWeight="600" ml={6}>
                    {task.assignedLawyer || "—"}
                  </Text>
                </Box>
                <Box pl={{ base: 0, sm: 4 }} pt={{ base: 2, sm: 0 }}>
                  <HStack mb={2}>
                    <User size={16} color="gray" />
                    <Text fontSize="sm" color="gray.500" fontWeight="500">
                      Client
                    </Text>
                  </HStack>
                  <Text fontWeight="600" ml={6}>
                    {task.client || "—"}
                  </Text>
                </Box>
              </Grid>
            </Box>

            {/* Case Details Card */}
            <Box {...cardStyles}>
              <HStack mb={4}>
                <Briefcase size={18} color="gray" />
                <Text fontSize="md" fontWeight="700">
                  Case Details
                </Text>
              </HStack>
              <Grid templateColumns="120px 10px 1fr" gap={3} alignItems="center" ml={2}>
                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  Case Number
                </Text>
                <Text fontSize="sm" color="gray.500">:</Text>
                <Text fontSize="sm" fontWeight="600">
                  {task.caseNumber || "—"}
                </Text>

                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  Case Title
                </Text>
                <Text fontSize="sm" color="gray.500">:</Text>
                <Text fontSize="sm" fontWeight="600">
                  {task.caseName || "—"}
                </Text>
              </Grid>
            </Box>

            {/* Hearing Details Card */}
            <Box {...cardStyles}>
              <HStack mb={4}>
                <MapPin size={18} color="gray" />
                <Text fontSize="md" fontWeight="700">
                  Hearing Details
                </Text>
              </HStack>
              <Grid templateColumns="120px 10px 1fr" gap={3} alignItems="center" ml={2}>
                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  Court Room
                </Text>
                <Text fontSize="sm" color="gray.500">:</Text>
                <HStack>
                  <Text fontSize="sm" fontWeight="600">
                    {task.description?.split(" - ")[1] || "—"}
                  </Text>
                </HStack>

                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  Hearing Type
                </Text>
                <Text fontSize="sm" color="gray.500">:</Text>
                <Box>
                  <Badge
                    bg="purple.100"
                    color="purple.700"
                    _dark={{ bg: "purple.900", color: "purple.200" }}
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight="600"
                  >
                    {task.description?.split(" - ")[0] || "—"}
                  </Badge>
                </Box>

                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  Status
                </Text>
                <Text fontSize="sm" color="gray.500">:</Text>
                <Box>
                  <Badge
                    bg={
                      task.status === "Completed"
                        ? "green.100"
                        : task.status === "Overdue"
                          ? "red.100"
                          : "yellow.100"
                    }
                    color={
                      task.status === "Completed"
                        ? "green.700"
                        : task.status === "Overdue"
                          ? "red.700"
                          : "yellow.700"
                    }
                    _dark={{
                      bg:
                        task.status === "Completed"
                          ? "green.900"
                          : task.status === "Overdue"
                            ? "red.900"
                            : "yellow.900",
                      color:
                        task.status === "Completed"
                          ? "green.200"
                          : task.status === "Overdue"
                            ? "red.200"
                            : "yellow.200",
                    }}
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight="600"
                    textTransform="uppercase"
                  >
                    {task.status}
                  </Badge>
                </Box>

                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  Judge Name
                </Text>
                <Text fontSize="sm" color="gray.500">:</Text>
                <Text fontSize="sm" fontWeight="600">
                  —
                </Text>

                <Text fontSize="sm" color="gray.500" fontWeight="500">
                  Attendees
                </Text>
                <Text fontSize="sm" color="gray.500">:</Text>
                <Text fontSize="sm" fontWeight="600">
                  —
                </Text>
              </Grid>
            </Box>

            {/* Notes Section - Conditional */}
            {task.notes && (
              <Box {...cardStyles}>
                <HStack mb={3}>
                  <FileText size={18} color="gray" />
                  <Text fontSize="md" fontWeight="700">
                    Notes
                  </Text>
                </HStack>
                <Text fontSize="sm" lineHeight="tall" ml={2} fontWeight="500">
                  {task.notes}
                </Text>
              </Box>
            )}
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px" pt={4} pb={4} bg="white" _dark={{ bg: "gray.800" }}>
          <Flex w="100%" justify="space-between" align="center">
            <Button
              variant="outline"
              borderRadius="8px"
              borderColor="gray.200"
              _dark={{ borderColor: "gray.600" }}
            >
              <HStack gap={2}>
                <Calendar size={16} />
                <Text fontWeight="600">Add to Calendar</Text>
              </HStack>
            </Button>
            <HStack gap={3}>
              <Button variant="outline" onClick={onClose} borderRadius="8px" fontWeight="600">
                Close
              </Button>
              {task.status !== "Completed" && (
                <Button
                  colorScheme="green"
                  bg="green.700"
                  _hover={{ bg: "green.800" }}
                  color="white"
                  borderRadius="8px"
                  onClick={() => onComplete(task)}
                >
                  <HStack gap={2}>
                    <CheckCircle size={16} />
                    <Text fontWeight="600">Mark Complete</Text>
                  </HStack>
                </Button>
              )}
            </HStack>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot >
  );
};
