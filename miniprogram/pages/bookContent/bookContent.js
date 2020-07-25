const db = wx.cloud.database({});
var app = getApp();
var userId = require('../../utils/get_user.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oneChecked: true,
    contentlist: [],
    tags: [],
    userItem:[],

    // 用户登录的数据
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  pageData: {

  },
  oneChange(event) {
    this.setData({
      'oneChecked': event.detail.checked
    })
  },
  onChange(event) {
    const detail = event.detail;
    this.setData({
      ['tags[' + event.detail.name + '].checked']: detail.checked
    })

  },
  // 收藏功能
  favorite:function(){
    var _this = this
    wx.getSetting({
      success: (res) => {
        if (app.globalData.hasUserInfo == true) {
          return new Promise((resolve, reject) => {
            db.collection('userItem').where({
              openid: app.globalData.openid,
              book_id: this.pageData.id,
              f_type: 0
            }).get().then((res) => {
              _this.setData({
                userItem: res.data
              })
              // 收藏代码-start-------------------
              if (this.data.userItem.length != 0) {

                db.collection('userItem').where({
                  book_id: this.pageData.id
                }).remove()
                  .then(res => {
                    // 删除数据成功
                    let isCollected = !this.data.isCollected
                    this.setData({
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
              }
              // ---------------end-----------

              //------------------------------
              else {
                console.log(this.pageData.imageUrl)
                console.log(this.pageData.title)
                // 将该图鉴写入收藏user数据库
                db.collection('userItem').add({
                  data: {
                    openid:app.globalData.openid,
                    imageUrl: this.pageData.imageUrl,
                    book_id: this.pageData.id,
                    title: this.pageData.title,
                    f_type: 0
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
        else{
          wx.getUserInfo({
            success: res => {
              if (res.userInfo !== undefined) {
                console.log(res.userInfo)
                app.globalData.userInfo = res.userInfo
                app.globalData.hasUserInfo = true
              }
            }
          })
        }
      }
    }) 
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    // 接收传过来的id
    this.pageData.id = options.id
    var change1 = 'tags[0].name'
    // 根据id查找对应的数据
    db.collection('animals').doc(options.id).get({
      success(res) {
        console.log("查找成功！")
        // console.log(res.data.title)
        _this.setData({
          contentlist: res.data,
          change1: res.data.catalogue,
        })
        _this.pageData.title = res.data.title
        _this.pageData.imageUrl = res.data.imageUrl
      }
    })
    db.collection('userItem').where({
      openid: app.globalData.openid,
      book_id: this.pageData.id,
      f_type: 0
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
      else {
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