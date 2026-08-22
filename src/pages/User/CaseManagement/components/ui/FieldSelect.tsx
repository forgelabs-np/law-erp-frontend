import { Box } from "@chakra-ui/react";
import { ChangeEvent, ReactNode } from "react";

interface FieldSelectProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  /** CSS width of the select itself (defaults to full width). */
  w?: string;
}

/**
 * Small styled native <select>. Chakra v3's Select is a compound
 * component; a native select keeps forms simple and consistent with
 * the rest of the case management UI.
 */
export const FieldSelect = ({
  value,
  onChange,
  children,
  placeholder,
  disabled = false,
  size = "md",
  w = "100%",
}: FieldSelectProps) => {
  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      p={size === "sm" ? 1 : 2}
      bg="white"
      _focusWithin={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
      opacity={disabled ? 0.6 : 1}
    >
      <select
        value={value}
        disabled={disabled}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        style={{
          width: w,
          background: "transparent",
          outline: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          fontSize: size === "sm" ? "13px" : "14px",
        }}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {children}
      </select>
    </Box>
  );
};
