import { ChakraProvider as Provider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

import chakraSystem, { type BrandSystem } from "@/shared/theme";

export function ChakraProvider({
  children,
  value,
}: PropsWithChildren<{ value?: BrandSystem }>) {
  // `value` lets the firm-brand theme swap the system at runtime; every other
  // usage keeps the default system.
  return <Provider value={value ?? chakraSystem}>{children}</Provider>;
}
