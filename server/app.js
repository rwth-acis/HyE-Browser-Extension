const app = require('express')();
const path = require('path');
const bodyParser = require('body-parser');
const yt = require('./lib/youtube.js');
const util = require('./lib/util.js');
const cookies = require('./etc/cookies.json');
const headers = require('./etc/headers.json');

const YOUTUBE = "https://www.youtube.com/";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var host = "127.0.0.1";
var port = "2201";
parseArgs(process.argv.slice(2));

function parseArgs(args) {
    for (let i = 0; i < args.length; ++i)
    {
        switch (args[i]) {
            case '--host':
                ++i;
                if (i > args.length || args[i].slice(0,2) === "--")
                {
                    util.log("Error: No host specified");
                    break;
                }
                host = args[i];
                break;
            case '--port':
                ++i;
                if (i > args.length || args[i].slice(0,2) === "--")
                {
                    util.log("Error: No port specified");
                    break;
                }
                port = args[i];
                break;
            case '--verbose':
                util.setDebug(true);
                break;
        }
    }
}

app.get('/', function(req, res) {
    res.setHeader('content-type', 'text/html');
    res.status(200).sendFile(path.join(__dirname, 'views/main.html'));
})

app.get('/main/script.js', function(req, res) {
    res.setHeader('content-type', 'application/javascript');
    res.status(200).sendFile(path.join(__dirname, 'scripts/main.js'));
})

app.get('/main/style.css', function(req, res) {
    res.setHeader('content-type', 'text/css');
    res.status(200).sendFile(path.join(__dirname, 'style/main.css'));
})

app.get('/youtube/watch', async function(req, res) {
    if (typeof req.query["v"] === "undefined")
    {
        res.status("400").send("Missing video ID");
        return;
    }
    let videoId = req.query["v"];
    util.debug("Handling " + videoId);
    res.setHeader('content-type', 'application/json');
    res.setHeader('access-control-allow-origin', 'https://www.youtube.com/');
    // let cookies = await cookies.parseCookies(req.body.cookies);
    let recommendations = await yt.video(videoId, headers, cookies);
    util.debug(recommendations);
    res.send(recommendations);
})

app.get('/youtube', async function(req, res) {
    util.debug("Handling main page");
    res.setHeader('content-type', 'application/json');
    res.setHeader('access-control-allow-origin', 'https://www.youtube.com/');
    // let cookies = await cookies.parseCookies(req.body.cookies);
    let recommendations = await yt.mainPage(headers, cookies);
    util.debug(recommendations);
    res.send(recommendations);
})

// app.use('/youtube', async function(req, res) {
//     util.log("Handling main page", verbose);
//     res.setHeader('content-type', 'application/json');
//     // FIX!!
//     res.setHeader('access-control-allow-origin', '*');
//     let recommendations = await yt.mainPage();
//     res.send(recommendations);
// })

app.listen(port, host, function () {
    util.log('App listening on ' + host + ':' + port);
});
