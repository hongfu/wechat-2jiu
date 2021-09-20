// pages/infos/infos.js
import { net,store } from "../../utils/util";

Page({
  data: {
  },
  onReady: function (options) {
    var that = this
    //强制刷新
    const {force} = options||false
    if(force){
      that.getInfos()
    }else{
      //本地缓存
      store.get('iExTm').then(res=>{
        res != null && res>new Date().getTime()
        ? store.get('infos').then(res=>{
          that.setData({
            infos: res,
            appInfo: getApp().globalData.appInfo
          })
          store.set('infos',res)
        })
        : that.getInfos()
      })
    }
  },
  onPullDownRefresh: function(){
    this.getInfos()
    wx.stopPullDownRefresh()
  },
  getInfos: function () {
    var that = this
    net.post('/info/list')
      .then(res => {
          that.setData({
            infos: res,
            appInfo: getApp().globalData.appInfo
          });
          store.set('infos',res).then((store.set('iExTm',new Date().getTime()+60*1000)))
      })
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
  },
  toLiuyan: function () {
    getApp().toPage('liuyan')
  },
  toMy(){
    getApp().toPage('my')
  }
})