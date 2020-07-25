// pages/animalBook/animalBook.js
const db = wx.cloud.database({});
var pList = require('../../resource/protectList.js');//引入我们的保护列表资源
var s_value = ''
var p_id = 2
var a_class = ""

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,//初始文本框不显示内容
    showLeft1: false,//初始时遮罩不显示
    searchVal: "", // 搜索关键字
    totalCount: 835, // 数据库总数
    pageSize: 10,  // 每次上拉加载更新10条
    // 动物图片列表数据
    animalItems: [],

    // 筛选：保护列表单选内容
    pidx: '',
    protectList: [],
    // 筛选：类别列表单选内容
    cidx:'',
    classList: []
  },

  // 使文本框进入可编辑状态
  showInput: function () {
    this.setData({
      inputShowed: true  // 设置文本框可以输入内容
    });
  },
  // 取消搜索
  hideInput: function () {
    this.setData({
      inputShowed: false,
      searchVal: '',
      isLoad: false
    });
    s_value = ''
    var _this = this;
    // 获取数据库数据
    if(p_id == 10){
      db.collection('animals').where({
        title: db.RegExp({
          regexp: s_value,//作为关键字进行匹配
          options: 'i',//不区分大小写
        }),
        class: db.RegExp({
          regexp: a_class,//作为关键字进行匹配
          options: 'i',//不区分大小写
        })
      }).get({
        success(res) {
          console.log(res.data);
          _this.setData({
            animalItems: res.data
          })
        }
      })
    }
    else{
      db.collection('animals').where({
        title: db.RegExp({
          regexp: s_value,//作为关键字进行匹配
          options: 'i',//不区分大小写
        }),
        class: db.RegExp({
          regexp: a_class,//作为关键字进行匹配
          options: 'i',//不区分大小写
        }),
        pid:p_id
      }).get({
        success(res) {
          console.log(res.data);
          _this.setData({
            animalItems: res.data
          })
        }
      })
    }
    db.collection('animals').where({
      title: db.RegExp({
        regexp: s_value,//作为关键字进行匹配
        options: 'i',//不区分大小写
      }),
      class: db.RegExp({
        regexp: a_class,//作为关键字进行匹配
        options: 'i',//不区分大小写
      })
    }).get({
      success(res) {
        console.log(res.data);
        _this.setData({
          animalItems: res.data
        })
      }
    })

  },
  // 搜索提交关键字
  input(e) {
    this.setData({
      searchVal: e.detail.value
    })
    s_value = e.detail.value
    console.log(s_value)
    // console.log(e.detail.value)
  },
  // 关键字模糊搜索
  search: function () {
    // 重新给数组赋值为空
    var bei_animalItems = this.data.animalItems
    console.log(bei_animalItems)
    this.setData({
      animalItems: []
    })
    // 数据库正则对象
    var _this = this
    db.collection('animals').where({
      title: db.RegExp({
        regexp: this.data.searchVal,//作为关键字进行匹配
        options: 'i',//不区分大小写
      })
    }).get({
      success(res) {
        console.log("查找成功！")
        _this.setData({
          animalItems: res.data,
          isLoad: true
        })
      }
    })
  },



  // 抽屉函数
  toggleLeft1() {
    this.setData({
      showLeft1: !this.data.showLeft1
    });
  },

  // 保护级别的单选
  proSelectApply: function (e) {
    var _this = this;
    let id = e.target.dataset.id

    this.setData({
      showLeft1: !this.data.showLeft1,
      pidx: id

    })
    // 修改当前的全局p_id值
    p_id = parseInt(id)

    if(id == 10){  // 查询全部
      db.collection('animals').get({
        success(res) {
          console.log("查询成功！")
          console.log(res.data)
          _this.setData({
            isLoad: false,
            animalItems: res.data
          })
        },
        fail(err) {
          console.log("查询失败！")
          console.log(err),
          this.setData({
            isLoad: true
          })
        }
      })

      db.collection('ani_class').where({
        pid: 2
      }).get({
        success(res) {
          console.log("类别数据查询成功！")
          // console.log(res.data)
          _this.setData({
            classList: res.data,
            isLoad: false
          })
        },
        fail(err) {
          wx.showToast({
            title: '查询失败',
          });
          this.setData({
            isLoad: true
          })
          console.error("查询类别数据失败！", err)
        }
      })
    }else{
      // 根据相应的pid查询对应保护级别的动植物数据
      db.collection('animals').where({
        pid: parseInt(id)
      }).get({
        success(res) {
          console.log("查询成功！")
          console.log(res.data)
          _this.setData({
            animalItems: res.data,
            isLoad: false
          })
        },
        fail(err) {
          this.setData({
            isLoad: true
          })
          console.log("查询失败！")
          console.log(err)
        }
      })

      // 根据相应的pid查询对应类别列表
      db.collection('ani_class').where({
        pid: parseInt(id)
      }).get({
        success(res) {
          console.log("查询成功！")
          _this.setData({
            classList: res.data,
            isLoad: false
          })
        },
        fail(err) {
          this.setData({
            isLoad: true
          })
          console.log("查询失败！")
          console.log(err)
        }
      })

    }
  },

  // 所属类别的单选列表，根据protectList变化
  claSelectApply: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var item = this.data.classList[index];
    var query_class = item.ani_class  // 获取当前需要查询的类别名，这里因为类别名太多了，我标不过来，所以用类别名来查询
    // 设置当前的cidx
    this.setData({
      cidx: item.cid,
      showLeft1: !this.data.showLeft1,
    })
    a_class = query_class

    // 判断是否为查询全部
    if(p_id == 10){
      db.collection('animals').where({
        class: query_class
      }).get({
        success(res) {
          console.log("类别数据查询成功！")
          console.log(res.data)
          _this.setData({
            animalItems: res.data,
            isLoad: false
          })
        },
        fail(err) {
          wx.showToast({
            title: '查询失败',
          })
          this.setData({
            isLoad: true
          })
          console.error("查询类别数据失败！", err)
        }
      })
    }else{  // 如果仅查询某个保护级别
      db.collection('animals').where({
        pid: p_id,
        class: query_class
      }).get({
        success(res) {
          console.log("类别数据查询成功！")
          console.log(res.data)
          _this.setData({
            animalItems: res.data,
            isLoad: false
          })
        },
        fail(err) {
          this.setData({
            isLoad: true
          })
          wx.showToast({
            title: '查询失败',
          })
          console.error("查询类别数据失败！", err)
        }
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 创建一个变量来保存页面page示例中的this
    //console.log("loading")
    var _this = this;
    // 获取数据库数据
    db.collection('animals').get({
      success(res) {
        console.log(res.data);
        _this.setData({
          animalItems: res.data
        })
      }
    })
    // 获取保护列表数据
    _this.setData({
      protectList: pList
    })

    // 加载默认的类别列表数据，因为cid是在数据库里定义的，为了防止因修改cid导致程序不可运行，故从数据库中读取
    db.collection('ani_class').where({
      pid: 2
    }).get({
      success(res) {
        console.log("类别数据查询成功！")
        console.log(res.data)
        _this.setData({
          classList: res.data
        })
      },
      fail(err) {
        wx.showToast({
          title: '查询失败',
        })
        console.error("查询类别数据失败！", err)
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
    var _this = this
    var temp = []
    // 获取后面二十条，从第21条开始，每次取pageSize条
    console.log(this.data.animalItems.length)
    console.log(this.data.totalCount)
    if (this.data.animalItems.length < this.data.totalCount) {
      try {
        if(p_id == 10){
          db.collection('animals').skip(_this.data.animalItems.length).limit(_this.data.pageSize).where({
            title: db.RegExp({
              regexp: s_value,//作为关键字进行匹配
              options: 'i',//不区分大小写
            }),
            class: db.RegExp({
              regexp: a_class,//作为关键字进行匹配
              options: 'i',//不区分大小写
            })
          }).get({
            success: function (res) {
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var tempTopic = res.data[i]
                  // console.log(tempTopic)
                  temp.push(tempTopic)
                }
                // 下面追加到原数据后面
                console.log(temp)
                var totaltaskOngoing = {}
                totaltaskOngoing = _this.data.animalItems.concat(temp)
                // console.log(totaltaskOngoing)
                _this.setData({
                  animalItems: totaltaskOngoing,
                })
              } else {
                wx.showToast({
                  title: '没有更多数据了',
                })
                _this.setData({
                  isLoad: true
                })
              }
            },
            fail: function (event) {
              console.log("-----" + event)
            }
          })
        }else{
          db.collection('animals').skip(_this.data.animalItems.length).limit(_this.data.pageSize).where({
            title: db.RegExp({
              regexp: s_value,//作为关键字进行匹配
              options: 'i',//不区分大小写
            }),
            pid: p_id,
            class: db.RegExp({
              regexp: a_class,//作为关键字进行匹配
              options: 'i',//不区分大小写
            })
          }).get({
            success: function (res) {
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var tempTopic = res.data[i]
                  // console.log(tempTopic)
                  temp.push(tempTopic)
                }
                // 下面追加到原数据后面
                // console.log(temp)
                var totaltaskOngoing = {}
                totaltaskOngoing = _this.data.animalItems.concat(temp)
                // console.log(totaltaskOngoing)
                _this.setData({
                  animalItems: totaltaskOngoing,
                })
              } else {
                _this.setData({
                  isLoad: true
                })
                wx.showToast({
                  title: '没有更多数据了',
                })
              }
            },
            fail: function (event) {
              console.log("-----" + event)
            }
          })
        }
      } catch (e) {
        console.error(e)
      }
    } else {
      _this.setData({
        isLoad: true
      })
      wx.showToast({
        title: '没有更多数据了',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})