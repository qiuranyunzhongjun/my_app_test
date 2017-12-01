const { mysql: config } = require('../config')
var mysql = require('../tools/operatedb')
var async = require('async');

async function post(ctx, next) {
  // 检查签名，确认是微信发出的请求
  // const { signature, timestamp, nonce } = ctx.query
  // if (!checkSignature(signature, timestamp, nonce)) ctx.body = 'ERR_WHEN_CHECK_SIGNATURE'

  /**
   * 解析微信发送过来的请求体
   * 可查看微信文档：https://mp.weixin.qq.com/debug/wxadoc/dev/api/custommsg/receive.html#接收消息和事件
   */
  console.log(ctx.request);
  var that = ctx.request.body;

  var addSql = 'INSERT INTO activitys(name,date,starttime,endtime,totalPersons,currentPersons,place,author) VALUES(?,?,?,?,?,?,?,?)';
  var addSqlParams = [that.actname, that.date, that.starttime, that.endtime, that.totalPersons, that.currentPersons, that.place, that.author];
  console.log("addActivity-start")
  var result = await mysql.synOperateSql('myUsers', addSql, addSqlParams)
  console.log("addActivity-end")
  console.log(result.insertId)
  addSql = 'INSERT INTO users_activitys(userid,activityid,state) VALUES(?,?,?)';
  addSqlParams = [that.author, result.insertId, '1'];
  console.log("insert user_activity")
  mysql.operateSql('myUsers', addSql, addSqlParams)
}
module.exports = {
  post
}
