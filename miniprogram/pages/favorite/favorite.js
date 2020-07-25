const db = wx.cloud.database({});
var app = getApp();
Page({
  data: {
    navState: 0,//导航状态
    favorAnimalItems:[],
    articles: [],
  },
  //监听滑块
  bindchange(e) {
    // console.log(e.detail.current)
    let index = e.detail.current;
    this.setData({
      navState: index
    })
  },
  //点击导航
  navSwitch: function (e) {
    // console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index;
    this.setData({
      navState: index
    })
  },
  // 收藏动物跳转
  gotoBookContent: function(e){
    wx.navigateTo({
      url: '../bookContent/bookContent?id=' + e.currentTarget.dataset.id,
    })
  },
  // 文章跳转链接
  article_Detail(e) {
    var id = e.currentTarget.dataset.id
    // console.log(id)
    // 判断type为视频还是文章，视频type=0,文章type=1
    type = e.currentTarget.dataset.type
    if (type) {
      wx.navigateTo({
        url: "../index/video/video?id=" + id,
      })
    }
    else {
      wx.navigateTo({
        url: '../index/animalMomentsDetail/animalMomentsDetail?id=' + id,
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    // wx.getSetting({
      // success: (res) => {
        // if (res.authSetting['scope.userInfo'] !== undefined) {
        // if (app.globalData.hasUserInfo){
          // 查询收藏的图鉴
          db.collection('userItem').where({
            openid: app.globalData.openid,
            f_type: 0
          }).get({
            success(res) {
              _this.setData({
                favorAnimalItems: res.data
              })
            },
            fail(err) {
              console.log("查询失败！")
              console.log(err)
            }
          })

          // 查询收藏的文章
          db.collection('userItem').where({
            openid: app.globalData.openid,
            f_type: 1
          }).get({
            success(res) {
              console.log("查询成功！")
              console.log(res.data)
              _this.setData({
                articles: res.data
              })
            },
            fail(err) {
              console.log("查询失败！")
              console.log(err)
            }
          })

        // }
        // else {
        //   wx.showModal({
        //     title: '尚未授权',
        //     content: '请点击确定跳转至授权页面',
        //     success: function (res) {
        //       if (res.confirm) {
        //         wx.getUserInfo({
        //           withCredentials: true,
        //           lang: '',
        //           success: function(res) {
        //             app.globalData.userInfo = res.userInfo
        //             app.globalData.hasUserInfo = true

                    
        //             console.log('app.globalData.hasUserInfo=' + app.globalData.hasUserInfo)
        //           },
        //           fail: function(res) {},
        //           complete: function(res) {},
        //         })
        //         console.log("确定授权")
        //         db.collection('userItem').where({
        //           openid: app.globalData.openid,
        //           f_type: 0
        //         }).get({
        //           success(res) {
        //             _this.setData({
        //               favorAnimalItems: res.data
        //             })
        //           },
        //           fail(err) {
        //             console.log("查询失败！")
        //             console.log(err)
        //           }
        //         })

        //         // 查询收藏的文章
        //         db.collection('userItem').where({
        //           openid: app.globalData.openid,
        //           f_type: 1
        //         }).get({
        //           success(res) {
        //             console.log("查询成功！")
        //             console.log(res.data)
        //             _this.setData({
        //               articles: res.data
        //             })
        //           },
        //           fail(err) {
        //             console.log("查询失败！")
        //             console.log(err)
        //           }
        //         })
        //         // wx.navigateTo({
        //           // url: '../tologin/tologin',
                  
        //         // })
        //       }
        //     }
        //   })
        // }
      // }
    // })
  }
})
