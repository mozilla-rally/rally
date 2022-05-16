process.on('unhandledRejection', (err) => {
    console.log(err);
});
chrome.runtime.id = "test-id";
