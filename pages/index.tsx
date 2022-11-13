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
import APIKeyDialog from '../components/APIKeyDialog';
import useAPIKey from '../libs/hooks/useAPIKey';

const Home: NextPage = () => {
  const [isEnglishVisible, setIsEnglishVisible] = useState<Boolean>(false);
  const [apiKey, setAPIKey] = useAPIKey();
  const {sentence, isLoading, isError} = useSentence(apiKey, false);

  const showEnglishButtonOnClick: () => void = () => {
    setIsEnglishVisible(true);
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
        {sentence && (
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
        {(isLoading || !apiKey) && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        )}
        {(isError && !isLoading && apiKey) && (
          <>
            <Typography variant="h5" align="center">Could not fetch sentence from WaniKani</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" onClick={() => setAPIKey(null)}>Retry</Button>
            </Box>
          </>
        )}
      </Paper>

      {/* <APIKeyDialog isOpen={!apiKey} onSubmit={(apiKey) => setAPIKey(apiKey)} /> */}
      
    </Container>
  );
};

export default Home
