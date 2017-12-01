//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
        wx.setNavigationBarTitle({ title: 'BUAA在线约活动' }); 
    },
    globalData: {
      userInfo: null,
      myInfo:null,
      openId: 'oHTf00Agty4DqVIrBm8P6kZMBmuk',
      activity:null,
    },
})