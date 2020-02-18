var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');

var app = getApp();
Page({
  data: {
    topNum: 0,
    tabs: ["我的提问", "精选问答"],
    activeIndex: 0,
    sliderWidth: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    checkedAllStatus: true,
    hasLogin: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
        success: function(res) {
            var sliderWidth = res.windowWidth / 2;
            that.setData({
                sliderWidth: sliderWidth,
                sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
            });
        }
    });

    wx.cloud.callFunction({
      name: "getNewTopic",
      complete: function complete(res) {
        console.log("getNewTopic", res)
        that.setData({
          topic: res.result.data
        });
      }
    });
    wx.cloud.callFunction({
      name: "getHotTopic",
      complete: function complete(res) {
        // console.log("getNewTopic", res)
        that.setData({
          hotTopic: res.result.data
        });
      }
    });

  },

  tabClick: function (e) {
    this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id
    });
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    var that = this
    this.setData({
      hasLogin: app.globalData.hasLogin
    });


  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  goLogin() {
    wx.navigateTo({
      url: "/pages/auth/login/login"
    });
  },

  onPullDownRefresh() {
  },

  hotList: function hotList() {
    var _this2 = this;
    wx.cloud.callFunction({
      name: "getHotTopic",
      complete: function complete(res) {
        // console.log("getHotTopic",res)
        _this2.setData({
          hotTopic: res.result.data
        });
        return res;
      }
    });
  },
  newList: function newList() {
    var _this3 = this;
    wx.cloud.callFunction({
      name: "getNewTopic",
      complete: function complete(res) {
        // console.log("getNewTopic", res)
        _this3.setData({
          topic: res.result.data
        });
        return res;
      }
    });
  },
  addTopic: function addTopic() {
    wx.navigateTo({
      url: "../addTopic/addTopic"
    });
  },
  //oneTopic
  toOneTopic: function toOneTopic(e) {
    wx.navigateTo({
      url: "../oneTopic/oneTopic?topicId=" + e.currentTarget.dataset.id
    });
  },
  // 获取滚动条当前位置
  scrolltoupper: function scrolltoupper(e) {
    if (e.detail.scrollTop > 100) {
      // console.log(e)
      this.setData({
        floorStatus: true
      });
    } else {
      this.setData({
        floorStatus: false
      });
    }
  },
  //回到顶部
  goTop: function goTop(e) {
    // 一键回到顶部
    this.setData({
      topNum: this.data.topNum = 0
    });
  },
  tabChange: function tabChange(res) {
    var key = res.detail.currentIndex;
    var res;
    // console.log(key)
    if (key == 1) {
      res = this.hotList();
    } else {
      res = this.newList();
    }
  },
  upBtn: function upBtn(res) {
    var key = res.detail.currentIndex;
    var that = this;
    that.hotList();
    that.newList();
    that.goTop();
  }
  
});