"use client";

import type * as stylex from "@stylexjs/stylex";

import {
  InputGroup,
  InputGroupInput,
  inputGroupSizes,
} from "@/components/primitives/input-group";
import type {
  InputGroupInputProps,
  InputGroupSize,
} from "@/components/primitives/input-group";

const inputSizes = inputGroupSizes;

type InputSize = InputGroupSize;

// `sx` styles the box; every other prop goes to the input inside it.
type InputProps = Omit<InputGroupInputProps, "sx"> & {
  size?: InputSize;
  sx?: stylex.StyleXStyles;
};

function Input({ size = "default", sx, ...props }: InputProps) {
  return (
    // A lone input is no group of controls.
    <InputGroup role="none" size={size} sx={sx}>
      <InputGroupInput {...props} />
    </InputGroup>
  );
}

export { Input, inputSizes };
export type { InputProps, InputSize };
