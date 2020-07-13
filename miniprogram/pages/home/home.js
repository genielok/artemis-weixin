// pages/home/home.js
var app = getApp();
var userId = require('../../utils/get_user.js')
Page({


  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var _this = this
    if (app.globalData.hasUserInfo){
      _this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }



    // var _this = this
    // wx.getSetting({
    //   success: (res) => {
    //     if (res.authSetting['scope.userInfo'] !== undefined) {
    //       wx.getUserInfo({
    //         success: res => {
    //           app.globalData.userInfo = res.userInfo
    //           _this.setData({
    //             userInfo: res.userInfo,
    //             hasUserInfo: true
    //           })
    //         }
    //       })

    //     }
    //   }
    // })
  },
  getUserInfo: function (e) {

    // console.log(e)
    // app.globalData.hasUserInfo = true
    // app.globalData.userInfo = e.detail.userInfo
    // console.log("【function】getUserInfo")
    // console.log(e.detail.userInfo)
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // })




    // --------------------
    var _this = this
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo'] !== undefined) {
          wx.getUserInfo({
            success: res => {
              app.globalData.hasUserInfo = true
              app.globalData.userInfo = res.userInfo
              _this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
            }
          })

        }
        else{

        }
      }
    })
  }
})