// pages/animalMoments/animalMomentsList/animalMomentsList.js
const db = wx.cloud.database({});
Page({

  data: {
    articles: [],
    sub_img_url:''
  },


  onLoad: function (options) {
    var _this = this
    // 接收传过来的id，判断是哪一个版块
    // this.pageData.id = options.id
    console.log(options.id)
    var tempId = parseInt(options.id)

    // 设置对应主题的版块大图
    this.setData({
      sub_img_url: '../../../images/animalMoments/moments-swiper'+options.id+'.png'
    })
    // 查询对应主题的文章列表
    db.collection('ani_article').where({
      tag_id: tempId
    }).get({
      success(res) {
        console.log("查询成功！")
        console.log(res.data)
        _this.setData({
          articles: res.data
        })
        // 数据已取得
        console.log(_this.data.articles)
      },
      fail(err) {
        console.log("查询失败！")
        console.log(err)
      }
    })


  },

  gotoDetail(e) {
    var type = e.currentTarget.dataset.type
    var id = e.currentTarget.dataset.id
    if(type == 0){
      wx.navigateTo({
        url: '../animalMomentsDetail/animalMomentsDetail?id='+id,
      })
    }else if(type == 1){
      wx.navigateTo({
        url: '../video/video?id=' + id,
      })
    }
  },

})