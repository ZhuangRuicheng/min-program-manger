// pages/invoice/invoiceInfo/invoiceInfo.js
const app = getApp()
var util = require('../../../utils/util.js');
var Interface = require('../../../utils/url.js');
var request = require('../../../utils/request.js');
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
    array: [],
    typeIndex: 0,
    typeArray: ['普通发票', '增值税专用发票'],
    types:'',
    invoiceType:'',
    title:'',
    taxNumber:'',
    companyAddress:'',
    telephone:'',
    bankName:'',
    bankAccount:''

  },


  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
   
    //console.log(this.data.array[e.detail.value])
  },
  bindPickerChangeType: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取发票类型
    var that = this;
    var types = options.types;
    var title = options.title;
    var taxNumber = options.taxNumber;
    var companyAddress = options.companyAddress;
    var telephone = options.telephone;
    var bankName = options.bankName;
    var bankAccount = options.bankAccount;
    console.log("title:" + title)
    this.setData({
      title: title,
      types: types,
      taxNumber: taxNumber,
      companyAddress: companyAddress,
      telephone: telephone,
      bankName: bankName,
      bankAccount: bankAccount,
    })
    var url = util.url + Interface.getInvoiceType;
    var params = {};
    var successData = function(res){
      if(res.data.code == 0){
        var types = res.data.data.invoiceType;
        var invoiceType = types.split(",");
        that.setData({
          array: invoiceType
        })
      }else{
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function(res){};
    request.Request("GET", "加载中", url, params, successData, failData)
// wx.request({
//   url: util.url +Interface.getInvoiceType,
//   header: {
//     'Content-Type': 'application/json',
//     'Token': authenticat
//   },
//   method: 'GET',
//   success: function(res) {
//     console.log(res)
//     var types = res.data.data.invoiceType;
//     var invoiceType = types.split(",");
//     that.setData({
//       array: invoiceType
//     })
//   },
//   fail: function(res) {},
//   complete: function(res) {},
// })

  },
   /**
   * 自定义函数
   */

  next:function(e){
    var title = this.data.title;
    var taxNumber = this.data.taxNumber;
    if (util.stringIsEmpty(title)){
      util.showToastMsg('发票抬头不能为空')
      return
    }else{
      if (util.stringIsEmpty(taxNumber)){
        util.showToastMsg("纳税人识别号不能为空")
        return
      }else{
         var index = this.data.index;
         var types = this.data.array[index];
         var typeIndex = this.data.typeIndex;
         var typeArray = this.data.typeArray[typeIndex];
         var companyAddress = this.data.companyAddress;
         var telephone = this.data.telephone;
         var bankName = this.data.bankName;
         var bankAccount = this.data.bankAccount;
      wx.navigateTo({
        url: '../informationConfirmation/informationConfirmation?types=' + types + '&title=' + title + '&taxNumber=' + taxNumber + '&companyAddress=' + companyAddress + '&telephone=' + telephone + '&bankName=' + bankName + '&bankAccount=' + bankAccount + '&typeArray=' + typeArray,
      })
      }
    }
  

  },
  // 获取改变输入框的值
  inputChanged: function (e) {
    switch (e.currentTarget.id) {
      case 'types':
        this.setData({
          types: e.detail.value
        })

        break;
      case 'invoiceType':
        this.setData({
          invoiceType: e.detail.value
        })

        break;
      case 'title':
        this.setData({
          title: e.detail.value
        })

        break;
      case 'taxNumber':
        this.setData({
          taxNumber: e.detail.value
        });
        break;
      case 'companyAddress':

        this.setData({
          companyAddress: e.detail.value
        })

        break;
      case 'telephone':
        this.setData({
          telephone: e.detail.value
        })

        break;
      case 'bankName':
        this.setData({
          bankName: e.detail.value
        });
        break;
      case 'bankAccount':
        this.setData({
          bankAccount: e.detail.value
        });
        break;
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