var util = require('../../utils/util.js')
const config = require('../../config');
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var app = getApp();

Page({
    data: {
        inputShowed: false,
        showTopTips: false,
        //inputVal: "",
        date: "2017.11.22",//约开始日期
        startTime: "08:01",//约开始时间
        endTime: "09:01",
        num: 24,
        match_type: 4,
        place:"更换活动位置",
        radioItems: [
            { name: '学习', value: '0' },
            { name: '跑步', value: '1' },
            { name: '狼人杀', value: '2' }
        ]//所有可以约的项目
    },

    onLoad: function () {

    },
    
    
    //改人数的函数
    userNumInput: function (e) {
        this.setData({
            num: e.detail.value
        })
    },
    //改约日期的函数
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    //改约时间的函数
    bindTimeChange: function (e) {
        this.setData({
            startTime: e.detail.value
        })
    },
    bindEndTimeChange: function (e) {
        this.setData({
            endTime: e.detail.value
        })
    },
    //跳转到显示约成功的页面
    forSubmit: function (e) {
        var _this = this
        var that = this.data
        // console.log("actname"+ that.radioItems[that.match_type])
        // console.log("starttime" + that.startTime)
        // console.log("endtime" + that.endTime)
        // console.log("totalPersons" + that.num)
        // console.log("currentPersons" + 0)
        // console.log("place" + that.place)
        // console.log(" author"+ app.globalData.openId)
        wx.request({
            url: config.service.updateActivityUrl,
            data: { actname: that.radioItems[that.match_type].name,
              starttime: that.date.replace('.', '-').replace('.', '-')+" "+that.startTime+":00", 
              endtime: that.date.replace('.', '-').replace('.', '-') + " " + that.endTime + ":00", 
            totalPersons: that.num, currentPersons: 0, place: that.place, 
            author: app.globalData.openId},
            header: { 'content-type': 'application/x-www-form-urlencoded' },  //添加头部才能传输
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT

            success: function (res) {
                var err = res.data.error
                if (err) {
                    _this.setData({
                        error: err
                    })
                }
                console.log(res)
                wx.navigateTo({
                  url: '../index/index'
                })
            }
        })
    },

    choosePlace:function(e){
        var that = this;
        wx.chooseLocation({
          success: function (res) {
              console.log(res.latitude)
              console.log(res.longitude)
              console.log(res.name)
              console.log(res.address) 
              that.setData({
                place: res.address
              })
            },
        })
    },

    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;

        }
        this.data.match_type = parseInt(e.detail.value);
        this.setData({
            radioItems: radioItems
        });
    }
});
