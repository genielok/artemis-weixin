// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 获取用户openid
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return wxContext.OPENID
}


// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()

//   return {
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//   }
// }