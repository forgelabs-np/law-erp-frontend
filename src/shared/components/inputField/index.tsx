import { Group, Input, InputAddon, mergeRefs, Stack } from "@chakra-ui/react";
import moment from "moment";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import NepaliInput from "react-nepali-input";

import { InputCalendarIcon } from "@/assets/svgs";
import { InputFieldProps } from "@/shared/types/inputfield";
import { capitalizeWords } from "@/shared/utils/captlizeWords";
import { priceWithComma } from "@/shared/utils/priceWithComma";

import { Field, InputGroup } from "../ui";
import { PasswordInput } from "./password-input";

const VALID_HEX_COLOR_REGEX = /^#([0-9A-F]{6})$/i;

const getCaretPositionFromDigitIndex = (
  formattedValue: string,
  digitIndex: number
) => {
  if (digitIndex <= 0) return 0;

  let digitCount = 0;

  for (let index = 0; index < formattedValue.length; index += 1) {
    if (/\d/.test(formattedValue[index])) {
      digitCount += 1;
    }

    if (digitCount === digitIndex) {
      return index + 1;
    }
  }

  return formattedValue.length;
};

const sanitizeColorCode = (rawValue: string) => {
  if (!rawValue) return "";

  const upperCased = rawValue.toUpperCase();
  const hasHash = upperCased.startsWith("#");
  const alphanumeric = upperCased.replace(/[^A-F0-9]/g, "").slice(0, 6);

  return hasHash ? `#${alphanumeric}` : alphanumeric;
};

const CustomCalenderInput = <T extends FieldValues>({
  field,
  onAdditionalChange,
  dateRef,
  placeholder,
}: {
  field: ControllerRenderProps<T, FieldPath<T>>;
  onAdditionalChange?: (e: string) => void;
  dateRef: RefObject<DatePicker | null>;
  placeholder?: string;
  disabled?: boolean;
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(field.value);
  }, [field]);

  return (
    <InputGroup
      width="full"
      onClick={() => dateRef.current?.onInputClick()}
      endElement={<InputCalendarIcon />}
    >
      <Input
        type={"text"}
        height={"48px"}
        fontSize={"14px"}
        variant="outline"
        borderColor={"#c2c2c2"}
        borderRadius={"lg"}
        required={false}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => {
          const newValue = e.target?.value;
          setValue(newValue);
        }}
        onBlur={() => {
          const formattedDate =
            moment(value).format("YYYY-MM-DD") !== "Invalid date"
              ? moment(value).format("YYYY-MM-DD")
              : "";
          setValue(formattedDate);
          field.onChange(formattedDate);
          if (onAdditionalChange)
            onAdditionalChange((formattedDate ?? "")?.toString());
        }}
        _readOnly={{
          backgroundColor: "gray.100",
          borderColor: "gray.1000",
        }}
        _disabled={{
          backgroundColor: "none",
          borderColor: "none",
          borderWidth: 0,
          paddingLeft: 0,
          opacity: "1",
        }}
      />
    </InputGroup>
  );
};

const CustomInput = <T extends FieldValues>({
  field,
  props,
  isInvalid,
  subtype,
  filterDate,
}: {
  field: ControllerRenderProps<T, FieldPath<T>>;
  props: InputFieldProps<T>;
  isInvalid: boolean;
  subtype: string;
  filterDate?: number;
}) => {
  const {
    onChange,
    value: fieldValue,
    ref: fieldRef,
    ...restFieldProps
  } = field;

  const controlledValue = fieldValue ?? "";

  const dateRef = useRef<DatePicker | null>(null);
  const numberInputRef = useRef<HTMLInputElement | null>(null);
  const desiredDigitCaretRef = useRef<number | null>(null);
  const isNumberInputFocusedRef = useRef(false);

  const {
    customRegex,
    name,
    placeholder = "",
    type = "text",
    capitalizeFirst = false,
    rightIcon,
    onAdditionalChange,
    handleChange,
    onAdditionalBlur,
    restrictSpace = false,
    restrictDecimal = false,
    hasColorPicker = false,
    formatWithCommas = false,
    ...otherProps
  } = props;

  // Function to capitalize the first letter of each word
  const capitalizeFirstLetter = (value: string) => {
    return value.replace(/(^|[. ])[a-z]/g, (char) => char.toUpperCase());
  };

  // Function to allow only alphabetic characters
  const allowOnlyAlphabets = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/[^a-zA-Z\s.]/g, "");
  };

  const handleInputChange = (inputValue: string) => {
    const isNumber = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;
    const isInputValueANumber = isNumber.test(inputValue) ?? false;

    let newValue = `${inputValue}`;

    if (!isInputValueANumber) {
      newValue = capitalizeFirst ? capitalizeWords(inputValue) : inputValue;
    }

    if (onAdditionalChange) {
      onAdditionalChange(newValue);
    }

    if (handleChange) {
      return handleChange(newValue);
    } else {
      return onChange(newValue);
    }
  };

  useLayoutEffect(() => {
    if (props.type !== "number" || !formatWithCommas) return;
    if (!isNumberInputFocusedRef.current) return;
    if (desiredDigitCaretRef.current === null) return;

    const input = numberInputRef.current;
    if (!input) return;

    const nextCaretPosition = getCaretPositionFromDigitIndex(
      input.value,
      desiredDigitCaretRef.current
    );

    input.setSelectionRange(nextCaretPosition, nextCaretPosition);
    desiredDigitCaretRef.current = null;
  }, [controlledValue, formatWithCommas, props.type]);

  // In InputField.tsx, add this before the date type check
  if (props.type === "datetime-local") {
    return (
      <Input
        {...restFieldProps}
        id={name}
        type="datetime-local"
        value={
          field.value ? moment(field.value).format("YYYY-MM-DDTHH:mm") : ""
        }
        onChange={(e) => {
          const newValue = e.target.value;
          field.onChange(newValue);
          if (onAdditionalChange) onAdditionalChange(newValue);
        }}
        onBlur={(e) => {
          field.onBlur();
          onAdditionalBlur?.(e.target.value);
        }}
        placeholder={placeholder}
        height={"48px"}
        fontSize={"14px"}
        variant="outline"
        borderRadius={"lg"}
        border={isInvalid ? "1px solid #E53E3E" : "1px solid #c2c2c2"}
        required={false}
        min={otherProps?.min}
        max={otherProps?.max}
        _readOnly={{
          backgroundColor: "gray.100",
          borderColor: "gray.1000",
        }}
        _disabled={{
          backgroundColor: "gray.200",
          borderColor: "gray.100",
          borderWidth: 1,
          paddingLeft: 0,
          opacity: "1",
          pl: "2",
        }}
        _focus={{
          borderColor: "gray.400",
        }}
      />
    );
  }
  if (props.type === "nepali") {
    return (
      <Group
        width="full"
        attached={!!rightIcon}
        css={{
          "& input": {
            height: "48px",
            width: "100%",
            border: otherProps.disabled ? "none" : "1px solid",
            borderColor: isInvalid
              ? "#E53E3E"
              : otherProps.readOnly
                ? "gray.1000"
                : "#c2c2c2",
            borderRadius: "8px",
            fontSize: "14px",
            paddingX: "12px",
            paddingLeft: otherProps.disabled ? "0px" : undefined,
            backgroundColor: otherProps.readOnly ? "gray.100" : "white",
          },
          "& input:focus-visible": {
            outlineColor: "#a3a2a2",
            boxShadow: "0 0 0 1px #a3a2a2",
          },
        }}
      >
        <NepaliInput
          placeholder={placeholder}
          name={name}
          id={name}
          value={controlledValue}
          readOnly={otherProps.readOnly}
          disabled={otherProps.disabled}
          setValue={(e: string) => {
            field.onChange(e);
            if (onAdditionalChange) onAdditionalChange(e);
          }}
          border={isInvalid ? "1px solid #E53E3E" : "1px solid #c2c2c2"}
        />
        {rightIcon && <InputAddon>{rightIcon}</InputAddon>}
      </Group>
    );
  }

  if (props.type === "password") {
    return (
      <PasswordInput
        id={name}
        placeholder={placeholder}
        {...field}
        value={controlledValue}
        {...otherProps}
        position="relative"
        pr={10}
        paddingY={1}
        height={"48px"}
        fontSize={"14px"}
        borderRadius={"lg"}
        required={false}
        width="full"
        _readOnly={{
          backgroundColor: "gray.100",
          borderColor: "gray.1000",
        }}
        border={"1px solid #c2c2c2"}
        _disabled={{
          backgroundColor: "none",
          borderColor: "none",
          borderWidth: 0,
          paddingLeft: 0,
          opacity: "1",
        }}
      />
    );
  }
  if (props.type === "number") {
    const inputValue = formatWithCommas
      ? priceWithComma(field?.value ?? "")
      : (field?.value ?? "");

    return (
      <Input
        {...restFieldProps}
        ref={mergeRefs(fieldRef, numberInputRef)}
        id={name}
        placeholder={placeholder}
        value={inputValue}
        readOnly={otherProps.readOnly}
        onKeyDown={(e) => {
          const allowedKeys = [
            "Backspace",
            "ArrowLeft",
            "ArrowRight",
            "Delete",
            "Tab",
            "Enter",
          ];
          if (e.ctrlKey || e.metaKey) return;
          if (allowedKeys.includes(e.key)) return;
          if (!/^\d$/.test(e.key)) {
            e.preventDefault();
            return;
          }
          if (otherProps.maxLength !== undefined) {
            const currentValue = (e.target as HTMLInputElement).value.replace(
              /[^0-9]/g,
              ""
            );
            if (currentValue.length >= Number(otherProps.maxLength)) {
              e.preventDefault();
            }
          }
        }}
        border={isInvalid ? "1px solid #E53E3E" : "1px solid #c2c2c2"}
        onFocus={() => {
          isNumberInputFocusedRef.current = true;
        }}
        onBlur={(e) => {
          isNumberInputFocusedRef.current = false;
          desiredDigitCaretRef.current = null;
          field.onBlur();
          onAdditionalBlur?.(e.target.value);
        }}
        onChange={(e) => {
          if (formatWithCommas) {
            desiredDigitCaretRef.current = e.target.value
              .slice(0, e.target.selectionStart ?? 0)
              .replace(/[^0-9]/g, "").length;
          }

          let raw = e.target.value.replace(/[^0-9]/g, "");
          if (otherProps.maxLength !== undefined) {
            raw = raw.slice(0, Number(otherProps.maxLength));
          }
          handleInputChange(raw);
        }}
        onPaste={(e) => {
          e.preventDefault();
          let pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
          if (otherProps.maxLength !== undefined) {
            pasted = pasted.slice(0, Number(otherProps.maxLength));
          }
          handleInputChange(pasted);
        }}
        borderWidth={props.disabled ? "0px" : "1px"}
        background={props.disabled ? "#EBEBEB" : ""}
        _readOnly={{ backgroundColor: "gray.100", borderColor: "gray.1000" }}
        height={"48px"}
        borderRadius={"lg"}
        _disabled={{
          backgroundColor: "gray.200",
          borderColor: "gray.100",
          borderWidth: 1,
          paddingLeft: 0,
          opacity: "1",
          pl: "2",
        }}
      />
    );
  }
  if (props.type === "date") {
    const isAllowedDate = (date: Date) => {
      return date.getDate() === filterDate;
    };

    return (
      <Stack
        gap={0}
        css={{
          "& .react-datepicker__header__dropdown--select select": {
            background: "transparent",
            marginY: 1,
          },
        }}
      >
        <DatePicker
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          id={name}
          ref={dateRef}
          placeholderText={placeholder ? `${placeholder} (yyyy-mm-dd)` : ""}
          selected={field.value ?? null}
          showPopperArrow={false}
          filterDate={
            filterDate
              ? isAllowedDate
              : () => {
                  return true;
                }
          }
          minDate={
            otherProps?.min != null
              ? new Date(otherProps.min?.toString())
              : undefined
          }
          maxDate={
            otherProps?.max != null
              ? new Date(otherProps.max?.toString())
              : undefined
          }
          dateFormat="yyyy/MM/dd"
          // onChange={(date: Date | null) => {
          //   field.onChange(date);

          //   if (onAdditionalChange && date) {
          //     onAdditionalChange(moment(date).format("YYYY-MM-DD"));
          //   }
          // }}
          onChange={(date: moment.MomentInput) => {
            const formattedDate = moment(date).format("YYYY-MM-DD");
            field.onChange(formattedDate);
            if (onAdditionalChange)
              onAdditionalChange((formattedDate ?? "")?.toString());
          }}
          customInput={
            <CustomCalenderInput
              field={field}
              placeholder={`${placeholder}`}
              onAdditionalChange={onAdditionalChange}
              dateRef={dateRef}
            />
          }
          disabled={otherProps.disabled}
        />
      </Stack>
    );
  }

  if (subtype === "name") {
    return (
      <Input
        {...restFieldProps}
        {...otherProps}
        value={controlledValue}
        id={name}
        placeholder={placeholder}
        type={type === "numberText" ? "text" : type}
        border={"1px solid #c2c2c2"}
        height={"48px"}
        fontSize={"14px"}
        variant="outline"
        borderRadius={"lg"}
        required={false}
        onInput={(e) => {
          allowOnlyAlphabets(e);
          const input = e.currentTarget;
          input.value = capitalizeFirstLetter(input.value);
        }}
        onChange={(e) => {
          handleInputChange(e?.target?.value);
        }}
        onBlur={(e) => {
          const blurValue = e?.target?.value;
          field.onBlur();
          onAdditionalBlur?.(blurValue);
        }}
        _readOnly={{
          backgroundColor: "gray.100",
          borderColor: "gray.1000",
        }}
        _disabled={{
          backgroundColor: "none",
          borderColor: "none",
          borderWidth: 0,
          paddingLeft: 0,
          opacity: "1",
        }}
      />
    );
  }
  if (hasColorPicker) {
    const colorPickerValue = VALID_HEX_COLOR_REGEX.test(controlledValue)
      ? controlledValue
      : "#000000";

    return (
      <Group width="full" attached>
        <Input
          {...restFieldProps}
          {...otherProps}
          value={controlledValue}
          id={name}
          placeholder={placeholder}
          type="text"
          height={"48px"}
          fontSize={"14px"}
          variant="outline"
          borderRadius={"lg"}
          border={isInvalid ? "1px solid #E53E3E" : "1px solid #c2c2c2"}
          required={false}
          onChange={(e) => {
            handleInputChange(sanitizeColorCode(e.target.value));
          }}
          onBlur={(e) => {
            const sanitized = sanitizeColorCode(e.target.value);
            const blurValue =
              sanitized && !sanitized.startsWith("#")
                ? `#${sanitized}`
                : sanitized;
            onChange(blurValue);
            field.onBlur();
            onAdditionalBlur?.(blurValue);
          }}
          _readOnly={{
            backgroundColor: "gray.100",
            borderColor: "gray.1000",
          }}
          _disabled={{
            backgroundColor: "gray.200",
            borderColor: "gray.100",
            borderWidth: 1,
            paddingLeft: 0,
            opacity: "1",
            pl: "2",
          }}
          // _focus={{
          //   borderColor: "gray.400",
          // }}
        />
        <Input
          type="color"
          value={colorPickerValue}
          onChange={(e) => handleInputChange(e.target.value.toUpperCase())}
          width="56px"
          minWidth="56px"
          padding="1"
          borderRadius="0 8px 8px 0"
          border="1px solid #c2c2c2"
          cursor={
            otherProps.disabled || otherProps.readOnly
              ? "not-allowed"
              : "pointer"
          }
          disabled={otherProps.disabled}
          readOnly={otherProps.readOnly}
        />
      </Group>
    );
  }
  return (
    <Group width="full" attached={!!rightIcon}>
      <Input
        {...restFieldProps}
        {...otherProps}
        value={
          formatWithCommas ? priceWithComma(controlledValue) : controlledValue
        }
        id={name}
        placeholder={placeholder}
        type={type === "numberText" ? "text" : type}
        height={"48px"}
        fontSize={"14px"}
        variant="outline"
        borderRadius={"lg"}
        border={isInvalid ? "1px solid #E53E3E" : "1px solid #c2c2c2"}
        required={false}
        onKeyDown={(event) => {
          // js regex test/match couldn't stop the space key
          if (restrictSpace && event.code === "Space") {
            event.preventDefault();
            return;
          }
          if (props.type === "numberText") {
            {
              const { key } = event;
              if (
                [
                  "Backspace",
                  "ArrowLeft",
                  "ArrowRight",
                  "Delete",
                  "Tab",
                  "Enter",
                ].includes(key)
              ) {
                return;
              }
              if (!isNaN(Number(key))) {
                return;
              }
              if (
                !restrictDecimal &&
                key === "." &&
                !event.currentTarget.value.includes(".")
              ) {
                return;
              }
              if (customRegex && key.match(customRegex)) {
                return;
              }
              event.preventDefault();
            }
          }
        }}
        onChange={(e) => {
          handleInputChange(e?.target?.value);
        }}
        onBlur={(e) => {
          const blurValue = e?.target?.value;
          field.onBlur();
          onAdditionalBlur?.(blurValue);
        }}
        _readOnly={{
          backgroundColor: "gray.100",
          borderColor: "gray.1000",
        }}
        _disabled={{
          backgroundColor: "gray.200",
          borderColor: "gray.100",
          borderWidth: 1,
          paddingLeft: 0,
          opacity: "1",
          pl: "2",
        }}
        _focus={{
          borderColor: "gray.400",
        }}
      />
      {rightIcon && <InputAddon>{rightIcon}</InputAddon>}
    </Group>
  );
};

const InputField = <T extends FieldValues = FieldValues>(
  props: InputFieldProps<T>
) => {
  const { required, filteredDate, ...fieldProps } = props;
  const {
    field,
    fieldState: { error },
  } = useController({ name: props.name, control: props.control });

  return (
    <Field
      label={props.label}
      invalid={!!error}
      required={required}
      errorText={error?.message}
    >
      <CustomInput
        field={field}
        props={fieldProps}
        isInvalid={!!error}
        subtype={props.subtype ?? ""}
        filterDate={filteredDate}
      />
    </Field>
  );
};

export default InputField;
