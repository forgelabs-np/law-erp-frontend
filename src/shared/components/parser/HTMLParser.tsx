import { Box } from "@chakra-ui/react";
import parse from "html-react-parser";

import { HTMLParserProps } from "@/shared/types";

import "@/shared/styles/editor.css";

export const HTMLParser = ({ data }: HTMLParserProps) => {
  if (typeof data !== "string") return;

  return <Box className="parsed-content-wrapper">{parse(data)}</Box>;
};
