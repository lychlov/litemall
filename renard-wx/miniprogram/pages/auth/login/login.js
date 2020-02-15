var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var user = require('../../../utils/user.js');

var app = getApp();
Page({
  data: {
    openid:''
  },
  onLoad: function(options) {
    this.getOpenid();
    var openid = this.data.openid;
    var userId = wx.getStorageSync("userId");
    var userImg = wx.getStorageSync("userImg"); 
    var userName = wx.getStorageSync("userName");
    var userInfo = wx.getStorageSync("userInfo");
    console.log(userId)
    if (userId) {
      this.setData({
        isHide: false,
        userName: userName,
        userImg: userImg,
        userId: userId,
        userInfo: userInfo
      });
      app.globalData.hasLogin = true;

      wx.navigateBack({
        delta: 1
      })
    }
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成

  },
  onReady: function() {

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

  //授权
  getUserInfoClick: function getUserInfoClick(e) {
    var _this = this;
    console.log(e);
    var d = e.detail.userInfo;
    this.setData({
      userImg: d.avatarUrl,
      userName: d.nickName,
      isHide: false
    });
    wx.setStorageSync("userInfo",d);
    wx.setStorageSync("userName", d.nickName);
    wx.setStorageSync("userImg", d.avatarUrl);
    var db = wx.cloud.database();
    var _ = db.command;
    db.collection("jingzhi-user").where({
      _openid: this.data.openid
    }).get({
      success: function success(res) {
        console.log("查询用户:", res);
        if (res.data && res.data.length > 0) {
          console.log("已存在");
          wx.setStorageSync("userId", res.data[0].userId);
          wx.setStorageSync("openId", res.data[0]._openid);
          console.log(res.data[0].userId);
        } else {
          setTimeout(function () {
            var userImg = d.avatarUrl,
              userName = d.nickName,
              userId;
            if (!userId) {
              userId = _this.getUserId();
            }
            // db.collection("user").add({
            //   data: {
            //     userId: userId,
            //     userImg: userImg,
            //     userName: userName,
            //     iv: d.iv
            //   },
            wx.cloud.callFunction({
              name: 'addUser',
              data: {
                userId: userId,
                userImg: userImg,
                userName: userName,
              },
              success: function success(res) {
                wx.showToast({
                  title: "注册成功"
                });
                console.log('云addUser: ', res,res.result.openid)
                console.log("用户新增成功");
                db.collection("jingzhi-user").where({
                  userId: userId
                }).get({
                  success: function success(res) {
                    wx.setStorageSync("openId", res.data[0]._openid);
                    app.globalData.hasLogin = true;

                    wx.navigateBack({
                      delta: 1
                    })
                  },
                  fail: function fail(err) {
                    app.globalData.hasLogin = false;
                    util.showErrorToast('微信登录失败');
                    console.log("openId缓存失败");
                  }
                });
              }
            });
          }, 100);
        }
      }
    });
    this.onLoad();
  },
  // 获取用户openid
  getOpenid: function getOpenid() {
    var _this2 = this;
    // let that = this;
    wx.cloud.callFunction({
      name: "getOpenID",
      complete: function complete(res) {
        console.log("云函数获取到的openid: ", res);
        var openid = res.result.OPENID;
        _this2.setData({
          openid: openid
        });
        console.log(_this2.data.openid);
      }
    });
  },
  getUserId: function getUserId() {
    // var w = "abcdefghijklmnopqrstuvwxyz0123456789",
    //   firstW = w[parseInt(Math.random() * (w.length))];
    var firstW = "user";
    var userId = firstW + Date.now() + (Math.random() * 1e5).toFixed(0);
    console.log(userId);
    wx.setStorageSync("userId", userId);
    return userId;
  },

  
  wxLogin: function(e) {
    if (e.detail.userInfo == undefined) {
      app.globalData.hasLogin = false;
      util.showErrorToast('微信登录失败');
      return;
    }

    user.checkLogin().catch(() => {

      user.loginByWeixin(e.detail.userInfo).then(res => {
        app.globalData.hasLogin = true;

        wx.navigateBack({
          delta: 1
        })
      }).catch((err) => {
        app.globalData.hasLogin = false;
        util.showErrorToast('微信登录失败');
      });

    });
  }
})