function addCookie(cookie)
{
    let item = document.createElement("li");
    item.innerHTML = `${JSON.stringify(cookie)}`;
    document.querySelector("#cookieList").appendChild(item);
}

function printCookies(storageObj)
{
    ytCookies = storageObj["ytCookies"];
    console.log("Got cookies", ytCookies);
    let msgBox = document.querySelector("#tempMsg");
    if (typeof ytCookies === "undefined" || ytCookies.length === 0)
        msgBox.innerHTML = "No cookies";
    else
    {
        msgBox.parentNode.removeChild(msgBox);
        ytCookies.forEach(addCookie);
    }
}

browser.storage.local.get("ytCookies", printCookies);
