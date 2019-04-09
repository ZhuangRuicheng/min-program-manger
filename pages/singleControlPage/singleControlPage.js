// pages/cuestControl/cuestControl.js
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
    roomNum: '',
    hotelName: '',
    expireTime: '',
    id: '',
    hasPermission: false, // 是否存在权限
    hasIdCard: false,  //是否绑定身份证,
    idShow: false,  //绑定身份证弹出层
    noDevices: false, // 是否装有设备
    openDoorImg: '../img/doorProhibit.png',
    door: '../img/door.png',
    elevator: '../img/elevator.png',
    allShut: '../img/allShut.png',
    scens: '../img/scens.png',
    reader: '../img/reader.png',
    bright: '../img/bright.png',
    sleep: '../img/sleep.png',
    brightShow: false,
    curtainsShow: false,
    customShow: false,
    tvShow: false,
    airShow: false,
    roomControl: true, //房间设备是否为空
    accessControl: false, //门禁是否为空
    openIhc: false, //是否装有设备
    deviceId: '',
    hoverProgress1: 'https://eimg.doorconn.com/hotel_assistant/images/progress-n.png',
    hoverProgress2: 'https://eimg.doorconn.com/hotel_assistant/images/progress-n.png',
    hoverProgress3: false,
    devices: [],
    locktList: {},  //门锁
    brightList: [],  //灯光
    airConditionerList: [], //空调
    drawPowerList: [],     //取电开关
    drawPowerStatus: '', //取电开关状态
    tvList: [],    //电视
    customList: [],  //窗帘
    doorDisplay: [], //电子门显
    situations: [], //情景模式
    customDevices: [], // 自定义客控
    elevatorList: [], //电梯
    accessControlList: [],//门禁
    installLocation: '',  //安装位置,
    deviceType: '',//类型
    actionCode: '', //状态码
    temperature: 26, //空调默认温度
    airStatus: false, //空调是否开启
    isCold: true, // 空调是否为制冷状态
    mode: 'COLD',
    name: '',
    timer: 'countDown',//定时器名字
    countDownNum: '20',//倒计时初始值,
    countDownNumShow: false, //倒计时显示或隐藏
    countDownShow: true,
    airId: '', //缓存中空调deviceId,
    switchShow: false, //多个房间弹出层显示
    switchSign: false,
    switchRoomList: [] //多个房间列表
  },
  //防止屏幕滑动
  preventTouchMove: function () { },
  //显示房间切换弹出层
  roomSwitchShow: function () {
    var that = this;
    that.setData({
      switchShow: true
    })
    //检查是否存在多个房间
    var successData = function (res) {
      if (res.data.code == 0) {
        that.setData({
          switchRoomList: res.data.data
        })
      }
    }
    request.getRoomLists(util, Interface, successData, request);
  },
  //切换房间
  selectRoom: function (e) {
    var that = this;
    var ihcNo = e.currentTarget.dataset.ihc_no;
    var roomNum = e.currentTarget.dataset.room_num;
    var params = {
      "ihcNo": ihcNo,
      "roomNum": roomNum
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        wx.setStorageSync("expireTime", res.data.data.expireTime)
        wx.setStorageSync("ihcNo", res.data.data.hotelIhcNo)
        wx.setStorageSync("hotelName", res.data.data.hotelName)
        wx.setStorageSync("roomNum", res.data.data.roomNum)
        that.setData({
          hotelName: res.data.data.hotelName,
          roomNum: res.data.data.roomNum,
          expireTime: res.data.data.expireTime,
          switchShow: false
        })
        that.onLoadQueryDevice(that)
      } else {
        util.showToastMsg(res.data.msg)
      }

    };
    request.selectRoom(util, Interface, request, params, successData);
  },
  //关闭房间切换弹出层
  closeSwitch: function () {
    this.setData({
      switchShow: false
    })
  },
  //返回小程序
  returnMiniProgram:function(e){
    wx.navigateBackMiniProgram({
      extraData: {
        "orderGuid": wx.getStorageSync("orderGuid")
      },
    })
  },
  //绑定身份证弹出层
  clickInputId: function (e) {
    this.setData({
      idShow: true
    })
  },
  //隐藏身份证弹出层
  cancelInputId: function (e) {
    this.setData({
      idShow: false
    })
  },
  //获取输入身份证
  getInputId: function (e) {
    this.setData({
      id: e.detail.value.replace(/\s+/g, '')
    })
  },
  //绑定身份证
  bindIdCard: function (e) {
    var that = this;
    var id = that.data.id;
    var url = util.url + Interface.saveIdCard;
    var params = {
      'idCard': id
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        util.showToastMsg("绑定成功")
        that.setData({
          idShow: false,
          hasIdCard: true
        })

      } else {
        util.showToastMsg(res.data.msg)

      }
      that.checkPermission(that)
    };
    var failData = function (res) { };
    // request.Request("POST", "提交中", url, params, successData, failData)
  },
  //防止屏幕滑动
  preventTouchMove: function (e) { },
  //取消一键总关弹出窗
  cancelBright: function (e) {
    this.setData({
      brightShow: false
    })
  },
  //取消窗帘弹出窗
  cancelCurtains: function (e) {
    this.setData({
      curtainsShow: false
    })
  },
  //取消自定义客控弹出窗
  cancelCustom: function (e) {
    this.setData({
      customShow: false,
    })
  },
  //取消电视弹出窗
  cancelTv: function (e) {
    this.setData({
      tvShow: false
    })
  },
  //取消空调弹出层
  cancelAir: function (e) {
    this.setData({
      airShow: false
    })
  },
  //开门禁
  openProhibit: function (e) {
    wx.vibrateShort({})
    var that = this;
    var deviceId = e.currentTarget.dataset.id;
    var deviceType = e.currentTarget.dataset.type;
    var actionCode = e.currentTarget.dataset.code;
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    var url = util.url + Interface.controlDevice;
    var params = {
      'deviceId': deviceId,
      'actionCode': actionCode,
      'deviceType': deviceType,
      // 'roomNum': roomNum,
      'ihcNo': ihcNo
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        util.showToastMsg("门禁打开成功")
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else {
        var showNodalMsg = res.data.msg;
        request.showModalMsgs(showNodalMsg)
      }
    };
    var failData = function (res) { };
    request.controlRequest("POST", url, params, successData, failData)
  },
  //开门
  openDoor: function (e) {
    wx.vibrateShort({})
    var that = this;
    var deviceId = e.currentTarget.dataset.id;
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    var url = util.url + Interface.openDoorLock;
    var params = {
      'deviceId': deviceId,
      // 'roomNum': roomNum,
      'ihcNo': ihcNo
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        util.showToastMsg("开门成功")
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else {
        var showNodalMsg = res.data.msg;
        request.showModalMsgs(showNodalMsg)
      }
    };
    var failData = function (e) { };
    request.controlRequest("POST", url, params, successData, failData)
  },
  //开电梯
  openElevatar: function (e) {
    wx.vibrateShort({})
    var that = this;
    var deviceId = e.currentTarget.dataset.id;
    var deviceType = e.currentTarget.dataset.type;
    var actionCode = e.currentTarget.dataset.code;
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    var url = util.url + Interface.controlDevice;
    if (actionCode == 0) {
      var params = {
        'deviceId': deviceId,
        'actionCode': 1,
        'deviceType': deviceType,
        // 'roomNum': roomNum,
        'ihcNo': ihcNo
      };
    } else {
      var params = {
        'deviceId': deviceId,
        'actionCode': 0,
        'deviceType': deviceType,
        // 'roomNum': roomNum,
        'ihcNo': ihcNo
      };
    }
    var successData = function (res) {
      if (res.data.code == 0) {
        util.showToastMsg("电梯控制成功");
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else {
        var showNodalMsg = res.data.msg;
        request.showModalMsgs(showNodalMsg)
      }
    };
    var failData = function (res) { };
    request.controlRequest("POST", url, params, successData, failData)
  },
  //刷新控制灯光设备显示状态
  refreshBright: function () {
    var that = this;
    var installLocation = that.data.installLocation;
    that.setData({
      brightShow: true,
    })
    var successData = function (res) {
      for (var i = 0; i < res.data.data.installLocationDevices.length; i++) {
        if (res.data.data.installLocationDevices[i].installLocation == installLocation) {
          for (var j = 0; j < res.data.data.installLocationDevices[i].deviceTypeList.length; j++) {
            that.setData({
              brightList: res.data.data.installLocationDevices[i].deviceTypeList[j].deviceList
            })
            return false
          }
        }
      }
    };
    that.queryDevice(that, successData)
  },
  //灯光控制
  openAllShut: function (e) {

    var that = this;
    var installLocation = e.currentTarget.dataset.location;
    var deviceType = e.currentTarget.dataset.deviceid;
    var devices = that.data.devices;
    that.setData({
      brightShow: true,
      installLocation: installLocation
    })
    var successData = function (res) {
      for (var i = 0; i < res.data.data.installLocationDevices.length; i++) {
        if (res.data.data.installLocationDevices[i].installLocation == installLocation) {
          for (var j = 0; j < res.data.data.installLocationDevices[i].deviceTypeList.length; j++) {
            if (res.data.data.installLocationDevices[i].deviceTypeList[j].deviceType == deviceType) {
              that.setData({
                brightList: res.data.data.installLocationDevices[i].deviceTypeList[j].deviceList
              })
              return false
            }
          }
        }
      }
    };
    that.queryDevice(that, successData)
  },
  //灯光总开总关控制
  openOrShut: function (e) {
    wx.vibrateShort({})
    var that = this;
    var actionCode = e.currentTarget.id;
    that.setData({
      actionCode: actionCode
    })
    var brightList = that.data.brightList;
    var data = {
      controlDevices: []
    }
    for (var i = 0; i < brightList.length; i++) {
      var bright = {
        "deviceType": brightList[i].deviceType,
        "deviceId": brightList[i].deviceId,
        "actionCode": actionCode
      }
      data.controlDevices.push(bright)
    }
    var url = util.url + Interface.controlAllLamps;
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    var params = {
      'controlDevices': data.controlDevices,
      // 'roomNum': roomNum,
      'ihcNo': ihcNo
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        util.showToastMsg("控制成功")
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else {
        var showNodalMsg = res.data.msg;
        request.showModalMsgs(showNodalMsg)
      }
      setTimeout(function () {
        var successData = function (res) {
          that.setData({
            devices: res.data.data.installLocationDevices,
          })
        };
        that.refreshBright()
      }, 2000)
    };
    var failData = function (res) {
      var successData = function (res) {
        that.setData({
          devices: res.data.data.installLocationDevices,
        })
      };
      that.queryDevice(that, successData)
    };
    request.controlRequest("POST", url, params, successData, failData)
  },
  //单个灯光控制
  signalBright: function (e) {
    wx.vibrateShort({})
    var that = this;
    var deviceId = e.currentTarget.dataset.id;
    var actionCode = e.currentTarget.dataset.code;
    var deviceType = e.currentTarget.dataset.type;
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    var url = util.url + Interface.controlDevice;
    if (actionCode == 1) {
      var params = {
        'deviceId': deviceId,
        'actionCode': 0,
        'deviceType': deviceType,
        // 'roomNum': roomNum,
        'ihcNo': ihcNo
      };
    } else if (actionCode == 0) {
      var params = {
        'deviceId': deviceId,
        'actionCode': 1,
        'deviceType': deviceType,
        // 'roomNum': roomNum,
        'ihcNo': ihcNo
      };
    }

    var successData = function (res) {
      if (res.data.code == 0) {
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else {
        var showNodalMsg = res.data.msg;
        request.showModalMsgs(showNodalMsg)
      }
      // setTimeout(function () {
      var successData = function (res) {
        that.setData({
          devices: res.data.data.installLocationDevices,
        })
      };
      that.refreshBright()
      // }, 1000)
    };
    var failData = function (res) { };
    request.controlRequest("POST", url, params, successData, failData)
  },
  //浪漫模式
  openScens: function (e) {
    var that = this;
    wx.vibrateShort({})
    var situationId = e.currentTarget.dataset.id;
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    var url = util.url + Interface.setSituation;
    var params = {
      'situationId': situationId,
      // 'roomNum': roomNum,
      'ihcNo': ihcNo
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        util.showToastMsg("控制成功")
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else {
        var showNodalMsg = res.data.msg;
        request.showModalMsgs(showNodalMsg)
      }
    };
    var failData = function (res) { };
    request.Request("POST", "操作中", url, params, successData, failData)
  },

  //空调弹出层
  air: function (e) {
    var that = this;
    var installLocation = e.currentTarget.dataset.location;
    var deviceType = e.currentTarget.dataset.type;
    // var deviceId = e.currentTarget.dataset.id;
    wx.setStorageSync('status', 'OFF')
    var airStatus = wx.getStorageSync("status");
    if (!airStatus) {
      that.setData({
        airStatus: false,
        isCold: false,
      })
    } else if (airStatus == 'OFF') {
      that.setData({
        airStatus: false,
        isCold: true
      })
    }
    that.setData({
      airShow: true,
      installLocation: installLocation,
      deviceType: deviceType,
    })
    var successData = function (res) {
      for (var i = 0; i < res.data.data.installLocationDevices.length; i++) {
        if (res.data.data.installLocationDevices[i].installLocation == installLocation) {
          for (var j = 0; j < res.data.data.installLocationDevices[i].deviceTypeList.length; j++) {
            if (res.data.data.installLocationDevices[i].deviceTypeList[j].deviceType == deviceType) {
              for (var k = 0; k < res.data.data.installLocationDevices[i].deviceTypeList[j].deviceList.length; k++) {
                console.log("id:" + res.data.data.installLocationDevices[i].deviceTypeList[j].deviceList[k].deviceId)
                that.storage(that, res.data.data.installLocationDevices[i].deviceTypeList[j].deviceList[k].deviceId)

              }
              that.setData({
                airConditionerList: res.data.data.installLocationDevices[i].deviceTypeList[j].deviceList
              })
              return false
            }

          }
        }
      }
    };
    that.queryDevice(that, successData)
  },
  //异步获取缓存
  storage: function (that, data) {
    wx.getStorage({
      key: data,
      success: function (res) {
        that.setData({
          temperature: res.data
        })
      },
      fail: function (res) {
        that.setData({
          temperature: 26
        })
      }
    })
  },
  //空调开关
  airSwitch: function (e) {
    wx.vibrateShort({})
    var that = this;
    var status = wx.getStorageSync("status");
    var url = util.url + Interface.switchAirConditioner;
    var deviceId = that.data.airConditionerList[0].deviceId;
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    if (!status) {
      var params = {
        'deviceId': deviceId,
        'status': 'ON',
        // 'roomNum': roomNum,
        'ihcNo': ihcNo
      };
    } else if (status == 'ON') {
      var params = {
        'deviceId': deviceId,
        'status': 'OFF',
        // 'roomNum': roomNum,
        'ihcNo': ihcNo
      };
    } else if (status == 'OFF') {
      var params = {
        'deviceId': deviceId,
        'status': 'ON',
        // 'roomNum': roomNum,
        'ihcNo': ihcNo
      };
    }
    var successData = function (res) {
      if (res.data.code == 0) {
        if (status == 'ON') {
          that.setData({
            airStatus: false
          })
        } else {
          that.setData({
            airStatus: true
          })
        }
        if (!status) {
          wx.setStorageSync('status', 'ON')
          var params = {
            'deviceId': deviceId,
            'mode': 'COLD',
            'temperature': that.data.temperature,
            // 'roomNum': roomNum,
            'ihcNo': ihcNo
          };
          that.AirConditioner(that, params);
        } else if (status == 'ON') {
          wx.setStorageSync('status', 'OFF')
          that.setData({
            isCold: true
          })
        } else if (status == 'OFF') {
          wx.setStorageSync('status', 'ON')
          var params = {
            'deviceId': deviceId,
            'mode': 'COLD',
            'temperature': that.data.temperature,
            // 'roomNum': roomNum,
            'ihcNo': ihcNo
          };
          that.AirConditioner(that, params);
        }
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else {
        var showNodalMsg = res.data.msg;
        request.showModalMsgs(showNodalMsg)
      }
    };
    var failData = function (res) { };
    request.controlRequest("POST", url, params, successData, failData)
  },
  //空调制冷、制热
  refrigeration: function (e) {
    wx.vibrateShort({})
    var that = this;
    var deviceId = that.data.airConditionerList[0].deviceId;
    var airStatus = wx.getStorageSync("status");
    var temperature = that.data.temperature;
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    var url = util.url + Interface.setAirConditioner;
    var mode = e.currentTarget.id;
    if (mode == 'HOT') {
      if (airStatus == 'ON') {
        that.setData({
          mode: mode,
          isCold: false
        })
      }
    } else {
      that.setData({
        mode: mode,
        isCold: true
      })
    }
    if (airStatus == 'ON') {
      var params = {
        'deviceId': deviceId,
        'mode': mode,
        'temperature': temperature,
        // 'roomNum': roomNum,
        'ihcNo': ihcNo
      };
    } else {
      util.showToastMsg("请先点击上面开启空调按钮")
      return
    }
    that.AirConditioner(that, params);
  },
  //温度调节
  temperatureAdjust: function (e) {
    wx.vibrateShort({})
    var that = this;
    var number = e.currentTarget.id;
    var temperature = that.data.temperature;
    var mode = that.data.mode;
    var airStatus = wx.getStorageSync("status");
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    var deviceId = that.data.airConditionerList[0].deviceId;
    var url = util.url + Interface.setAirConditioner;
    if (airStatus == 'ON') {
      if (number == 'reduce') {
        temperature = temperature - 1;
        if (temperature >= 16) {
          var params = {
            'deviceId': deviceId,
            'mode': mode,
            'temperature': temperature,
            // 'roomNum': roomNum,
            'ihcNo': ihcNo
          };
        } else {
          var showNodalMsg = '温度(范围在16~30)';
          request.showModalMsgs(showNodalMsg)
          return
        }
      } else if (number == 'add') {
        temperature = temperature + 1;
        if (temperature <= 30) {
          var params = {
            'deviceId': deviceId,
            'mode': mode,
            'temperature': temperature,
            // 'roomNum': roomNum,
            'ihcNo': ihcNo
          };
        } else {
          var showNodalMsg = '温度(范围在16~30)';
          request.showModalMsgs(showNodalMsg)
          return
        }
      }
    } else {
      util.showToastMsg("请先点击上面开启空调按钮")
      return
    }
    var successData = function (res) {
      if (res.data.code == 0) {
        that.setData({
          temperature: temperature
        })
        wx.setStorage({
          key: deviceId,
          data: temperature,
        })
        wx.setStorage({
          key: 'deviceId',
          data: deviceId,
        })
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else {
        var showNodalMsg = res.data.msg;
        request.showModalMsgs(showNodalMsg)
      }
    };
    var failData = function (res) { };
    request.controlRequest("POST", url, params, successData, failData)
  },
  //空调控制公共函数
  AirConditioner: function (that, params) {
    var url = util.url + Interface.setAirConditioner;
    var successData = function (res) {
      if (res.data.code == 0) {
        // util.showToastMsg("操作成功")
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else {
        var showNodalMsg = res.data.msg;
        request.showModalMsgs(showNodalMsg)
      }
    };
    var failData = function (res) { };
    request.controlRequest("POST", url, params, successData, failData)
  },
  //窗帘弹出窗
  curtains: function (e) {
    var that = this;
    var installLocation = e.currentTarget.dataset.location;
    var deviceType = e.currentTarget.dataset.type;
    that.setData({
      curtainsShow: true,
      installLocation: installLocation,
      deviceType: deviceType
    })
    var successData = function (res) {
      for (var i = 0; i < res.data.data.installLocationDevices.length; i++) {
        if (res.data.data.installLocationDevices[i].installLocation == installLocation) {
          for (var j = 0; j < res.data.data.installLocationDevices[i].deviceTypeList.length; j++) {
            if (res.data.data.installLocationDevices[i].deviceTypeList[j].deviceType == deviceType) {
              that.setData({
                customList: res.data.data.installLocationDevices[i].deviceTypeList[j].deviceList
              })
              return false
            }

          }
        }
      }
    };
    that.queryDevice(that, successData)
  },
  //窗帘控制
  windowCurtains: function (e) {
    wx.vibrateShort({})
    var that = this
    var actionCode = e.currentTarget.id;
    var deviceId = e.currentTarget.dataset.deviceid;
    that.setData({
      deviceId: deviceId
    })
    if (actionCode == 0) {
      that.setData({
        hoverProgress1: 'https://eimg.doorconn.com/hotel_assistant/images/progress.png',
      })
      setTimeout(function () {
        that.setData({
          hoverProgress1: 'https://eimg.doorconn.com/hotel_assistant/images/progress-n.png'
        })
      }, 50)
    } else if (actionCode == 1) {
      that.setData({
        hoverProgress2: 'https://eimg.doorconn.com/hotel_assistant/images/progress2.png',
      })
      setTimeout(function () {
        that.setData({
          hoverProgress2: 'https://eimg.doorconn.com/hotel_assistant/images/progress-n.png'
        })
      }, 50)
    } else if (actionCode == 2) {
      that.setData({
        hoverProgress1: 'https://eimg.doorconn.com/hotel_assistant/images/progress2.png',
        hoverProgress2: 'https://eimg.doorconn.com/hotel_assistant/images/progress.png',
      })
      setTimeout(function () {
        that.setData({
          hoverProgress1: 'https://eimg.doorconn.com/hotel_assistant/images/progress-n.png',
          hoverProgress2: 'https://eimg.doorconn.com/hotel_assistant/images/progress-n.png'
        })
      }, 50)
    }
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    var url = util.url + Interface.controlCurtain;
    var params = {
      'deviceId': deviceId,
      'actionCode': actionCode,
      // 'roomNum': roomNum,
      'ihcNo': ihcNo
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        // util.showToastMsg('控制成功');
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else {
        var showNodalMsg = res.data.msg;
        request.showModalMsgs(showNodalMsg)
      }
    };
    var failData = function (res) { };
    request.controlRequest("POST", url, params, successData, failData)
  },
  //电视
  tv: function (e) {

    var that = this;
    var installLocation = e.currentTarget.dataset.location;
    var deviceType = e.currentTarget.dataset.type;
    that.setData({
      tvShow: true,
      installLocation: installLocation,
      deviceType: deviceType
    })
    var successData = function (res) {
      for (var i = 0; i < res.data.data.installLocationDevices.length; i++) {
        if (res.data.data.installLocationDevices[i].installLocation == installLocation) {
          for (var j = 0; j < res.data.data.installLocationDevices[i].deviceTypeList.length; j++) {
            if (res.data.data.installLocationDevices[i].deviceTypeList[j].deviceType == deviceType) {
              that.setData({
                tvList: res.data.data.installLocationDevices[i].deviceTypeList[j].deviceList
              })
              return false
            }

          }
        }
      }
    };
    that.queryDevice(that, successData)
  },
  //电视控制
  tvSwitch: function (e) {
    wx.vibrateShort({})
    var that = this;
    var actionCode = e.currentTarget.dataset.code;
    var url = util.url + Interface.controlTv;
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    var deviceId = that.data.tvList[0].deviceId;
    var params = {
      'deviceId': deviceId,
      'actionCode': actionCode,
      // 'roomNum': roomNum,
      'ihcNo': ihcNo
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        // util.showToastMsg("控制成功")
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else {
        var showNodalMsg = res.data.msg;
        request.showModalMsgs(showNodalMsg)
      }
    };
    var failData = function (res) { };
    request.controlRequest("POST", url, params, successData, failData)
  },

  //自定义客控
  custom: function (e) {

    var that = this;
    var installLocation = e.currentTarget.dataset.location;
    var deviceType = e.currentTarget.dataset.type;
    var name = e.currentTarget.dataset.name;
    that.setData({
      customShow: true,
      installLocation: installLocation,
      deviceType: deviceType,
      name: name
    })

    var successData = function (res) {
      for (var i = 0; i < res.data.data.installLocationDevices.length; i++) {
        if (res.data.data.installLocationDevices[i].installLocation == installLocation) {
          for (var j = 0; j < res.data.data.installLocationDevices[i].deviceTypeList.length; j++) {
            if (res.data.data.installLocationDevices[i].deviceTypeList[j].deviceType == deviceType) {
              that.setData({
                customDevices: res.data.data.installLocationDevices[i].deviceTypeList[j].deviceList
              })
              return false
            }

          }
        }
      }
    };
    that.queryDevice(that, successData)
  },
  //自定义客控控制
  customAction: function (e) {
    wx.vibrateShort({})
    var that = this;
    var deviceId = e.currentTarget.dataset.id;
    var actionCode = e.currentTarget.dataset.code;
    var deviceType = e.currentTarget.dataset.type;
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    var url = util.url + Interface.controlDevice;
    var params = {
      'deviceId': deviceId,
      'actionCode': actionCode,
      'deviceType': deviceType,
      // 'roomNum': roomNum,
      'ihcNo': ihcNo
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        // util.showToastMsg("控制成功");
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else {
        var showNodalMsg = res.data.msg;
        request.showModalMsgs(showNodalMsg)
      }
    };
    var failData = function (res) { };
    request.controlRequest("POST", url, params, successData, failData)
  },
  //取电开关
  power: function (e) {
    wx.vibrateShort({})
    var that = this;
    var deviceId = e.currentTarget.dataset.id;
    var deviceType = e.currentTarget.dataset.type;
    var actionCode = e.currentTarget.dataset.status;
    var code = e.currentTarget.dataset.code;
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    var url = util.url + Interface.controlDevice;
    var params = {
      'deviceId': deviceId,
      'actionCode': actionCode,
      'deviceType': deviceType,
      // 'roomNum': roomNum,
      'ihcNo': ihcNo
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        if (code == 1) {
          that.countDown();
          that.setData({
            countDownNumShow: true,
            drawPowerStatus: 1
          })
        } else if (code == 0) {
          clearInterval(that.data.timer);
          that.setData({
            countDownNum: 20,
            countDownNumShow: false,
            drawPowerStatus: 0
          })
        } else if (code == 2) {
          clearInterval(that.data.timer);
          that.setData({
            countDownNum: 20,
            countDownNumShow: false,
            drawPowerStatus: 0
          })
        }
        that.refreshDrawPower(that)
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.redirectTo({
          url: '../Scavenging/Scavenging',
        })
      } else {
        var showNodalMsg = res.data.msg;
        request.showModalMsgs(showNodalMsg)
      }

    };
    var failData = function (res) { };
    request.controlRequest("POST", url, params, successData, failData)

  },
  //刷新取电开关
  refreshDrawPower: function (that) {
    var url = util.url + Interface.queryDevice;
    var params = {};
    var successData = function (res) {
      var drawPowerList = [];
      var drawPowerStatus = '';
      for (var i = 0; i < res.data.data.entranceGuard.length; i++) {
        if (res.data.data.entranceGuard[i].deviceType == 3) {
          drawPowerList.push(res.data.data.entranceGuard[i]);
          drawPowerStatus = res.data.data.entranceGuard[i].status;
        }
      }
      that.setData({
        drawPowerList: drawPowerList,
        drawPowerStatus: drawPowerStatus
      })
    };
    var failData = function (res) { };
    request.controlRequest("GET", url, params, successData, failData)
  },
  //查询设备公共函数
  queryDevice: function (that, successData) {
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    var url = util.url + Interface.queryDevice;
    var params = {
      // 'roomNum': roomNum,
      'ihcNo': ihcNo
    };
    var failData = function (res) { };
    request.controlRequest("GET", url, params, successData, failData)
    // request.Request("GET", "操作中", url, params, successData, failData)
  },
  //刷新页面切换设备查询
  onLoadQueryDevice: function (that) {
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo')
    // console.log("ihcNo:" + wx.getStorageSync('ihcNo'))
    var url = util.url + Interface.queryDevice;
    var params = {
      // 'roomNum': roomNum,
      'ihcNo': ihcNo
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        var locktList = [];  //门锁
        for (var i = 0; i < res.data.data.entranceGuard.length; i++) {
          if (res.data.data.entranceGuard[i].deviceType == 0) {
            locktList.push(res.data.data.entranceGuard[i])
          }
        }
        // 房间是否装有设备
        if (res.data.data.entranceGuard == '' && res.data.data.installLocationDevices == '' && res.data.data.situations == '') {
          that.setData({
            noDevices: true
          })
        }
        //取电开关
        var drawPowerList = [];
        var drawPowerStatus = '';
        for (var i = 0; i < res.data.data.entranceGuard.length; i++) {
          if (res.data.data.entranceGuard[i].deviceType == 3) {
            drawPowerList.push(res.data.data.entranceGuard[i]);
            drawPowerStatus = res.data.data.entranceGuard[i].status;
          }
        }
        //电梯
        var elevatorList = [];
        for (var i = 0; i < res.data.data.entranceGuard.length; i++) {
          if (res.data.data.entranceGuard[i].deviceType == 8) {
            elevatorList.push(res.data.data.entranceGuard[i])
          }
        }
        //门禁
        var accessControlList = [];
        for (var i = 0; i < res.data.data.entranceGuard.length; i++) {
          if (res.data.data.entranceGuard[i].deviceType == 7) {
            accessControlList.push(res.data.data.entranceGuard[i])
          }
        }
        if (drawPowerList == '' && res.data.data.installLocationDevices == '') {
          that.setData({
            roomControl: false
          })
        }
        if (accessControlList == '' && elevatorList == '' && locktList == '') {
          that.setData({
            accessControl: false
          })
        } else {
          that.setData({
            accessControl: true
          })
        }
        that.setData({
          devices: res.data.data.installLocationDevices,
          locktList: locktList,
          drawPowerList: drawPowerList,
          situations: res.data.data.situations,
          elevatorList: elevatorList,
          accessControlList: accessControlList,
          drawPowerStatus: drawPowerStatus
        })
      } else {
        util.showToastMsg(res.data.msg)
        that.setData({
          roomControl: false
        })
      }
    };
    var failData = function (res) { };
    request.Request("GET", "加载中", url, params, successData, failData)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      // currentTab: app.globalData.currentTab,
      // pagePath: app.globalData.pagePath,
      hasPermission: wx.getStorageSync('hasPermission')
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
    var hotelName = wx.getStorageSync('hotelName');
    var roomNum = wx.getStorageSync('roomNum');
    var expireTime = wx.getStorageSync('expireTime');
    that.setData({
      hotelName: hotelName,
      roomNum: roomNum,
      expireTime: expireTime,
      hasPermission: wx.getStorageSync('hasPermission')
    })
    var that = this;
    var hotelId = wx.getStorageSync('HotelId');
    var url = util.url + Interface.checkPermission;
    var params = {
      'hotelId': hotelId
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        wx.setStorageSync("expireTime", res.data.data.expireTime)
        wx.setStorageSync("hasIdCard", res.data.data.hasIdCard)
        wx.setStorageSync("ihcNo", res.data.data.IhcNo)
        wx.setStorageSync("roomNum", res.data.data.roomNum)
        wx.setStorageSync("hasPermission", res.data.data.hasPermission)
        that.setData({
          hotelName: res.data.data.hotelName,
          roomNum: res.data.data.roomNum,
          hasIdCard: res.data.data.hasIdCard,
          expireTime: res.data.data.expireTime,
          openIhc: res.data.data.openIhc,
          hasPermission: res.data.data.hasPermission
        })
        if (res.data.data.hasPermission) {
          that.onLoadQueryDevice(that)
          //检查是否存在多个房间
          var successData = function (res) {
            if (res.data.code == 0) {
              if (res.data.data.length > 1) {
                that.setData({
                  switchSign: true
                })
              }
            }
          }
          request.getRoomLists(util, Interface, successData, request);
        }
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.clearStorageSync("authenticat")
        wx.clearStorageSync("loginToken")
        setTimeout(function () {
          wx.redirectTo({
            url: '../Scavenging/Scavenging',
          })
        }, 1500)
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.clearStorageSync("authenticat")
        wx.clearStorageSync("loginToken")
        setTimeout(function () {
          wx.redirectTo({
            url: '../Scavenging/Scavenging',
          })
        }, 1500)
      }
    };
    var failData = function (res) { };
    request.Request("GET", "加载中", url, params, successData, failData)
  },
  //倒计时函数
  countDown: function () {
    var that = this;
    var countDownNum = that.data.countDownNum;//获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          that.setData({
            countDownNumShow: false,
            drawPowerStatus: 1
          })
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
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
  //权限
  //下拉查询设备
  onPullDownQueryDevice: function (that) {
    // var roomNum = wx.getStorageSync('roomNum');
    var ihcNo = wx.getStorageSync('ihcNo');
    console.log("下拉刷新：" + ihcNo)
    var url = util.url + Interface.queryDevice;
    var params = {
      // 'roomNum': roomNum,
      'ihcNo': ihcNo
    };
    var successData = function (res) {

      if (res.data.code == 0) {
        var locktList = [];  //门锁
        for (var i = 0; i < res.data.data.entranceGuard.length; i++) {
          if (res.data.data.entranceGuard[i].deviceType == 0) {
            locktList.push(res.data.data.entranceGuard[i])
          }
        }
        // 房间是否装有设备
        if (res.data.data.entranceGuard == '' && res.data.data.installLocationDevices == '' && res.data.data.situations == '') {
          that.setData({
            noDevices: true
          })
        }
        //取电开关
        var drawPowerList = [];
        var drawPowerStatus = '';
        for (var i = 0; i < res.data.data.entranceGuard.length; i++) {
          if (res.data.data.entranceGuard[i].deviceType == 3) {
            drawPowerList.push(res.data.data.entranceGuard[i]);
            drawPowerStatus = res.data.data.entranceGuard[i].status;
          }
        }
        //电梯
        var elevatorList = [];
        for (var i = 0; i < res.data.data.entranceGuard.length; i++) {
          if (res.data.data.entranceGuard[i].deviceType == 8) {
            elevatorList.push(res.data.data.entranceGuard[i])
          }
        }
        //门禁
        var accessControlList = [];
        for (var i = 0; i < res.data.data.entranceGuard.length; i++) {
          if (res.data.data.entranceGuard[i].deviceType == 7) {
            accessControlList.push(res.data.data.entranceGuard[i])
          }
        }
        if (drawPowerList == '' && res.data.data.installLocationDevices == '') {
          that.setData({
            roomControl: false
          })
        } else {
          that.setData({
            roomControl: true
          })
        }
        if (accessControlList == '' && elevatorList == '' && locktList == '') {
          that.setData({
            accessControl: false
          })
        } else {
          that.setData({
            accessControl: true
          })
        }

        that.setData({
          devices: res.data.data.installLocationDevices,
          locktList: locktList,
          drawPowerList: drawPowerList,
          situations: res.data.data.situations,
          elevatorList: elevatorList,
          accessControlList: accessControlList,
          drawPowerStatus: drawPowerStatus
        })
        util.showToastMsg("刷新成功")
      }  else {
        util.showToastMsg(res.data.msg)
        that.setData({
          roomControl: false
        })
      }
      wx.stopPullDownRefresh()
    };
    var failData = function (res) {
      wx.stopPullDownRefresh()
    };
    // setTimeout(function () {
    request.Request("GET", "正在刷新", url, params, successData, failData)
    // }, 500)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    var hotelId = wx.getStorageSync('HotelId');
    var url = util.url + Interface.checkPermission;
    var params = {
      'hotelId': hotelId
    };
    var successData = function (res) {
      if (res.data.code == 0) {
        wx.setStorageSync("expireTime", res.data.data.expireTime)
        wx.setStorageSync("hasIdCard", res.data.data.hasIdCard)
        wx.setStorageSync("openIhc", res.data.data.openIhc)
        wx.setStorageSync("roomNum", res.data.data.roomNum)
        wx.setStorageSync("ihcNo", res.data.data.IhcNo)
        // var hotelName = wx.getStorageSync('hotelName');
        that.setData({
          hotelName: res.data.data.hotelName,
          roomNum: res.data.data.roomNum,
          expireTime: res.data.data.expireTime,
          openIhc: res.data.data.openIhc,
          hasPermission: res.data.data.hasPermission
        })
        that.onPullDownQueryDevice(that)
      } else if (res.data.code == 10) {
        util.showToastMsg(res.data.msg)
        wx.clearStorageSync("authenticat")
        wx.clearStorageSync("loginToken")
        setTimeout(function () {
          wx.redirectTo({
            url: '../Scavenging/Scavenging',
          })
        }, 1500)
      } else if (res.data.code == 20) {
        util.showToastMsg(res.data.msg)
        wx.clearStorageSync("authenticat")
        wx.clearStorageSync("loginToken")
        setTimeout(function () {
          wx.redirectTo({
            url: '../Scavenging/Scavenging',
          })
        }, 1500)
      }
    };
    var failData = function (res) { };
    request.Request("GET", "加载中", url, params, successData, failData)
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
    var url = util.url + Interface.share;
    Interface.PVCount(url, HotelId, authenticat);
    return {
      title: this.data.hotelName + "，不一样的客房入住体验！",
      path: 'pages/index/hotelReservation/hotelReservation?HotelId=' + HotelId,
      imageUrl: util.imgUrl + '/shareImg.png'
    }
  }
})