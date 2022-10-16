import { logEvent } from "firebase/analytics";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AttributionProvider } from "../services/AttributionService";
import { AuthenticationProvider } from "../services/AuthenticationService";
import { useFirebase } from "../services/FirebaseService";
import { FlagProvider } from "../services/FlagService";
import { StudiesProvider } from "../services/StudiesService";
import { UserDocumentProvider } from "../services/UserDocumentService";
import "../styles";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { analytics } = useFirebase();

  useEffect(() => {
    if (router.isReady) {
      // Log landing page
      logEvent(analytics, "page_view", {
        page_path: router.pathname,
      });

      // Log all transitions
      router.events.on("routeChangeComplete", () => {
        logEvent(analytics, "page_view", {
          page_path: router.pathname,
        });
      });
    }
  }, [analytics, router]);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
        <meta name="description" content="Mozilla Rally" />
        <link rel="icon" href="/favicon.svg" />

        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossOrigin="anonymous"
        />
      </Head>
      <FlagProvider>
        <AuthenticationProvider>
          <UserDocumentProvider>
            <AttributionProvider>
              <StudiesProvider>
                <Component {...pageProps} />
              </StudiesProvider>
            </AttributionProvider>
          </UserDocumentProvider>
        </AuthenticationProvider>
      </FlagProvider>
    </>
  );
}

export default MyApp;
