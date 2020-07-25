wx.cloud.init()

/**
 * @method login
 * @return {} promise对象，包含openid,appid
 * @desc 用户登陆
*/
const login = async () => {
  return await wx.cloud.callFunction({
    name: 'login'
  })
}
module.exports = {login}