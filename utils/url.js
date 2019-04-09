//判断字符串是否为空
const stringNotEmpty = str => {
  if (str != null && str.length > 0) {
    return true
  }
  return false
}

const stringIsEmpty = str => {
  if (str == null || str == '') {
    return true
  }
  return false
}
//showModalMsg
const showModalMsg = (msg, defaultMsg = '') => {

  if (stringIsEmpty(msg)) {
    msg = defaultMsg
  }
  wx.showModal({
    title: '',
    content: msg,
    showCancel: false,
    cancelText: '',
    cancelColor: '',
    confirmText: '确定',
    // confirmColor: showModalColor(),
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}



//showToastMsg
const showToastMsg = (msg, defaultMsg = '') => {

  if (stringIsEmpty(msg)) {
    msg = defaultMsg
  }
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 2000,
    mask: true,
  })

}

//GET请求封装

const GETRequest = (url, params, success, fail, loadingText, showFailMsg) => {

  requestMethod('GET', url, success, fail, loadingText, showFailMsg)

}

//POST请求封装

const POSTRequest = (url, params, success, fail, loadingText, showFailMsg) => {

  requestMethod('POST', url, params, success, fail, loadingText, showFailMsg)

}
const requestMethod = (method, url, params, success, fail, loadingText = "加载中...", showFailMsg = true) => {

  if (stringNotEmpty(loadingText)) {
    wx.showLoading({
      title: loadingText,
      mask: true,
    })
  }

  wx.request({
    url: url,
    data: params,
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync("authenticat")
    },
    method: method,
    dataType: 'json',
    responseType: 'text',
    success: function (res) {

      if (stringNotEmpty(loadingText)) {
        wx.hideLoading()
      }

      success(res)
      console.log("datas:" + res.data.code)

    },
    fail: function (res) {

      if (stringNotEmpty(loadingText)) {
        wx.hideLoading()
      }

      res.err = 'network'
      fail(res)

      var errMsg = '请求失败，请检查网络'
      if (res.statusCode == 404) {
        errMsg = '请求资源不存在'
      }
      showModalMsg(errMsg)
    },
    complete: function (res) {

    },
  })
}

//最新数据统计封装
const PVCount = (url, HotelId, authenticat) => {
  wx.request({
    url: url,
    data: {
      "hotelId": HotelId
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
    },
    fail: function (res) { },
    complete: function (res) { },
  })
};
//停留小程序时间统计封装
const PVStayTime = (params, authenticat, util, Interface) => {
  wx.request({
    url: util.url + Interface.stayTime,
    data: params,
    header: {
      'Content-Type': 'application/json',
      'Token': authenticat
    },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      console.log(res)
    },
    fail: function (res) { },
    complete: function (res) { },
  })
};

//微信登录
var wechatLogin = '/api/wechat/login';

//扫描房间二维码
var scanRoomQrCode = '/api/room/scanRoomQrCode';

//获取登陆首页信息
var getHomePageInfo = '/api/room/getScanHomePageInfo';

//解码敏感信息用户接口
var decodeUserInfo = '/api/wechat/decodeUserInfo';

//解码用户获取手机号码信息
var decodePhone = '/api/wechat/decodePhone';

//获取酒店早餐券
// var getBreakFastCouponConfig = '/api/coupon/getBreakFastCouponConfig';
var getBreakFastCouponConfig = '/api/voucher/getBreakfastVoucherInfo';

//领取早餐券
var takeBreakfastVoucher = '/api/voucher/takeBreakfastVoucher';

//创建早餐券订单
// var createBreakfastCouponOrder = '/api/coupon/createBreakfastCouponOrder';
var createBreakfastCouponOrder = '/api/voucher/createBreakfastVoucherPayOrder';

//获取扫房间二维码领取早餐券信息
var takeBreakfastVoucherInRoom = '/api/voucher/takeBreakfastVoucherInRoom';

//前台扫码获取领取早餐券信息
var takeBreakfastVoucherInReception = '/api/voucher/takeBreakfastVoucherInReception';

//前台获取早餐券信息
var getTakeBreakfastVoucherInfo = '/api/voucher/getTakeBreakfastVoucherInfo';

//顾客反馈
var customerFeedback = '/api/hotel/customerFeedback';

//获取酒店信息
var getHotelInfo = '/api/hotel/getHotelInfo';

//通过Id获取酒店信息(分享跳转到酒店介绍页使用)
var getHotelInfoById = '/api/hotel/getHotelInfoById';

//刷新订单状态
var refreshOrderStatus = '/api/hotel/refreshOrderStatus';

//获取发票类型
var getInvoiceType = '/api/config/getInvoiceType';

//值班经理留言
var getManagerLeaveMessage = '/api/config/getManagerLeaveMessage';

//获取迷你吧信息
var getMiniBarInfo = '/api/miniBar/getMiniBarInfo';

//获取商品列表
var findProducts = '/api/miniBar/findProducts';

//添加商品到购物车
var addProductToCart = '/api/miniBar/addProductToCart';

//减少购物车商品
var reduceCart = '/api/miniBar/reduceCart';

//清空购物车
var cleanCart = '/api/miniBar/cleanCart';

//获取购物车
var findCarts = '/api/miniBar/findCarts';

//迷你吧下订单
var createOrder = '/api/miniBar/createOrder';

//PV统计
var pvCount = '/api/statistics/pvCount';

//获取酒店VIP等级列表
var getHotelVipGradeList = '/api/vip/getHotelVipGradeList';

//检查购买VIP是否有空信息未填写
var checkEmptyInfo = '/api/vip/checkEmptyInfo';

//获取上次购买VIP填写记录
var getLastTimeRegisterInfo = '/api/vip/getLastTimeRegisterInfo';

//创建VIP订单
var createVIPOrder = '/api/vip/createOrder';

//填写VIP信息
var VIPfillInfo = '/api/vip/fillInfo';

//发送验证码
var sendVerificationCode = '/api/vip/sendVerificationCode';

//微信统一下单接口
var unifiedOrder = '/api/pay/wx/unifiedOrder';

//反馈
var feedBack = '/api/order/feedBack';

//退房
var checkout = '/api/order/checkout';

//清扫房间
var cleanRoom = '/api/order/cleanRoom'

//预约发票
var applyInvoice = '/api/order/applyInvoice';

//自主续住
var continueStay = '/api/order/continueStay';

//获取顾客订单服务
var findOrderList = '/api/order/findOrderList';

//获取顾客订单服务详情
var getOrderByIdCustomer = '/api/order/getOrderById';

//评价
var evaluate = '/api/order/evaluate';

//打赏
var reward = '/api/order/reward';

//首页打赏
var rewardOnHome = '/api/order/rewardOnHome';

//获取推荐酒店
var recommendHotels = '/api/additional/recommendHotels';

//酒店预订信息
// var hotelReservationInfo = '/api/hotel/getHotelReservationPageInfo';
var hotelReservationInfo = '/api/hotel/book/getHotelBookInfo';

//创建酒店预定信息
// var createReservationOrder = '/api/hotel/createReservationOrder';
var createReservationOrder = '/api/hotel/book/createHotelBookOrder';

//获取酒店预订编辑信息
// var getHotelReserveEditInfo = '/api/hotel/getHotelReserveEditInfo';
var getHotelReserveEditInfo = '/api/hotel/book/getHotelBookEditInfo';

//酒店预订（有会员，未付钱）
var hotelBook = '/api/hotel/book/hotelBook';

//获取酒店预订房型详情
var getRoomTypeDetailById = '/api/hotel/book/getRoomTypeDetailById';

//获取我的票券
// var findMyCouponList = '/api/customer/findMyCouponList';
var findMyCouponList = '/api/voucher/getMyBreakfastVouchers';

//获取早餐券详情
var getBreakfastVoucherDetail = '/api/voucher/getBreakfastVoucherDetail';

//未扫码统计
var pvCountNoScan = '/api/statistics/pvCountNoScan';

//酒店预订数据统计
var hotelReservePvAdd = '/api/statistic/hotelReservePvAdd';

//VIP数据统计
var vipPvAdd = '/api/statistic/vipPvAdd';

//早餐券数据统计
var breakfastCouponPvAdd = '/api/statistic/breakfastCouponPvAdd';

//迷你吧数据统计
var miniBarPvAdd = '/api/statistic/miniBarPvAdd';

//值班经理在线数据统计
var feedbackPvAdd = '/api/statistic/feedbackPvAdd';

//自主续住数据统计
var continueStayPvAdd = '/api/statistic/continueStayPvAdd';

//发票数据统计
var invoicePvAdd = '/api/statistic/invoicePvAdd';

//退房数据统计
var checkOutPvAdd = '/api/statistic/checkOutPvAdd';

//清扫房间数据统计
var cleanRoomPvAdd = '/api/statistic/cleanRoomPvAdd';

//分享数据统计
var share = '/api/statistic/share';

//多次分享数据统计
var forward = '/api/statistic/forward';

//停留时间数据统计
var stayTime = '/api/statistic/stayTime ';

//使用早餐券
var useBreakfastCoupon = '/api/voucher/useBreakfastVoucher';

//其他页面数据统计接口
var allPvAdd = '/api/statistic/allPvAdd';

//捎句话
var aFewWords = '/api/order/aFewWords';

//获取住过酒店
// var getLivedHotels = '/api/hotel/getLivedHotels';
var getLivedHotels = '/api/hotel/getRecommendHotels';

/*
  客控模块接口 
*/
//查询房间设备列表
var queryDevice = '/api/ihc/queryDevice';

//开关空调
var switchAirConditioner = '/api/ihc/switchAirConditioner';

//设置空调
var setAirConditioner = '/api/ihc/setAirConditioner';

//控制电视
var controlTv = '/api/ihc/controlTv';

//打开门锁
var openDoorLock = '/api/ihc/openDoorLock';

//一键总开关（灯光）
var controlAllLamps = '/api/ihc/controlDeviceList';

//控制窗帘
var controlCurtain = '/api/ihc/controlCurtain';

//设置情景模式
var setSituation = '/api/ihc/setSituation';

//自定义设备控制
var controlDevice = '/api/ihc/controlDevice';

//权限判断
var checkPermission = '/api/ihc/checkPermission';

//身份证绑定
var saveIdCard = '/api/customer/saveIdCard';

//绑定名字
var saveName = '/api/customer/saveName';

//获取个人信息
var getCustomerInfo = '/api/customer/getCustomerInfo';

//发送解绑身份证短信验证码
var sendUnBindIdCardCode= '/api/customer/sendUnBindIdCardVerificationCode';

//解绑身份证
var unBindIdCard = '/api/customer/unBindIdCard';

//更改手机号码获取验证码
var updatePhoneVerificationCode = '/api/customer/sendSwitchPhoneNumberVerificationCode';

//更换绑定手机号码
var updatePhoneNumber = '/api/customer/savePhoneNumber';

//小程序跳转小程序上传手机号
var getJumpPhone = '/api/wechat/uploadPhone';

//查询多个房间
var getRoomList = '/api/ihc/getRoomList';

//切换房间
var selectedRoom = '/api/ihc/selectedRoom';

/**    ****客房送餐***** */
//获取送餐信息
var getMealInfo = '/api/meal/getMealInfo';

//减少购物车
var mealsReduceCart = '/api/meal/reduceCart';

//加入购物车
var mealsAddCart = '/api/meal/addCart';

//获取购物车
var mealsGetCardList = '/api/meal/getCardList';

//清空购物车
var mealsCleanCart= '/api/meal/cleanCart';

//创建订单
var mealsCreateOrder = '/api/meal/createOrder';

module.exports = {
  GETRequest: GETRequest,
  POSTRequest: POSTRequest,
  wechatLogin: wechatLogin,
  scanRoomQrCode: scanRoomQrCode,
  getHomePageInfo: getHomePageInfo,
  decodeUserInfo: decodeUserInfo,
  decodePhone: decodePhone,
  getBreakFastCouponConfig: getBreakFastCouponConfig,
  createBreakfastCouponOrder: createBreakfastCouponOrder,
  customerFeedback: customerFeedback,
  getHotelInfo: getHotelInfo,
  getHotelInfoById: getHotelInfoById,
  refreshOrderStatus: refreshOrderStatus,
  getInvoiceType: getInvoiceType,
  getManagerLeaveMessage: getManagerLeaveMessage,
  getMiniBarInfo: getMiniBarInfo,
  findProducts: findProducts,
  addProductToCart: addProductToCart,
  reduceCart: reduceCart,
  cleanCart: cleanCart,
  findCarts: findCarts,
  createOrder: createOrder,
  pvCount: pvCount,
  getHotelVipGradeList: getHotelVipGradeList,
  checkEmptyInfo: checkEmptyInfo,
  getLastTimeRegisterInfo: getLastTimeRegisterInfo,
  createVIPOrder: createVIPOrder,
  VIPfillInfo: VIPfillInfo,
  sendVerificationCode: sendVerificationCode,
  unifiedOrder: unifiedOrder,
  feedBack: feedBack,
  checkout: checkout,
  cleanRoom: cleanRoom,
  applyInvoice: applyInvoice,
  continueStay: continueStay,
  findOrderList: findOrderList,
  getOrderByIdCustomer: getOrderByIdCustomer,
  evaluate: evaluate,
  reward: reward,
  recommendHotels: recommendHotels,
  hotelReservationInfo: hotelReservationInfo,
  createReservationOrder: createReservationOrder,
  findMyCouponList: findMyCouponList,
  pvCountNoScan: pvCountNoScan,
  hotelReservePvAdd: hotelReservePvAdd,
  vipPvAdd: vipPvAdd,
  breakfastCouponPvAdd: breakfastCouponPvAdd,
  miniBarPvAdd: miniBarPvAdd,
  feedbackPvAdd: feedbackPvAdd,
  continueStayPvAdd: continueStayPvAdd,
  invoicePvAdd: invoicePvAdd,
  checkOutPvAdd: checkOutPvAdd,
  cleanRoomPvAdd: cleanRoomPvAdd,
  share: share,
  forward: forward,
  stayTime: stayTime,
  PVCount: PVCount,
  PVStayTime: PVStayTime,
  getHotelReserveEditInfo: getHotelReserveEditInfo,
  useBreakfastCoupon: useBreakfastCoupon,
  allPvAdd: allPvAdd,
  aFewWords: aFewWords,
  getLivedHotels: getLivedHotels,
  takeBreakfastVoucher: takeBreakfastVoucher,
  getBreakfastVoucherDetail: getBreakfastVoucherDetail,
  takeBreakfastVoucherInRoom: takeBreakfastVoucherInRoom,
  takeBreakfastVoucherInReception: takeBreakfastVoucherInReception,
  getTakeBreakfastVoucherInfo: getTakeBreakfastVoucherInfo,
  hotelBook: hotelBook,
  getRoomTypeDetailById: getRoomTypeDetailById,
  //客控接口
  queryDevice: queryDevice,
  switchAirConditioner: switchAirConditioner,
  controlTv: controlTv,
  openDoorLock: openDoorLock,
  controlAllLamps: controlAllLamps,
  setAirConditioner: setAirConditioner,
  controlCurtain: controlCurtain,
  setSituation: setSituation,
  controlDevice: controlDevice,
  checkPermission: checkPermission,
  saveIdCard: saveIdCard,
  saveName: saveName,
  getCustomerInfo: getCustomerInfo,
  sendUnBindIdCardCode: sendUnBindIdCardCode,
  unBindIdCard: unBindIdCard,
  updatePhoneVerificationCode: updatePhoneVerificationCode,
  updatePhoneNumber: updatePhoneNumber,
  rewardOnHome: rewardOnHome,
  getJumpPhone: getJumpPhone,
  getRoomList: getRoomList,
  selectedRoom: selectedRoom,
  getMealInfo: getMealInfo,
  mealsReduceCart: mealsReduceCart,
  mealsAddCart: mealsAddCart,
  mealsGetCardList: mealsGetCardList,
  mealsCleanCart: mealsCleanCart,
  mealsCreateOrder: mealsCreateOrder
}