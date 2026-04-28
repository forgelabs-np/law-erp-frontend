import { Grid, VStack } from "@chakra-ui/react";
import { useRef } from "react";
import { DropzoneRootProps, useDropzone } from "react-dropzone";
import { useController, useFormContext } from "react-hook-form";

import { DropzoneProps } from "@/shared/types";

import { MultiFilePreview, SingleFilePreview } from "./Preview";

export const Dropzone = ({ name, multiple }: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { control } = useFormContext();

  const { field } = useController({
    name,
    control,
  });

  const { value, onChange } = field;

  // this resets the input so onDrop is triggered even when selecting the same file
  const resetInput = () => {
    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.value = "";
    }
  };

  // function to control the file change
  const onDrop = (acceptedFiles: File[]) => {
    if (multiple) {
      const previousValues = Array.isArray(value)
        ? value?.map((file) => file)
        : [];

      onChange([...previousValues, ...acceptedFiles]);
    } else {
      const uploadedFile = acceptedFiles?.[0];
      onChange(uploadedFile);
    }

    resetInput();
  };

  // remove file in case of single upload
  const removeSingleFile = () => {
    onChange();
  };

  // remove file in case of multiple upload
  const removeMultipleFiles = (deleteIndex: number) => {
    if (Array.isArray(value)) {
      const filteredValues = value?.filter((_, index) => index !== deleteIndex);
      onChange(filteredValues);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple,
  });

  return (
    <VStack alignItems="stretch" width="full">
      <Grid
        {...(getRootProps() as Omit<DropzoneRootProps, "color">)}
        position="relative"
        placeItems="center"
        width="full"
        height="80"
        bg="gray.200"
      >
        <input ref={inputRef} {...getInputProps()} />

        <div>Drag and drop to upload files</div>
      </Grid>

      {value ? (
        multiple ? (
          <MultiFilePreview value={value} onRemove={removeMultipleFiles} />
        ) : (
          <SingleFilePreview value={value} onRemove={removeSingleFile} />
        )
      ) : undefined}
    </VStack>
  );
};
