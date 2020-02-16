// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('jingzhi-topic')
      .where({
        isPrivate:0
      })
      .orderBy('topicTime', 'desc')
      .get({
        success: function (res) {
          return res
        }
      });
  } catch (e) {
    console.error(e);
  }
}