 ### 简单二维码获取系统
 1、修改配置
 > wxapp/config.js
 
 
 2、启动
 ```
 npm install
 npm run start
 ```
 
 3、 访问 http://127.0.0.1:3000
 
 
 注意，
 1. 小程序需发布后才可以获取二维码, 否则提示无效路径。
 2. 如果使用appId和secret获取accessToken的话，会刷新导致accessToken发生刷新, 旧accessToken失效，如果其他业务用到，将影响其他业务。解决方法是直接在代码写死线上的accesstoken
 3. 提示ip 不在白名单内的，mp平台或者open平台添加对应的ip白名单。
 
 
 
 