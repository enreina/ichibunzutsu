import type { NextPage } from 'next'
import Head from 'next/head'
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useState, useEffect} from 'react';
import { AppBar, CssBaseline, IconButton, Toolbar } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useSentence, JapaneseSentenceElement } from '../lib/sentence';
import SettingsDialog from '../components/SettingsDialog';
import type { SettingsType } from '../components/SettingsDialog';
import useSavedSettings from '../lib/hooks/useSavedSettings';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AboutDialog from '../components/AboutDialog';
import MenuIcon from '@mui/icons-material/Menu';

const Home: NextPage = () => {
  const [isEnglishVisible, setIsEnglishVisible] = useState<boolean>(false);
  const [savedSettings, setSavedSettings] = useSavedSettings();
  const {isWaniKaniEnabled, waniKaniAPIKey} = savedSettings || {};
  const {sentence, isLoading, isError, refetch} = useSentence(waniKaniAPIKey, isWaniKaniEnabled);
  const router = useRouter();
  const shouldOpenSettings = !!router.query.settings;
  const shouldOpenAbout = !!router.query.about;

  useEffect(() => {
    if (!savedSettings) {
      router.push("?settings=1", "/settings");
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
    router.push("/");
  };

  const closeDialogHandler = () => {
    router.push("/");
  };

  const sentenceIsLoaded = !isLoading && savedSettings && sentence;

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Ichi Bun Zutsu - Practice Japanese reading, one sentence at a time</title>
        <meta name="description" content="A web app for Japanese reading practice -- one sentence at a time." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />

      <AppBar color="transparent" elevation={0} component="nav">
          <Container sx={{marginTop: 3}} maxWidth="lg">
            <Toolbar disableGutters>
              <Box sx={{flexGrow: 0, display:{xs: "none", md: "flex"}, visibility: "hidden"}}>
                <Link href="?about=1" as="/about"><Button sx={{textTransform: 'none'}} variant="text" disabled>About</Button></Link>
                <Link href="?settings=1" as="/settings"><Button sx={{textTransform: 'none'}} variant="text" disabled>Settings</Button></Link>
              </Box>
              <Box sx={{flexGrow: 0, display:{xs: "flex", md: "none"}, visibility: "hidden"}}><IconButton><MenuIcon/></IconButton></Box>
              <Box sx={{flexGrow: 1, display:"flex", flexDirection: "column"}}>
                <Typography variant="body2" color="text.secondary" align="center">１分ずつ</Typography>
                <Typography variant="body2" color="text.secondary" align="center">Ichi Bun Zutsu</Typography>
              </Box>
              <Box sx={{flexGrow: 0, display:{xs: "flex", md: "none"}}}>
                <IconButton 
                  aria-label="open menu bar"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit">
                  <MenuIcon/>
                </IconButton>
              </Box>
              <Box sx={{flexGrow: 0, display:{xs: "none", md: "flex"}}}>
                <Link href="?about=1" as="/about"><Button sx={{textTransform: 'none'}} variant="text">About</Button></Link>
                <Link href="?settings=1" as="/settings"><Button sx={{textTransform: 'none'}} variant="text">Settings</Button></Link>
              </Box>
            </Toolbar>
          </Container>
      </AppBar>

      <Toolbar />
      <Paper sx={{ my: 4, p: { xs: 2, md: 3 }}}>
        {sentenceIsLoaded && (
          <>
            <Typography component="h1" variant="h4" align="center"><JapaneseSentenceElement sentence={sentence} /></Typography>
            {isEnglishVisible && <Typography variant="h5" align="center">{sentence['en']}</Typography>}
            {!isEnglishVisible && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={showEnglishButtonOnClick} variant="contained">Show English</Button>
              </Box>
            )}
            <Box sx={{ fontStyle: 'italic', marginTop: 2, display: 'flex', justifyContent: 'center' }}>
              <Typography variant="caption">Hover or click on any kanji to show furigana</Typography>
            </Box>
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

      {sentenceIsLoaded && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button sx={{textTransform: 'none'}} onClick={refetchSentence} variant="text">I want to read another sentence</Button>
        </Box>
      )}

      <SettingsDialog 
        onClose={closeDialogHandler} 
        isOpen={shouldOpenSettings} 
        onSubmit={settingsSubmitHandler} 
        savedSettings={savedSettings} />

      <AboutDialog isOpen={shouldOpenAbout} onClose={closeDialogHandler}/>
    </Container>
  );
};

export default Home
