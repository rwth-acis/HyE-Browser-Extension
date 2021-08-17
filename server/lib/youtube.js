//const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const util = require('./util.js');

const MAIN_PAGE = "https://www.youtube.com/";
const THUMBNAIL_TAG = 'ytd-thumbnail';
// const runtimeTag = 'ytd-thumbnail-overlay-time-status-renderer';

function parseMainPage(html)
{
    let $ = cheerio.load(html);
    let thumbnails = $(THUMBNAIL_TAG);
    let recommendations = [];
    let result = [];
    for (let key in thumbnails)
    {
        recommendations.push(thumbnails[key].parent);
    }
    for (let i = 0; i < recommendations.length; ++i)
    {
        try
        {
            $ = cheerio.load(recommendations[i]);
            let imgs = $("img");
            if (imgs.length < 1)
                continue;
            let links = $("a");
            if (links.length < 2)
                continue;
            // let runtimeElem = $(runtimeTag);
            // let runtime = "???";
            // if (typeof runtimeElem.length !== "undefined" &&
            //   runtimeElem.length > 0)
            // {
            //     runtime = cheerio.load(runtimeElem).text();
            // }
            result.push(
            {
                "thumbnailImg": imgs['0'].attribs.src,
                "avatarImg": imgs['1'].attribs.src,
                "thumbnailLink": links['0'].attribs.href,
                "avatarLink": links['1'].attribs.href,
                "titleLink": links['2'].attribs.href,
                "title": links['2'].attribs.title,
                "userLink": links['3'].attribs.href,
                "user": cheerio.load(links['3']).text()
                // "runtime": runtime
            });
        } catch (e) {
            util.log(e);
            continue;
        }
    }
    return result;
}

function parseAside(html)
{
    let $ = cheerio.load(html);
    let thumbnails = $(THUMBNAIL_TAG);
    let keys = Object.keys(thumbnails);
    let recommendations = [];
    let result = [];
    for (let i = 0; i < keys.length; ++i)
    {
        recommendations.push(thumbnails[keys[i]].parent);
    }
    for (let i = 0; i < recommendations.length; ++i)
    {
        try
        {
            $ = cheerio.load(recommendations[i]);
            // let imgs = $("img");
            // let thumbnail = "";
            // if (imgs.length < 1)
            //     continue;
            // else if (imgs.length < 2)
            //     thumbnail = imgs['0'].attribs.src;
            // else
            //     thumbnail = imgs['1'].attribs.src;
            let links = $("a");
            if (links.length < 2)
                continue;
            // Todo: Fix thumbnails
            // let runtimeElem = $(runtimeTag);
            // let runtime = "???";
            // if (typeof runtimeElem.length !== "undefined" &&
            //   runtimeElem.length > 0)
            // {
            //     runtime = cheerio.load(runtimeElem).text();
            // }
            let rawDescription = cheerio.load(links['1']).text();
            let videoDetails = getVidDetails(rawDescription);
            if (typeof links['1'].attribs.href === "undefined" ||
              // typeof imgs['0'].attribs.src === "undefined" ||
              typeof videoDetails.title === "undefined" ||
              typeof videoDetails.channel === "undefined")
            result.push(
            {
                // "thumbnail": imgs['0'].attribs.src,
                "link": links['1'].attribs.href,
                "title": videoDetails.title,
                "channel": videoDetails.channel,
                "rawDescription": rawDescription
                // "runtime": runtime
            });
        } catch (e) {
            util.log(e);
            continue;
        }
    }
    return result;
}

function getVidUrl(vidId)
{
    return MAIN_PAGE + "watch?v=" + vidId;
}

function getVidDetails(rawText)
{
    let title = '';
    let channel = '';
    let phase = 0; // 0 -> looking for title, 1 -> writing title, 2 -> looking for channel, 3 -> writing channel
    for (let i = 0; i < rawText.length; ++i)
    {
        switch (phase) {
            case 0:
                if (!util.isBlankSpace(rawText[i]))
                {
                    title += rawText[i];
                    ++phase;
                }
                continue;
            case 1:
                if (rawText[i] === '\n')
                    ++phase;
                else
                    title += rawText[i];
                continue;
            case 2:
                if (!util.isBlankSpace(rawText[i]))
                {
                    channel += rawText[i];
                    ++phase;
                }
                continue;
            case 3:
                if (rawText[i] === '\n')
                    return {"title": title, "channel": channel};
                else
                    channel += rawText[i];
                continue;
          default:
              break;
        }
    }
    return {"title": title, "channel": channel};
}

const mainPage = (cookies) => {
    return new Promise(async (resolve, reject) => {
        let browser = await puppeteer.launch();
        let page = await browser.newPage();
        for (let i = 0; i < cookies.length; ++i)
            await page.setCookie(cookies[i]);
        await page.goto(MAIN_PAGE);
        let html = await page.content();
        resolve(parseMainPage(html));
    });
}

const video = (id, cookies) => {
    return new Promise(async (resolve, reject) => {
        let browser = await puppeteer.launch();
        let page = await browser.newPage();
        for (let i = 0; i < cookies.length; ++i)
        {
            console.debug(`Setting cookie ${cookies[i]['name']}`);
            await page.setCookie(cookies[i]);
        }
        await page.goto(getVidUrl(id), { waitUntil: 'networkidle0' });
        await page.screenshot({ 'path': './test.png', 'fullPage': true });
        let html = await page.content();
        resolve(parseAside(html));
    });
}

exports.mainPage = mainPage;
exports.video = video;
