import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useContext, useState } from 'react';
import type { SavedSettings } from '../lib/hooks/useSavedSettings';
import { useTheme } from '@mui/material/styles';
import { Divider, Typography } from '@mui/material';
import ThemeContext from './ThemeContext';

const WANIKANI_TOKEN_LINK =
  'https://www.wanikani.com/settings/personal_access_tokens';
const TATOEBA_LINK = 'https://tatoeba.org';
const API_KEY_LENGTH = 36;
const INVALID_API_KEY_ERROR_MESSAGE = 'Invalid API key';
const isValidAPIKey = (apiKey: string) => {
  const regexExpForUUID =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExpForUUID.test(apiKey);
};
const SettingsDialogText: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <DialogContentText sx={{ marginTop: '16px', marginBottom: '16px' }}>
    {children}
  </DialogContentText>
);

const SettingsDialogTextGroup = ({
  isWaniKaniEnabled,
}: {
  isWaniKaniEnabled: boolean;
}) => {
  if (isWaniKaniEnabled) {
    return (
      <>
        <SettingsDialogText>
          You will practice reading Japanese sentences tailored to your WaniKani
          level.
        </SettingsDialogText>
        <SettingsDialogText>
          Please provide your API Key of your WaniKani account. You can get your
          key{' '}
          <Link target="_blank" rel="noopener" href={WANIKANI_TOKEN_LINK}>
            here
          </Link>
          .
        </SettingsDialogText>
      </>
    );
  }
  return (
    <>
      <SettingsDialogText>
        If you have a WaniKani account, enabling the WaniKani integration above
        is recommended.
      </SettingsDialogText>
      <SettingsDialogText>
        Otherwise, you can still proceed and practice reading with Japanese
        sentences from the{' '}
        <Link target="_blank" rel="noopener" href={TATOEBA_LINK}>
          Tatoeba
        </Link>{' '}
        project.
      </SettingsDialogText>
    </>
  );
};

export type SettingsType = {
  isWaniKaniEnabled: boolean;
  validableAPIKey?: {
    value: string;
    isValid: boolean;
    errorMessage: string;
  };
  isDarkModeEnabled: boolean;
  isQuizModeEnabled: boolean;
};

export default function SettingsDialog({
  isOpen,
  onClose,
  onSubmit,
  savedSettings,
}: {
  isOpen: boolean;
  onClose?: () => void;
  onSubmit: (settings: SettingsType) => void;
  savedSettings?: SavedSettings | null;
}) {
  const initialSettings = {
    isWaniKaniEnabled: savedSettings?.isWaniKaniEnabled || false,
    validableAPIKey: savedSettings?.waniKaniAPIKey
      ? {
          value: savedSettings?.waniKaniAPIKey,
          isValid: isValidAPIKey(savedSettings?.waniKaniAPIKey),
          errorMessage: '',
        }
      : undefined,
    isDarkModeEnabled: savedSettings?.isDarkModeEnabled || false,
    isQuizModeEnabled: savedSettings?.isQuizModeEnabled || false,
  };
  const [settings, setSettings] = useState<SettingsType>(initialSettings);
  const {
    palette: { mode: themeMode },
  } = useTheme();
  const isDarkModeEnabled = themeMode === 'dark';
  const themeContext = useContext(ThemeContext);

  const onWaniKaniIntegrationChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings((prevState) => {
      const isValidableAPIKey = prevState.validableAPIKey ?? {
        value: '',
        isValid: false,
        errorMessage: '',
      };
      return {
        ...prevState,
        isWaniKaniEnabled: event.target.checked,
        isValidableAPIKey,
      };
    });
  };

  const onAPIKeyTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const isValid = isValidAPIKey(value);
    const errorMessage =
      value.length === API_KEY_LENGTH && !isValid
        ? INVALID_API_KEY_ERROR_MESSAGE
        : '';

    setSettings((prevState) => ({
      ...prevState,
      validableAPIKey: {
        value,
        isValid,
        errorMessage,
      },
    }));
  };

  const onAPIKeyTextFieldBlur = (_: React.FocusEvent<HTMLInputElement>) => {
    setSettings((prevState) => ({
      ...prevState,
      ...(prevState.validableAPIKey
        ? {
            validableAPIKey: {
              ...prevState.validableAPIKey,
              errorMessage: prevState.validableAPIKey?.isValid
                ? ''
                : INVALID_API_KEY_ERROR_MESSAGE,
            },
          }
        : {}),
    }));
  };

  const onDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    themeContext.toggleThemeMode();
    setSettings((prevState) => ({
      ...prevState,
      isDarkModeEnabled: event.target.checked,
    }));
  };

  const onQuizModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prevState) => ({
      ...prevState,
      isQuizModeEnabled: event.target.checked,
    }));
  };

  const proceedButtonOnClick = () => {
    onSubmit(settings);
  };

  const onDialogClose = () => {
    if (onClose) {
      onClose();
    }
    // return state to initial settings
    setSettings(initialSettings);
  };

  const { isWaniKaniEnabled, validableAPIKey, isQuizModeEnabled } = settings;

  return (
    <Dialog open={isOpen} onClose={onDialogClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Sentence Source
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isWaniKaniEnabled}
              onChange={onWaniKaniIntegrationChanged}
            />
          }
          label={`WaniKani integration is ${
            isWaniKaniEnabled ? 'enabled' : 'disabled'
          }`}
        />
        <SettingsDialogTextGroup isWaniKaniEnabled={isWaniKaniEnabled} />
        {isWaniKaniEnabled && (
          <TextField
            autoFocus
            required
            error={validableAPIKey && validableAPIKey.errorMessage !== ''}
            helperText={validableAPIKey?.errorMessage}
            margin="dense"
            id="wanikani-api-key"
            label="WaniKani APIv2 Key"
            fullWidth
            variant="standard"
            value={validableAPIKey?.value || ''}
            onChange={onAPIKeyTextFieldChange}
            onBlur={onAPIKeyTextFieldBlur}
            inputProps={{ maxLength: API_KEY_LENGTH }}
          />
        )}
        <Typography variant="subtitle1" gutterBottom>
          Quiz Mode
        </Typography>
        <FormControlLabel
          control={
            <Switch checked={isQuizModeEnabled} onChange={onQuizModeChange} />
          }
          label={`Quiz mode is ${isQuizModeEnabled ? 'enabled' : 'disabled'}`}
        />
        <SettingsDialogText>
          With the quiz mode enabled, you can practice by typing out the reading
          before comparing to the correct reading.
        </SettingsDialogText>
        <Divider sx={{ marginBottom: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Appearance
        </Typography>
        <FormControlLabel
          control={
            <Switch checked={isDarkModeEnabled} onChange={onDarkModeChange} />
          }
          label={`Dark mode is ${isDarkModeEnabled ? 'enabled' : 'disabled'}`}
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={settings.isWaniKaniEnabled && !validableAPIKey?.isValid}
          onClick={proceedButtonOnClick}
        >
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
}
