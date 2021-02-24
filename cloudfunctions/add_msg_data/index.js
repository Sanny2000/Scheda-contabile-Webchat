// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//获取数据库的应用
const db = cloud.database()

//云函数入口函数
exports.main = async (event,context) => {
  console.log(event) //userInfo是event自带的

  return await db.collection("msg_data").add({
    data: event
  })
}