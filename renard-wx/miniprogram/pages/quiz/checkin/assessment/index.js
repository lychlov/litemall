/*
Tencent is pleased to support the open source community by making WeChat iHearing available.

Copyright (C) 2019 THL A29 Limited, a Tencent company. All rights reserved.

Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const app = getApp()

import { evalMode, assessmentItems, } from '../../../../utils/conf.js'
import { language } from '../../../../utils/language.js'

const languageCN = language[0]

import { requestAppId, requestUrl } from '../../../../utils/conf.js'

const overallIndex = [{
  key: 'pron_accuracy',
  desc: '准确度',
},
{
  key: 'pron_fluency',
  desc: '流畅度',
},
{
  key: 'pron_completion',
  desc: '完成度',
},
]

Page({
  data: {
    mode: 'word',
    modeDetail: evalMode.word,

    assessmentItem: {},

    index: 0,
    canPrevious: true,
    canNext: true,

    // hasResult: false,
    hasResult: true,
    wordList:[],
    buttonType: 'normal',

    // 整体结果
    overallResult: {
      "pron_accuracy": 56,
      "pron_fluency": 30,
      "pron_completion": 32,
    },

    // 整体指标
    overallIndex: overallIndex,


    // 返回结果处理后的音标数组
    phoneticArr: [
    ],

    // 返回结果处理后的单词数组
    wordArr: [],

    wordError: [], // 错误单词
    wordCaton: [], // 停顿过长
    wordMiss: [], // 遗漏词汇
    wordExtra: [], // 多读词汇


    voicePath: "",

    playType: 'wait', // 语音播放状态


  },


  previous: function () {
    if (!this.data.canPrevious) {
      wx.showToast({
        title: '已经是第一个了！',
        image: '/images/warning.png',
        duration: 2000
      })
      console.warn("not can previous ")
      return
    }
    this.initPage({
      mode: this.data.mode,
      index: this.data.index - 1
    })
  },
  next: function () {
    if (!this.data.canNext) {
      console.warn("not can next ")
      wx.showToast({
        title: '已经是最后一个了！',
        image: '/images/warning.png',
        duration: 2000
      })
      return
    }
    this.initPage({
      mode: this.data.mode,
      index: this.data.index + 1
    })
  },


  playVoice: function (e) {
    console.log("playVoice", e)
    let word = e.currentTarget.dataset.word
    console.log(e.currentTarget.dataset)
    if (!word) {
      console.warn("no translate voice path")
      return
    }

    let flag = this.data.mode == 'sentence' ? 1 : 0

    // let play_path = `${requestUrl}&appid=${requestAppId}&mode=get_voice&flag=${flag}&voice_id=${voiceId}`
    let play_path="https://fanyi.baidu.com/gettts?lan=en&spd=3&source=web&text="+word
    console.log("play_path", play_path)

    wx.onBackgroundAudioStop(res => {
      console.log("play voice end", res)
      this.playAnimationEnd()
    })

    this.playAnimationStart()


    wx.playBackgroundAudio({
      dataUrl: play_path,
      title: '',
      success: (res) => {
        console.log("play success")
        this.playAnimationStart()
      },
      fail: (res) => {
        // fail
        console.log("failed played", play_path);
        this.playAnimationEnd()
      },
      complete: function (res) {
        console.log("complete played");
      }
    })

  },


  /**
     * 开始播放
     */
  playAnimationStart: function () {
    this.setData({
      playType: 'playing',
    })

  },

  /**
   * 结束播放
   */
  playAnimationEnd: function () {
    this.setData({
      playType: 'wait',
    })
  },

  // 处理浮点数
  handleNum: function (num) {
    return Number(num).toFixed(0)
  },

  // 准确度分级
  getAccuracyType: function (accuracy) {
    let accuracyType = 'normal'
    if (accuracy > 80) {
      accuracyType = 'success'
    } else if (accuracy < 60) {
      accuracyType = 'error'
    }
    return accuracyType
  },

  // 单词模式处理音标
  handlePhoneInfo: function (result) {
    let word = result.words[0]
    let phoneArr = word.phone_info

    let phoneHandledArr = []
    for (let i = 0; i < phoneArr.length; i++) {
      let phoneItem = phoneArr[i]

      let phoneType = this.getAccuracyType(phoneItem.pron_accuracy)

      phoneHandledArr.push({
        phone: phoneItem.phone,
        type: phoneType,
      })
    }

    this.setData({
      phoneticArr: phoneHandledArr
    })
  },

  // 单词模式处理音标
  handlePhoneInfo: function (result) {
    let word = result.words[0]
    let phoneArr = word.phone_info

    let phoneHandledArr = []
    for (let i = 0; i < phoneArr.length; i++) {
      let phoneItem = phoneArr[i]

      let phoneType = this.getAccuracyType(phoneItem.pron_accuracy)

      phoneHandledArr.push({
        phone: phoneItem.phone,
        type: phoneType,
      })
    }

    this.setData({
      phoneticArr: phoneHandledArr
    })
  },

  // 句子模式处理单词
  handleSentenceInfo: function (result) {
    let words = result.words || [];
    let wordLen = words.length;

    let wordArr = []
    let wordError = []
    let wordCaton = []
    let wordMiss = []
    let wordExtra = []


    let lastWordEnd = 0; // 上一个词的结束时间
    for (let i = 0; i < wordLen; i++) {
      let wordItem = words[i];
      let tag = wordItem.tag;
      let word = wordItem.word;

      let wordObj = {}

      if (tag === 1) { // 多读
        wordExtra.push(word)
      } else if (tag === 2) { // 少读
        wordMiss.push(word)
        wordArr.push({
          word: word,
          type: 'error',
        })

      } else if (tag === 0) { // 匹配
        let phoneType = this.getAccuracyType(wordItem.pron_accuracy)
        if (phoneType == 'error') {
          wordError.push(word)
        }
        let wordStart = wordItem.word_start,
          wordEnd = wordItem.word_end

        let interval = wordStart - lastWordEnd
        if (lastWordEnd > 0 && interval > 200) { // 间隔大于200ms算卡顿
          wordCaton.push(word)
        }

        lastWordEnd = wordEnd

        wordArr.push({
          word: word,
          type: phoneType,
        })
      }
    }

    this.setData({
      wordArr: wordArr,
      wordError: wordError,
      wordCaton: wordCaton,
      wordMiss: wordMiss,
      wordExtra: wordExtra,
    })
  },

  // 缓存评估结果到localstorage
  cacheResult: function (result) {
    let content = this.data.assessmentItem.text
    let mode = this.data.mode

    let contentData = {
      content: content,
      index: this.data.index,
      pron_accuracy: this.handleNum(result.pron_accuracy),
    }

    let storageData = {}

    wx.getStorage({
      key: mode,
      success: function (res) {
        console.log("getStorage   cacheResult", res.data)
        storageData = res.data
      },
      fail: function () {

      },
      complete: function () {
        console.log("getStorage complete", storageData)
        storageData[content] = contentData
        wx.setStorage({
          key: mode,
          data: storageData
        })
      },
    })
  },

  // 统一处理整体评估结果
  handleOverallResult: function (result) {
    this.setData({
      overallResult: {
        pron_accuracy: this.handleNum(result.pron_accuracy),
        pron_fluency: this.handleNum(result.pron_fluency),
        pron_completion: this.handleNum(result.pron_completion),
      },
    })
  },

  // 单词模式
  buildWordResult: function (result) {
    this.handleOverallResult(result)
    this.handlePhoneInfo(result)

    this.cacheResult(result)
  },

  // 句子模式
  buildSentenceResult: function (result) {
    this.handleOverallResult(result)
    this.handleSentenceInfo(result)

    this.cacheResult(result)
  },

  onShow: function () {
    // console.log("list onshow")
    // this.showAssessmentCache()
  },

  onLoad: function (option) {
    // mode=sentence&index=10
    console.log("assessment", option)
    var that = this
    const db = wx.cloud.database()
    db.collection('jingzhi-word-checkin').orderBy('index','desc')
    .limit(1).get({
      success: function (res) {
        // res.data 是包含以上定义的两条记录的数组
        console.log('载入打卡单词',res)
        if (res.data.length>0) {
          that.setData({
            wordList: res.data[0].word_list,

          });
          that.initPage(option)

        } else {
          console.log('载入')
        }
      }
    })
  },

  initPage: function (option) {
    console.log("initPage", option)
    let index = option.index || 0
    let modeName = option.mode || 'word'
    let modeDetail = evalMode[modeName] || {}
    let listKey = modeName == 'word' ? 'currentWordList' : 'currentSentenceList'
    let assessmentList = this.data.wordList
    console.log("assessmentList",assessmentList)
    let assessmentItem = assessmentList[index] || {}
    if (modeName == 'word') {
      app.globalData.currentSentenceList = assessmentItem.sent_ids || []
    }

    let canPrevious = index > 0
    let canNext = index < assessmentList.length - 1

    this.setData({
      mode: modeName,
      modeDetail: modeDetail,
      assessmentItem: assessmentItem,
      index: Number(index),
      hasResult: false,
      voicePath: '',
      canPrevious: canPrevious,
      canNext: canNext,
    })

    wx.setNavigationBarTitle({
      title: `${modeDetail.desc}测评`
    })
  },

  onHide: function() {
    const innerAudioContext = wx.createInnerAudioContext()

    innerAudioContext.stop()
},
})
