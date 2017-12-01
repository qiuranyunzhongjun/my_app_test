const { mysql: config } = require('../config')
var mysql = require('mysql');
var async = require('async');

function get() {
  var connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.pass,
    database: 'myUsers',
    port: config.port
  })
  var promise = new Promise(function (resolve, reject) {

    connection.connect();
    var activityGetSql = "SELECT * FROM activitys";
    connection.query(
      activityGetSql, 
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
};
module.exports = async ctx => {
  // 获取上传之后的结果
  // 具体可以查看：
  const data = await get()
  ctx.state.data = data
}
