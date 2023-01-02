import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeContextProvider } from '../components/ThemeContext'
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="apple-mobile-web-app-title" content="Ichi Bun Zutsu" />
        <meta name="application-name" content="Ichi Bun Zutsu" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta name="theme-color" content="#23a6f0" />
      </Head>
      <ThemeContextProvider>
        <Component {...pageProps} />
      </ThemeContextProvider>
    </>;
}

export default MyApp
