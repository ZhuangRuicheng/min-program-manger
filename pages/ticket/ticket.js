// pages/ticket/ticket.js
const app = getApp()
var util = require('../../utils/util.js');
var Interface = require('../../utils/url.js');
var request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight,//获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight,//获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    ticketList: [],
    disableTicketList: [],
    showModalStatus: false,
    popupHotelName:'',
    popupTicketName:'',
    popupTicketqrCodeUrl:'',
    popupCode:'',
    disable:'',
    useBtnShow:false,
    hotelName:'',
    isUsed:false,
    isLastPage:false,
    date:'',
    voucherId:'',
    hotelId:'',
    status:'',
    isOpenCancel:false
  },
  //禁止出现弹框底部滑动
  preventTouchMove:function(e){},
  /**
   * 弹出层函数
   */
  showModal: function (e) {
    this.setData({
      showModalStatus: true
    })
    // 弹出层请求数据渲染
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var idx = e.currentTarget.dataset.idx;
    var hotelId = e.currentTarget.dataset.hotelid;
    var url = util.url + Interface.getBreakfastVoucherDetail;
    var params = {
      "voucherId": idx,
      "hotelId": hotelId,
    };
    var successData = function (res) {
      console.log(successData)
          that.setData({
            hotelName: res.data.data.hotelName,
            popupTicketqrCodeUrl: 'data:image/png;base64,'+res.data.data.qrCodeBase64,
            popupCode: res.data.data.digital,
            status: res.data.data.status,
            date: res.data.data.expiryTime,
            isOpenCancel: res.data.data.isOpenCancel,
            voucherId: res.data.data.voucherId
          })
    };
    that.findMyCouponList(url, params, that, successData)
    
  },
  hideModal: function () {
      this.setData({
        showModalStatus: false
      })
    var that = this;
    that.publicGetTitcket(that);
  },
  //弹出选择是否使用按钮
  orUse:function(e){
    this.setData({
      showModalStatus:false,
      useBtnShow:true
    })
  },
  //暂不使用按钮事件
  NotUse:function(e){
    this.setData({
      showModalStatus: true,
      useBtnShow: false
    })
  },
  //票券使用请求
  confirmUse:function(e){
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var HotelId = wx.getStorageSync("HotelId");
    var ticketId = that.data.voucherId;
    var url = util.url + Interface.useBreakfastCoupon;
    var params = {
      "hotelId": HotelId,
      "voucherId": ticketId
    };
    var successData = function(res){
      if (res.data.code == 0) {
        setTimeout(function () {
          util.showToastMsg("使用成功");
        }, 1000)

        that.setData({
          showModalStatus: false,
          useBtnShow: false
        })
        var url = util.url + Interface.findMyCouponList;
        var params = {
          "pageSize": 15,
        };
        var successData = function (res) {
          that.setData({
            ticketList: res.data.data.breakfastVouchers,
            // isLastPage: successData.data.data.isLastPage,
          })
        };
        that.findMyCouponList(url, params, that, successData)
      } else {
        util.showToastMsg(res.data.msg);
        that.setData({
          showModalStatus: false,
          useBtnShow: false
        })
      }
    };
    var failData = function(res){};
    request.Request("POST", "提交中", url, params, successData, failData)
  },
  //我的票券函数
  findMyCouponList: function (url, params, that, successData){
    // var authenticat = wx.getStorageSync("authenticat");
    var HotelId = wx.getStorageSync("HotelId");
    var failData = function(res){};
    // 获取可用券请求
    request.Request("GET", "加载中", url, params, successData, failData)
  },
  publicGetTitcket:function(that){
    var url = util.url + Interface.findMyCouponList;
    var params = {
      "pageSize": 15,
    };
    var successData = function (res) {
      that.setData({
        ticketList: res.data.data.breakfastVouchers,
      })
    };
    that.findMyCouponList(url, params, that, successData)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.publicGetTitcket(that);
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
    var that = this;
    var len = that.data.ticketList.length;
    var voucherId = that.data.ticketList[len - 1].voucherId;
    var authenticat = wx.getStorageSync("authenticat");
    var HotelId = wx.getStorageSync("HotelId");
    var url = util.url + Interface.findMyCouponList;
    var params = {
      "voucherId": voucherId,
      "pageSize": 15,
    };
    var successData = function (res) {
      if (res.data.data.breakfastVouchers == ''){
        util.showToastMsg("已加载完全")
      }else{
        that.setData({
          ticketList: that.data.ticketList.concat(res.data.data.breakfastVouchers),
        })
      }
    };
    that.findMyCouponList(url, params, that, successData)
    // 获取可用券请求
    // if(!that.data.isLastPage){
    //   that.findMyCouponList(url, params, that, successFunction)
     
    // }else{
    //   util.showToastMsg('已加载完全')
    // }
    
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