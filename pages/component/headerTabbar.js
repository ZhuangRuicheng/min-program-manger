// pages/component/headerTabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      // 设置标题
      type: String,
      value: '客房助手'
    },
    tabbarColor: {
      //导航栏颜色
      type: String,
      value: '#ea5415'
    },
    titleColor: {
      //title字体颜色
      type: String,
      value: '#ffffff'
    },
    show_bol: {
      // 控制返回箭头是否显示
      type: Boolean,
      value: false
    },
    my_class: {
      // 控制样式
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    type: "组件",
    bar_Height: wx.getSystemInfoSync().statusBarHeight + 5
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 返回事件
    goBack: function() {
      console.log("退后")
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})