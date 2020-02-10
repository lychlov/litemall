var app = getApp();
var WxParse = require('../../../lib/wxParse/wxParse.js');
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    quizType: "",
    quizList: [],
    isLoading: true,					// 判断是否尚在加载中
		article: {}
  },

  onItemClick: function (event) {
    var targetUrl = "/pages/quiz/answer/answer";
    targetUrl = targetUrl + "?quizName=" + event.currentTarget.dataset.quizname + "&quizCourse=" + event.currentTarget.dataset.course
    console.log(targetUrl)
    wx.navigateTo({
      url: targetUrl
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      quizType: options.quizType,
    });

    const db = wx.cloud.database();
    db.collection('jingzhi-quiz').where({
      type: options.quizType
    }).orderBy('creat_time','desc').get({
      success: function (res) {
        console.log(res)
        that.setData({
          quizList: res.data
        })
      }
    });
    console.log(that.data.quizList)


    
    // let result = app.towxml('$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$','markdown',{
		// 	theme:'light',					// 主题，默认`light`
		// 	events:{					// 为元素绑定的事件方法
		// 		tap:(e)=>{
		// 			console.log('tap',e);
		// 		}
		// 	}
		// });
    // console.log(result)
		// 更新解析数据
		this.setData({
			// article:result,
			isLoading: false
		});
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
    wx.pauseBackgroundAudio()
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

  }
})