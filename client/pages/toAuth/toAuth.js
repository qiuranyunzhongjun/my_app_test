//toAuth.js 认证页面
var util = require('../../utils/util.js')
const config = require('../../config');
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var app = getApp();
Page({
    data: {
        //认证信息
      userInfo: {},
      loading: true,
      userName: null,
      userSchool: null,
      userClass: null,
      phoneNumber: null,
      studentCard: null,
      changePic: false, //是否切换了图片,
      imgUrl:null,
    },
    
    onLoad: function () {
        wx.setNavigationBarTitle({ title: '个人认证' }); 
          //提交信息
        var that = this;
        that.setData({
          loading : false
        }) 
        // this.setData({
        //   userName: "yawnmp",
        //   userSchool: "北航",
        //   userClass: "6",
        //   phoneNumber: "13240303107",
        //   studentCard: "12005048",
        //   imgUrl: "http://www.nipic.com/show/3/109/39a392ea9afa1e7b.html",
        // })  
        // this.toAuth();
    },
    // 上传图片接口
    chooseImage: function () {
      var that = this

      // 选择图片
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          util.showBusy('正在上传')
          var filePath = res.tempFilePaths[0]

          // 上传图片
          wx.uploadFile({
            url: config.service.uploadUrl,
            filePath: filePath,
            name: 'file',

            success: function (res) {
              util.showSuccess('上传图片成功')
              //console.log(res)
              res = JSON.parse(res.data)
              console.log(res.data.imgUrl)
              that.setData({
                imgUrl: res.data.imgUrl
              })
            },
            fail: function (e) {
              util.showModel('上传图片失败')
            }
          })

        },
        fail: function (e) {
          console.error(e)
        }
      })
    },
    // 预览图片
    previewImg: function () {
      wx.previewImage({
        current: this.data.imgUrl,
        urls: [this.data.imgUrl]
      })
    },
    changePicture: function (e) {
      //长按切换照片
      var that = this;
      var index = e.target.dataset.index;
      wx.showActionSheet({
        itemList: ['更改图片', '删除'],
        success: function (res) {
          if (res.tapIndex == "0") {
            this.chooseImage();
          } else if (res.tapIndex == "1") {
            that.setData({
              imgUrl: null,
              hidden: false,
              changePic: true,//切换了图片
            })
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })

    },
    setName: function (e) {
      //真实姓名
      var that = this;
      that.setData({
        userName: e.detail.value
      })
    },
    setName: function (e) {
      //所在学校
      var that = this;
      that.setData({
        userSchool: e.detail.value
      })
    },

    setMajor: function (e) {
      //专业班级
      var that = this;
      that.setData({
        userClass: e.detail.value
      })
    },

    setPhone: function (e) {
      //联系方式
      var that = this;
      that.setData({
        phoneNumber: e.detail.value
      })
    },

    setCardId: function (e) {
      //学号
      var that = this;
      that.setData({
        studentCard: e.detail.value
      })
    },
    toAuth: function () {
      //提交信息
      var that = this;
      var thatData = that.data;
      var formData = {
        "studentId": thatData.studentCard,
        'name': thatData.userName,
        'weixin': app.globalData.openId,
        'school': thatData.userSchool,
        'telephone': thatData.phoneNumber,
        'department': thatData.userClass,
        "description": "内测阶段增加的信息",
        "picurl": thatData.imgUrl
      };
      console.log(formData)
      if (!thatData.userName || !thatData.phoneNumber || !thatData.userClass || !thatData.studentCard) {
        wx.showToast({
          title: '你是不是忘记填了点什么！',
          icon: 'false',
          duration: 2000
        })
        return;
      }
      if (!thatData.imgUrl) {
        wx.showToast({
          title: '你是不是忘记选择照片了！',
          icon: 'false',
          duration: 2000
        })
        return;
      }
      util.showBusy('请求中...')
      wx.request({
        url: config.service.registerUrl,
        header: {
          'content-type': 'application/json'
        },
        data: formData,
        method:"POST",
        success: function (res) {
          console.log(formData)
          console.log(res)
          wx.showToast({
            title: '注册成功！',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function (error) {
          wx.showToast({
            title: error,
            icon: 'false',
            duration: 2000
          })
        }
      })
    }
})
