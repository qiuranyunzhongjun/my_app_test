/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://eujhlx7r.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        // 用户注册接口
        registerUrl: `${host}/weapp/register`,

        // 用户新增测试接口
        demoUrl: `${host}/weapp/demo`,

        // 用户获取注册信息接口
        userInfoUrl: `${host}/weapp/userInfo`,

        // 用户增加活动信息信息接口
        updateActivityUrl: `${host}/weapp//addActivity`,

        // 用户获取活动信息接口
        activityUrl: `${host}/weapp/activitys`,
    }
};

module.exports = config;
