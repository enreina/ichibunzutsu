import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useState } from "react";

const WANIKANI_TOKEN_LINK = "https://www.wanikani.com/settings/personal_access_tokens";
const TATOEBA_LINK = "https://tatoeba.org";
const API_KEY_LENGTH = 36;
const INVALID_API_KEY_ERROR_MESSAGE = "Invalid API key";
const isValidAPIKey = (apiKey: string) => {
  const regexExpForUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExpForUUID.test(apiKey);
};
const SettingsDialogText: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <DialogContentText sx={{marginTop: "16px", marginBottom: "16px"}}>{children}</DialogContentText>
);

const SettingsDialogTextGroup = ({isWaniKaniEnabled}: {isWaniKaniEnabled: boolean}) => {
  if (isWaniKaniEnabled) {
    return (<>
      <SettingsDialogText>You will practice reading Japanese sentences tailored to your WaniKani level.</SettingsDialogText>
      <SettingsDialogText>Please provide your API Key of your WaniKani account. You can get your key <Link target="_blank" rel="noopener" href={WANIKANI_TOKEN_LINK}>here</Link>.</SettingsDialogText>
    </>);
  }
  return (<>
    <SettingsDialogText>If you have a WaniKani account, enabling the WaniKani integration above is recommended.</SettingsDialogText>
    <SettingsDialogText>Otherwise, you can still proceed and practice reading with Japanese sentences from the <Link target="_blank" rel="noopener" href={TATOEBA_LINK}>Tatoeba</Link> project.</SettingsDialogText>
  </>);
};

const COPYWRITING = {
  "settings_dialog_text_1_wanikani_disabled": `If you have a WaniKani account, enabling the WaniKani integration above is recommended.`,
  "settings_dialog_text_2_wanikani_disabled": `Otherwise, you can still proceed and practice reading with Japanese sentences from the Tatoeba project.`,
  "settings_dialog_text_1_wanikani_enabled": `You will practice reading Japanese sentences tailored to your WaniKani level. `,
  "settings_dialog_text_2_wanikani_enabled": `Please provide your API Key of your WaniKani account. You can get your key here.`,
};

export type SettingsType = {
  isWaniKaniEnabled: boolean,
  validableAPIKey?: {
    value: string,
    isValid: boolean,
    errorMessage: string,
  },
};

export default function SettingsDialog({isOpen, onSubmit, isWaniKaniEnabled:  propsIsWaniKaniEnabled, waniKaniAPIKey: propsWaniKaniAPIKey}: 
  {
    isOpen: boolean, 
    onSubmit: (settings: SettingsType) => void, 
    isWaniKaniEnabled?: boolean, 
    waniKaniAPIKey?: string
  }) {
  const [settings, setSettings] = useState<SettingsType>({
    isWaniKaniEnabled: propsIsWaniKaniEnabled || false,
    validableAPIKey: propsWaniKaniAPIKey ? {value: propsWaniKaniAPIKey, isValid: isValidAPIKey(propsWaniKaniAPIKey), errorMessage: ""} : undefined,
  });

  const onWaniKaniIntegrationChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prevState => {
      const isValidableAPIKey = prevState.validableAPIKey ?? {
        value: "",
        isValid: false,
        errorMessage: "",
      };
      return {
        ...prevState,
        isWaniKaniEnabled: event.target.checked,
        isValidableAPIKey,
      };
    });
  };

  const onAPIKeyTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const isValid = isValidAPIKey(value);
    const errorMessage = value.length === API_KEY_LENGTH && !isValid ? INVALID_API_KEY_ERROR_MESSAGE : "";

    setSettings(prevState => ({
      ...prevState,
      validableAPIKey: {
        value,
        isValid,
        errorMessage,
      }
    }));
  };

  const onAPIKeyTextFieldBlur = (_: React.FocusEvent<HTMLInputElement>) => {
    setSettings(prevState => ({
      ...prevState,
      ...(prevState.validableAPIKey ? {
          validableAPIKey: {
            ...prevState.validableAPIKey,
            errorMessage: prevState.validableAPIKey?.isValid ? "" : INVALID_API_KEY_ERROR_MESSAGE,
          },
       }: {}),
    }));
  };

  const {isWaniKaniEnabled, validableAPIKey} = settings;

  const proceedButtonOnClick = () => {
    onSubmit(settings);
  }

  return (
      <Dialog open={isOpen}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <FormControlLabel control={<Switch checked={isWaniKaniEnabled} onChange={onWaniKaniIntegrationChanged} />} label="WaniKani integration is disabled" />
        <SettingsDialogTextGroup isWaniKaniEnabled={isWaniKaniEnabled} />  
        {isWaniKaniEnabled && <TextField
          autoFocus
          required
          error={validableAPIKey && validableAPIKey.errorMessage !== ""}
          helperText={validableAPIKey?.errorMessage}
          margin="dense"
          id="wanikani-api-key"
          label="WaniKani APIv2 Key"
          fullWidth
          variant="standard"
          value={validableAPIKey?.value || ""}
          onChange={onAPIKeyTextFieldChange}
          onBlur={onAPIKeyTextFieldBlur}
          inputProps={{maxLength: API_KEY_LENGTH}}
        />}
      </DialogContent>
      <DialogActions>
        <Button disabled={settings.isWaniKaniEnabled && !(validableAPIKey?.isValid)} onClick={proceedButtonOnClick}>Save Settings</Button>
      </DialogActions>
    </Dialog>
  );
}