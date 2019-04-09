// pages/clearRoom/clearRoom.js
const app = getApp()
var util = require('../../utils/util.js');
var Interface = require('../../utils/url.js');
var request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'请即打扫',
    name: "",
    remarks: "",
    checked: false,
    QrModalStatus:false,
    adjust_position: true,
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight,//获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight,//获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
  },
  Bindtapchecked:function(e){
    if (!this.data.checked) {
      this.setData({
        checked: true
      })
    } else {
      this.setData({
        checked: false
      })
    }
  },
  //提示框隐藏
  QRhideModal:function(e){
    this.setData({
      QrModalStatus:false
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  //文本框输入更改
  inputChange: function (e) {
    switch (e.currentTarget.id) {
      case 'name':

        this.setData({
          name: e.detail.value.replace(/\s+/g, '')
        })
        break;
      case 'remarks':
        this.setData({
          remarks: e.detail.value.replace(/\s+/g, '')
        })

        break;
    }
  },
  //表单信息提交
  formSubmit:util.throttle(function (e) {
      if(this.data.checked){
      var name = this.data.name;
      if(name == ''){
          util.showToastMsg('请输入您的名字')
          return
      }else{
       var that = this;
       var remarks = that.data.remarks;
       var formId = e.detail.formId;
       var url = util.url + Interface.cleanRoom;
        var params = {
          "name": name,
          "remarks": remarks,
          "formId": formId
        };
        var successData = function(res){
          if (res.data.code == 0) {
            that.setData({
              name: '',
              remarks: '',
              checked: false,
              QrModalStatus: true
            })
            wx.setStorageSync("customerName", name)
          } else if (res.data.code == 10) {
            util.showToastMsg(res.data.msg)
            wx.clearStorageSync("authenticat")
            wx.clearStorageSync("loginToken")
            wx.redirectTo({
              url: '../Scavenging/Scavenging',
            })
          } else {
            util.showToastMsg(res.data.msg)
          }
        };
        var failData = function(res){};
       request.Request("POST", "提交中", url, params, successData, failData)
      }
    }else{
      util.showToastMsg('请勾选服务状态')
      return
    }
  }, 3000),

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var customerName = wx.getStorageSync("customerName");
    that.setData({
      name: customerName
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
    var that = this;
    that.setData({
      tabbarColor: app.globalData.tabbarColor,
      titleColor: app.globalData.titleColor
    })
    var authenticat = wx.getStorageSync("authenticat");
    var HotelId = wx.getStorageSync("HotelId");
    var url = util.url + Interface.cleanRoomPvAdd;
    Interface.PVCount(url, HotelId, authenticat);
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
    //数据统计
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var HotelId = wx.getStorageSync("HotelId");
    var hotelName = wx.getStorageSync("hotelName");
    var url = util.url + Interface.share;
    Interface.PVCount(url, HotelId, authenticat);
    return {
      title: hotelName + "，不一样的客房入住体验！",
      path: 'pages/index/hotelReservation/hotelReservation?HotelId='+HotelId,
      imageUrl: util.imgUrl + '/shareImg.png'
    }
  }
})