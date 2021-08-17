// TODO: Pull from config
const SERVER_ROOT = "http://127.0.0.1:2201/";

function handleStored()
{
    console.log("Stored cookies");
}

function storeCookies(cookies)
{
    console.log(cookies);
    browser.storage.local.set({"ytCookies": cookies}, handleStored);
}

function handleError(err)
{
    console.log(err);
}

function openPage() {
    console.log("Getting cookies");
    browser.cookies.getAll({"domain": ".youtube.com"}).then(storeCookies,
      handleError);
    browser.tabs.create({
      url: SERVER_ROOT
    });
}

browser.browserAction.onClicked.addListener(openPage);
