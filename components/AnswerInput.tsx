import { TextField, TextFieldProps } from '@mui/material';
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useRef,
  useState,
} from 'react';
import { toKana } from 'wanakana';

export default function AnswerInput({
  value,
  onChange,
  onEnter,
  onKeyDown,
  ...props
}: TextFieldProps & { onEnter?: () => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [convertedValue, setConvertedValue] = useState<string>(
    toKana(value, { IMEMode: true })
  );

  const extendedOnChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const convertedValue = toKana(e.target.value, { IMEMode: true });
    setConvertedValue(convertedValue);
    if (inputRef.current) inputRef.current.value = convertedValue;
    if (onChange) onChange(e);
  };

  const extendedOnKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onEnter) onEnter();
    }
    if (onKeyDown) onKeyDown(e);
  };

  return (
    <TextField
      inputRef={inputRef}
      onChange={extendedOnChange}
      onKeyDown={extendedOnKeyDown}
      value={convertedValue}
      {...props}
    />
  );
}
