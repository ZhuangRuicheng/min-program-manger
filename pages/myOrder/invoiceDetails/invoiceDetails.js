// pages/myOrder/invoiceDetails/invoiceDetails.js
const app = getApp()
var util = require('../../../utils/util.js');
var Interface = require('../../../utils/url.js');
var orderDetails = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight,//获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight,//获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    orderDetail: {},
    finishUserInfo: {},
    orderInfo:[],
    invoiceTitle:'',
    invoiceType:'',
    taxNumber:'',
    bankName:'',
    telephone:'',
    invoiceItem:'',
    companyAddress:'',
    bankAccount:'',
    color: '',
    acceptColor: '',
    finishColor: '',
    satisfiedImg: '../../img/satisfiedImg_n.png',
    NotSatisfiedImg: '../../img/NotSatisfied.png',
    satisfiedShow: true,
    NotSatisfiedShow: true,
    two: '0.5',
    five: '1.1',
    ten: '2.5',
    twenty: '6.6',
    fifty: '8.8',
    hiddenmodalput: false,
    text: '',
    status:'',
    code:'',
    ladyImg: 'https://eimg.doorconn.com/hotel_assistant/images/header.png',
    aFewWordsInput: '',
    orderId: ''
  },
  //捎句话信息提交
  aFewWords: function (e) {
    var that = this;
    var aFewWordsInput = that.data.aFewWordsInput;
    var authenticat = wx.getStorageSync("authenticat");
    var orderId = that.data.orderId;
    console.log("aFewWordsInput:" + aFewWordsInput)
    if (aFewWordsInput == '') {
      util.showToastMsg("请输入您想说的话");
      return
    } else {
      wx.showLoading({
        title: '提交中',
      })
      wx.request({
        url: util.url + Interface.aFewWords,
        data: {
          'afewWords': aFewWordsInput,
          'orderId': orderId
        },
        header: {
          'Content-Type': 'application/json',
          'Token': authenticat
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          console.log(res)
          if (res.data.code == 0) {
            that.setData({
              aFewWordsInput: ''
            })
          } else {
            util.showToastMsg(res.data.msg)
          }
        },
        fail: function (res) { },
        complete: function (res) {
          wx.hideLoading();
          var code = that.data.orderId;
          var url = util.url + Interface.getOrderByIdCustomer;
          //订单详情请求
          //成功回调函数
          var successFunction = function (successData) {
            that.setData({
              orderDetail: successData.data.data.orderDetail,
              customerEvaluate: successData.data.data.orderDetail.customerEvaluate,
              finishUserInfo: successData.data.data.finishUserInfo,
            })
          }
          //失败回调函数
          var failFunction = function (failData) {

          };
          orderDetails.orderDetails(code, authenticat, that, url, successFunction, failFunction, "加载中...")
        },
      })
    }
  },
  //获取捎句话内容
  aFewWordsInput: function (e) {
    this.setData({
      aFewWordsInput: e.detail.value
    })
  },
  satisfied: function (e) {
    var that = this;
    var customerEvaluate = that.data.customerEvaluate;
    var SATISFIED = 'SATISFIED';
    if (customerEvaluate != '') {
      util.showToastMsg('您已经评价过')
      return
    } else {
      if (that.data.status == 'FINISH') {
        var orderId = that.data.orderId;
        var authenticat = wx.getStorageSync("authenticat");
        var url = util.url + Interface.evaluate;
        var succesFunction = function (data) {
          that.setData({
            satisfiedImg: '../../img/satisfied.png',
            NotSatisfiedShow: false
          })
        };
        orderDetails.customerEvaluate(url, orderId, SATISFIED, authenticat, succesFunction, that, util)
      } else {
        util.showToastMsg('订单尚未处理完成，暂不能进行评价')
        return
      }
    }
  },
  NotSatisfied: function (e) {
    var that = this;
    var customerEvaluate = that.data.customerEvaluate;
    var SATISFIED = 'DISSATISFIED';
    if (customerEvaluate != '') {
      util.showToastMsg('您已经评价过')
      return
    } else {
      if (that.data.status == 'FINISH') {
        var orderId = that.data.orderId;
        var authenticat = wx.getStorageSync("authenticat");
        var url = util.url + Interface.evaluate;
        var succesFunction = function (data) {
          that.setData({
            NotSatisfiedImg: '../../img/NotSatisfiedImg_s.png',
            satisfiedShow: false
          })
        };
        orderDetails.customerEvaluate(url, orderId, SATISFIED, authenticat, succesFunction, that, util)
      } else {
        util.showToastMsg('订单尚未处理完成，暂不能进行评价')
        return
      }
    }
  },
  //金额打赏
  rewardCost: function (e) {
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var money = e.currentTarget.id;
    var urlOrderNo = util.url + Interface.reward;
    var unifiedOrder = util.url + Interface.unifiedOrder;
    var orderId = that.data.orderId;
    var rewardSuccess = function (data) {
      that.setData({
        // showModalStatus: false,
        hiddenmodalput: false,
      })
      var code = that.data.orderId;
      var url = util.url + Interface.getOrderByIdCustomer;
      //订单详情请求
      //成功回调函数
      var successFunction = function (successData) {
        that.setData({
          orderDetail: successData.data.data.orderDetail,
          customerEvaluate: successData.data.data.orderDetail.customerEvaluate,
          finishUserInfo: successData.data.data.finishUserInfo,
        })
      }
      //失败回调函数
      var failFunction = function (failData) {

      };
      orderDetails.orderDetails(code, authenticat, that, url, successFunction, failFunction, "加载中...")
    };
    orderDetails.reward(urlOrderNo, unifiedOrder, money, rewardSuccess, authenticat, that, util, orderId)

  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: false,
      text: '',
      // showModalStatus: false,

    });
  },
  //随意打赏
  atWill: function (e) {
    this.setData({
      hiddenmodalput: true
    })
  },
  //获取输入文本框值
  inputContent: function (e) {
    this.setData({
      text: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var code = options.orderId;
    var url = util.url + Interface.getOrderByIdCustomer;
    that.setData({
      orderId: code
    })
    //订单详情请求
    //成功回调函数
    var successFunction = function (data) {
      that.setData({
        orderDetail: data.data.data.orderDetail,
        orderInfo: JSON.parse(data.data.data.orderDetail.orderInfo),
        customerEvaluate: data.data.data.orderDetail.customerEvaluate,
        finishUserInfo: data.data.data.finishUserInfo,
      })
    }
    //失败回调函数
    var failFunction = function (failData) {

    };
    orderDetails.orderDetails(code, authenticat, that, url, successFunction, failFunction, "加载中...")
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
    var url = util.url + Interface.allPvAdd;
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