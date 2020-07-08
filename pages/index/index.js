//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    motto: '基岩版服务器管理',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ip:"",
    port:'',
    propertie :{},
    logined:false,
  },
  udpSocket:null,
  propertie:{},
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData(
      {
        ip:(wx.getStorageSync('ip'||"")),
        propertie:{"ip":(wx.getStorageSync('ip'||""))}
      }
    )
    this.initUDP()
    console.log("storage "+this.data.ip)
    if(this.data.ip != '') this.loginee()
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  oninput: function(e){
    this.data.ip=e.detail.value
  },
  loginee: function(e){
    if(this.data['ip']=="") wx.showToast({title: '请输入内容',icon:"none"})
    else {
      wx.setStorageSync('ip', this.data.ip)
      this.propertie["ip"] = this.data.ip
      this.setData({ip:this.data.ip,propertie:this.propertie})
      console.log("data " + this.data.ip)
      this.udpSocket.send_recv(
        JSON.stringify({"status":"login","cookie-set":Math.random()}),
        [this.data.ip,19131],
        {
          fail:()=>util.toast("服务器连接超时"),
          success:()=>this.setData({logined:true})
        }
      )
      
    }
  },
  initUDP:function(){
    const udpSocket=new util.UDPsocket()
    
    let port=udpSocket.bind()
    this.udpSocket=udpSocket
    this.propertie["port"] = port
    this.setData({port:port,propertie:this.propertie})
    console.log(port)
  },
  test:function(){
    var a= new util.UDPsocket()
    a.bind()
    a.send_recv("aa",[this.data.ip,19131],{
      fail:()=>util.toast("连接超时"),
      success:(d)=>console.log(d)
    })
  }
})
