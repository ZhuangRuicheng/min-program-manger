// pages/self/self.js
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
    index: 0,
    date: '2018-08-28',
    time: '12:00',
    pay:'0',
    adjust_position: true,

      //续住时间数据
    array: ['  1 ', '  2  ', '  3  ', '  4  ','  5  ','  6  ','  7  '],
    objectArray: [
      {
        id: 0,
        name: '  1 晚  '
      },
      {
        id: 1,
        name: '  2 晚  '
      },
      {
        id: 2,
        name: '  3 晚  '
      },
      {
        id: 3,
        name: '  4 晚  '
      },
      {
        id: 4,
        name: '  5 晚  '
      },
      {
        id: 5,
        name: '  6 晚  '
      },
      {
        id: 6,
        name: '  1 周  '
      }
    ],
    name: "",
    remarks: "",
    QrModalStatus: false,
    checkOutDay:'',
    checkOutMonth:'',
    checkOutYear:''
  },

    //  自定义事件函数
  //提示框隐藏
  QRhideModal: function (e) {
    this.setData({
      QrModalStatus: false
    })
    wx.navigateBack({
      delta: 1,
    })
  },
    // 续住事件选择函数
  bindPickerChange: function (e) {

    this.setData({
      index: e.detail.value,
    })
  },
      // 离开日期选择函数
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
      // 离开时间选择函数
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
    //  支付方式选择函数
  // bindPickerPay: function (e) {
  //   this.setData({
  //     pay: e.detail.value
  //   })
  // },
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
      // 续住信息提交
  infoSubmit: util.throttle(function (e) {
    var name = this.data.name;
    if (name == '') {
      util.showToastMsg('请输入您的名字')
      return
    } else {
      var that = this;
      var authenticat = wx.getStorageSync("authenticat");
      var days = that.data.array[that.data.index];
      var date = that.data.date;
      var time = that.data.time;
      var leaveTime = date + " " + time;
      var name = that.data.name;
      var remarks = that.data.remarks;
      var formId = e.detail.formId;
      var url = util.url + Interface.continueStay;
      var params = {
        'days': days,
        'leaveTime': leaveTime,
        'name': name,
        'remarks': remarks,
        'formId': formId
      };
      var successData = function(res){
        if (res.data.code == 0) {
          that.setData({
            name: '',
            remarks: '',
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
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)
        }
      };
      var failData = function(res){};
      request.Request("POST", "提交中", url, params, successData, failData)
    }
  }, 3000),

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    var customerName = wx.getStorageSync("customerName");
    this.setData({
      name: customerName
    })

    var date = new Date();
  
    //当月天数
    var monthDaySize;
    //当月号数
    var checkOutDay = date.getDate();

    //当月月份
    var checkOutMonth = date.getMonth() + 1;
    var checkOutYear = date.getFullYear();
    if (date.getMonth() + 1 == 1 || date.getMonth() + 1 == 3 || date.getMonth() + 1 == 5 || date.getMonth() + 1 == 7 || date.getMonth() + 1 == 8 || date.getMonth() + 1 == 10 || date.getMonth() + 1 == 12) {
      monthDaySize = 31;
      if (checkOutDay - monthDaySize == 0) {
        checkOutDay = "01";
        checkOutMonth = checkOutMonth + 1;
      } else {
        checkOutMonth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        checkOutDay = (date.getDate() + 1) < 10 ? '0' + (date.getDate() + 1) : (date.getDate() + 1);
      }
      if (checkOutDay == 31) {
        checkOutYear = checkOutYear + 1;
      }

    } else if (date.getMonth() + 1 == 4 || date.getMonth() + 1 == 6 || date.getMonth() + 1 == 9 || date.getMonth() + 1 == 11) {
      monthDaySize = 30;
      if (checkOutDay - monthDaySize == 0) {
        checkOutDay = "01";
        checkOutMonth = checkOutMonth + 1;
      } else {
        checkOutMonth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        checkOutDay = (date.getDate() + 1) < 10 ? '0' + (date.getDate() + 1) : (date.getDate() + 1);
      }
    } else if (date.getMonth() + 1 == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((checkOutYear - 2000) % 4 == 0) {
        monthDaySize = 29;
        if (checkOutDay - monthDaySize == 0) {
          checkOutDay = "01";
          checkOutMonth = checkOutMonth + 1;
        } else {
          checkOutMonth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
          checkOutDay = (date.getDate() + 1) < 10 ? '0' + (date.getDate() + 1) : (date.getDate() + 1);
        }
      } else {
        monthDaySize = 28;
        if (checkOutDay - monthDaySize == 0) {
          checkOutDay = "01";
          checkOutMonth = checkOutMonth + 1;
        } else {
          checkOutMonth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
          checkOutDay = (date.getDate() + 1) < 10 ? '0' + (date.getDate() + 1) : (date.getDate() + 1);
        }
      }
    };
    var time = checkOutYear + "-" + checkOutMonth + "-" + checkOutDay;
    this.setData({
      date:time,
      checkOutDay: checkOutDay,
      checkOutMonth: checkOutMonth,
      checkOutYear: checkOutYear
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
    var url = util.url + Interface.continueStayPvAdd;
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