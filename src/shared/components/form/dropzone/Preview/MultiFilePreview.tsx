import { MultiFilePreviewProps } from "@/shared/types";

import { SingleFilePreview } from "./SingleFilePreview";

export const MultiFilePreview = ({
  value,
  onRemove,
}: MultiFilePreviewProps) => {
  return value.map((file, index) => (
    <SingleFilePreview value={file} onRemove={() => onRemove?.(index)} />
  ));
};
