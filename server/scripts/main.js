const UPLOAD_LINK = "/youtube/cookies";

function uploadCookies(e)
{
    let cookies = [];
    let items = document.querySelector("#cookieList").childNodes;
    for (let i = 0; i < items.length; ++i)
    {
        if (typeof items[i].innerHTML === "undefined")
            continue;
        cookies.push(JSON.parse(items[i].innerHTML));
    }
    e.preventDefault();
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
        {
            console.log(this.responseText);
            return;
        }
        else if (this.readyState == 4 && (this.status < 200 || this.status >= 300))
        {
            console.log(this.status);
            return;
        }
    };
    xhttp.open("POST", UPLOAD_LINK, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    console.log("Sending request to update cookies");
    console.log(cookies);
    xhttp.send(JSON.stringify({'cookies': cookies}));
}

document.querySelector("#upload").addEventListener("click", uploadCookies, false);
