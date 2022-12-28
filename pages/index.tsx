import type { NextPage } from 'next'
import Head from 'next/head'
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useState, useEffect} from 'react';
import { AppBar, CssBaseline, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useSentence } from '../lib/hooks/useSentence';
import SettingsDialog from '../components/SettingsDialog';
import type { SettingsType } from '../components/SettingsDialog';
import useSavedSettings from '../lib/hooks/useSavedSettings';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AboutDialog from '../components/AboutDialog';
import MenuIcon from '@mui/icons-material/Menu';
import { JapaneseSentenceElement } from '../components/JapaneseSentenceElement';

type NavItemType = {
  key: string,
  text: string,
  href: string, 
  as: string,
};

const navItems: NavItemType[] = [
  {key: "about", text: "About", href: "?about=1", as: "/about"},
  {key: "settings", text: "Settings", href: "?settings=1", as:"/settings"},
];

const NavigationLinks = ({navItems}: {navItems: NavItemType[]}) => {
  return <>
    {navItems.map((navItem) => (
      <Link href={navItem.href} as={navItem.as}>
        <Button sx={{textTransform: 'none'}} variant="text">{navItem.text}</Button>
      </Link>
    ))}
  </>;
};

const NavigationList = ({navItems, onNavigationItemClick}: {navItems: NavItemType[], onNavigationItemClick: (navItem: NavItemType) => void}) => {
  return <List>
    {navItems.map((item) => (
      <ListItem key={item.key} disablePadding>
        <ListItemButton onClick={() => onNavigationItemClick(item)} sx={{ textAlign: 'center' }}>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    ))}
  </List>;
};

const Home: NextPage = () => {
  const [isDrawerMenuOpen, setIsDrawerMenuOpen] = useState<boolean>(false);
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

  const navItemClickHandler = (item: NavItemType) => {
    router.push(item.href, item.as);
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
              {/* To ensure the center box is centered */}
              <Box sx={{flexGrow: 0, display:{xs: "none", md: "flex"}, visibility: "hidden"}}>
                <NavigationLinks navItems={navItems} />
              </Box>
              <Box sx={{flexGrow: 0, display:{xs: "flex", md: "none"}, visibility: "hidden"}}><IconButton><MenuIcon/></IconButton></Box>

              {/* App Name in Middle */}
              <Box sx={{flexGrow: 1, display:"flex", flexDirection: "column"}}>
                <Typography variant="body2" color="text.secondary" align="center">一文ずつ</Typography>
                <Typography variant="body2" color="text.secondary" align="center">Ichi Bun Zutsu</Typography>
              </Box>

              {/* Menu Icon only on mobile view */}
              <Box sx={{flexGrow: 0, display:{xs: "flex", md: "none"}}}>
                <IconButton 
                  aria-label="open menu bar"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={() => setIsDrawerMenuOpen(true)}>
                  <MenuIcon/>
                </IconButton>
              </Box>
              {/* Menu on dekstop view */}
              <Box sx={{flexGrow: 0, display:{xs: "none", md: "flex"}}}>
                <NavigationLinks navItems={navItems} />
              </Box>
            </Toolbar>
          </Container>
      </AppBar>

      <Box component="nav" onClick={() => setIsDrawerMenuOpen(false)}>
        <Drawer
          anchor="right"
          open={isDrawerMenuOpen}
          variant="temporary"
          ModalProps={{keepMounted: true}}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}>
            <Box>
              <NavigationList navItems={navItems} onNavigationItemClick={navItemClickHandler} />
            </Box>
        </Drawer>
      </Box>

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
