// pages/repAndHelp/repAndHelpDetail/repAndHelpDetail.js
const db = wx.cloud.database({});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    helpList:[],
    pageData: {

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    // 接收传过来的id
    // this.pageData.id = options.id
    // console.log(options.id)
    var tempId = parseInt(options.id)
    var keyword = options.province
    console.log("-----------")
    console.log(options.province)
    console.log("-----------")
    if(keyword == null){
    // 根据id查找对应的数据
      db.collection('help_tel').where({
        pro_id: tempId
      }).get({
        success(res) {
          console.log("查询成功！")
          console.log(res.data)
          _this.setData({
            helpList: res.data
          })
          // 数据已取得
          // console.log(_this.data.helpList)
        },
        fail(err) {
          console.log("查询失败！")
          console.log(err)
        }
      })
  }else{
      // province: keyword,
      db.collection('help_tel').where({
        province: keyword
      }).get({
        success(res) {
          console.log("查询成功！")
          console.log(res.data)
          _this.setData({
            helpList: res.data
          })
          // 数据已取得
          // console.log(_this.data.helpList)
        },
        fail(err) {
          console.log("查询失败！")
          console.log(err)
        }
      })

  }
    // console.log(this.data.helpList)
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