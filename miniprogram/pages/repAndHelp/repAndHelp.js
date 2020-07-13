var items = require('../../resource/city.js');//引入我们的城市列表资源
const db = wx.cloud.database({});
const app = getApp();



Page({

  data: {

    city: '',
    // citys:[],

    cityData: {},

    _py: ["A", "B", "C", "F", "G", "H", "J", "L", "N",  "Q", "S", "X", "Y", "Z"],

    //搜索列表
    hidden: true,

    showPy: '★',

    selectData: [],
    searchVal: "", // 搜索关键字
    clearShow:false  // 动态清除

  },

  // 搜索提交关键字
  input(e) {
    var _this = this
    this.setData({
      searchVal: e.detail.value
    })
    // console.log(e.detail.value)
    var s_value = e.detail.value
    if(s_value.length >0 && !_this.data.clearShow){
      _this.setData({
        clearShow:true
      })
    }else if(s_value.length == 0){
      _this.setData({
        clearShow:false
      })
    }
    // console.log(s_value)
  },
  // 关键字模糊搜索
  // 增加一个eles if来判断是否存在数据库中
  search: function () {

    if(this.data.searchVal == ""){
      wx.showToast({
        title: '请输入',
        icon:'none'
      })
    }else{
      // 查询是否存在province数据库
      var _this = this
      return new Promise((resolve, reject) => {
        // 随机获得一个卡牌
        db.collection('province').where({
          fullName: db.RegExp({
            regexp: this.data.searchVal,//作为关键字进行匹配
            options: 'i',//不区分大小写
          })
        }).get({
          success(res) {
            // console.log(res.data);
            // _this.setData({
            //   search_result: res.data
            // })
            if(res.data.length!=0){
              wx.navigateTo({
                url: 'repAndHelpDetail/repAndHelpDetail?id=' + res.data[0].id,
              })
            }
            else{
              wx.navigateTo({
                url: 'repAndHelpnation/repAndHelpnation',
              })
            }
          }
        })
      })
      

      // 原 start ---------------------------------
      // wx.navigateTo({
      //   url: 'repAndHelpDetail/repAndHelpDetail?province='+this.data.searchVal,
      // })
      // 原 end ---------------------------------
    }
  },


  onLoad: function () {

    var that = this;

    that.setData({
      cityData: items.citys
    })
    console.log(this.data.cityData.A)

  },





  //选择城市

  selectCity: function (e) {

    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'repAndHelpDetail/repAndHelpDetail?id='+id,
    })
    // console.log(id)

  },



  //获取文字信息

  getPy: function (e) {

    this.setData({

      hidden: false,

      showPy: e.target.id,

    })

  },



  setPy: function (e) {

    this.setData({

      hidden: true,

      scrollTopId: this.data.showPy

    })

  },



  //触发全部开始选择

  tStart: function () {

    this.setData({

      hidden: false

    })

  },



  //触发结束选择

  tEnd: function () {

    this.setData({

      hidden: true,

      scrollTopId: this.data.showPy

    })

  }

})
