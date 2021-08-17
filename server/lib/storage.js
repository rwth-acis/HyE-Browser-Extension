const mysql = require('mysql');
const config = require('../etc/config.json');
const schema = require('../etc/schema.js');
const util = require('./util.js');

var con;
let connected = false;

function reverseMysqlEscape(val)
{
    return unescape(val).replace(/&amp;/g, '&');
}

function init()
{
    return new Promise(resolve => {
        con = mysql.createConnection({
          host: config.host,
          database: config.database,
          user: config.user,
          password: config.password
        });

        con.connect(function(err) {
            if (err)
            {
                util.log(err);
                resolve(false);
            }
            else
            {
                util.log("Established MySQL connection");
                connected = true;
                resolve(true);
            }
        });
    });
}

function store(obj)
{
    return new Promise(resolve => {
        if (!connected)
        {
            util.log("Error: no database connection");
            return false;
        }
        let parsedObj = schema.parse(obj);
        if (parsedObj === {})
        {
            util.log("Error: invalid cookie");
            return false;
        }
        const sql = `INSERT INTO ${config.table} ${schema.sqlString()} VALUES ${util.toTupleString(Object.values(parsedObj))}`;
        con.query(sql, function(err, res) {
            if (err)
            {
                util.log(err);
                resolve(false);
            }
            else
                resolve(true);
        });
    });
}

function retrieve()
{
    return new Promise(resolve => {
        if (!connected)
        {
            util.log("Error: no database connection");
            return {};
        }
        const sql = `SELECT * FROM ${config.table}`;
        con.query(sql, function(err, res) {
            if (err)
            {
                util.log(err);
                resolve(false);
            }
            else
            {
                // Todo: Remove 'expires' column
                for (let i = 0; i < res.length; ++i)
                {
                    res[i]['expires'] = 0;
                    res[i]['hostOnly'] = (res[i]['hostOnly'] == 1);
                    res[i]['httpOnly'] = (res[i]['hostOnly'] == 1);
                    res[i]['secure'] = (res[i]['secure'] == 1);
                    res[i]['value'] = reverseMysqlEscape(res[i]['value']);
                }
                resolve(res);
            }
        });
    });
}

exports.init = init;
exports.store = store;
exports.retrieve = retrieve;
