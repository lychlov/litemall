var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    categoryList: [],
    currentCategory: {},
    currentSubCategoryList: {},
    allList: {},
    scrollLeft: 0,
    scrollTop: 0,
    goodsCount: 0,
    scrollHeight: 0
  },
  onLoad: function(options) {
    this.getCatalog();
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getCatalog();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  getCatalog: function() {
    //CatalogList
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.CatalogAll).then(function(res) {
      that.setData({
        allList: res.data.allList,
        // categoryList: res.data.categoryList,
        currentCategory: res.data.currentCategory,
        currentSubCategoryList: res.data.currentSubCategory
      });
    });
    that.setData({
      categoryList: [{
        "id":1000,
        "name":"常规练习",
        "subLevel":[{
          "id":1001,
          "name":"课后练习",
          "iconPath":"../../images/after-class.png",
        },{
          "id":1002,
          "name":"阶段诊断",
          "iconPath":"../../images/diagnosis.png",
        },{
          "id":1003,
          "name":"历年真题",
          "iconPath":"../../images/real-quiz.png",
        },{
          "id":1004,
          "name":"模拟练兵",
          "iconPath":"../../images/simulation.png",
        },],
      },{
        "id":3000,
        "name":"专项精炼",
        "subLevel":[{
          "id":3001,
          "name":"补短专练",
          "iconPath":"../../images/after-class.png",
        },{
          "id":3002,
          "name":"培优专练",
          "iconPath":"../../images/diagnosis.png",
        },{
          "id":3003,
          "name":"一对一",
          "iconPath":"../../images/real-quiz.png",
        }],
      },{
        "id":2000,
        "name":"刷题练习",
        "subLevel":[{
          "id":2001,
          "name":"随机题库",
          "iconPath":"../../images/shuffle.png",
        }],
      },]
    });

    wx.hideLoading();
  },
  getCurrentCategory: function(item) {
    let that = this;

    for (var key in that.data.allList) {
      if (key == item.id) {
        that.setData({
          currentCategory: item,
          currentSubCategoryList: that.data.allList[key]
        });
      }
    }
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },

  switchCate: function(event) {
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    }

    this.getCurrentCategory(event.currentTarget.dataset.id);
  },
  levelClick: function(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: "/pages/category/category?id=" + e.currentTarget.dataset.id
    })
  }
})