const { mysql: config } = require('../config')
var mysql = require('mysql');


//connection.connect();
/*var connection = mysql.createConnection({
  host: '${config.port.mysql.host }',
  user: '${config.port.mysql.user }',
  password: '${config.port.mysql.pass }',
  database: 'myUsers'
});
*/
/**
 * 响应 GET 请求（响应微信配置时的签名检查请求）
 */
async function get (ctx, next) {
    // const { signature, timestamp, nonce, echostr } = ctx.query
    // if (checkSignature(signature, timestamp, nonce)) ctx.body = echostr
    // else ctx.body = 'ERR_WHEN_CHECK_SIGNATURE'
  console.log(connection);
  connection.connect();
  var myUsersGetSql = "SELECT * FROM weapp_users";
  connection.query(myUsersGetSql, function (err, result) {
    if (err) console.log('[SELECT ERR]-', err.message);
    ctx.state.data = {result:result};
    ctx.response.body = { result: result };
    console.log("数据库查询结果：");
    console.log(result);
    connection.end();
  })
}

async function post (ctx, next) {
    // 检查签名，确认是微信发出的请求
    // const { signature, timestamp, nonce } = ctx.query
    // if (!checkSignature(signature, timestamp, nonce)) ctx.body = 'ERR_WHEN_CHECK_SIGNATURE'

    /**
     * 解析微信发送过来的请求体
     * 可查看微信文档：https://mp.weixin.qq.com/debug/wxadoc/dev/api/custommsg/receive.html#接收消息和事件
     */
    // const body = ctx.request.body;
    // ctx.body = mysql('weapp_users').select('*');
    //mysql('db_name').insert();
  var connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.pass,
    database: 'myUsers',
    port: config.port
  })
    connection.connect();
    var addSql = 'INSERT INTO weapp_users(studentId,name,weixin,school,department,telephone,picurl,description) VALUES(?,?,?,?,?,?,?,?)';
    console.log(ctx.request);
    var that = ctx.request.body;
    var addSqlParams = [that.studentId, that.name, that.weixin, that.school, that.department, that.telephone, that.picurl, that.description];
    console.log(addSqlParams);
    connection.query(addSql, addSqlParams, function (err, result) {
      if (err) {
        ctx.body = '[INSERT ERROR] - ' + err.message;
        connection.end();
        return;
      }
      ctx.body = result;
      console.log(result);
      connection.end();
    });
}
module.exports = {
    post,
    get
}
