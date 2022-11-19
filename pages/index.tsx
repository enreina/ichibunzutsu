import type { NextPage } from 'next'
import Head from 'next/head'
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useState} from 'react';
import { CssBaseline } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useSentence } from '../libs/sentence';
import SettingsDialog from '../components/SettingsDialog';
import type { SettingsType } from '../components/SettingsDialog';
import useSavedSettings from '../libs/hooks/useSavedSettings';

const Home: NextPage = () => {
  const [isEnglishVisible, setIsEnglishVisible] = useState<Boolean>(false);
  const [savedSettings, setSavedSettings] = useSavedSettings();
  const {isWaniKaniEnabled, waniKaniAPIKey} = savedSettings || {};
  const {sentence, isLoading, isError, refetchSentence} = useSentence(waniKaniAPIKey, isWaniKaniEnabled);

  const showEnglishButtonOnClick: () => void = () => {
    setIsEnglishVisible(true);
  };

  const errorRetryHandler = () => {
      refetchSentence();
  };

  const settingsSubmitHandler = (settings: SettingsType) => {
    setSavedSettings({
      isWaniKaniEnabled: settings.isWaniKaniEnabled,
      waniKaniAPIKey: settings.validableAPIKey?.value,
    });
  };

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Ichi Bun Zutsu</title>
        <meta name="description" content="A web app for Japanese reading practice -- one sentence at a time." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />
      <Typography sx={{marginTop: 4}} variant="body2" color="text.secondary" align="center">１文ずつ</Typography>
      <Typography variant="body2" color="text.secondary" align="center">Ichi Bun Zutsu</Typography>

      <Paper sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }}}>
        {!isLoading && savedSettings && sentence && (
          <>
            <Typography component="h1" variant="h4" align="center">{sentence['ja']}</Typography>
            {isEnglishVisible && <Typography variant="h5" align="center">{sentence['en']}</Typography>}
            {!isEnglishVisible && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={showEnglishButtonOnClick} variant="contained">Show English</Button>
              </Box>
            )}
          </>
        )}
        {(isLoading || (!savedSettings)) && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        )}
        {(isError && savedSettings) && (
          <>
            <Typography variant="h5" align="center">Could not fetch sentence</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" onClick={errorRetryHandler}>Retry</Button>
            </Box>
          </>
        )}
      </Paper>
      <SettingsDialog isOpen={!savedSettings} onSubmit={settingsSubmitHandler} />
    </Container>
  );
};

export default Home
