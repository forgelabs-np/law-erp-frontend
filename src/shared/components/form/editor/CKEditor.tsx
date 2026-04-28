import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor as CKEditor5 } from "@ckeditor/ckeditor5-react";
import { useController, useFormContext } from "react-hook-form";

import { CKEditorProps } from "@/shared/types";

import "@/shared/styles/editor.css";

export const CKEditor = ({ name }: CKEditorProps) => {
  const { control } = useFormContext();

  const { field } = useController({
    name,
    control,
  });

  const { value, onChange } = field;

  return (
    <CKEditor5
      editor={ClassicEditor}
      config={{
        toolbar: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "bold",
          "italic",
          "|",
          "numberedList",
          "bulletedList",
          "|",
          "blockQuote",
          "link",
        ],
      }}
      data={value}
      onBlur={(_, editor) => onChange(editor.getData())} // update this to onChange function based on your project requirement
    />
  );
};
