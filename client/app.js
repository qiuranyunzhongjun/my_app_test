//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
        wx.setNavigationBarTitle({ title: '云中君' }); 
    },
    globalData: {
      userInfo: null,
      myInfo:null,
      openId : ''
    },
})