// Purpose: The content script injects this file into the Youtube video, to send
// data from youtube page to content script.

export {};

const PATHS = [
  // '/get_midroll_info?', (seems to be phased out in favor of v1/player/ad_break)
  // '/watch?v=', (seems to be phased out in favor of v1/player)
  '/youtubei/v1/player/ad_break?', /* XHR */
  '/youtubei/v1/player?', /* fetch */
  '/youtubei/v1/next?', /* fetch */
  '/youtubei/v1/browse?' /* fetch */
];

declare var ytInitialPlayerResponse;
declare var ytInitialData;

// the initial data is sometimes baked into the HTML of the page,
// in variable ytInitialPlayerResponse or ytInitialData
// so we send that too!
setTimeout(() => {
  if (typeof ytInitialPlayerResponse !== 'undefined') {
    const data = {
      body: ytInitialPlayerResponse,
      url: window.location.href,
      hostUrl: window.location.href
    };
    console.debug(
      'sending ytInitialPlayerResponse data from YouTube page to content script',
      data
    );
    window.postMessage(data, '*');
  }

  if (typeof ytInitialData !== 'undefined') {
    const data = {
      body: ytInitialData,
      url: window.location.href,
      hostUrl: window.location.href
    };
    console.debug(
      'sending ytInitialData data from YouTube page to content script',
      data
    );
    window.postMessage(data, '*');
  }
}, 3000);

const cleanAndParse = text => JSON.parse(text.replace('for (;;);', ''));

console.debug('monkeypatching XHR and fetch');

// Monkeypatch XHR
const xhrLoadHandler = function() {
  if (
    !this.__xData ||
    !this.__xData.url ||
    (this.responseType !== 'text' && this.responseType !== '') ||
    !this.responseText
  )
    return;

  PATHS.forEach(path => {
    if (!this.__xData.url.includes(path)) return;

    let body;
    try {
      body = cleanAndParse(this.responseText);
    } catch (er) {
      console.debug('could not parse', this.responseText);
      console.error(er);
    }
    if (body)
      setTimeout(() => {
        const data = {
          body,
          url: this.__xData.url,
          hostUrl: window.location.href
        };
        console.debug('sending data from youtube page to content script', data);
        window.postMessage(data, '*');
      }, 250); // gives the content script time to register a listener.
  });
};

const { open, send } = XMLHttpRequest.prototype;

XMLHttpRequest.prototype.open = function(_method, url) {
  this.__xData = { url };
  return open.apply(this, arguments);
};

XMLHttpRequest.prototype.send = function(_postData) {
  this.onload = xhrLoadHandler;
  return send.apply(this, arguments);
};

// Monkeypatch window.fetch
const fetchLoadHandler = function(response) {
  const body = null;
  PATHS.forEach(path => {
    if (!response.url.includes(path)) return;
    const clonedResponse = response.clone(); // clone the response object so that the original response object is still "unread" by future consumers of the promise.

    clonedResponse
      .json()
      .then(body => {
        setTimeout(() => {
          const data = {
            body,
            url: clonedResponse.url,
            hostUrl: window.location.href
          };
          console.debug('sending data from YouTube page to content script', data);
          window.postMessage(data, '*');
        }, 250); // gives the content script time to register a listener.
      })
      .catch(er => {
        console.debug('could not parse', body);
        console.error(er);
      });
  });
};

const oldFetch = window.fetch;
window.fetch = function() {
  return Promise.resolve(
    oldFetch.apply(window, arguments).then(response => {
      fetchLoadHandler(response);
      return response;
    })
  );
};
