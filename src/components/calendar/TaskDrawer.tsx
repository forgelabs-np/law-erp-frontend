import {
  Box,
  Flex,
  Text,
  Button,
  Badge,
  VStack,
  HStack,
  IconButton,
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
  FileText,
  CheckCircle,
  Trash2,
  Edit2,
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

  return (
    <DrawerRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size="md"
      placement="end"
    >
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          <Flex justify="space-between" align="center" mt={2}>
            <Badge
              bg={color}
              color="white"
              px={2}
              py={1}
              borderRadius="full"
              fontSize="xs"
            >
              {task.taskType}
            </Badge>
            <HStack>
              <IconButton
                aria-label="Edit Task"
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
              >
                <Edit2 size={16} />
              </IconButton>
              <IconButton
                aria-label="Delete Task"
                variant="ghost"
                color="red.500"
                size="sm"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 size={16} />
              </IconButton>
              <DrawerCloseTrigger position="relative" inset="auto" />
            </HStack>
          </Flex>
          <DrawerTitle mt={4} fontSize="2xl">
            {task.title}
          </DrawerTitle>
        </DrawerHeader>

        <DrawerBody pt={6}>
          <VStack align="stretch" gap={6}>
            <HStack gap={6}>
              <HStack color="gray.600" _dark={{ color: "gray.300" }}>
                <Calendar size={18} />
                <Text fontSize="sm" fontWeight="500">
                  {format(new Date(task.startDate), "MMM d, yyyy")}
                </Text>
              </HStack>
              <HStack color="gray.600" _dark={{ color: "gray.300" }}>
                <Clock size={18} />
                <Text fontSize="sm" fontWeight="500">
                  {format(new Date(task.startDate), "h:mm a")} -{" "}
                  {format(new Date(task.endDate), "h:mm a")}
                </Text>
              </HStack>
            </HStack>

            <Box
              borderBottomWidth="1px"
              w="100%"
              borderColor="gray.200"
              _dark={{ borderColor: "gray.700" }}
            />

            <Box>
              <Text fontSize="sm" color="gray.500" mb={1}>
                Description
              </Text>
              <Text fontSize="md">
                {task.description || "No description provided."}
              </Text>
            </Box>

            <Flex gap={8} wrap="wrap">
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>
                  Assigned Lawyer
                </Text>
                <HStack>
                  <User size={16} color="gray" />
                  <Text fontWeight="500">{task.assignedLawyer}</Text>
                </HStack>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>
                  Client
                </Text>
                <Text fontWeight="500">{task.client}</Text>
              </Box>
            </Flex>

            <Box
              bg="gray.50"
              _dark={{ bg: "gray.800" }}
              p={4}
              borderRadius="lg"
            >
              <HStack mb={2}>
                <Briefcase size={18} color="gray" />
                <Text fontWeight="600">Case Details</Text>
              </HStack>
              <Text fontSize="sm">
                <Text as="span" color="gray.500">
                  Name:{" "}
                </Text>
                {task.caseName}
              </Text>
              <Text fontSize="sm">
                <Text as="span" color="gray.500">
                  Number:{" "}
                </Text>
                {task.caseNumber}
              </Text>
            </Box>

            <Flex justify="space-between">
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>
                  Status
                </Text>
                <Badge
                  colorScheme={
                    task.status === "Completed"
                      ? "green"
                      : task.status === "Overdue"
                        ? "red"
                        : "blue"
                  }
                >
                  {task.status}
                </Badge>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>
                  Priority
                </Text>
                <Badge
                  colorScheme={
                    task.priority === "Critical"
                      ? "red"
                      : task.priority === "High"
                        ? "orange"
                        : "gray"
                  }
                >
                  {task.priority}
                </Badge>
              </Box>
            </Flex>
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
          {task.status !== "Completed" && (
            <Button colorScheme="green" onClick={() => onComplete(task)}>
              <CheckCircle size={16} style={{ marginRight: 8 }} />
              Mark Complete
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};
