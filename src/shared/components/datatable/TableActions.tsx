import { HStack, IconButton } from "@chakra-ui/react";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { TableActionsProps } from "@/shared/types";
import { Tooltip } from "../ui";

export const TableActions = ({
  onView,
  onEdit,
  onDelete,
}: TableActionsProps) => {
  return (
    <HStack gap="2" alignItems="center">
      {!!onView && (
        <Tooltip content="View">
          <IconButton
            aria-label="View"
            variant="ghost"
            size="sm"
            w="32px"
            h="32px"
            minW="32px"
            p="0"
            borderRadius="8px"
            border="1px solid"
            borderColor="gray.200"
            color="gray.400"
            bg="white"
            transition="all 0.15s ease"
            _hover={{
              bg: "gray.50",
              borderColor: "gray.300",
              color: "blue.600",
            }}
            onClick={onView}
          >
            <Eye size={15} />
          </IconButton>
        </Tooltip>
      )}

      {!!onEdit && (
        <Tooltip content="Edit">
          <IconButton
            aria-label="Edit"
            variant="ghost"
            size="sm"
            w="32px"
            h="32px"
            minW="32px"
            p="0"
            borderRadius="8px"
            border="1px solid"
            borderColor="gray.200"
            color="gray.400"
            bg="white"
            transition="all 0.15s ease"
            _hover={{
              bg: "gray.50",
              borderColor: "gray.300",
              color: "blue.600",
            }}
            onClick={onEdit}
          >
            <Pencil size={15} />
          </IconButton>
        </Tooltip>
      )}

      {!!onDelete && (
        <Tooltip content="Delete">
          <IconButton
            aria-label="Delete"
            variant="ghost"
            size="sm"
            w="32px"
            h="32px"
            minW="32px"
            p="0"
            borderRadius="8px"
            border="1px solid"
            borderColor="gray.200"
            color="gray.400"
            bg="white"
            transition="all 0.15s ease"
            _hover={{
              bg: "red.50",
              borderColor: "red.200",
              color: "red.600",
            }}
            onClick={onDelete}
          >
            <Trash2 size={15} />
          </IconButton>
        </Tooltip>
      )}
    </HStack>
  );
};
