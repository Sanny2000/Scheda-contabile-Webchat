// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//获取数据库的应用
const db = cloud.database()

//获取指令对象的应用
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)

  var dateTime = _.gte(event.startTime).and(_.lte(event.endTime))
  console.log(dateTime)
  return await db.collection("msg_data").where({
   date: dateTime,
   userInfo: event.userInfo
  }).get()
}