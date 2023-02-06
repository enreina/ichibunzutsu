import type { NextPage } from 'next';
import Head from 'next/head';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState, useEffect, ChangeEventHandler } from 'react';
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
import AnswerInput from '../components/AnswerInput';

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
  const [answer, setAnswer] = useState<string>('');
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

  const answerInputChangeHandler: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = ({ target: { value } }) => {
    setAnswer(value);
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
            {!isEnglishVisible && (
              <AnswerInput
                fullWidth
                autoComplete="off"
                autoFocus={true}
                variant="standard"
                onChange={answerInputChangeHandler}
                sx={{ my: 3 }}
                placeholder="Type the reading here"
                inputProps={{
                  sx: {
                    textAlign: 'center',
                    fontSize: '24px',
                  },
                }}
              />
            )}
            {isEnglishVisible && (
              <>
                <Typography
                  sx={{
                    my: 3,
                    borderBottom: 1,
                    fontSize: '24px',
                    height: '1.4375em',
                    pt: '4px',
                    pb: '5px',
                  }}
                  component="h2"
                  variant="h5"
                  align="center"
                >
                  {answer}
                </Typography>
                <Typography
                  data-testid="english-sentence"
                  variant="h5"
                  align="center"
                >
                  {sentence['en']}
                </Typography>
              </>
            )}
            {!isEnglishVisible && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  data-testid="show-english-button"
                  onClick={showEnglishButtonOnClick}
                  variant="contained"
                >
                  Show Answer
                </Button>
              </Box>
            )}
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
