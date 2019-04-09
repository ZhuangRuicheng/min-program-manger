// pages/Scavenging/Scavenging.js
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
    cede: '',
    recommendHotels: [],
    disableImg: util.imgUrl + '/header.jpg',
    currentTab: 0
  },
  scanCode: function (e) {
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ["qrCode"],
      success: function (res) {
        console.log(res)
        // if (res.path.indexOf("?") != -1 || res.path.indexOf("?") != undefined) {
        //   var char = res.path.split("?")[0];
        // }
        // if (char == 'pages/index/index' || res.path.indexOf("?") != undefined){
          wx.reLaunch({
            url: '../index/index?q=' + encodeURIComponent(res.result),
          })
        // }else{
        //   util.showToastMsg("该二维码不是房间二维码，请重新扫码")
        // }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //跳转至酒店介绍
  hotel_Introduction: function (e) {
    var HotelId = e.currentTarget.dataset.id;
    var hotelName = e.currentTarget.dataset.name;
    wx.setStorageSync("hotelName", hotelName);
    // wx.setStorageSync("HotelId", HotelId);
    wx.navigateTo({
      url: '../index/hotelReservation/hotelReservation?HotelId=' + HotelId,
    })
  },
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      if (e.currentTarget.dataset.current == 1) {
        var hasPermission = wx.getStorageSync('hasPermission')
        if (hasPermission) {
          wx.redirectTo({
            url: '../cuestControl/cuestControl',
          })
        } else {
          wx.redirectTo({
            url: '../cuestControl/cuestControl',
          })
        }

      } else if (e.currentTarget.dataset.current == 2) {

        wx.redirectTo({
          url: '../person_Center/person_Center',
        })
      }
      app.globalData.currentTab = e.currentTarget.dataset.current;

    }
  },
  onLoad: function (options) {
    if (options.scene == 1073) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      app.globalData.pagePath = '../Scavenging/Scavenging';
      var that = this;
      var authenticat = wx.getStorageSync("authenticat");
      //获取经纬度坐标
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {

          const latitude = res.latitude;  //纬度
          const longitude = res.longitude;      //经度
          wx.login({
            success: function (res) {
              //获取loginTaken
              wx.request({
                url: util.url + Interface.wechatLogin,
                data: {
                  "code": res.code,
                  // "latitude": latitude,
                  // "longitude": longitude,
                },
                header: {
                  'content-type': 'application/json',
                },
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: function (res) {
                  console.log(res)
                  wx.setStorageSync("authenticat", res.data.data.loginToken);
                  var url = util.url + Interface.getLivedHotels;
                  var params = {
                    "latitude": latitude,
                    "longitude": longitude,
                  };
                  var successData = function (res) {
                    that.setData({
                      recommendHotels: res.data.data.recommendHotels,
                    })
                  };
                  var failData = function (res) { };
                  request.Request("GET", "加载中", url, params, successData, failData)
                },
                fail: function (res) { },
                complete: function (res) { },
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })

        },
        fail: function (res) {
          setTimeout(function () {
            wx.redirectTo({
              url: '../Scavenging/openLocation/openLocation',
            })
          }, 3000)
        },
        complete: function (res) { },
      })
    }
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