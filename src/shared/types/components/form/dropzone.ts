export type DropzoneProps = {
  name: string;

  multiple?: boolean;
};

export type MultiFilePreviewProps = {
  value: File[] | string[];
  onRemove?: (index: number) => void;
};

export type SingleFilePreviewProps = {
  value: File | string;
  fileName?: string;
  onRemove?: VoidFunction;
};
