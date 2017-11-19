const { mysql: config } = require('../config')
var mysql = require('mysql');

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
    console.log(result);
    return result;
  })
  connection.end();
}

module.exports = {
  operateSql
}