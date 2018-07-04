const axios = require("axios");
// const Qs = require("qs")
const request = axios.create({
  timeout: 5000, // 请求超时时间,
  // transformRequest: [function (data) {
  // data = Qs.stringify(data);
  // console.info(data)
  // return data;
  // }],
  // headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});


/**
 * 接口A: 适用于需要的码数量较少的业务场景 接口地址：
 * @param options.accessToken
 * @param options.path
 * @param options.width
 * @param options.auto_color
 * @param options.line_color
 * @param options.is_hyaline
 * */
const getWxaCode = (options) => {
  const url = "https://api.weixin.qq.com/wxa/getwxacode?access_token=" + options.accessToken;
  const postData = {
    path: options.path, // 小程序page路径
    width: options.width || 430, // 二维宽度
    auto_color: options.auto_color,
    line_color: options.line_color,
    is_hyaline: options.is_hyaline
  };
  return request.post(url, postData, {responseType: 'arraybuffer'})
};

/**
 * 接口B：适用于需要的码数量极多的业务场景
 * @param options.page // 必须是已经发布的小程序存在的页面（否则报错），例如 "pages/index/index" ,根路径前不要填加'/',不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面
 * @param options.width // 二维宽度
 * @param options.scene // // 最大32个可见字符，只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~，其它字符请自行编码为合法字符（因不支持%，中文无法使用 urlencode 处理，请使用其他编码方式）
 * @param options.auto_color
 * @param options.accessToken
 * @param options.line_color
 * @param options.is_hyaline
 *
 * */

const getWxacodeUnlimit = (options) => {
  const url = "https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" + options.accessToken;

  const data = {
    page: options.page,
    scene: options.scene,
    width: options.width || 430, // 二维宽度
    auto_color: options.auto_color,
    line_color: options.line_color,
    is_hyaline: options.is_hyaline
  };
  return request.post(url, data,  {responseType: 'arraybuffer'})
};

/**
 * 接口C：适用于需要的码数量较少的业务场景
 * @param options.accessToken
 * @param options.path
 * @param options.width
 * */
const createWxaQrcode = (options) => {
  const url = "https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=" + options.accessToken;

  const data = {
    path: options.path, // 必须是已经发布的小程序存在的页面（否则报错），例如 "pages/index/index" ,根路径前不要填加'/',不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面
    width: options.width || 430, // 二维宽度
  };
  return request.post(url, data, {responseType: 'arraybuffer'})
};

module.exports = {
  getWxaCode,
  getWxacodeUnlimit,
  createWxaQrcode
};
