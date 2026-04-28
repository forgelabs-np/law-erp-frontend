import { ChakraProvider as Provider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

import chakraSystem from "@/shared/theme";

export function ChakraProvider({ children }: PropsWithChildren) {
  return <Provider value={chakraSystem}>{children}</Provider>;
}
