const { mysql: config } = require('../config')
var mysql = require('mysql');
var async = require('async');

function operateSql(dbname, sql, sqlParams) {

  /**
   * 封装操作数据库函数
   * 指定数据库名，操作语句，操作参数
   */
  var connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.pass,
    database: dbname,
    port: config.port
  })
  connection.connect();
  connection.query(sql, sqlParams, function (err, result) {
    if (err) console.log('[operate SQL ERR]-', err.message);
    console.log("操作数据库结果：");
    connection.end();
    console.log(result);
    return result;
  })
  return;
}

function synOperateSql(dbname, sql, sqlParams) {

  /**
   * 封装操作数据库函数
   * 指定数据库名，操作语句，操作参数
   */
  var connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.pass,
    database: dbname,
    port: config.port
  })
  var promise = new Promise(function (resolve, reject) {

    connection.connect();
    connection.query(
      sql, sqlParams,
      function selectCb(err, results) {
        if (results) {
          console.log(results);
          resolve(results);
        }
        if (err) {
          console.log(err);
        }
        connection.end();
      }
    );
  });
  promise.then(function (value) {
    console.log(value);
    return value;
    // success
  }, function (value) {
    // failure
  });
  return promise;
}

module.exports = {
  operateSql,
  synOperateSql
}