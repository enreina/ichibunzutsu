import type { NextPage } from 'next'
import Head from 'next/head'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useState} from 'react';

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
      <Box>
        <Typography variant="subtitle1">１文ずつ</Typography>
        <Typography variant="subtitle1">Ichi Bun Zutsu</Typography>
        <Typography variant="h4">僕は世界で一番弱い。</Typography>
        {isEnglishVisible && <Typography variant="h5">I am the weakest in the world.</Typography>}
        {!isEnglishVisible && <Button onClick={showEnglishButtonOnClick} variant="contained">英語を表示</Button>}
      </Box>
    </Container>
  );
};

export default Home
