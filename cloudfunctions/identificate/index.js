// 云函数入口文件
const cloud = require('wx-server-sdk')
let AipImageClassifyClient = require("baidu-aip-sdk").imageClassify;
const args = require("conf.js"); //获取API各参数
console.log(args)

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let APP_ID = args.APP_ID;
  let API_KEY = args.API_KEY;
  let SECRET_KEY = args.SECRET_KEY;
  console.log(APP_ID)

  // 新建一个对象，保存一个对象调用服务接口
  let client = new AipImageClassifyClient(APP_ID,API_KEY,SECRET_KEY);
  console.log("已可成功到这一步")
  let fileID = event.fileID;
  let res = await cloud.downloadFile({
    fileID:fileID,
  })
  let image = res.fileContent.toString("base64");

  var fs = require('fs');

  // 可选参数
  var options = {};
  options["top_num"] = "3"; // 返回预测得分top结果数，默认为6
  options["baike_num"] = "5"; // 返回百科信息的结果数，默认不返回"0"

  // 调用动物识别
  client.animalDetect(image,options).then(function (result) {
    identResult = JSON.stringify(result)
    console.log(JSON.stringify(result));
  }).catch(function (err) {
    // 如果发生网络错误
    console.log(err);
  });
  return client.animalDetect(image,options)
}