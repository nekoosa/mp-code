const express = require('express');
const fs = require('fs');
const Path = require('path');
const archiver = require('archiver');
const router = express.Router();
const wxapp = require('../wxapp/index');
const qrcode = require('../wxapp/api/qrcode');

router.get('/', async function (req, res, next) {
  res.render("index")
});

/**
 * 生成二维码
 * */
router.post('/qrcode', async function (req, res, next) {
  let reqData = req.body;
  let ret = {};
  if (!reqData) {
    ret["success"] = false;
    ret["message"] = "参数不能为空";
    res.send(ret);
    return -1;
  } else if (!reqData.type) {
    ret["success"] = false;
    ret["message"] = "type参数不能为空";
    res.send(ret);
    return -1;
  } else if (!reqData.path) {
    ret["success"] = false;
    ret["message"] = "path参数不能为空";
    res.send(ret);
    return -1;
  }
  // else if (reqData.path.startsWith("/")) {
  //   ret["success"] = false;
  //   ret["message"] = "path不能为/开头";
  //   res.send(ret);
  //   return -1;
  // }
  else if (reqData.type === "2" && !reqData.scene) {
    ret["success"] = false;
    ret["message"] = "scene不能空";
    res.send(ret);
  }

  let accessToken = await wxapp.getAccessToken();
  let resp = null;
  let result = [];
  let output = fs.createWriteStream(Path.resolve(__dirname + '../cache/tmp.zip'));
  let archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });
  archive.pipe(output);
  if (reqData.type === "2") { // 小程序码无限次
    for (let path of reqData.path) {
      resp = await qrcode.getWxacodeUnlimit({
        accessToken: accessToken,
        page: path,
        scene: reqData.scene
      })
      archive.append(new Buffer(resp.data, 'binary'), { name: path.replace('/', '.') + '.txt' });
    }
  } else if (reqData.type === "1") { // 小程序码有限次
    for (let path of reqData.path) {
      resp = await qrcode.getWxaCode({
        accessToken: accessToken,
        path: path,
      });
      archive.append(new Buffer(resp.data, 'binary'), { name: path.replace('/', '.') + '.txt' });
    }
  } else if (reqData.type === "3") { // 二维码
    for (let path of reqData.path) {
      resp = await qrcode.createWxaQrcode({
        accessToken: accessToken,
        path: path,
      });
      archive.append(new Buffer(resp.data, 'binary'), { name: path.replace('/', '.') + '.txt' });
    }
  }
  archive.finalize();
  // TODO 根据路径生成压缩包返回
  if (resp.headers["content-type"].indexOf("json") !== -1) {
    let content = resp.data.toString();
    console.info(content);
    ret.success = false;
    ret.message = JSON.parse(content)["errmsg"];
    res.send(ret);
  } else {
    ret.attach = '/cache/tmp.zip';
    ret.success = true;
    res.send(ret);
  }
  // if (resp.headers["content-type"].indexOf("json") !== -1) {
  //   let content = buf.toString();
  //   console.info(content);
  //   ret.success = false;
  //   ret.message = JSON.parse(content)["errmsg"];
  //   res.send(ret);
  // } else {
  //   ret.attach = wxapp.saveImage(buf);
  //   ret.success = true;
  //   res.send(ret);
  // }
});

module.exports = router;
