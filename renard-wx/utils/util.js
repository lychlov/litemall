var api = require('../config/api.js');
var app = getApp();

function formatTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n
}

/**
 * 封装微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Litemall-Token': wx.getStorageSync('token')
      },
      success: function(res) {

        if (res.statusCode == 200) {

          if (res.data.errno == 501) {
            // 清除登录相关内容
            try {
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('token');
            } catch (e) {
              // Do something when catch error
            }
            // 切换到登录页面
            wx.navigateTo({
              url: '/pages/auth/login/login'
            });
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function(err) {
        reject(err)
      }
    })
  });
}

function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

function addHistory (params){
  console.log('调用addHistory')
  return new Promise((resolve, reject) => {
    const db = wx.cloud.database()
    console.log(params)
    let openID = params.openID;
    let quizName = params.quizName
    db.collection('jingzhi-quiz-record').where({
      quizName:quizName,
      openID:openID
    }).get().then(res=>{
      console.log('查询到历史记录',res)
      if(res.data.length>0){
        db.collection('jingzhi-quiz-record').doc(res.data[0]._id).set({
          data:params
        }).then(res1=>{
          console.log('更新历史记录',res1)
          resolve({ 'result': res.data[0]._id })
        })
      }else{
        db.collection('jingzhi-quiz-record').add({
          data: params,
        }).then(res2=>{
          console.log('创建历史记录',res2)
          resolve({ 'result': res2._id})
        })
      }
    })
  })
}

module.exports = {
  addHistory,
  formatTime,
  request,
  redirect,
  showErrorToast
};