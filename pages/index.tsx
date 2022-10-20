import type { NextPage } from 'next'
import Head from 'next/head'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useState} from 'react';
import { CssBaseline } from '@mui/material';
import Paper from '@mui/material/Paper';

const Home: NextPage = () => {
  const [isEnglishVisible, setIsEnglishVisible] = useState<Boolean>(false);

  const showEnglishButtonOnClick: () => void = () => {
    setIsEnglishVisible(true);
  };

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Ichi Bun Zutsu</title>
        <meta name="description" content="A web app for Japanese reading practice -- one sentence a day." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />

      <Typography sx={{marginTop: 4}} variant="body2" color="text.secondary" align="center">１文ずつ</Typography>
      <Typography variant="body2" color="text.secondary" align="center">Ichi Bun Zutsu</Typography>

      <Paper sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }}}>
          <Typography component="h1" variant="h4" align="center">僕は世界で一番弱い。</Typography>
          {isEnglishVisible && <Typography variant="h5" align="center">I am the weakest in the world.</Typography>}
          {!isEnglishVisible && <Button onClick={showEnglishButtonOnClick} variant="contained" fullWidth>英語を表示</Button>}
      </Paper>
    </Container>
  );
};

export default Home
