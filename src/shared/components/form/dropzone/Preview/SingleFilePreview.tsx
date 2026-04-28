import { HStack, Text } from "@chakra-ui/react";

import { CloseIcon } from "@/shared/assets";
import { SingleFilePreviewProps } from "@/shared/types";

export const SingleFilePreview = ({
  value,
  fileName,
  onRemove,
}: SingleFilePreviewProps) => {
  if (!fileName) {
    fileName = typeof value === "string" ? value : value?.name;
  }

  return (
    <HStack
      justifyContent="space-between"
      px="4"
      py="2"
      bg="gray.200"
      fontSize="sm"
    >
      <Text>{fileName}</Text>

      <CloseIcon width="24" color="red" cursor="pointer" onClick={onRemove} />
    </HStack>
  );
};
