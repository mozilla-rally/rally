import { useFirebase } from "./FirebaseService";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const PUBLIC_RECAPTCHA_V3_KEY = "PUBLIC KEY GOES HERE";

export interface ReCaptchaDataContext {
    // Loading flag for all reCaptcha feature.
    isReCaptchaLoaded: boolean;
}

let context: ReCaptchaDataContext | null = null;

export function useReCaptcha() {
    if (!context) {
        const { app } = useFirebase();

        if (typeof window !== "undefined") {
            // Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
            // key is the counterpart to the secret key you set in the Firebase console.

            // @ts-ignore
            // Uncomment this to run in debug mode
            // self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
            initializeAppCheck(app, {
                provider: new ReCaptchaV3Provider(PUBLIC_RECAPTCHA_V3_KEY),

                // Optional argument. If true, the SDK automatically refreshes App Check
                // tokens as needed.
                isTokenAutoRefreshEnabled: true
            });
        }
    }

    return context;
}

