// pages/index/hotelReservation/orderFilling/orderFilling.js
const app = getApp()
var util = require('../../../../utils/util.js');
var Interface = require('../../../../utils/url.js');
var request = require('../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight,//获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight,//获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    array: [],
    index: 0,
    roomNum:1,
    phoneNumber:'',
    remarks:'',
    name:'',
    QrModalStatus:false,
    id: 0,
    inputName: '',
    price: '',
    hotelName: '',
    checkInStartTime: '',
    checkOutStartTime: '',
    liveDate:'',
    HotelId:0,
    check:false,
    ID:'',
    hasOpenVip:''
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  checkboxChange(e) {
   var check = this.data.check;
   if(check){
     this.setData({
       check: false
     })
   }else{
     this.setData({
       check: true
     })
   }

  },
  //提示框隐藏
  QRhideModal: function (e) {
    this.setData({
      QrModalStatus: false
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  //免押金预订
  depositFree:function(e){
    var that = this;
    var url = util.url + Interface.hotelBook;
    var checkInDate = that.data.checkInStartTime;
    var leaveDate = that.data.checkOutStartTime;
    var liveDay = that.data.liveDate;
    var roomTypeId = that.data.id;
    var roomCount = that.data.roomNum;
    var name = that.data.inputName;
    var phone = that.data.phoneNumber;
    var remarks = that.data.remarks;
    var index = that.data.index;
    var array = that.data.array;
    var vipName = array[index];
    var idCard = that.data.ID;
    var wxFormId = e.detail.formId;
    var check = that.data.check;
    if (check){
      var params = {
        'checkInDate': checkInDate,
        'leaveDate': leaveDate,
        'liveDay': liveDay,
        'roomTypeId': roomTypeId,
        'roomCount': roomCount,
        'name': name,
        'phone': phone,
        'remarks': remarks,
        'vipName': vipName,
        'idCard': idCard,
        'wxFormId': wxFormId
      };
    }else{
      var params = {
        'checkInDate': checkInDate,
        'leaveDate': leaveDate,
        'liveDay': liveDay,
        'roomTypeId': roomTypeId,
        'roomCount': roomCount,
        'name': name,
        'phone': phone,
        'remarks': remarks,
        'wxFormId': wxFormId
      };
    }
    var successData = function(res){
      if(res.data.code == 0){
        that.setData({
          QrModalStatus: true
        })
        setTimeout(function () {
          util.showToastMsg("预订成功")
        }, 1500)
      }else{
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function(res){};
    if (name == '') {
      util.showToastMsg('请输入您的名字')
      return
    } else {
      if (phone == '') {
        util.showToastMsg('手机号不能为空')
        return
      } else {
        if (check){
          var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
          if (reg.test(idCard) === false) {
           util.showToastMsg("身份证输入有误")
            return
          }else{
          request.Request("POST", "预定中", url, params, successData, failData)
        } 
        }
      }
    }
  },
  //表单数据提交
  formSubmit:function(e){
    var that = this;
    var checkInDate = that.data.checkInStartTime;
    var leaveDate = that.data.checkOutStartTime;
    var liveDay = that.data.liveDate;
    var roomTypeId = that.data.id;
    var roomCount = that.data.roomNum;
    var name = that.data.inputName;
    var phone = that.data.phoneNumber;
    var remarks = that.data.remarks;
    var wxFormId = e.detail.formId;
    if(name == ''){
      util.showToastMsg('请输入您的名字')
      return
    }else{
      if(phone == ''){
        util.showToastMsg('手机号不能为空')
        return
      }else{
        var url = util.url + Interface.createReservationOrder;
        var params = {
          'checkInDate': checkInDate,
          'leaveDate': leaveDate,
          'liveDay': liveDay,
          'roomTypeId': roomTypeId,
          'roomCount': roomCount,
          'name': name,
          'phone': phone,
          'remarks': remarks,
          'wxFormId': wxFormId
        };
        var successData = function(res){
          if (res.data.code == 0) {
            console.log(res)
            var orderNo = res.data.data.tradeNo;
            var authenticat = wx.getStorageSync("authenticat");
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
              success: function (res) {
                console.log(res)
                if(res.data.code == 0){
                  wx.requestPayment({
                    'timeStamp': res.data.data.timeStamp,
                    'nonceStr': res.data.data.nonceStr,
                    'package': res.data.data.packageValue,
                    'signType': res.data.data.signType,
                    'paySign': res.data.data.paySign,
                    success: function (res) {
                      console.log(res)
                      that.setData({
                        QrModalStatus: true
                      })
                      setTimeout(function () {
                        util.showToastMsg("支付成功")
                      }, 1500)
                    },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }else{
                  util.showToastMsg(res.data.msg)
                }

              },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else {
            util.showToastMsg(res.data.msg)
          }
        };
        var failData = function(res){};
        request.Request("POST", "预定中", url, params, successData, failData)
      }
    }
  },
  //获取输入框内容
  inputChange: function (e) {
    switch (e.currentTarget.id) {
      case "name":
        this.setData({
          inputName: e.detail.value
        })
        break;
      case "phoneNumber":
        this.setData({
          phoneNumber: e.detail.value
        })
        break;
      case "remarks":
        this.setData({
          remarks: e.detail.value
        })
        break;
      case "ID":
        this.setData({
          ID: e.detail.value
        })
        break;

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var checkInStartTime = options.checkInStartTime;
    var id = options.id;
    var name = options.name;
    var price = options.price;
    var hotelName = options.hotelName;
    var checkOutStartTime = options.checkOutStartTime;
    var liveDate = options.liveDate;
    var HotelId = options.HotelId;
    var authenticat = wx.getStorageSync("authenticat");
    //获取个人信息
    var url = util.url + Interface.getHotelReserveEditInfo;
    var params = {
      'hotelId': HotelId
    };
    var successData = function (res) {
      that.setData({
        inputName: res.data.data.customerName,
        phoneNumber: res.data.data.phoneNumber,
        hasOpenVip: res.data.data.hasOpenVip,
        array: res.data.data.vipNames,
      })
    };
    var failData = function (res) { };
    request.Request("GET", "加载中", url, params, successData, failData)
    that.setData({
      id: id,
      name: name,
      price: price,
      hotelName: hotelName,
      checkInStartTime: checkInStartTime,
      checkOutStartTime: checkOutStartTime,
      liveDate: liveDate,
      HotelId: HotelId
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var HotelId = that.data.id;
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