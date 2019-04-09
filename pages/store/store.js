// pages/store/store.js
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
    tabbarHeight: wx.getSystemInfoSync().statusBarHeight,//获取手机状态栏高度
    tabbarWidth: wx.getSystemInfoSync().screenHeight,//获取状态栏宽度
    tabbarColor: app.globalData.tabbarColor,
    titleColor: app.globalData.titleColor,
    introduce: "",
    img: '',
    cart: {
      totalQuantity: 0,
      totalPrice: 0,
      list: {},
      productId: 0
    },
    order: [],
    cartList: [],
    showCartDetail: false,
    products: [],
    classifySeleted: 1,
    hide_good_box: true,
  },
  upper: function(e) {
    console.log("出发了")
  },
  //清空购物车
  cleanCart: function(e) {
    var that = this;
    var url = util.url + Interface.cleanCart;
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
    let systemInfo = wx.getStorageSync('systemInfo');
    this.busPos = {};
    this.busPos['x'] = 45; //购物车的位置
    this.busPos['y'] = app.globalData.hh - 56;
    //购物车请求
    that.shoppCart(that);
    var url = util.url + Interface.getMiniBarInfo;
    var params = {};
    var successData = function(res) {
      if (res.data.code == 0) {
        that.setData({
          introduce: res.data.data.description,
          img: res.data.data.logoUrl,
        })
      } else {
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function(res) {};
    storeRequest.storeRequest("GET", "加载中", url, params, successData, failData)
    that.goodsList(that);

  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function() {},
  // 生命周期函数--监听页面显示
  // 每次打开页面都会调用一次
  onShow: function() {
    var that = this;
    that.setData({
      tabbarColor: app.globalData.tabbarColor,
      titleColor: app.globalData.titleColor
    })
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

  // 开发者可以添加任意的函数或数据到
  //  object 参数中，在页面的函数中用 this 可以访问
  checkOrderSame: function(name) {
    var list = this.data.order;
    for (var index in list) {
      if (list[index].name == name) {
        return index;
      }
    }
    return false;
  },
  tapAddCart: function(e) {

    this.finger = {};
    var topPoint = {};
    this.finger['x'] = e.touches["0"].clientX; //点击的位置
    this.finger['y'] = e.touches["0"].clientY;

    if (this.finger['y'] < this.busPos['y']) {
      topPoint['y'] = this.finger['y'] - 150;
    } else {
      topPoint['y'] = this.busPos['y'] - 150;
    }
    topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;

    if (this.finger['x'] > this.busPos['x']) {
      topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
    } else { //
      topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
    }

    this.linePos = app.bezier([this.busPos, topPoint, this.finger], 30);
    this.startAnimation(e);
  },
  startAnimation: function(e) {
    var index = 0,
      that = this,
      bezier_points = that.linePos['bezier_points'];

    this.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    var len = bezier_points.length;
    index = len
    this.timer = setInterval(function() {
      for (let i = index - 1; i > -1; i--) {
        that.setData({
          bus_x: bezier_points[i]['x'],
          bus_y: bezier_points[i]['y']
        })

        if (i < 1) {
          clearInterval(that.timer);
          // that.addGoodToCartFn(e);
          var productId = e.target.dataset.idx;
          that.setData({
            productId: productId
          })
          var url = util.url + Interface.addProductToCart;
          var params = {
            'productId': productId,
            'count': 1
          };
          var successData = function(res) {
            if (res.data.code == 0) {
              that.setData({
                hide_good_box: true
              })
              that.shoppCart(that); 
            }else{
              that.setData({
                hide_good_box: true
              })
              util.showToastMsg(res.data.msg)
            }
                      
          };
          var failData = function(res) {
            that.shoppCart(that);
            that.setData({
              hide_good_box: true
            })
          };
          storeRequest.storeRequest("POST", "提交中", url, params, successData, failData)
        }
      }
    }, 20);

  },

  tapReduceCart: function(e) {

    var productId = e.currentTarget.dataset.id
    var that = this;
    var url = util.url + Interface.reduceCart;
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
      url: '../../pages/store/storeOrder/storeOrder'
    })
  },
  //商品列表函数
  goodsList: function(that) {
    var url = util.url + Interface.findProducts;
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
          goodsList: res.data.data,
          // products: products,
          classifySeleted: res.data.data[0].categoryId
        })
      } else {
        util.showToastMsg(res.data.msg)
      }
    };
    var failData = function(res) {};
    storeRequest.storeRequest("GET", "加载中", url, params, successData, failData)
  },
  //购物车请求
  shoppCart: function(that) {
    var url = util.url + Interface.findCarts;
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

});