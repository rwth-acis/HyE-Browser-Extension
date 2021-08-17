const config = require('../lib/config.js');
const util = require('../lib/util.js');

function swapRecs(newRecs)
{
    let candidates = document.querySelectorAll("ytd-thumbnail");
    let recs = [];
    for (let i = 0; i < candidates.length && i < newRecs.length; ++i)
    {
        elem = candidates[i];
        try
        {
            recs.push(elem.parentElement);
        } catch (e)
        {
            util.err(e);
            continue;
        }
    }
    for (let i = 0; i < recs.length; ++i)
    {
        try
        {
            let imgs = recs[i].querySelectorAll("img");
            let links = recs[i].querySelectorAll("a");
            // let runtime = recs[i].querySelector(
            //   "ytd-thumbnail-overlay-time-status-renderer");
            imgs[0].src = newRecs[i].thumbnailImg;
            imgs[1].src = newRecs[i].avatarImg;
            links[0].href = newRecs[i].thumbnailLink;
            links[1].href = newRecs[i].avatarLink;
            links[2].href = newRecs[i].titleLink;
            links[2].text = newRecs[i].title;
            links[3].href = newRecs[i].userLink;
            links[3].text = newRecs[i].user;
            // runtime.textContent = newRecs[i].runtime;
        } catch (e)
        {
            util.err(e);
            continue;
        }
    }
}

let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function ()
{
    util.log(this.readyState);
    if (this.readyState == 4 && this.status == 200)
    {
        swapRecs(JSON.parse(this.responseText));
    }
    else if (this.readyState == 4 && (this.status < 200 || this.status >= 300))
    {
        util.err(this.status);
    }
};
xhttp.open("GET", config.root, true);
util.log("Sending request to get recommendations");
xhttp.send();
