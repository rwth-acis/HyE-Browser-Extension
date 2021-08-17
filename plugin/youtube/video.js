// Todo: Pull from config
const SERVER_ROOT = "http://127.0.0.1:2201/youtube/watch?v=";
const DEFAULT_ID = "dQw4w9WgXcQ";

function log(msg)
{
    console.log("[HYE]", msg);
}

function err(err)
{
    console.log("[HYE Error]", err);
}

function swapRecs(newRecs)
{
    console.log(newRecs);
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
            log(e);
            continue;
        }
    }
    console.log(recs);
    for (let i = 0; i < recs.length; ++i)
    {
        try
        {
            let imgs =  recs[i].querySelectorAll("img");
            let links = recs[i].querySelectorAll("a");
            // let runtime = recs[i].querySelector(
            //   "ytd-thumbnail-overlay-time-status-renderer");
            if (links.length == 2)
                links[1].textContent = newRecs[i].rawDescription;
            else if (links.length >= 4)
            {
                links[2].textContent = newRecs[i].title;
                links[3].textContent = newRecs[i].channel;
            }
            else
                continue;
            links.forEach(link => { link.href = newRecs[i].link });
            // imgs[0].src = newRecs[i].thumbnail;
            // runtime.textContent = newRecs[i].runtime;
        } catch (e)
        {
            log(e);
            continue;
        }
    }
}

async function getRecs()
{
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function ()
    {
        log(this.readyState);
        if (this.readyState == 4 && this.status == 200)
        {
            swapRecs(JSON.parse(this.responseText));
            return;
        }
        else if (this.readyState == 4 && (this.status < 200 || this.status >= 300))
        {
            err(this.status);
            return;
        }
    };
    let query = window.location.href.split('?')[1];
    let vidId = DEFAULT_ID;
    if (query[0] == 'v')
    {
        vidId = query.split('=')[1];
        vidId = vidId.split('&')[0];
    }
    else
    {
        let i = 0;
        while (query[0] != 'v')
            query = window.location.href.split('&')[++i];
        vidId = query.split('=')[1];
    }
    xhttp.open("GET", SERVER_ROOT + vidId, true);
    log("Sending request to get recommendations: " + vidId);
    xhttp.send();
}

getRecs();
