import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Text, Separator, Portal } from "@chakra-ui/react";
import { VisibilityState } from "@tanstack/react-table";

interface ColumnOption {
  id: string;
  label: string;
  isDefault: boolean;
}

interface ColumnToggleProps {
  columns: ColumnOption[];
  visibility: VisibilityState;
  onVisibilityChange: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void;
}

export const ColumnToggle = ({
  columns,
  visibility,
  onVisibilityChange,
}: ColumnToggleProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const defaultColumns = useMemo(
    () => columns.filter((col) => col.isDefault),
    [columns]
  );

  const optionalColumns = useMemo(
    () => columns.filter((col) => !col.isDefault),
    [columns]
  );

  const hasAnyOptionalSelected = useMemo(
    () => optionalColumns.some((col) => visibility[col.id] === true),
    [optionalColumns, visibility]
  );

  // Close on click outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    // Delay adding listener to avoid closing on the same click that opened
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleToggle = useCallback(
    (columnId: string) => {
      onVisibilityChange((old) => ({
        ...old,
        [columnId]: !old[columnId],
      }));
    },
    [onVisibilityChange]
  );

  const handleReset = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const resetState: VisibilityState = {};
      optionalColumns.forEach((col) => {
        resetState[col.id] = false;
      });
      onVisibilityChange(resetState);
    },
    [optionalColumns, onVisibilityChange]
  );

  const handleTriggerClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <Button
        ref={triggerRef}
        variant="outline"
        size="sm"
        colorPalette="gray"
        onClick={handleTriggerClick}
        py={4.5}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        Columns
      </Button>

      {open && (
        <Portal>
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: triggerRef.current
                ? triggerRef.current.getBoundingClientRect().bottom + 4
                : 0,
              left: triggerRef.current
                ? triggerRef.current.getBoundingClientRect().left
                : 0,
              width: 220,
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
              zIndex: 9999,
              padding: "8px 0",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4px 12px 8px",
              }}
            >
              <Text fontSize="xs" fontWeight="600" color="gray.500">
                COLUMNS
              </Text>
              {hasAnyOptionalSelected && (
                <button
                  onClick={handleReset}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3182ce",
                    fontSize: 12,
                    cursor: "pointer",
                    padding: "2px 6px",
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            <Separator />

            {/* Default columns (always on) */}
            <div style={{ padding: "8px 12px 4px" }}>
              {defaultColumns.map((col) => (
                <div
                  key={col.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 0",
                    opacity: 0.6,
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "1.5px solid #cbd5e0",
                      borderRadius: 3,
                      background: "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <Text fontSize="sm" color="gray.600">
                    {col.label}
                  </Text>
                </div>
              ))}
            </div>

            <Separator />

            {/* Optional columns */}
            <div style={{ padding: "4px 12px 8px" }}>
              {optionalColumns.map((col) => {
                const isChecked = visibility[col.id] === true;
                return (
                  <div
                    key={col.id}
                    onClick={() => handleToggle(col.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 0",
                      cursor: "pointer",
                      borderRadius: 4,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f7fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        border: `1.5px solid ${isChecked ? "#3182ce" : "#cbd5e0"}`,
                        borderRadius: 3,
                        background: isChecked ? "#3182ce" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isChecked && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <Text fontSize="sm">{col.label}</Text>
                  </div>
                );
              })}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};
