// [FIX] This logging system is terrible

var m_debug = false;

function setDebug(val)
{
    if (val === true || val === false)
        m_debug = val;
}

function log(msg)
{
    console.log(msg);
}

function debug(msg)
{
    if (m_debug)
        console.log(msg);
}

function toTupleString(arr)
{
    if (arr.constructor !== Array)
    {
        log('Error: argument is not a list');
        return "";
    }
    let res = "(";
    for (let i = 0; i < arr.length; ++i)
    {
        if (i)
            res += ',';
        res += arr[i];
    }
    res += ')';
    return res;
}

function isAlphaNumeric(char)
{
	return char.match(/^[a-z0-9]+$/i) !== null;
}

function isBlankSpace(char)
{
    return (char === ' ' || char === '\n' || char === '\t');
}

exports.setDebug = setDebug;
exports.log = log;
exports.debug = debug;
exports.toTupleString = toTupleString;
exports.isAlphaNumeric = isAlphaNumeric;
exports.isBlankSpace = isBlankSpace;
