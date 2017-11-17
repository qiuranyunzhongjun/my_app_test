//toAuth.js 认证页面
const config = require('../../config');
Page({
    data: {
        //认证信息
        studentCard: "12005048",
        userName:"杨明",
        openId:"12138",
        phoneNumber:"13240333232",
        userSchool:"北京航空航天大学",
        userClass:"计算机科学与技术",
        imgUrl:"http://scse1606.cn/image/buaa.jpg",
    },
    onLoad: function () {
        wx.setNavigationBarTitle({ title: '个人认证' }); 
          //提交信息
          var that = this;
          var thatData = that.data;
          var schoolIndex = that.data.schoolIndex;
          var formData = {
            "studentId": that.data.studentCard,
            'name': that.data.userName,
            'telephone': that.data.phoneNumber,
            'school': that.data.userSchool,
            'department': that.data.userClass,
            "picurl": that.data.imgUrl,
          };
          console.log(formData)

          //等待认证获取详情
          wx.request({
            url: config.service.userInfoUrl,
            header: {
              'content-type': 'application/json'
            },
            method: 'GET',
            data: formData,
            success: function (res) {
              console.log(res.data);
              console.log("查询成功");
            }
          });
    }
})
