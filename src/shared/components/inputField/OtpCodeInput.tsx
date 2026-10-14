import {
  Box,
  HStack,
  SystemStyleObject,
  useControllableState,
} from "@chakra-ui/react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  ChangeEvent,
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export type OtpCodeInputStatus = "idle" | "error" | "success";

export interface OtpCodeInputProps {
  /** Number of code slots. Defaults to 6. */
  length?: number;
  /** Controlled value. Omit together with `onChange` for uncontrolled usage. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Fired with the sanitised (digits only) code on every change. */
  onChange?: (code: string) => void;
  /** Fired once when the code reaches `length`. */
  onComplete?: (code: string) => void;
  /** Visual state owned by the parent (the parent owns the server response). */
  status?: OtpCodeInputStatus;
  /** Render digits as dots (e.g. one-time codes the user may share a screen). */
  mask?: boolean;
  /** Show the blinking caret on the active slot. Defaults to true. */
  caret?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Accessible name of the single code input. */
  ariaLabel?: string;
  className?: string;
  /** Name of the underlying input, for autofill/password managers. */
  name?: string;
}

type SlotState =
  | "idle"
  | "active"
  | "filled"
  | "error"
  | "success"
  | "disabled";

const NON_DIGIT = /\D/g;
const CARET_LAYOUT_ID = "otp-code-caret";

/** Digits only, capped at the configured length. */
const sanitizeCode = (raw: string, length: number) =>
  raw.replace(NON_DIGIT, "").slice(0, length);

const SLOT_BASE_CSS: SystemStyleObject = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 1,
  minWidth: 0,
  borderWidth: "1px",
  borderRadius: "xl",
  fontWeight: 600,
  transition:
    "border-color 150ms ease, background-color 150ms ease, color 150ms ease",
};

/** Slot colours use the project's theme tokens (primary / red / green). */
const SLOT_PALETTE: Record<SlotState, SystemStyleObject> = {
  idle: { borderColor: "gray.200", bg: "gray.50", color: "gray.900" },
  active: { borderColor: "primary.500", bg: "white", color: "gray.900" },
  filled: { borderColor: "primary.300", bg: "white", color: "gray.900" },
  error: { borderColor: "red.400", bg: "red.50", color: "red.700" },
  success: { borderColor: "green.400", bg: "green.50", color: "green.700" },
  disabled: { borderColor: "gray.200", bg: "gray.100", color: "gray.400" },
};

const SLOT_ACTIVE_RING: SystemStyleObject = {
  outlineWidth: "2px",
  outlineStyle: "solid",
  outlineOffset: "2px",
};

/**
 * The whole row is one click target: a single invisible input sits on top of
 * the decorative slots, so the code field keeps native keyboard behaviour
 * (arrows, Home/End, Backspace/Delete, paste, OS one-time-code autofill) and
 * exposes exactly one accessible control instead of six.
 */
const INPUT_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 2,
  width: "100%",
  height: "100%",
  margin: 0,
  padding: 0,
  border: "none",
  outline: "none",
  background: "transparent",
  color: "transparent",
  caretColor: "transparent",
  opacity: 0,
  cursor: "text",
  // Keeps iOS from zooming the viewport when the field is focused.
  fontSize: "16px",
};

const ERROR_DRAIN_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 1,
  transformOrigin: "top",
  pointerEvents: "none",
};

const SUCCESS_BADGE_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
};

const CARET_STYLE: CSSProperties = {
  position: "absolute",
  zIndex: 3,
  // No transforms: keeps framer-motion's layout transition clean.
  top: "28%",
  bottom: "28%",
  width: "2px",
  pointerEvents: "none",
};

const SR_ONLY_STYLE: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};

interface SlotProps {
  state: SlotState;
  /** Identity of the digit so a new digit replays the landing animation. */
  digitKey: string;
  showCaret: boolean;
  isActive: boolean;
}

const Slot = ({
  state,
  digitKey,
  showCaret,
  isActive,
  children,
}: PropsWithChildren<SlotProps>) => (
  <Box
    w={{ base: "38px", sm: "48px", md: "56px" }}
    h={{ base: "48px", sm: "56px", md: "64px" }}
    fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
    aria-hidden="true"
    css={SLOT_BASE_CSS}
    {...SLOT_PALETTE[state]}
    {...(isActive ? SLOT_ACTIVE_RING : {})}
  >
    {children ? (
      <motion.span
        key={digitKey}
        initial={{ y: -10, opacity: 0, scale: 0.85 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 480, damping: 30 }}
      >
        {children}
      </motion.span>
    ) : null}

    {showCaret ? (
      <motion.div
        layoutId={CARET_LAYOUT_ID}
        style={CARET_STYLE}
        animate={{ opacity: [1, 0.15, 1] }}
        transition={{
          layout: { type: "spring", stiffness: 500, damping: 34 },
          opacity: { duration: 1.1, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Box w="full" h="full" borderRadius="full" bg="primary.500" />
      </motion.div>
    ) : null}
  </Box>
);

const MASK_CHAR = "•";

/**
 * OtpCodeInput — reusable animated one-time-code field.
 *
 * Handles entry and UI only: it never talks to an API and never navigates. The
 * parent keeps ownership of the request, loading state, server error message
 * and success navigation, and drives the visual `status`.
 */
export const OtpCodeInput = ({
  length = 6,
  value,
  defaultValue,
  onChange,
  onComplete,
  status = "idle",
  mask = false,
  caret = true,
  disabled = false,
  autoFocus = false,
  ariaLabel = "Verification code",
  className,
  name,
}: OtpCodeInputProps) => {
  const [rawCode, setRawCode] = useControllableState({
    value,
    defaultValue: sanitizeCode(defaultValue ?? "", length),
    onChange,
  });

  // Always render a sanitised code, whatever the parent passes down.
  const code = sanitizeCode(rawCode ?? "", length);
  const isComplete = code.length === length;
  const isReadOnly = status === "success";

  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastCompletedRef = useRef<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [caretIndex, setCaretIndex] = useState(0);
  const statusId = useId();

  const activeIndex =
    isFocused && !disabled ? Math.max(0, Math.min(caretIndex, length - 1)) : -1;

  /**
   * The invisible input owns the real selection; this only mirrors it onto the
   * decorative slots. Clicking anywhere in the row jumps to the end of the
   * entered code, which is what users expect from a code field.
   */
  const placeCaretAfterCode = () => {
    const input = inputRef.current;
    if (!input) return;
    const nextIndex = Math.min(code.length, length);
    input.setSelectionRange(nextIndex, nextIndex);
    setCaretIndex(Math.max(0, Math.min(nextIndex, length - 1)));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // No `maxLength` on the input: a pasted string is sanitised and capped here
    // so a paste containing stray characters never loses trailing digits.
    setRawCode(sanitizeCode(event.target.value, length));
  };

  const handleSelect = () => {
    const input = inputRef.current;
    if (!input) return;
    setCaretIndex(Math.max(0, Math.min(input.selectionStart ?? 0, length - 1)));
  };

  const handleFocus = () => {
    setIsFocused(true);
    placeCaretAfterCode();
  };

  useEffect(() => {
    if (!autoFocus || disabled) return;
    inputRef.current?.focus();
  }, [autoFocus, disabled]);

  // Fires once per completed code, never again for the same value.
  useEffect(() => {
    if (code.length !== length) {
      lastCompletedRef.current = null;
      return;
    }
    if (lastCompletedRef.current === code) return;
    lastCompletedRef.current = code;
    onComplete?.(code);
  }, [code, length, onComplete]);

  const announcement = useMemo(() => {
    if (status === "success") return "Code verified.";
    if (status === "error") return "Incorrect code. Please try again.";
    if (isComplete) return `Code entered, ${length} of ${length} digits.`;
    return `${code.length} of ${length} digits entered.`;
  }, [code.length, isComplete, length, status]);

  const slots = Array.from({ length }, (_, index) => {
    const digit = code[index] ?? "";

    const state: SlotState = disabled
      ? "disabled"
      : status === "error"
        ? "error"
        : status === "success"
          ? "success"
          : index === activeIndex
            ? "active"
            : digit
              ? "filled"
              : "idle";

    return (
      <Slot
        key={index}
        state={state}
        digitKey={digit}
        isActive={index === activeIndex}
        showCaret={caret && index === activeIndex && !isComplete && !isReadOnly}
      >
        {digit ? (mask ? MASK_CHAR : digit) : ""}
      </Slot>
    );
  });

  return (
    <MotionConfig reducedMotion="user">
      <Box className={className} position="relative" w="100%">
        <motion.div
          style={{ width: "100%" }}
          animate={status}
          variants={{
            idle: { x: 0 },
            success: { x: 0 },
            error: {
              x: [0, -9, 9, -6, 6, 0],
              transition: { duration: 0.45, ease: "easeInOut" },
            },
          }}
        >
          <HStack
            position="relative"
            gap={{ base: "1.5", sm: "2", md: "3" }}
            css={{
              width: "fit-content",
              maxWidth: "100%",
              marginInline: "auto",
            }}
          >
            {slots}

            <input
              ref={inputRef}
              name={name}
              value={code}
              onChange={handleChange}
              onSelect={handleSelect}
              onFocus={handleFocus}
              onBlur={() => setIsFocused(false)}
              onClick={placeCaretAfterCode}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label={ariaLabel}
              aria-invalid={status === "error"}
              aria-describedby={statusId}
              disabled={disabled}
              readOnly={isReadOnly}
              style={INPUT_STYLE}
            />

            {status === "error" ? (
              <motion.div
                initial={{ scaleY: 1, opacity: 0.85 }}
                animate={{ scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={ERROR_DRAIN_STYLE}
              >
                <Box
                  position="absolute"
                  inset={0}
                  borderRadius="xl"
                  bg="red.100"
                />
              </motion.div>
            ) : null}
          </HStack>
        </motion.div>

        <AnimatePresence>
          {status === "success" ? (
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              style={SUCCESS_BADGE_STYLE}
              aria-hidden="true"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxSize="40px"
                borderRadius="full"
                bg="green.500"
                color="white"
                boxShadow="lg"
              >
                <Check size={22} strokeWidth={3} />
              </Box>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Box
          as="span"
          id={statusId}
          style={SR_ONLY_STYLE}
          role="status"
          aria-live="polite"
        >
          {announcement}
        </Box>
      </Box>
    </MotionConfig>
  );
};

export default OtpCodeInput;
