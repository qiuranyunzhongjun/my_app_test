var app = getApp()

Page({
    data: {
        activity:null,
    },

    onLoad: function () {
      this.setData({
        activity: app.globalData.activity
      })
      console.log(this.data.activity)
    },
    
    
});
