const { mysql: config } = require('../config')
var mysql = require('mysql');
var async = require('async');


async function get() {
  // const { signature, timestamp, nonce, echostr } = ctx.query
  // if (checkSignature(signature, timestamp, nonce)) ctx.body = echostr
  // else ctx.body = 'ERR_WHEN_CHECK_SIGNATURE'
  var res = {me:"空"};
  await console.log(connection);
  await connection.connect();
  var myUsersGetSql = "SELECT * FROM weapp_users";
  await connection.query(myUsersGetSql, function (err, result) {
    if (err) console.log('[SELECT ERR]-', err.message);
    res = result;
    console.log("数据库查询结果：");
    console.log(result);
    connection.end();
  })
  await  console.log(res)
  return res;
}
function get1(openId) {
  var connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.pass,
    database: 'myUsers',
    port: config.port
  })
  var promise = new Promise(function (resolve, reject) {
    
    connection.connect();
    var userGetSql = "SELECT * FROM weapp_users WHERE weixin = ?";
    var userGetSql_Params = openId;
    connection.query(
      userGetSql, userGetSql_Params,
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
  const data = await get1(ctx.request.query.openId)

  ctx.state.data = data
}
