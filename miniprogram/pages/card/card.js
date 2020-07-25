const db = wx.cloud.database({});
var app = getApp();
Page({
  options: {
    addGlobalClass: true,
    user_id:''
  },
  /**
   * 页面的初始数据
   */
  data: {
    elements: [],
  },
  showModal(e) {
    console.log(e);
    this.setData({
      modalName: e.currentTarget.dataset.target,
      bigUrl: e.currentTarget.dataset.url
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 长按保存功能--授权部分
  saveImage(e) {
    let _this = this
    wx.showActionSheet({
      itemList: ['保存到相册'],
      success(res) {
        let url = e.currentTarget.dataset.url;
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
      url:url,
      success: function(res){
        if(res.statusCode === 200){
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res){
              wx.showToast({
                title: '卡牌保存成功！',
              })
            },
            fail(res){
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    wx.getSetting({
      success:(res) => {
        if(res.authSetting['scope.userInfo']!==undefined){
          db.collection('userItem').where({
            openid: app.globalData.openid,
            f_type: 3
          }).get({
            success(res) {
              console.log(res.data)
              _this.setData({
                elements: res.data
              })
            },
            fail(err) {
              console.log("查询失败！")
              console.log(err)
            }
          })
          
        }
        else{
          wx.showModal({
            title: '尚未授权',
            content: '请点击确定跳转至授权页面',
            success:function(res){
              if(res.confirm){
                console.log("确定授权")
                wx.navigateTo({
                  url: '../tologin/tologin',
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})