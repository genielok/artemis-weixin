const db = wx.cloud.database({});
var app = getApp();
// pages/answerQuestion/answerQuestionSuccess/answerQuestionSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    randomCard:"",
    temp_id:0,
    pageData:{}
  },

  onLoad: function (options) {
    var _this = this
    return new Promise((resolve, reject) => {
      // 随机获得一个卡牌
      db.collection('card').aggregate().sample({
        size: 1
      }).end().then(
        res => {
          _this.setData({
            randomCard: res.list[0].imgUrl,
            temp_id: res.list[0].id
          })
          // console.log("是否获取到openid",app.globalData.openid)
          db.collection('userItem').add({
            data: {
              openid: app.globalData.openid,
              imgUrl: res.list[0].imgUrl,
              card_id: res.list[0].id,
              f_type: 3
            },
            success: res => {
              // console.log("[数据库] [新增记录] 收藏成功！", res)
            },
            fail:res => {
              wx.showModal({
                title: '新增记录失败！'
              })
              console.log("[数据库] [新增记录] 收藏失败！", res)
            }
          })
        }
      )
      })
  },

  goToCard: function(){
    wx.navigateTo({
      url: '../../card/card',
    })
  },
  // 长按保存功能--授权部分
  saveImage() {
    let _this = this
    wx.showActionSheet({
      itemList: ['保存到相册'],
      success(res) {
        let url = _this.data.randomCard;
        wx.getSetting({
          success: (res) => {
            if (!res.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => {
                  // 同意授权
                  _this.saveImgInner(url);
                },
                fail: (res) => {
                  console.log(res);
                  wx.showModal({
                    title: '保存失败',
                    content: '请开启访问手机相册权限',
                    success(res) {
                      wx.openSetting()
                    }
                  })
                }
              })
            } else {
              // 已经授权了
              _this.saveImgInner(url);
            }
          },
          fail: (res) => {
            console.log(res);
          }
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  // 长按保存功能--保存部分
  saveImgInner(url) {
    wx.downloadFile({
      url: url,
      success: function (res) {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                title: '卡牌保存成功！',
              })
            },
            fail(res) {
              wx.showToast({
                title: '卡牌保存失败',
              })
            }
          })
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})