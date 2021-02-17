// pages/addVideo/addVideo.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modification: false,
    author: '请选择分类',
    form: {
      name: '',
      banner: false,
      show: false,
      img: '',
      uploadImg: true,
      video: '',
      videoStatus: true,
      author: '',   
      website:''

    },

  },
  //删除title图片
  remImg() {
    const that = this;
    that.setData({
      [`form.uploadImg`]: true,
      [`form.img`]: ''
    })
    console.log(that.data.form)
  },
  // 删除视频
  remVideo() {
    const that = this;
    that.setData({
      [`form.videoStatus`]: true,
      [`form.video`]: ''
    })
    console.log(that.data.form)
  },
  //轮播
  switchChange: function (e) {
    const that = this;
    that.setData({
      ['form.banner']: e.detail.value
    })
  },
  //显示
  switchShowChange(e) {
    const that = this;
    that.setData({
      ['form.show']: e.detail.value
    })
  },


  //上传title图片
  uploadImg() {
    const that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.showLoading({
          title: '上传中...',
        })
        console.log(res, 11111)
        let fileName = 'coverList/';
        const tempFilePaths = res.tempFilePaths[0];
        //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
        let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
        //拓展名
        var fileExt = tempFilePaths.replace(/.+\./, "");
        //拼接成图片名
        let keepname = time + '.' + fileExt;
        wx.cloud.uploadFile({
          cloudPath: fileName + keepname,
          filePath: tempFilePaths, // 文件路径
        }).then(res => {
          // get resource ID
          // console.log(res.fileID)
          wx.hideLoading()
          that.setData({
            [`form.uploadImg`]: false,
            [`form.img`]: res.fileID
          })
        }).catch(error => {
          // handle error
        })

      }
    })
  },
  // 上传视频
  uploadVideo() {
    const that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        wx.showLoading({
          title: '上传中...',
        })
        console.log(res, 11111)
        let fileName = 'videoList/';
        let videoSrc = 'https://636c-cloud-kf4kf-1300208308.tcb.qcloud.la/videoList/';
        const tempFilePaths = res.tempFilePath;
        //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
        let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
        //拓展名
        var fileExt = tempFilePaths.replace(/.+\./, "");
        //拼接成图片名
        let keepname = time + '.' + fileExt;
        console.log(keepname, 9999)
        wx.cloud.uploadFile({
          cloudPath: fileName + keepname,
          filePath: tempFilePaths, // 文件路径
        }).then(res => {
          // get resource ID
          console.log(res.fileID)
          wx.hideLoading()
          that.setData({

            [`form.videoStatus`]: false,
            [`form.video`]: videoSrc + keepname

          })
        }).catch(error => {
          // handle error
        })

      }
    })
  },

  //获取文章字
  getName(e) {
    const that = this;
    that.setData({
      ['form.name']: e.detail.value
    })
  },
  //获取描述
  getUrl(e) {
    const that = this;
    that.setData({
      ['form.website']: e.detail.value
    })
    console.log(e,9999)
  },
  //测试人数
  getName(e) {
    const that = this;
    that.setData({
      ['form.name']: e.detail.value
    })
  },
  //获取ID
  getId(e) {
    const that = this;
    that.setData({
      ['form.itemId']: e.detail.value
    })
  },

  //提交
  btn() {
    const that = this;
    const form = that.data.form;

    if (form.img != '' && form.author != '') {
      if (that.data.modification) {
        wx.showLoading({
          title: '加载中...',
        })
        db.collection('test').doc(that.data.form._id).update({
            data: {

              name: form.name,
              img: form.img,
              video: form.video,
              author: form.author,
              show: form.show,
              banner: form.banner,
              website:form.website,
              date: new Date()
            },

          })
          .then(res => {
            console.log(88)
            wx.redirectTo({
              url: '/pages/index/index?id=1'
            })
            wx.hideLoading()

          })
      } else {
        db.collection('test').add({
          data: {
            name: form.name,
            img: form.img,
            video: form.video,
            author: form.author,
            show: form.show,
            banner: form.banner,
            website:form.website,
            date: new Date()
          }
        }).then(res => {
          console.log(99)
          wx.redirectTo({
            url: '/pages/index/index?id=1'
          })
          wx.hideLoading()

        })

      }

    } else {
      wx.showToast({
        icon: 'none',
        title: '内容填写不完整'
      })
    }
  },
  //选着分类
  opction() {
    const that = this;
    wx.showActionSheet({
      itemList: ['推荐', '心情', '明星', '励志', '动漫', '风景'],
      success(res) {
        let author = '';
        switch (res.tapIndex + 1) {
          case 1:
            that.setData({
              ['form.author']: res.tapIndex + 1,
              author: '推荐'
            })
            return;
          case 2:
            that.setData({
              ['form.author']: res.tapIndex + 1,
              author: '心情'
            })
            return;
          case 3:
            that.setData({
              ['form.author']: res.tapIndex + 1,
              author: '明星'
            })
            return;
          case 4:
            that.setData({
              ['form.author']: res.tapIndex + 1,
              author: '励志'
            })
            return;
          case 5:
            that.setData({
              ['form.author']: res.tapIndex + 1,
              author: '动漫'
            })
            return;
          case 6:
            that.setData({
              ['form.author']: res.tapIndex + 1,
              author: '风景'
            })
            return;
        }

      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.showLoading({
      title: '加载中...',
    })

    if (options.id) {
      db.collection('test').doc(options.id).get().then(res => {
        wx.hideLoading()
        that.setData({
          form: res.data,
          modification: true
        })
        if (res.data.img) {
          that.setData({
            [`form.uploadImg`]: false
          })
        } else {
          that.setData({
            [`form.uploadImg`]: true
          })
        }
        if (res.data.video) {
          that.setData({
            [`form.videoStatus`]: false
          })
        } else {
          that.setData({
            [`form.videoStatus`]: true
          })
        }
        switch (res.data.author) {
          case 1:
            that.setData({
              author: '推荐'
            })
            return;
          case 2:
            that.setData({
              author: '心情'
            })
            return;
          case 3:
            that.setData({
              author: '明星'
            })
            return;
          case 4:
            that.setData({
              author: '励志'
            })
            return;
          case 5:
            that.setData({
              author: '动漫'
            })
            return;
          case 6:
            that.setData({
              author: '风景'
            })
            return;

        }
      })
    } else {
      wx.hideLoading()
    }
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