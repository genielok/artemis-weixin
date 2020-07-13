//login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '',
    angle: 0
  },
  goToIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  onLoad: function () {
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    // 启动页获取用户openid，避免后面未获取到

    wx.cloud.callFunction({
      name:"getOpenid",
      complete:res => {
        // 将openid写入globalData
        app.globalData.openid = res.result
        // console.log(app.globalData.openid)
      }
    })
  },
  onShow: function () {
  },
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) {
        angle = 14;
      } else if (angle < -14) {
        angle = -14;
      }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  }
});