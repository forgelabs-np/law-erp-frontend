import { Box } from "@chakra-ui/react";
import { ChangeEvent, ReactNode } from "react";

interface FieldSelectProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  /** CSS width of the select itself (defaults to full width). */
  w?: string;
}

/**
 * Small styled native <select>. Chakra v3's Select is a compound
 * component; a native select keeps forms simple and consistent with
 * the rest of the case management UI.
 *
 * `size="lg"` renders the taller, card-form variant used by the
 * Create Matter wizard. The default `sm` / `md` rendering is unchanged.
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
  const isLarge = size === "lg";

  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius={isLarge ? "lg" : "md"}
      p={isLarge ? undefined : size === "sm" ? 1 : 2}
      px={isLarge ? 3 : undefined}
      minH={isLarge ? "46px" : undefined}
      display={isLarge ? "flex" : undefined}
      alignItems={isLarge ? "center" : undefined}
      bg="white"
      transition={isLarge ? "all 0.18s ease" : undefined}
      _hover={isLarge && !disabled ? { borderColor: "gray.300" } : undefined}
      _focusWithin={{
        borderColor: isLarge ? "primary.500" : "blue.400",
        boxShadow: isLarge ? "0 0 0 3px #E3E7FC" : "0 0 0 1px blue.400",
      }}
      opacity={disabled ? 0.6 : 1}
    >
      <select
        value={value}
        disabled={disabled}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value)
        }
        style={{
          width: w,
          background: "transparent",
          outline: "none",
          // Only the `lg` card variant drops the native control border, so the
          // existing sm/md rendering stays byte-identical for other callers.
          border: isLarge ? "none" : undefined,
          cursor: disabled ? "not-allowed" : "pointer",
          fontSize: isLarge ? "15px" : size === "sm" ? "13px" : "14px",
        }}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {children}
      </select>
    </Box>
  );
};
