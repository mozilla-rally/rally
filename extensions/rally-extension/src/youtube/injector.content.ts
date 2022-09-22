export {};

// Inject the monkeypatch script into YouTube pages
(function() {
  const inject = () => {
    const script = document.createElement('script');
    script.src = browser.runtime.getURL('dist/youtube/yt.injected.js');
    script.onload = function() {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(script);

    console.log('Injected XHR and fetch monkeypatch script');
  };

  inject();
})();
