var utils = require('../../utils/util.js');
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
//self.js 个人中心首页
//获取应用实例
var app = getApp()
Page({
  data: {
        userInfo: {},
        certificationOk: null,

        logged: false,
        takeSession: false,
        requestResult: ''
    },
  // 用户登录示例
  login_weixin: function () {
    if (this.data.logged) return

    utils.showBusy('正在登录')
    var that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          utils.showSuccess('登录成功')
          app.globalData.userInfo = result,
          that.setData({
            userInfo: result,
            logged: true
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              utils.showSuccess('登录成功')
              app.globalData.userInfo = result,
              that.setData({
                userInfo: result.data.data,
                logged: true
              })
            },

            fail(error) {
              utils.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },

      fail(error) {
        utils.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },
    onPullDownRefresh :function(){
        utils.getUserData();
        wx.stopPullDownRefresh()
    },
    
    onLoad: function (options) {
        var that = this;
        utils.getUserData();  
        that.setData({
            userInfo: app.globalData.userInfo,
            certificationOk: app.globalData.certificationOk,
        })
        
    },
    
    onReady:function(){
        var that = this;
        if (that.data.userInfo){
            if (that.data.certificationOk == 0){
                wx.showModal({
                    title: '认证提醒',
                    content: '您还没有认证',
                    cancelText: "下次再说",
                    cancelColor: "",
                    success: function (res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '../toAuth/toAuth',
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }
            
        }
    },
    onShow: function () {
        var that = this;
        console.log(that+"==================")
        utils.checkSettingStatu(that);
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    login:function(){
        //认证信息及个人信息切换
        var that = this;
        if (that.data.certificationOk == 2){
            //个人信息页面
            wx.navigateTo({
                url: '../selfInfo/selfInfo',
            })
        }else{
            //去认证页面
            wx.navigateTo({
                url: '../toAuth/toAuth',
            })
        }
        
    },

    openAccount: function (event) {
        //打开我的账户
        wx.navigateTo({
            url: '../myAccount/myAccount',
        })
    },

    openBookList:function(event){
        //打开个人中心图书列表
        var index = event.currentTarget.dataset.index;
        wx.navigateTo({
            url: '../bookList/bookList?index=' + index,
        })
    },

    //自营点上传图书
    uploadPilot: function () {
        wx.navigateTo({
            url: '../uploadPilot/uploadPilot'
        })
    },


    openOpinion:function(){
        //打开意见反馈
        wx.navigateTo({
            url: '../opinion/opinion',
        })
    },

    aboutUs:function(){
        //打开关于我们
        wx.navigateTo({
            url: '../aboutUs/aboutUs',
        })
    },

    openSetting:function(){
        wx.navigateTo({
            url: '../setting/setting',
        })
    },

    openCards:function(){
        wx.navigateTo({
            url: '../card/card',
        })
    }
})
