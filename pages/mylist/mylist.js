// pages/infos/infos.js
import { net,store } from "../../utils/util";

Page({
  data: {
  },
  onReady: function (options) {
    var that = this
    getApp().needLogin()
    //强制刷新
    const {force} = options||false
    if(force){that.getInfos();return true}
    //本地缓存
    store.get('miExTm').then(res=>{
      res === null && that.getInfos()
      res>new Date().getTime()
      ? store.get('myinfos').then(res=>{
        that.setData({
          infos: res,
          appInfo: getApp().globalData.appInfo
        })
        store.set('myinfos',res)
      })
      : that.getInfos()
    })
  },
  onUnload: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getInfos: function () {
    var that = this
    net.post('/info/mylist',{token: getApp().globalData.userInfo.token})
      .then(res => {
          that.setData({
            infos: res,
            appInfo: getApp().globalData.appInfo
          });
          store.set('myinfos',res).then((store.set('miExTm',new Date().getTime()+10*1000)))
      })
  },

  toAbout: function () {
    getApp().toPage('about')
  },
  toInfo: function (e) {
    getApp().toPage('info',{id:e.currentTarget.id})
  },
  previewImage: function(e){
    var that = this
    const id = e.currentTarget.id
    wx.previewImage({
        current: that.data.infos[id].imgs[0], // 当前显示图片的http链接
        urls: that.data.infos[id].imgs // 需要预览的图片http链接列表
    })
}

})