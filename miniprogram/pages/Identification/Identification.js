// Identification.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultList: [],
    tempFilePaths: '../../images/identification/logo.png',
    modalInfoUrl: '../../images/default.jpg',
    modalInfo: '暂无相关信息'
  },

  // 相册响应函数
  xiangce(e) {
    let tempFiles;
    let tempFilePaths;
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        tempFiles = res.tempFiles[0].size;
        tempFilePaths = res.tempFilePaths[0];
        _this.setData({
          tempFilePaths:tempFilePaths
        })
        if (tempFiles > 3000000) {
          wx.showToast({
            title: '图片大小大于3M',
            icon: 'none',
            duration: 2000
          });
          return;
        }
        wx.showLoading({
          title: '识别中',
        });
        this.uploadF(tempFilePaths);
        setTimeout(function () {
          wx.hideLoading();
        }, 5000);
      }
    });
  },

  // 相机响应函数
  camera() {
    let ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: "normal",
      success: (res) => {
        let tempFilePaths = res.tempImagePath;
        this.setData({
          camera: false
        });
        wx.showLoading({
          title: '识别中',
        });
        this.uploadF(tempFilePaths)
        setTimeout(function () {
          wx.hideLoading();
        }, 1000)
      }
    })
  },

  // 图片上传
  uploadF(path) {
    let name = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
    wx.cloud.uploadFile({
      cloudPath: name,
      filePath: path, // 文件路径
    }).then(res => {
      let id = res.fileID;
      var _this = this
      // 调用云函数识别图片
      wx.cloud.callFunction({
        name: 'identificate',
        data: {
          fileID: id
        },
        
      }).then(res => {
        console.log(res.result.result)
        //console.log("第一条结果介绍：",res.result.result[0].baike_info.description)
        //console.log("第二条结果介绍：", res.result.result[1].baike_info.description)
        for (var i = 0; i < res.result.result.length; i++){
          var temp = parseFloat(res.result.result[i].score);
          res.result.result[i].score = (temp*100).toFixed(2).toString()+'%';
        }
        
        _this.setData({
          resultList: res.result.result
        })
        // 删除照片
        wx.cloud.deleteFile({
          fileList: [id]
        }).then(res => {
        }).catch(error => {
        })
      }).catch(err => {
        console.log(err)
      });
    }).catch(error => {
    });
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '动物识别',
      path: '/pages/Identification/Identification',
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 500
          });
        }
      },
      fail: function (res) {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          wx.showToast({
            title: '分享取消',
            icon: 'loading',
            duration: 500
          })
        }
      }
    }

  },
  modalInfo: function(item){
    console.log(item)
  },
  //百科模态框
  showModal(e) {
    console.log(e)
    this.setData({
      modalName: e.currentTarget.dataset.target,
      modalInfoUrl: e.currentTarget.dataset.item.baike_info.image_url,
      modalInfo: e.currentTarget.dataset.item.baike_info.description
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      modalInfoUrl:'../../images/default.jpg',
      modalInfo:'暂无相关信息'
    })
  }
})

