const { net } = require("../../utils/util")

// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getApp().globalData.isLogin && this.setData({userid:getApp().globalData.userInfo.userid})
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

  },
  toInfos: function () {
    getApp().toPage('infos')
  },
  editInfo: function(e){
    getApp().toPage('liuyan',{infoid:e.currentTarget.id})
  },
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