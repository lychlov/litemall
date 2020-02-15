var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    categoryList: [],
    currentCategory: {},
    currentSubCategoryList: {},
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
    const db = wx.cloud.database()
    db.collection('jingzhi-quiz-category').get({
      success: function(res) {
        console.log(res)
        that.setData({
          allList:res.data,
          categoryList:res.data,
          currentCategory: res.data[0],
          currentSubCategoryList: res.data[0].subcategoryList
        })
        wx.hideLoading();
      }
    });

  },
  getCurrentCategory: function(id) {
    let that = this;
    util.request(api.CatalogCurrent, {
        id: id
      })
      .then(function(res) {
        that.setData({
          currentCategory: res.data.currentCategory,
          currentSubCategoryList: res.data.currentSubCategory
        });
      });
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
    var that = this;
    var currentTarget = event.currentTarget;
    const index = currentTarget.dataset.index
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    }
    console.log(event.currentTarget.dataset)
    that.setData({
      currentCategory: that.data.categoryList[index],
      currentSubCategoryList: that.data.categoryList[index].subcategoryList
    })
    // this.getCurrentCategory(event.currentTarget.dataset.id);
  }
})