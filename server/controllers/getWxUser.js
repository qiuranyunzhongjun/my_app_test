const { mysql: config } = require('../config')
var mysql = require('mysql');

module.exports = ctx => {
  var connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.pass,
    database: 'myUsers',
    port: config.port
  })
  connection.connect();
  var myUsersGetSql = "SELECT * FROM weapp_users";
  connection.query(myUsersGetSql, function (err, result) {
    if (err) console.log('[SELECT ERR]-', err.message);
    ctx.state.data = {
      msg: 'Hello World',
      userData : result
    }
    console.log("数据库查询结果：");
    console.log(result);
    connection.end();
  })
  
}
