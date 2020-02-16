// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  try {
    return await db.collection('jingzhi-word-checkin')
    .aggregate()
    .sort({'index':-1})
    .limit(7)
    .lookup({
      from: 'jingzhi-checkin-record',
      localField: 'index',
      foreignField: 'index',
      as: 'record',
    })
    .end().then(res => {
      console.log(res)  
      return res 
    })
    .catch(err => console.error(err))
  } catch(e){
    console.log(e)
    return(e)
  }
}