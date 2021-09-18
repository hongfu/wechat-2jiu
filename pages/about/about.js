// pages/about/about.js
import { net,store } from "../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ani: 'start',
    progre: 0,
    isLogin: false
  },

  onLoad: function () {
    var that = this

    getApp().globalData.isLogin
    ? that.setData({
      progre:100,
      isLogin: getApp().globalData.isLogin,
      appInfo: getApp().globalData.appInfo
    })
    : that.setData({
        progre:50,
        isLogin: getApp().globalData.isLogin,
        appInfo: getApp().globalData.appInfo
      })
  },

  wxupdate: function(e) {
    var that = this
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const{nickName,avatarUrl,gender,province,city} = res.userInfo
        //前端登录微信
        wx.login({
          success: res => {
            const {code} = res
            //后端存储微信登录信息
            net.post('/user/wxregister',{
              code: code,
              nick_name: nickName,
              avatar_url: avatarUrl,
              gender: gender,
              address: province+' '+city
            }).then(res=>{
                //本地保存用户信息
                that.setData({ 
                  progre: 100,
                  isLogin: true
                 })
                getApp().globalData.userInfo = res[0]
                getApp().globalData.isLogin = true
                store.set('2jtk',getApp().globalData.userInfo.token)
            })
           
          }
        })
      }
    })
  },

  // wxlogin: function () {
  //   var that = this
  //   // 登录
  //   wx.login({
  //     success: res => {
  //       const wxdata = res
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //       net.post('/user/wxlogin',wxdata).then(res=>{
  //         //处理和保存回传内容
  //         app.globalData.userInfo = res.data.result[0]
  //         that.setData({ 
  //           progre: 100,
  //           isLogin: true
  //          })
  //         store.set('2jtk',res.result[0].token)
  //       })
        
  //       // wx.request({
  //       //   url: config.API+'/user/wxlogin',
  //       //   method: 'POST',
  //       //   data: wxdata,
  //       //   success(res) {
  //       //     if (res.data.code === 1) {
  //       //       //处理和保存回传内容
  //       //       app.globalData.userInfo = res.data.result[0]
  //       //       that.setData({ 
  //       //         progre: 100,
  //       //         isLogin: true
  //       //        })
  //       //       store.set('2jtk',res.result[0].token)
  //       //     }
  //       //     else if (res.data.code === -1) {
  //       //       //用户未找到，显示登录按钮
  //       //       that.setData({
  //       //         unRegistered: true
  //       //       })
  //       //     }

  //       //   },
  //       //   fail(err) {
  //       //     console.log(err)
  //       //   }
  //       // })
  //     }
  //   })
  // },
  toMy: function(){
    getApp().toPage('my')
  },
  toHome: function(){
    getApp().toPage('infos')
  },
  buttonShow: function(){
    this.setData({
      ani: 'done'
    })
  }
})