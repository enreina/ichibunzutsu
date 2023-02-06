import type { NextPage } from 'next';
import Head from 'next/head';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useSentence } from '../lib/hooks/useSentence';
import SettingsDialog from '../components/SettingsDialog';
import type { SettingsType } from '../components/SettingsDialog';
import useSavedSettings from '../lib/hooks/useSavedSettings';
import { useRouter } from 'next/router';
import AboutDialog from '../components/AboutDialog';
import { JapaneseSentenceElement } from '../components/JapaneseSentenceElement';
import { NavigationBar, NavItemType } from '../components/NavigationBar';

const navItems: NavItemType[] = [
  { key: 'about', text: 'About', href: '?about=1', as: '/about' },
  { key: 'settings', text: 'Settings', href: '?settings=1', as: '/settings' },
];

const Home: NextPage = () => {
  const [isEnglishVisible, setIsEnglishVisible] = useState<boolean>(false);
  const [savedSettings, setSavedSettings] = useSavedSettings();
  const { isWaniKaniEnabled, waniKaniAPIKey } = savedSettings || {};
  const { sentence, isLoading, isError, refetch } = useSentence(
    waniKaniAPIKey,
    isWaniKaniEnabled
  );
  const router = useRouter();
  const shouldOpenSettings = !!router.query.settings;
  const shouldOpenAbout = !!router.query.about;

  useEffect(() => {
    if (!savedSettings) {
      router.push('?settings=1', '/settings');
    }
  }, [savedSettings]);

  const showEnglishButtonOnClick: () => void = () => {
    setIsEnglishVisible(true);
  };

  const refetchSentence = () => {
    refetch();
    setIsEnglishVisible(false);
  };

  const errorRetryHandler = () => {
    //TODO: reopen settings dialog on unauthorized error
    refetchSentence();
  };

  const settingsSubmitHandler = (settings: SettingsType) => {
    setSavedSettings({
      ...savedSettings,
      isWaniKaniEnabled: settings.isWaniKaniEnabled,
      waniKaniAPIKey: settings.validableAPIKey?.value,
      isDarkModeEnabled: settings.isDarkModeEnabled,
    });
    router.push('/');
  };

  const closeDialogHandler = () => {
    router.push('/');
  };

  const navItemClickHandler = (item: NavItemType) => {
    router.push(item.href, item.as);
  };

  const sentenceIsLoaded = !isLoading && savedSettings && sentence;

  return (
    <Container maxWidth="lg">
      <Head>
        <title>
          Ichi Bun Zutsu - Practice Japanese reading, one sentence at a time
        </title>
        <meta
          name="description"
          content="A web app for Japanese reading practice -- one sentence at a time."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />

      <NavigationBar
        navItems={navItems}
        navItemClickHandler={navItemClickHandler}
      />

      <Paper sx={{ my: 4, p: { xs: 2, md: 3 } }}>
        {sentenceIsLoaded && (
          <>
            <Typography
              data-testid="japanese-sentence"
              component="h1"
              variant="h4"
              align="center"
            >
              <JapaneseSentenceElement sentence={sentence} />
            </Typography>
            {isEnglishVisible && (
              <Typography
                data-testid="english-sentence"
                variant="h5"
                align="center"
              >
                {sentence['en']}
              </Typography>
            )}
            {!isEnglishVisible && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  data-testid="show-english-button"
                  onClick={showEnglishButtonOnClick}
                  variant="contained"
                >
                  Show English
                </Button>
              </Box>
            )}
            <Box
              sx={{
                fontStyle: 'italic',
                marginTop: 2,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption">
                Hover or click on any kanji to show furigana
              </Typography>
            </Box>
          </>
        )}
        {(isLoading || !savedSettings) && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        )}
        {isError && savedSettings && (
          <>
            <Typography variant="h5" align="center">
              Could not fetch sentence
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" onClick={errorRetryHandler}>
                Retry
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {sentenceIsLoaded && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            sx={{ textTransform: 'none' }}
            onClick={refetchSentence}
            variant="text"
          >
            I want to read another sentence
          </Button>
        </Box>
      )}

      <SettingsDialog
        onClose={closeDialogHandler}
        isOpen={shouldOpenSettings}
        onSubmit={settingsSubmitHandler}
        savedSettings={savedSettings}
      />

      <AboutDialog isOpen={shouldOpenAbout} onClose={closeDialogHandler} />
    </Container>
  );
};

export default Home;
