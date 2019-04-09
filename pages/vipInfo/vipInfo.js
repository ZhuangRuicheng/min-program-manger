// pages/vipInfo/vipInfo.js
const app = getApp()
var util = require('../../utils/util.js');
var Interface = require('../../utils/url.js');
var request = require('../../utils/request.js');
var interval = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight, //获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight, //获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    name: '',
    ID: '',
    phoneNumber: '',
    verificationCode: '',
    date: '请选择日期',
    time: '获取验证码',
    currentTime: 61,
    disabled: '',
    QrModalStatus: false,
    id: ''
  },
  getCode: function() {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabled: ''
        })
      }
    }, 1000)
  },
  //提示框隐藏
  QRhideModal: function(e) {
    this.setData({
      QrModalStatus: false
    })

    wx.navigateBack({
      delta: 2,
    })
  },
  //  获取验证码
  getVerificationCode: function(e) {

    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var phoneNumber = that.data.phoneNumber;
    if (phoneNumber == '') {
      util.showToastMsg('请先输入手机号码')
      return
    } else {
      var url = util.url + Interface.sendVerificationCode;
      var params = {
        'phoneNumber': phoneNumber,
      };
      var successData = function(res) {
        if (res.data.code == 0) {
          that.getCode();
          that.setData({
            disabled: "disable"
          })
        } else {
          util.showToastMsg(res.data.msg)
        }
      };
      var failData = function(res) {};
      request.Request("POST", "正在获取验证码", url, params, successData, failData)
    }
  },
  //  信息提交按钮事件函数
  formSubmit: function(e) {
    var name = this.data.name;
    var ID = this.data.ID;
    var phoneNumber = this.data.phoneNumber;
    var verificationCode = this.data.verificationCode;
    //var IDlong = this.data.ID.length;
    // var phoneNumberLong = this.data.phoneNumber.length;
    var formId = e.detail.formId
    // var regex = "(1[1-5]|2[1-3]|3[1-7]|4[1-6]|5[0-4]|6[1-5]|71|81|82|90)([0-5][0-9]|90)(\\d{2})(19|20)(\\d{2})((0[13578][1-9]|0[13578][12][0-9]|0[13578]3[01]|1[02]3[01])|(0[469][1-9]|0[469][12][0-9]|30)|(02[1-9]|02[12][0-9]))(\\d{3})([0-9]|x)";

    if (name === '' || name === undefined) {

      util.showToastMsg('请输入您的名字')
      return
    } else {
      if (util.stringIsEmpty(ID)) {
        util.showToastMsg('请输入您的身份证')
        return
      } else {
        if (ID.length != 18) {
          util.showToastMsg('您输入的身份证有误')
          return
        } else {
          if (util.stringIsEmpty(phoneNumber)) {
            util.showToastMsg('请输入您的手机号')
            return
          } else {
            if (phoneNumber.length != 11) {
              util.showToastMsg('您输入手机号有误')
              return
            } else {
              if (util.stringIsEmpty(verificationCode)) {
                util.showToastMsg('请输入验证码')
                return
              } else {
                var that = this;
                var id = that.data.id;
                var url = util.url + Interface.VIPfillInfo;
                var params = {
                  vipGradeId: id,
                  name: name,
                  idCard: ID,
                  code: verificationCode,
                  telephone: phoneNumber,
                  formId: formId
                };
                var successData = function(res) {
                  if (res.data.code == 0) {
                    that.setData({
                      name: '',
                      ID: '',
                      phoneNumber: '',
                      verificationCode: '',
                      QrModalStatus: true
                    })
                  }
                  if (res.data.code == 10) {
                    util.showToastMsg('请先登录')
                    wx.redirectTo({
                      url: '../Scavenging/Scavenging',
                    })
                  } else {
                    util.showToastMsg(res.data.msg)
                  }
                };
                var failData = function(res) {};
                request.Request("POST", "提交中", url, params, successData, failData)
              }
            }
          }
        }

      }
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
      case 'ID':
        this.setData({
          ID: e.detail.value.replace(/\s+/g, '')
        })

        break;
      case 'phoneNumber':
        this.setData({
          phoneNumber: e.detail.value.replace(/\s+/g, '')
        });
        break;
      case 'verificationCode':
        this.setData({
          verificationCode: e.detail.value.replace(/\s+/g, '')
        });
        break;
    }
  },
  //判断身份证
  // judgeID:function(e){
  //   var ID = this.data.ID.length;
  //   if(ID<18){
  //     util.showToastMsg('您输入的身份证有误')
  //     return
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var authenticat = wx.getStorageSync("authenticat");
    var id = options.id;
    that.setData({
      id: id
    })
    wx.request({
      url: util.url + Interface.getLastTimeRegisterInfo,
      header: {
        'content-type': 'application/json',
        'Token': authenticat
      },
      method: 'GET',
      success: function(res) {
        console.log(res);
        if (res.data.code == 10) {
          util.showToastMsg(res.data.msg)
          wx.clearStorageSync("authenticat")
          wx.clearStorageSync("loginToken")
          wx.redirectTo({
            url: '../../Scavenging/Scavenging',
          })
        } else {
          that.setData({
            name: res.data.data.name,
            ID: res.data.data.idCard,
            phoneNumber: res.data.data.phone,
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