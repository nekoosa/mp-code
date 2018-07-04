const BaseApi = require("./api/base");
const Config = require("./config");
const Cache = require("memory-cache");
const ACCESS_TOKEN_KEY = "ACCESS_TOKEN_";
const fs = require("fs");

// try {
//   if (fs.existsSync("cache")) {
//     // 载入缓存
//     let json = fs.readFileSync("cache");
//     Cache.importJson(json.toString())
//   }
// } catch (e) {
//   console.info(e);
// }

/**
 * 缓存access token
 * */
async function getAccessToken() {
  let accessToken = Cache.get(ACCESS_TOKEN_KEY + Config.appId);

  // 重新读取
  if (accessToken == null) {
    let expiresTime = new Date().getTime();
    let resp = await BaseApi.getAccessToken(Config.appId, Config.secret);
    if (!resp.data.access_token) {
      console.error("获取access_token失败！！ ", resp.data);
      // todo 没有access token就直接退出吧
    } else {
      console.info("刷新ACCESS TOKEN");
      accessToken = resp.data.access_token;
      expiresTime = resp.data.expires_in * 1009;
    }

    // 固化
    Cache.put(ACCESS_TOKEN_KEY + Config.appId, accessToken, expiresTime);
    fs.writeFile("cache", Cache.exportJson(),  ()=>{});
  }

  return accessToken;
}

/**
 * 保存二维码
 * @param buffer
 * @return string
 * */
function saveImage(buffer) {
  let date = new Date();
  let filename = date.getTime() + ".jpg";
  fs.writeFileSync("public/qrcode/" + filename, buffer);
  return "/qrcode/" + filename;
}

module.exports = {
  getAccessToken,
  saveImage
};