var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var app = getApp()
//self.js 个人中心首页
//获取应用实例
var app = getApp()
Page({
  data: {
      userInfo: {},
      myInfo:null,
      openID:null,
      logged: false,
      takeSession: false,
      requestResult: '原始消息'
    },


  // 用户登录示例
  login_weixin: function () {
    if (this.data.logged) return

    util.showBusy('正在登录')
    var that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          util.showSuccess('登录成功')
          that.setData({
            userInfo: result,
            logged: true
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            success(result) {
              util.showSuccess('登录成功')
              that.setData({
                userInfo: result.data.data,
                logged: true
              })
              app.globalData.userInfo = result.data.data
              that.openTunnel()
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },

      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },

    onPullDownRefresh :function(){
      console.log(this.requestResult)
    },
    
    onLoad: function (options) {
        var that = this;
        wx.setNavigationBarTitle({ title: '云中君' }); 
        this.login_weixin();
    },
    
    openTunnel: function () {
      //console.log("打开信道中")
      var that = this
      // 创建信道，需要给定后台服务地址
      var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

      // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
      tunnel.on('connect', () => {
        console.log('WebSocket 信道已连接')
        this.setData({ tunnelStatus: 'connected' })
        setTimeout(function () {
          that.sendMessage()
        }, 500);
      })

      tunnel.on('close', () => {
        console.log('WebSocket 信道已断开')
        this.setData({ tunnelStatus: 'closed' })
      })

      tunnel.on('reconnecting', () => {
        console.log('WebSocket 信道正在重连...')
      })

      tunnel.on('reconnect', () => {
        console.log('WebSocket 信道重连成功')
      })

      tunnel.on('error', error => {
        console.error('信道发生错误：', error)
      })

      // 监听自定义消息（服务器进行推送）
      tunnel.on('speak', speak => {
        console.log('收到说话消息：', speak)
        that.setData({
          //requestResult : speak,
          openID: speak.who.openId,
        }) 
        app.globalData.openId = speak.who.openId
        that.doRequest()
      })

      // 打开信道
      tunnel.open()
      //console.log("信道打开")

      this.setData({ tunnelStatus: 'connecting' })
    },
    /**
    * 向服务器发送消息获取用户唯一标识符openId
    */
    sendMessage() {
      console.log("准备接受用户openID，此时this.data.tunnelStatus=" + this.data.tunnelStatus + "并且this.tunnel=" + this.tunnel + "并且this.tunnel.isActive()=" + this.tunnel.isActive())
      if (!this.data.tunnelStatus || !this.data.tunnelStatus === 'connected') return
      // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
      if (this.tunnel && this.tunnel.isActive()) {
        // 使用信道给服务器推送「speak」消息
        //console.log("真的准备接受用户openID")
        this.tunnel.emit('speak', {
          'word': '' + new Date(),
        });
        //console.log("接受用户openID的请求发送完了")
      }
    },

    /**
     * 关闭已经打开的信道
     */
    closeTunnel() {
      if (this.tunnel) {
        this.tunnel.close();
      }
      //util.showBusy('信道连接中...')
      console.log("信道关闭")
      this.setData({ tunnelStatus: 'closed' })
    },

    doRequest: function () {
      util.showBusy('请求中...')
      var that = this
      console.log("请求" + that.data.openID)
      var options = {
        url: config.service.userInfoUrl,
        data: {openId:that.data.openID},
        success(result) {
          util.showSuccess('成功获取信息')
          console.log('request success', result)
          console.log('result.data[0]', result.data.data[0])
          that.setData({
            myInfo: result.data.data[0]
          })
          that.closeTunnel()
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
    onReady:function(){
        var that = this;
        
    },
    onShow: function () {
        var that = this;
        console.log(that+"渲染成功，没啥卵用")
        
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
        if (that.data.myInfo){
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
      console.log(this.requestResult)
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
