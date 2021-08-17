const util = require('../lib/util.js');
const md5 = require('md5');

const defaults = {
  "id": undefined,
  "name": undefined,
  "value": undefined,
  "domain": undefined,
  "path": "'/'",
  "hostOnly": false,
  "httpOnly": false,
  "sameSite": "'None'",
  "secure": false
};

const sizes = {
  "name": 64,
  "value": 2048,
  "domain": 256,
  "path": 1024
}

const sameSiteVals = ["None", "Lax", "Strict"];

function parseMonth(month)
{
    if (month < 10)
        return '0' + month;
    return month;
}

function parseTimestamp(timestamp)
{
    let date = new Date(timestamp);
    return `${date.getFullYear()}-${parseMonth(date.getMonth())}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function parseBool(val)
{
    if (val.toLowerCase() === 'false')
        return false;
    else if (val.toLowerCase() === 'true')
        return true;
    else
    {
        util.log(`Error: invalid boolean value ${val}`);
        return undefined;
    }
}

function parse(obj)
{
    let res = {};
    let attribs = Object.keys(defaults);
    let id = "";
    for (let i = 0; i < attribs.length; ++i)
    {
        let attrib = attribs[i];
        if (attrib === 'id')
            obj['id'] = "tempValue";
        if (typeof obj[attrib] === "undefined")
        {
            if (defaults[attrib] === undefined)
            {
                util.log(`Error: missing attribute ${attrib}`);
                return {};
            }
            obj[attrib] = defaults[attrib];
        }
        let val = obj[attrib].toString();
        if (attrib !== 'accessed')
            id += val;
        if (sizes[attrib] < val.length)
        {
            util.log(`Error: '${attrib}' value too long (${val.length})`);
            return {};
        }
        else if (attrib === 'hostOnly' || attrib === 'httpOnly' || attrib == 'secure')
        {
            if ((res[attrib] = parseBool(val)) === undefined)
                return {};
        }
        else if (attrib === 'sameSite')
        {
            if (!(val.toLowerCase() in sameSiteVals))
            {
                // Treat 'no_restriction' as 'None'
                if (val.toLowerCase() === 'no_restriction')
                    val = 'None';
                else
                {
                    util.log(`Error: invalid same site value ${val}`);
                    return {};
                }
            }
            res[attrib] = `'${val}'`;
        }
        else if (attrib === 'size')
            res[attrib] = parseInt(val);
        else
            res[attrib] = `'${val}'`;
    }
    res['id'] = `'${md5(id)}'`;
    return res;
}

function sqlString()
{
    return util.toTupleString(Object.keys(defaults));
}

exports.sqlString = sqlString;
exports.parse = parse;
