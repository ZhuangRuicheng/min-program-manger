// pages/meals/mealsOrder/mealsOrder.js
const app = getApp()
var util = require('../../../utils/util.js');
var Interface = require('../../../utils/url.js');
var request = require('../../../utils/request.js');
var storeRequest = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight, //获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight, //获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    roomNum: wx.getStorageSync("roomNum"),
    title: '客房点餐',
    img: '../../img/note.png',
    goodsList: [],
    countNumber: 0,
    countMoney: 0,
    name: "",
    remarks: "",
    QrModalStatus: false,
    adjust_position: true,
    totalQuantity:'',
    totalPrice:''
  },
  //提示框隐藏
  QRhideModal: function(e) {
    this.setData({
      QrModalStatus: false
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  formSubmit: function(e) {
    // 获取订单号请求
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var name = that.data.name;
    var remarks = that.data.remarks;
    var formId = e.detail.formId
    if (name == '') {
      util.showToastMsg('请输入您的名字')
      return
    } else {
      wx.request({
        url: util.url + Interface.mealsCreateOrder,
        data: {
          'name': name,
          'remarks': remarks,
          "formId": formId
        },
        header: {
          'content-type': 'application/json',
          'Token': authenticat
        },
        method: 'POST',
        success: function(res) {
          console.log(res);
          //console.log("创建订单号：" + res.data.data.tradeNo)

          if (res.data.code == 0) {
            //价格为零
            if (!res.data.data.tradeNo) {
              wx.showLoading({
                title: '领取中',
                mask: true,
              })
              setTimeout(function() {
                util.showToastMsg("领取成功")
                that.setData({
                  QrModalStatus: true
                })
                wx.setStorageSync("customerName", name)
              }, 1000)

            } else {
              var orderNo = res.data.data.tradeNo;
              wx.request({
                url: util.url + Interface.unifiedOrder,
                data: {
                  tradeNo: orderNo,
                },
                header: {
                  'content-type': 'application/json',
                  'Token': authenticat
                },
                method: 'POST',
                success: function(res) {
                  console.log(res);
                  // 微信支付
                  wx.requestPayment({
                    'timeStamp': res.data.data.timeStamp,
                    'nonceStr': res.data.data.nonceStr,
                    'package': res.data.data.packageValue,
                    'signType': res.data.data.signType,
                    'paySign': res.data.data.paySign,
                    'success': function(res) {
                      that.setData({
                        QrModalStatus: true
                      })
                      wx.setStorageSync("customerName", name)
                      console.log(res)
                    },
                    'fail': function(res) {

                    }
                  })
                },
                fail: function(res) {},
                complete: function(res) {},
              })
            }


          } else {
            util.showToastMsg(res.data.msg);
            setTimeout(function() {
              wx.navigateBack({
                delta: 1,
              })
            }, 3000)

          }


        },
        fail: function(res) {},
        complete: function(res) {
          setTimeout(function() {
            wx.hideLoading()
          }, 2000)
        },
      })
    }
  },
  //文本框输入更改
  inputChange: function(e) {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var authenticat = wx.getStorageSync("authenticat");
    var customerName = wx.getStorageSync("customerName");
    that.setData({
      name: customerName
    })

    //购物车请求
    wx.request({
      url: util.url + Interface.mealsGetCardList,
      header: {
        'content-type': 'application/json',
        'Token': authenticat
      },
      method: 'GET',
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            goodsList: res.data.data.cartItems,
            totalPrice: res.data.data.totalPrice,
            totalQuantity: res.data.data.totalQuantity
          })
        } else {
          wx.redirectTo({
            url: '../../Scavenging/Scavenging',
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})