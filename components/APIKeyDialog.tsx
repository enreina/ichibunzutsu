import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import { useState } from "react";

const WANIKANI_TOKEN_LINK = "https://www.wanikani.com/settings/personal_access_tokens";
const API_KEY_LENGTH = 36;
const INVALID_API_KEY_ERROR_MESSAGE = "Invalid API key";
const isValidAPIKey = (apiKey: string) => {
  const regexExpForUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExpForUUID.test(apiKey);
}

export default function APIKeyDialog({isOpen, onSubmit}: {isOpen: boolean, onSubmit: (apiKey: string) => void}) {
  const [validableAPIKey, setValidableAPIKey] = useState<{
    value: string,
    isValid: boolean,
    errorMessage: string,
  }>({
    value: "",
    isValid: false,
    errorMessage: "",
  });

  const onAPIKeyTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const isValid = isValidAPIKey(value);
    const errorMessage = value.length === API_KEY_LENGTH && !isValid ? INVALID_API_KEY_ERROR_MESSAGE : "";

    setValidableAPIKey(prevState => ({
      ...prevState,
      value,
      isValid,
      errorMessage,
    }));
  };

  const onAPIKeyTextFieldBlur = (_: React.FocusEvent<HTMLInputElement>) => {
    setValidableAPIKey(prevState => ({
      ...prevState,
      errorMessage: prevState.isValid ? "" : INVALID_API_KEY_ERROR_MESSAGE,
    }));
  };

  const {value, isValid, errorMessage} = validableAPIKey;

  const proceedButtonOnClick = () => {
    onSubmit(value);
    // clear state
    setValidableAPIKey({
      value: "",
      isValid: false,
      errorMessage: "",
    });
  }

  return (
      <Dialog open={isOpen}>
      <DialogTitle>Please input your WaniKani API Key</DialogTitle>
      <DialogContent>
        <DialogContentText>
          We currently fetch Japanese sentences from WaniKani. If you already have a WaniKani account, your API Key can be found <Link target="_blank" rel="noopener" href={WANIKANI_TOKEN_LINK}>here</Link>.
        </DialogContentText>
        <TextField
          autoFocus
          required
          error={errorMessage !== ""}
          helperText={errorMessage}
          margin="dense"
          id="wanikani-api-key"
          label="WaniKani APIv2 Key"
          fullWidth
          variant="standard"
          value={value}
          onChange={onAPIKeyTextFieldChange}
          onBlur={onAPIKeyTextFieldBlur}
          inputProps={{maxLength: API_KEY_LENGTH}}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={!isValid} onClick={proceedButtonOnClick}>Proceed</Button>
      </DialogActions>
    </Dialog>
  );
}