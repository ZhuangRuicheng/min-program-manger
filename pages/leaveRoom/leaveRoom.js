// pages/leaveRoom/leaveRoom.js
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
    value1: '确认房间无遗漏物品',
    value2: '确认是否结清所有消费金额',
    checked1: false,
    checked2: false,
    code: '',
    QrModalStatus: false,
    adjust_position: true,
    focus: false

  },
  //点击完成收起键盘
  bindconfirms: function(e) {
    this.setData({
      focus: true
    })
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
  //跳转到我的发票
  invoice: function(e) {
    wx.redirectTo({
      url: '../invoice/invoice',
    })
  },
  // 复选框自定义触发函数
  checkboxChange1: function(e) {
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    if (!this.data.checked1) {
      this.setData({
        checked1: true,
      })
    } else {
      this.setData({
        checked1: false,
      })
    }

  },
  checkboxChange2: function(e) {
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    if (!this.data.checked2) {
      this.setData({
        checked2: true,
      })
    } else {
      this.setData({
        checked2: false,
      })
    }

  },
  // 自定义函数
  submitInfo: util.throttle(function(e) {
    var that = this
    var name = this.data.name;
    var formId = e.detail.formId;
    console.log(that.data.checked1)
    if (that.data.checked1 != true) {
      util.showToastMsg('请检查是否无遗留物品或者是否已结清所有消费金额')
      return
    } else {
      if (that.data.checked2 != true) {
        util.showToastMsg('请检查是否无遗留物品或者是否已结清所有消费金额')
        return
      } else {
        if (util.stringIsEmpty(name)) {
          util.showToastMsg('请输入您的姓名')
          return
        } else {
          //提交退房信息
          var that = this;
          var remarks = that.data.remarks;
          var url = util.url + Interface.checkout;
          var params = {
            'name': name,
            'remarks': remarks,
            'formId': formId
          };
          var successData = function(res) {
            if (res.data.code == 0) {
              that.setData({
                name: '',
                remarks: '',
                checked1: false,
                checked2: false,
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
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1500)
            }
          };
          var failData = function(res) {};
          request.Request("POST", "提交中", url, params, successData, failData)
        }
      }
    }
  }, 3000),

  inputInfo: function(e) {
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
    var that = this;
    var customerName = wx.getStorageSync("customerName");
    that.setData({
      name: customerName
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
    var that = this;
    that.setData({
      tabbarColor: app.globalData.tabbarColor,
      titleColor: app.globalData.titleColor
    })
    var authenticat = wx.getStorageSync("authenticat");
    var HotelId = wx.getStorageSync("HotelId");
    var url = util.url + Interface.checkOutPvAdd;
    Interface.PVCount(url, HotelId, authenticat);
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
    //数据统计
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var HotelId = wx.getStorageSync("HotelId");
    var hotelName = wx.getStorageSync("hotelName");
    var url = util.url + Interface.share;
    Interface.PVCount(url, HotelId, authenticat);
    return {
      title: hotelName + "，不一样的客房入住体验！",
      path: 'pages/index/hotelReservation/hotelReservation?HotelId=' + HotelId,
      imageUrl: util.imgUrl + '/shareImg.png'
    }
  }
})