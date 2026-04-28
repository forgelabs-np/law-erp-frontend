import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export type FormProviderProps<TFieldValues extends FieldValues> = {
  methods: UseFormReturn<TFieldValues>;
  children: React.ReactNode;
  onSubmit?: VoidFunction;
};
