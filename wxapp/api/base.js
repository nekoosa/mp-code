const axios = require("axios");

/**
 * 获取accesstoken
 * @param appId 小程序appid
 * @param secret secret
 * */

const getAccessToken = (appId, secret) => {
  const url = "https://api.weixin.qq.com/cgi-bin/token";
  const params = {
    "appid": appId,
    "secret": secret,
    "grant_type": "client_credential"
  };
  return axios.get(url, {params})
};


module.exports = {
  getAccessToken
};