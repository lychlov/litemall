// pages/analysis/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    s: ['A', 'B', 'C', 'D', 'E'],
    questionInfo: {},
    loading: true,
    result: {},
    disabled: true,
    actionVisible: false,
    index: 0,
    chose: [],
    myChoice:[],
    answer:{},
    showVideo: false,
    showHelpVideo: false
  },

  onLoad(options) {
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowWidth: res.windowWidth
        })
      }
    })
    var objectId = options.objectId
    console.log('objid',objectId)
    const db = wx.cloud.database()
    db.collection('jingzhi-quiz-record').where({
      _id: objectId
    }).get().then(res => {
      console.log(res)
      var right = res.data[0].score
      var wrong = res.data[0].result.length - right
      var persent = parseFloat(right / res.data[0].result.length * 100).toFixed(2)
      console.log(persent)
      this.setData({
        loading: false,
        result: res.data[0].result,
        right: right,
        wrong: wrong,
        persent: persent,
        total: res.data[0].result.length
      })
      this.setThisData(this.data.index)
    })
  },
  onReady(res) {
    this.videoContext = wx.createVideoContext('myVideo')
    this.helpVideoContext = wx.createVideoContext('helpVideo')
  },
  setThisData(i) {
    console.log(i)
    const r = this.data.result
    var answer = {}
    var myChoice ={}
    var current = "";
    var currentD = [];
    console.log(r)
    var choose = r[i].choose? r[i].choose[0]:''
    var rightAnswer = r[i].answer
    myChoice = {
      "item":r[i][choose],
      "markdown":r[i].choseList[this.data.s.indexOf(choose)].markdown,
    }
    answer = {
      "item":r[i][rightAnswer],
      "markdown":r[i].choseList[this.data.s.indexOf(rightAnswer)].markdown,
    }
    console.log(myChoice)
    console.log(answer)
    this.setData({
      current: current,
      currentD: currentD,
      questionInfo: r[i],
      answer: answer,
      myChoice:myChoice
    })
    console.log(this.data.current)
  },
  handlePageChange({ detail }) {
    const action = detail.type;
    const r = this.data.result


    if (action === 'next') {
      if (this.data.index >= (r.length - 1)) {
        console.log(this.data.index)
        return;
      }
      this.setThisData((this.data.index + 1));
      this.setData({
        index: (this.data.index + 1),
      })
    } else {
      this.setThisData((this.data.index - 1));
      this.setData({
        index: (this.data.index - 1),
      })
    }
  },
  //弹出统计下拉层
  handleOpen() {
    this.hideVideo()
    this.hideHelpVideo()
    this.setData({
      actionVisible: true
    })
  },
  //关闭统计下拉层
  actionCancel() {
    this.setData({
      actionVisible: false
    })
  },
  dump(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    this.setThisData(index)
    this.setData({
      index: index,
      actionVisible: false
    })
  },
  //放大图片
  showPic: function (e) {
    const src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
  showVideo() {
    this.videoContext.play()
    this.setData({
      showVideo: true
    })
  },
  hideVideo: function () {
    this.videoContext.pause()
    this.setData({
      showVideo: false
    });
  },
  showHelpVideo() {
    this.helpVideoContext.play()
    this.setData({
      showHelpVideo: true
    })
  },
  hideHelpVideo: function () {
    this.helpVideoContext.pause()
    this.setData({
      showHelpVideo: false
    });
  },
})