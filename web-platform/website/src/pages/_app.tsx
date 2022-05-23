import type { AppProps } from 'next/app';
import Head from "next/head";
import { AuthenticationProvider } from "../services/AuthenticationService";
import "../styles";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
        <meta name="description" content="Mozilla Rally" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <AuthenticationProvider>
        <Component {...pageProps} />
      </AuthenticationProvider>
    </>
  );
}

export default MyApp;
