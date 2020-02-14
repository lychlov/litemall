// pages/history/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    total:0,
    score:0,
    average:0,

  },

  onLoad (options) {
    var objectId = options.objectId
    const db = wx.cloud.database()
    db.collection('jingzhi-quiz-record').where({
      _id: objectId
    }).get().then(res =>{
      console.log(res)
      this.setData({
      objectId:objectId,
      loading: false,
      total: 3,
      score: 3,
      questions: res.data[0].result,
      beatNum: 10,
      average: 3
    })
    })
    // wx.u.getHistory(objectId).then(res=>{
    //   wx.u.getBeatNum(res.result.menu, res.result.score).then(res1=>{
    //     wx.u.getAverage(res.result.menu).then(res2 => {
    //       this.setData({
    //         objectId:objectId,
    //         loading: false,
    //         total: res.result.questionList.length,
    //         score: res.result.score,
    //         questions: res.result.questionList,
    //         beatNum: res1.result,
    //         average: parseInt(res2.result[0].allScore / res2.result[0].peopleNum)
    //       })
    //     })
    //   }) 
    // })
  },
  back(){
    wx.reLaunch({
      url: '/pages/catalog/catalog',
    })
  },
  analysis(){
    wx.navigateTo({
      url: '/pages/quiz/analysis/index?objectId='+ this.data.objectId,
    })
  }
})