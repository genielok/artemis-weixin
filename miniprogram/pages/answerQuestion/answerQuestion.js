//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cardList: [{
        card_id: "1",
        card_url: "../../images/answerQ/card0.png"
      },
      {
        card_id: "2",
        card_url: "../../images/answerQ/card1.png"
      },
      {
        card_id: "3",
        card_url: "../../images/answerQ/card2.png"
      },
      {
        card_id: "4",
        card_url: "../../images/answerQ/card3.png"
      }
    ]
  },
  bindSequence: function (e) {
    var _this = this
    if (app.globalData.hasUserInfo==true) {
      wx.navigateTo({
        url: 'answerQuestionDetail/answerQuestionDetail?type=random',
      })
    }
    else {
      wx.getUserInfo({
        success: res => {
          if (res.userInfo !== undefined) {
            console.log(res.userInfo)
            app.globalData.userInfo = res.userInfo
            app.globalData.hasUserInfo = true
          }
        }
      })
      // wx.showModal({
      //   title: '尚未授权',
      //   content: '请点击确定跳转至授权页面',
      //   success: function (res) {
      //     if (res.confirm) {
      //       wx.navigateTo({
      //             url: '../tologin/tologin',
      //       })
      //     }
      //   }
      // })
    }
  },
  //事件处理函数
  // bindSequence: function() {
    
  //   wx.navigateTo({
  //     url: 'answerQuestionDetail/answerQuestionDetail?type=random'
  //   })
  // },
  bindRandom: function() {
    wx.navigateTo({
      url: 'answerQuestionDetail/answerQuestionDetail?type=random'
    })
  },
  bindFavorite: function() {
    let favorite_list = wx.getStorageSync('favorite_list')
    if (!favorite_list) {
      wx.showModal({
        title: 'Oops!',
        content: '你没有收藏的问题'
      })
      return
    }
    wx.navigateTo({
      url: 'answerQuestionDetail/answerQuestionDetail?type=favorite'
    })
  },
  onLoad: function (options){
    // var _this = this
    // wx.getSetting({
    //   success: (res) => {
    //     if (res.authSetting['scope.userInfo'] !== undefined) {

    //     }
    //     else {
    //       wx.showModal({
    //         title: '尚未授权',
    //         content: '请点击确定跳转至授权页面',
    //         success: function (res) {
    //           if (res.confirm) {
    //             console.log("确定授权")
    //             wx.navigateTo({
    //               url: '../tologin/tologin',
    //             })
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  }


})