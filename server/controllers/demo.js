/**
 * 响应 GET 请求（响应微信配置时的签名检查请求）
 */
module.exports = ctx => {
  ctx.state.data = {
    msg: 'Hello World'
  }
}
