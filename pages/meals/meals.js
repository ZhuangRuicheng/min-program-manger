// pages/meals/meals.js
const app = getApp()
var util = require('../../utils/util.js');
var Interface = require('../../utils/url.js');
var request = require('../../utils/request.js');
var storeRequest = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight, //获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight, //获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    headerImg: '',
    reduceImg: '../images/shopping/reduce.png',
    plusImg: '../images/shopping/plus.png',
    clearImg: '../img/clearCart.png',
    cartImg: '../images/shopping/cart2.png',
    storeDetails: false,
    introduce: "",
    cart: {
      totalQuantity: 0,
      totalPrice: 0,
      list: {},
      productId: 0
    },
    order: [],
    cartList: [],
    goodsList: [],
    showCartDetail: false,
    scrollDown: '',
    products: [],
    classifySeleted: 1,
  },
  //防止页面滚动
  preventTouchMove: function(e) {},
  //关闭模态框
  hideModal: function() {
    this.setData({
      storeDetails: false
    })
  },
  //显示详情
  showDetais: function(e) {
    var name = e.currentTarget.dataset.name;
    var image = e.currentTarget.dataset.image;
    var description = e.currentTarget.dataset.description;
    var price = e.currentTarget.dataset.price;
    var productId = e.currentTarget.dataset.idx;
    this.setData({
      storeDetails: true,
      name: name,
      price: price,
      image: image,
      description: description,
      productId: productId
    })
  },
  //清空购物车
  cleanCart: function(e) {
    var that = this;
    var url = util.url + Interface.mealsCleanCart;
    var params = {};
    var successData = function(res) {
      if (res.data.code == 0) {
        that.setData({
          showCartDetail: false,
        })
      } else {
        util.showToastMsg(res.data.msg)
      }
      that.shoppCart(that);
    };
    var failData = function(res) {
      that.shoppCart(that);
    };
    storeRequest.storeRequest("POST", "提交中", url, params, successData, failData)
  },
  onLoad: function(options) {
    var that = this
    //购物车请求
    // that.shoppCart(that);
    // var url = util.url + Interface.getMealInfo;
    // var params = {};
    // var successData = function(res) {
    //   if (res.data.code == 0) {
    //     that.setData({
    //       introduce: res.data.data.introduce,
    //       headerImg: res.data.data.publicityImage,
    //     })
    //   } else {
    //     util.showToastMsg(res.data.msg)
    //   }
    // };
    // var failData = function(res) {};
    // storeRequest.storeRequest("GET", "加载中", url, params, successData, failData)
    that.goodsList(that);

  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function() {},
  // 生命周期函数--监听页面显示
  // 每次打开页面都会调用一次
  onShow: function() {
    var that = this
    var authenticat = wx.getStorageSync("authenticat")

    //购物车请求
    that.shoppCart(that);
    that.goodsList(that);
    var HotelId = wx.getStorageSync("HotelId");
    var url = util.url + Interface.miniBarPvAdd;
    Interface.PVCount(url, HotelId, authenticat);
  },
  // 生命周期函数--监听页面隐藏
  // 当navigateTo或底部tab切换时调用
  onHide: function() {},
  // 生命周期函数--监听页面卸载
  // 当redirectTo或navigateBack的时候调用。
  onUnload: function() {},
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {},
  // 页面上拉触底事件的处理函数
  onReachBottom: function() {},

  tapAddCart: function(e) {

    var that = this;
    // var type = e.currentTarget.id
    // console.log("id:" + type)
    var productId = e.currentTarget.dataset.idx;
    that.setData({
      productId: productId
    })
    var url = util.url + Interface.mealsAddCart;
    var params = {
      'productId': productId,
      'count': 1
    };
    var successData = function(res) {
      if (res.data.code == 0) {
        that.shoppCart(that);
      } else {
        util.showToastMsg(res.data.msg)
      }

    };
    var failData = function(res) {
      that.shoppCart(that);
    };
    storeRequest.storeRequest("POST", "提交中", url, params, successData, failData)


  },

  tapReduceCart: function(e) {

    var productId = e.currentTarget.dataset.id
    var that = this;
    var url = util.url + Interface.mealsReduceCart;
    var params = {
      'productId': productId,
    };
    var successData = function(res) {
      if (res.data.code != 0) {
        util.showToastMsg(res.data.msg)
      }
      that.shoppCart(that);
    };
    var failData = function(res) {
      that.shoppCart(that);
    };
    storeRequest.storeRequest("POST", "提交中", url, params, successData, failData)
  },
  InputTapAddCart: function(e) {
    var productId = e.target.dataset.idx;
    var that = this;
    var url = util.url + Interface.addProductToCart;
    var params = {
      'productId': productId,
      'count': 1
    };
    var successData = function(res) {
      if (res.data.code != 0) {
        util.showToastMsg(res.data.msg)
      }
      that.shoppCart(that);
    };
    var failData = function(res) {
      that.shoppCart(that);
    };
    storeRequest.storeRequest("POST", "提交中", url, params, successData, failData)
  },

  follow: function() {
    this.setData({
      followed: !this.data.followed
    });
  },
  onGoodsScroll: function(e) {
    if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
      this.setData({
        scrollDown: true
      });
    } else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
      this.setData({
        scrollDown: false
      });
    }

    var scale = e.detail.scrollWidth / 570,
      scrollTop = e.detail.scrollTop / scale,
      h = 0,
      classifySeleted,
      len = this.data.goodsList.length;
    this.data.goodsList.forEach(function(classify, i) {
      var _h = 70 + classify.products.length * (46 * 3 + 20 * 2);
      if (scrollTop >= h - 100 / scale) {
        classifySeleted = classify.categoryId;
      }
      h += _h;
    });
    this.setData({
      classifySeleted: classifySeleted
    });
  },

  tapClassify: function(e) {

    var id = e.target.dataset.id;
    this.setData({
      classifyViewed: 'b' + id
    });
    var self = this;
    setTimeout(function() {
      self.setData({
        classifySeleted: id
      });
    }, 100);
    console.log("id:" + id)
    console.log("classifyViewed:" + this.data.classifyViewed)
  },
  showCartDetail: function() {
    this.setData({
      showCartDetail: !this.data.showCartDetail
    });
    var that = this;
    var authenticat = wx.getStorageSync("authenticat")

  },

  hideCartDetail: function() {
    this.setData({
      showCartDetail: false
    });
  },
  submit: function(e) {
    wx.navigateTo({
      url: './mealsOrder/mealsOrder'
    })
  },
  //商品列表函数
  goodsList: function(that) {
    var url = util.url + Interface.getMealInfo;
    var params = {};
    var successData = function(res) {
      if (res.data.code == 0) {
        // var products = [];
        // for (var j = 0; j < res.data.data.length; j++) {
        //   for (var i = 0; i < res.data.data[j].products.length; i++) {
        //     products.push(res.data.data[j].products[i])
        //   }
        // }
        that.setData({
          goodsList: res.data.data.categories,
          introduce: res.data.data.introduce,
          headerImg: res.data.data.publicityImage,
          // products: products,
          classifySeleted: res.data.data.categories[0].categoryId
        })
        console.log("classifySeleted:" + res.data.data.categories[0].categoryId)
        // console.log("goods:"+)
      } else {
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function(res) {};
    storeRequest.storeRequest("GET", "加载中", url, params, successData, failData)
  },
  //购物车请求
  shoppCart: function(that) {
    var url = util.url + Interface.mealsGetCardList;
    var params = {};
    var successData = function(res) {
      if (res.data.code == 0) {
        that.setData({
          cart: res.data.data
        })
      } else {
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function(res) {};
    storeRequest.storeRequest("GET", "加载中", url, params, successData, failData)
  }
})