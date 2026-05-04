import { Text, VStack } from "@chakra-ui/react";

import { BoxOpenIcon } from "@/assets/svgs";

const NoDataAvailable = ({ content }: { content: string }) => {
  return (
    <VStack gap={2} height={"100%"} paddingTop={10} paddingBottom={5}>
      <BoxOpenIcon />
      <Text fontSize={"14px"} color={"gray.700"} fontWeight={500}>
        {content}
      </Text>
    </VStack>
  );
};

export default NoDataAvailable;
