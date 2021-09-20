const { net } = require("../../utils/util")

// pages/info/info.js
Page({
  data: {
    id: null,
  },
  onLoad: function (options) {
    var that = this
    getApp().globalData.isLogin && that.setData({userid:getApp().globalData.userInfo.userid})
    const {id} = options
    net.post('/info/id/'+id)
    .then(res=>{
      that.setData({
        info: res[0]
      })
    })
    net.post('/info/comment/infoid/'+id)
    .then(res=>{
      that.setData({
        comments: res
      })
    })
  },
  onShow: function (options) {
    // var that = this

    // getApp().globalData.isLogin && that.setData({userid:getApp().globalData.userInfo.userid})
   
    // const {id} = options
    // net.post('/info/id/'+id)
    // .then(res=>{
    //   that.setData({
    //     info: res[0]
    //   })
    // })
    // net.post('/info/comment/infoid/'+id)
    // .then(res=>{
    //   that.setData({
    //     comments: res
    //   })
    // })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // editInfo: function(e){
  //   getApp().toPage('liuyan',{infoid:e.currentTarget.id})
  // },
  previewImage: function (e) {
    var that = this
    const id = e.currentTarget.id
    wx.previewImage({
      current: that.data.info.imgs[id], // 当前显示图片的http链接
      urls: that.data.info.imgs // 需要预览的图片http链接列表
    })
  },
  kefu: function (e) {
    var that = this
    const tk = getApp().globalData.isLogin ? getApp().globalData.userInfo.token : null
    const nm = getApp().globalData.isLogin ? getApp().globalData.userInfo.nick_name : '一位游客'
    net.post('/info/comment/insert',{
      token: tk,
      infoid: that.data.info.infoid,
      comment: nm+'联系了物主'
    }).then(res=>{
      console.log(res)
    })
  }
})