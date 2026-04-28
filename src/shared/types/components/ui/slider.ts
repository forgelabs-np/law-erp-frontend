import { Slider as ChakraSlider } from "@chakra-ui/react";

export type SliderProps = ChakraSlider.RootProps & {
  marks?: Array<number | { value: number; label: React.ReactNode }>;
  label?: React.ReactNode;
  showValue?: boolean;
};
