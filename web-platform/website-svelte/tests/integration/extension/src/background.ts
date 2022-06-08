import { Rally, RunStates } from "@mozilla/rally-sdk";

const enableDevMode = false;
const rallySite = "http://localhost:5000";
const studyId = "facebookPixelHunt";

// TODO load from JSON file in /config/
const firebaseConfig = {
  apiKey: "abc123",
  authDomain: "demo-rally.firebaseapp.com",
  projectId: "demo-rally",
  storageBucket: "demo-rally.appspot.com",
  messagingSenderId: "abc123",
  appId: "1:123:web:abc123",
  functionsHost: "http://localhost:5001",
};

const enableEmulatorMode = true;

const stateChangeCallback = async (state) => {
  switch (state) {
    case RunStates.Running:
      console.log("Start data collection");
      console.log(`RallyID: ${rally.rallyId}`);
      break;
    case RunStates.Paused:
      console.log("Pause data collection");
      break;
    case RunStates.Ended:
      console.log("Pause data collection, study has ended");
      break;
    default:
      console.log("Unknown run state", state);
      break;
  }
};

const rally = new Rally({
  enableDevMode,
  stateChangeCallback,
  rallySite,
  studyId,
  firebaseConfig,
  enableEmulatorMode,
});
