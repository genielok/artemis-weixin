//index.js
const app = getApp()
const db = wx.cloud.database({}); // 连接数据库
// 从外部subject.js中导入专题的显示数据
var subject = require('../../resource/subject.js');
// 导入轮播数据
var swiper = require('../../resource/swiper.js');

Page({
  data: {
    // avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    articles: [],
    // 专题分类
    zones: [],
    cardCur: 0,
    // 轮播图片
    swiperList: [],
  },

  onLoad: function() {
    // 加载列表数据，is_top为1表示显示在首页，0表示不显示在首页
    var _this = this;
    db.collection('ani_article').where({
      is_top: 1
    }).get({
      success(res) {
        _this.setData({
          articles: res.data
        })
      },
      fail(err) {
        console.log("[查询失败] [数据库ani_article]",err)
      }
    })
    // 从subject.js中取得专题的显示数据与对应链接
    // 从swiper.js中取得轮播的数据
    _this.setData({
      zones: subject,
      swiperList:swiper
    })
  },

  // onGetUserInfo: function(e) {
  //   if (!this.data.logged && e.detail.userInfo) {
  //     this.setData({
  //       logged: true,
  //       avatarUrl: e.detail.userInfo.avatarUrl,
  //       userInfo: e.detail.userInfo
  //     })
  //   }
  // },

  // onGetOpenid: function() {
  //   // 调用云函数
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     data: {},
  //     success: res => {
  //       console.log('[云函数] [login] user openid: ', res.result.openid)
  //       app.globalData.openid = res.result.openid
  //       wx.navigateTo({
  //         url: '../userConsole/userConsole',
  //       })
  //     },
  //     fail: err => {
  //       console.error('[云函数] [login] 调用失败', err)
  //       wx.navigateTo({
  //         url: '../deployFunctions/deployFunctions',
  //       })
  //     }
  //   })
  // },

  // // 上传图片
  // doUpload: function () {
  //   // 选择图片
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {

  //       wx.showLoading({
  //         title: '上传中',
  //       })

  //       const filePath = res.tempFilePaths[0]
        
  //       // 上传图片
  //       const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
  //       wx.cloud.uploadFile({
  //         cloudPath,
  //         filePath,
  //         success: res => {
  //           console.log('[上传文件] 成功：', res)

  //           app.globalData.fileID = res.fileID
  //           app.globalData.cloudPath = cloudPath
  //           app.globalData.imagePath = filePath
            
  //           wx.navigateTo({
  //             url: '../storageConsole/storageConsole'
  //           })
  //         },
  //         fail: e => {
  //           console.error('[上传文件] 失败：', e)
  //           wx.showToast({
  //             icon: 'none',
  //             title: '上传失败',
  //           })
  //         },
  //         complete: () => {
  //           wx.hideLoading()
  //         }
  //       })

  //     },
  //     fail: e => {
  //       console.error(e)
  //     }
  //   })
  // },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  // 专题跳转到列表
  goToList(e) {
    // id=1,2,3分别为秘境之眼，熊猫频道，志愿行动，id=4为救助热线
    var id = e.currentTarget.dataset.id
    if(id!=4){
      wx.navigateTo({
        url: 'animalMomentsList/animalMomentsList?id=' + id,

      })
    }
    // 最后一个主题版块至救助热线
    else{
      wx.navigateTo({
        url: '../repAndHelp/repAndHelp',

      })
    }
  },
  // 轮播跳转链接
  gotoDetail(e) {
    var id = e.currentTarget.dataset.id
    // console.log(id)
    var detail_url = ''
    switch(id){
      case 0:
        detail_url = 'animalMomentsList/animalMomentsList?id=1'; // 秘境之眼列表,list的id
        break;
      case 1:
        detail_url = 'animalMomentsList/animalMomentsList?id=2'; // 熊猫列表, list的id
        break;
      case 2:
        detail_url = 'animalMomentsDetail/animalMomentsDetail?id=19'; // 文章art_id
        break;
      case 3:
        detail_url = 'animalMomentsDetail/animalMomentsDetail?id=20'; // 文章art_id
        break;
      case 4:
        detail_url = 'video/video?id=2';// 宣传片art_id
        break;
    }
    wx.navigateTo({
      url: detail_url,
    })
  },

  // 首页文章列表跳转链接
  article_Detail(e){
    var id = e.currentTarget.dataset.id
    // console.log(id)
    // 判断type为视频还是文章，视频type=0,文章type=1
    type = e.currentTarget.dataset.type
    if(type){
      wx.navigateTo({
        url: "video/video?id="+id,
      })
    }
    else{
      wx.navigateTo({
        url:'animalMomentsDetail/animalMomentsDetail?id='+id,
      })
    }
  }

})
