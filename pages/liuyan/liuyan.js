// liuyan.js
import { net,store,ui } from "../../utils/util";

Page({
  data: {
    title: '',
    title_length: 0,
    txt: '',
    txt_length: 0,
    imgs: [],
    imgs_length: 0,
    kouling: '',
    can_sale: true,
    sale_price: 0,
    can_exchange: false,
    can_give: false,
    done: true
  },
  onLoad(options) {
    var that = this
    getApp().needLogin()
    if(options.infoid){
      this.data.infoid = options.infoid
      net.post('/info/id/'+this.data.infoid)
      .then(res=>{
        res = res[0]
        that.setData({
          can_exchange: res.can_exchange,
          can_sale: res.can_sale,
          can_give: res.can_give,
          sale_price: res.sale_price,
          kouling: res.kouling,
          title: res.title,
          title_length: res.title.length,
          txt: res.txt,
          txt_length: res.txt.length,
          imgs: res.imgs,
          imgs_length: res.imgs.length,
        })
        })
    }
  },
  onUnload(){
    !this.data.infoid && this.data.done==false && store.set('lsti',this.data)
  },
  onShow(){
    var that = this
    //检查退出缓存
    !this.data.infoid && store.pop('lsti').then(res=>{
      if(res!=null){
        ui.queren('提示','有未完成的信息，是否继续？',()=>{
          that.setData({
            can_exchange: res.can_exchange,
            can_sale: res.can_sale,
            can_give: res.can_give,
            sale_price: res.sale_price,
            kouling: res.kouling,
            title: res.title,
            title_length: res.title_length,
            txt: res.txt,
            txt_length: res.txt_length,
            imgs: res.imgs,
            imgs_length: res.imgs_length,
          })
        })
      }
    })
  },
  someInput(e){
    var that = this
    that.data.done = false
    const key = e.currentTarget.id
    let obj = new Object()
    obj[key] = e.detail.value
    if(e.type=='input'){
      const lengthKey = key+'_length'
      obj[lengthKey] = e.detail.value.length
    }
    that.setData(obj)
  },
  chooseImg(){
    var that = this
    that.data.done = false
    wx.chooseImage({
      count: 5,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        for (let i = 0; i < res.tempFiles.length; i++) {
          if(res.tempFiles[i].size > 2*1024*1024) {
            wx.showToast({ title: '第'+(i+1)+'个文件大小应小于2M' })
            return false
          };
        }
        that.setData({
          imgs: tempFilePaths,
          imgs_length: tempFilePaths.length
        })
      }
    })
  },
  previewImage: function(e){
    var that = this
      wx.previewImage({
          current: e.currentTarget.id, // 当前显示图片的http链接
          urls: that.data.imgs // 需要预览的图片http链接列表
      })
  },
  submitInfo(that,modify=false){
    let data = {
      can_exchange: that.data.can_exchange,
      can_sale: that.data.can_sale,
      can_give: that.data.can_give,
      sale_price: that.data.sale_price,
      kouling: that.data.kouling,
      title: that.data.title,
      txt: that.data.txt,
      token: getApp().globalData.userInfo.token
    }
    let imgs = []
    let c = that.data.imgs.length
    //嵌套图片上传
    for (let i = 0; i < that.data.imgs.length; i++) {
      const f = that.data.imgs[i];
      net.upload('/uploadimg',f,'imgs')
      .then((res)=>{
        imgs.push(res[0].path)
      })
      .finally(()=>{
        c--
        if(c===0){
          data.imgs = imgs
            if(modify){
              net.post('/info/modify/'+that.data.infoid,data)
              .then(result=>{
                that.data.done = true
                wx.showToast({
                  mask: true,
                  title: '信息已修改成功',
                  icon: 'success',
                  duration: 2000
                })
              })
            }else{
              net.post('/info/insert',data)
              .then(result=>{
                that.data.done = true
                wx.showToast({
                  mask: true,
                  title: '信息已添加成功',
                  icon: 'success',
                  duration: 2000
                })
              })
            }
        }
      }
      )
    }
  },
  done: function(){
    var that = this
    if(that.data.infoid){
      ui.queren('提示','确定要修改信息么？',()=>{that.submitInfo(that,true)})
    }else{
      ui.queren('提示','作为新信息提交？',()=>{that.submitInfo(that)})
    }
  },
  toMy: function(){
    getApp().toPage('my')
  }
})
