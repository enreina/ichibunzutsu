import { TextField, TextFieldProps } from '@mui/material';
import { ChangeEventHandler, useRef, useState } from 'react';
import { toKana } from 'wanakana';

export default function AnswerInput({
  value,
  onChange,
  ...props
}: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [convertedValue, setConvertedValue] = useState<string>(
    toKana(value, { IMEMode: true })
  );

  const extendedOnChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setConvertedValue(toKana(e.target.value, { IMEMode: true }));
    if (onChange) onChange(e);
  };

  return (
    <TextField
      inputRef={inputRef}
      onChange={extendedOnChange}
      value={convertedValue}
      {...props}
    />
  );
}
