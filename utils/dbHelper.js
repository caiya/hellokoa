/**
 * Created by chaozhou on 2015/9/18.
 */
var mssql = require('mssql');
var dbconfig = require('../config/dbconfig.json');

var user = dbconfig.user,
    password = dbconfig.password,
    server = dbconfig.server,
    database = dbconfig.database;

/**
 * 默认config对象
 * @type {{user: string, password: string, server: string, database: string, options: {encrypt: boolean}, pool: {min: number, idleTimeoutMillis: number}}}
 */
var config = {
    user: user,
    password: password,
    server: server, // You can use 'localhost\\instance' to connect to named instance
    database: database,
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        useUTC: false
    },
    pool: {
        min: 10,
        max: 100,
        idleTimeoutMillis: 30000
    }
};

var connection = new mssql.Connection(config);
connection.on('error', function (err) {
    console.error(err);
});
connection.connect(function (err) {
    if (err) {
        console.error(err);
    }
});

/**
 * 执行原生Sql
 * @param sql
 * @params 参数对象(可为空，为空表示不加参数)
 * @param callBack(err,recordset)
 */
var querySql = function (sql, params, callBack) {
    return new Promise(function(resolve,reject){
        var ps = new mssql.PreparedStatement(connection);
        if (params != "") {
            for (var index in params) {
                if (typeof params[index] == "number") {
                    ps.input(index, mssql.BigInt);
                } else if (typeof params[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                }
            }
        }
        console.log("sql:" + sql);
        ps.prepare(sql, function (err) {
            if (err)
                console.log(err);
            ps.execute(params, function (err, recordset) {
                ps.unprepare(function (err) {
                    if (err)
                        console.log(err);
                });
                if(err)reject(err);
                resolve(recordset);
            });
        });
    });
};

exports.querySql = querySql;