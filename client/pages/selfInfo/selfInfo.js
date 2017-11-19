//selfInfo.js 个人信息
//获取应用实例
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var app = getApp()
Page({
    data: {
       myInfo: null,
       loading:true,
       schoolIndex:0,
       majorIndex:0,
       //school:new Array("请选择", "河北工业大学", "天津工业大学", "河北经贸大学"),
       //major:new Array("请选择", "工商管理", "网络工程", "软件工程")
  },
  onLoad: function () {
    var that = this;
    that.doRequest();
    this.setData({
      loading: false
    })
    wx.setNavigationBarTitle({ title: '云中君' });
  },

  onShow: function () {
    console.log("selfInfo.show启动")
    this.setData({
      myInfo: app.globalData.myInfo
    })
  },

    doRequest: function () {
      util.showBusy('请求信息中...')
      var that = this
      console.log("请求" + app.globalData.openId)
      var options = {
        url: config.service.userInfoUrl,
        data: { openId: app.globalData.openId },
        success(result) {
          util.showSuccess('成功获取信息')
          console.log('request success', result)
          that.setData({
            myInfo: result.data.data[0]
          })
          console.log(that.data.myInfo)
        },
        fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }
      }
      if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
        qcloud.request(options)
      } else {    // 使用 wx.request 则不带登录态
        wx.request(options)
      }
    },
    // 预览图片
    previewImg: function () {
      wx.previewImage({
        current: this.data.myInfo.picurl,
        urls: [this.data.myInfo.picurl]
      })
    },
    toAuth:function(){
        wx.navigateTo({
            url: '../toAuth/toAuth',
        })
    }
})
