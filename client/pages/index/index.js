var util = require('../../utils/util.js');
const config = require('../../config');
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var app = getApp()

//index.js
//获取应用实例
var screenNum = 3;
Page({
    data: {
        cateisShow: false,
        activeNum: 1,
        loading: true,
        now:null,
        activityObj:null,
        activityShow:null,
    },

    onPullDownRefresh: function () {
        //监听页面刷新
        this.onLoad()
        wx.stopPullDownRefresh()
    },

    onLoad: function () {
        var that = this;
        wx.setNavigationBarTitle({ title: '云中君' });
        //活动列表数据获取
        wx.request({
            url: config.service.activityUrl,
            method: "GET",
            success: function (res) {
                that.setData({
                    activityObj: res.data.data,
                    activityShow: res.data.data,
                    loading:false
                })
                console.log(that.data.activityObj)
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    icon: 'false',
                    duration: 2000
                })
            }
        })
        this.login_weixin();
    },
    // 用户登录示例
    login_weixin: function () {
      var that = this
      // 调用登录接口
      qcloud.login({
        success(result) {
          if (result) {
            that.setData({
              userInfo: result,
              logged: true
            })
          } else {
            // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
            qcloud.request({
              url: config.service.requestUrl,
              success(result) {
                //util.showSuccess('登录成功')
                app.globalData.userInfo = result.data.data
                console.log("登陆后请求注册信息")

                that.closeTunnel()
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
        console.log("成功获取openid")
        that.closeTunnel()
      })
      // 打开信道
      tunnel.open()
      //console.log("信道打开")

      this.setData({ tunnelStatus: 'connecting' })
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

    onShow: function () {
        this.onLoad() 
    },
    chooseActivity:function (name){
      if (this.data.activityObj==null)
        return null;
      var toshow=[];
      for (var act in this.data.activityObj){
        if (this.data.activityObj[act].name==name)
          toshow.push(this.data.activityObj[act]);
      }
      return toshow
    },
    activitydetail: function (event){
      console.log(event.currentTarget.id)
      for (var act in this.data.activityShow) {
        if (this.data.activityShow[act].id == event.currentTarget.id){
            app.globalData.activity = this.data.activityShow[act]
            break
        }
      }
      console.log("准备跳转")
      wx.navigateTo({
        url: '../activity/activity',
      })
    },
    changeTab: function (event) {
       var that  = this
        //切换筛选tab
        var num = event.target.dataset.id;
        console.log("change to "+num)
        this.setData({
            activeNum: num
        })
        switch (num) {
          case '1':
            that.setData({
              activityShow: that.data.activityObj
            })
            break
          case '2':
            that.setData({
              activityShow: that.chooseActivity("狼人杀")
            })
            break
          case '3':
            that.setData({
              activityShow: that.chooseActivity("学习")
            })
            break;
          case '4':
            that.setData({
              activityShow: that.chooseActivity("跑步")
            })
            break;
        }
    },
})
