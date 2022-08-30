import validate from "./utils/validate";

// Listen for messages from the injected script on YouTube
window.addEventListener("message", ({source, data}) => {
  if (source === window) {
    try {
      validate(data);
      console.time('yt-scanner');
      console.timeEnd('yt-scanner');
    } catch (err) {
      if (!err.includes("Invalid Data")) {
        console.debug('Unexpected error');
        console.error(err);
        console.timeEnd('yt-scanner');
      }
    }
  }
});