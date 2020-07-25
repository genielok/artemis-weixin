// pages/animalMoments/animalMomentsDetail/animalMomentsDetail.js
const db = wx.cloud.database({});
const app = getApp();
var userId = require('../../../utils/get_user.js')
// var art = require('../../../resource/article.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles: {},
    isCollected: false
  },
  pageData: {

  },
  // 收藏功能
  favorite: function () {
    var _this = this
    wx.getSetting({
      success: (res) => {
        if (app.globalData.hasUserInfo == true) {
          return new Promise((resolve, reject) => {
            db.collection('userItem').where({
              openid: app.globalData.openid,
              article_id: this.pageData.id,
              f_type: 1
            }).get().then((res) => {
              _this.setData({
                userItem: res.data
              })
              console.log(this.data.userItem.length)
              if (this.data.userItem.length != 0) {

                db.collection('userItem').where({
                  article_id: this.pageData.id
                }).remove()
                  .then(res => {
                    // 删除数据成功
                    let isCollected = !this.data.isCollected
                    this.setData({
                      // 下面本来是这样子的:isCollected=isCollected,可以简写
                      isCollected
                    })
                    wx.showToast({
                      title: '取消收藏',
                    })
                    console.log(res)
                  }).catch(err => {
                    // 删除数据失败
                    wx.showToast({
                      title: '取消收藏失败',
                    })
                    console.log(err)
                  })

                // wx.showToast({
                //   icon: 'none',
                //   title: '已收藏',

                // })

              }
              else {
                // console.log(this.pageData.imageUrl)
                // console.log(this.pageData.title)
                // 将该图鉴写入收藏user数据库
                db.collection('userItem').add({
                  data: {
                    openid: app.globalData.openid,
                    img_url: this.pageData.img_url,
                    article_id: this.pageData.id,
                    title: this.pageData.title,
                    abstract: this.pageData.abstract,
                    tag: this.pageData.tag,
                    f_type: 1
                  },
                  success: res => {
                    console.log("[数据库] [新增记录] 收藏成功！", res)
                    let isCollected = !this.data.isCollected
                    this.setData({
                      // 下面本来是这样子的:isCollected=isCollected,可以简写
                      isCollected
                    })
                    wx.showToast({
                      title: '收藏成功！',
                    })
                  },
                  fail: err => {
                    wx.showToast({
                      icon: 'none',
                      title: '新增记录失败',
                    })
                    console.log("[数据库] [新增记录] 失败！", err)
                  }
                })
              }
            })

          })

        }
        else {
          wx.getUserInfo({
            success: res => {
              if (res.userInfo !== undefined){
                console.log(res.userInfo)
                app.globalData.userInfo = res.userInfo
                app.globalData.hasUserInfo = true
              }
            }
          })
        }
      }
    })


    // return new Promise((resolve, reject) => {
    //   db.collection('userItem').where({
    //     _openid: app.globalData.openid,
    //     article_id: this.pageData.id,
    //     f_type:1
    //   }).get().then((res) => {
    //     _this.setData({
    //       userItem: res.data
    //     })
    //     console.log(this.data.userItem.length)
    //     if (this.data.userItem.length != 0) {
          
    //       db.collection('userItem').where({
    //         article_id: this.pageData.id
    //       }).remove()
    //         .then(res => {
    //           // 删除数据成功
    //           let isCollected = !this.data.isCollected
    //           this.setData({
    //             // 下面本来是这样子的:isCollected=isCollected,可以简写
    //             isCollected
    //           })
    //           wx.showToast({
    //             title: '取消收藏',
    //           })
    //           console.log(res)
    //         }).catch(err => {
    //           // 删除数据失败
    //           wx.showToast({
    //             title: '取消收藏失败',
    //           })
    //           console.log(err)
    //         })

    //       // wx.showToast({
    //       //   icon: 'none',
    //       //   title: '已收藏',
            
    //       // })
          
    //     }
    //     else {
    //       // console.log(this.pageData.imageUrl)
    //       // console.log(this.pageData.title)
    //       // 将该图鉴写入收藏user数据库
    //       db.collection('userItem').add({
    //         data: {
    //           img_url: this.pageData.img_url,
    //           article_id: this.pageData.id,
    //           title: this.pageData.title,
    //           abstract: this.pageData.abstract,
    //           tag: this.pageData.tag,
    //           f_type:1
    //         },
    //         success: res => {
    //           console.log("[数据库] [新增记录] 收藏成功！", res)
    //           let isCollected = !this.data.isCollected
    //           this.setData({
    //             // 下面本来是这样子的:isCollected=isCollected,可以简写
    //             isCollected
    //           })
    //           wx.showToast({
    //             title: '收藏成功！',
    //           })
    //         },
    //         fail: err => {
    //           wx.showToast({
    //             icon: 'none',
    //             title: '新增记录失败',
    //           })
    //           console.log("[数据库] [新增记录] 失败！", err)
    //         }
    //       })
    //     }
    //   })

    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    this.pageData.id = parseInt(options.id)
    var tempId = parseInt(options.id)
    db.collection('ani_article').where({
      art_id: tempId
    }).get({
      success(res) {
        _this.setData({
          articles: res.data[0]
        })
        _this.pageData.title = res.data[0].title
        _this.pageData.img_url = res.data[0].img_url
        _this.pageData.abstract = res.data[0].abstract
        _this.pageData.tag = res.data[0].tag
      },
      fail(err) {
        console.log("[查询失败] [数据库ani_article]",err)
      }
    })
    db.collection('userItem').where({
      openid: app.globalData.openid,
      article_id: this.pageData.id,
      f_type: 1
    }).get().then((res) => {
      _this.setData({
        userItem: res.data
      })
      console.log(this.data.userItem.length)
      // let isCollected = this.data.isCollected
      if (this.data.userItem.length != 0) {
        this.setData({
          isCollected: true
        })
      }
      else{
        this.setData({
          isCollected: false
        })
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