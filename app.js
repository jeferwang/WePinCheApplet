//app.js
let util = require('utils/util.js');
App({
  globalData: {
    userInfo: null,
    applet_id: 666,
    openid: '',
    Urln: 'http://www.sy.com',
    appid: null,
    appsecret: null,
    // 附加信息
    path: '/weidogs/weipinche/public'
  },
  onLaunch: function () {
    const that = this;
    // 生成apiPath
    that.globalData.apiPath = that.globalData.Urln + that.globalData.path;
    // 申请权限
    that.checkAuth();
    // 向后台添加用户
    that.getOpenid(true, false);
  },
  /**
   * 检查并获取权限
   */
  checkAuth: function () {
    const that = this;
    wx.getLocation({
      fail: function () {
        that.resetAuth();
      }
    });
    wx.getUserInfo({
      fail: function () {
        that.resetAuth();
      }
    });
  },
  /**
   * 提醒用户重新设置权限
   */
  resetAuth: function () {
    let that = this;
    wx.getSetting({
      success: function (setting) {
        // 同时检查用户基本信息权限和位置信息权限
        if (!setting.authSetting['scope.userInfo'] || !setting.authSetting['scope.userLocation']) {
          wx.showModal({
            title: '提示',
            content: '请允许我们获取您的基本信息和位置信息，否则我们无法为您提供有效的服务',
            showCancel: false,
            success: function () {
              wx.openSetting({
                success: function (res) {
                  if (!res.authSetting['scope.userInfo'] || !res.authSetting['scope.userLocation']) {
                    that.resetAuth();
                  }
                }
              });
            }
          });
        }
      }
    });
  },
  /**
   * 向后台请求openid
   * 设置openid缓存
   * 设置用户
   */
  getOpenid: function (setUser = true, callback = false) {
    const that = this;
    wx.login({
      success: function (resp1) {
        wx.request({
          url: that.globalData.apiPath + '/api/applet/getOpenIdByCode',
          data: {
            applet_id: that.globalData.applet_id,
            js_code: resp1.code
          },
          method: 'POST',
          success: function (resp2) {
            const openid = resp2.data.data.openid;
            wx.setStorageSync('openid', openid);
            if (callback) {
              callback(openid);
            }
            if (setUser) {
              wx.getUserInfo({
                withCredentials: false,
                lang: 'zh_CN',
                success: function (resp3) {
                  wx.request({
                    url: that.globalData.apiPath + '/api/user/setUser',
                    method: 'POST',
                    data: {
                      applet_id: that.globalData.applet_id,
                      openid: resp2.data.data.openid,
                      user_img: resp3.userInfo.avatarUrl,
                      name: resp3.userInfo.nickName,
                      addr: resp3.userInfo.country + resp3.userInfo.province + resp3.userInfo.city
                    }
                  });
                }
              });
            }
          }, fail: function (resp) {
            console.log('requestOpenId fail');
          }
        });
      }, fail: function () {
        console.log('login error');
      }
    });
  },
  /**
   * 加载中wrapper
   */
  loadingWrapper: function (callback, title = '加载中...') {
    wx.showLoading({
      title: title
    });
    callback();
    wx.hideLoading();
  },
  /**
   * 包装http请求函数
   * 自动带上applet_id
   */
  requestWithAppletId: function (params) {
    const that = this;
    let data = params.data || {};
    const newData = Object.assign({applet_id: that.globalData.applet_id}, data);
    // 赋予新的发送数据
    params.data = newData;
    // 默认请求方法
    if (!params.method) {
      params.method = "POST";
    }
    // 加载默认错误处理函数
    if (!params.fail) {
      params.fail = function () {
        wx.showModal({
          title: 'Error',
          showCancel: false,
          content: '加载失败',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
            }
          }
        });
      };
    }
    // 发起请求
    wx.request(params);
  },
  /**
   * 带上openid参数执行函数
   */
  withOpenid: function (callback) {
    const that = this;
    let openid = wx.getStorageSync('openid');
    if (!openid) {
      that.getOpenid(true, function (oid) {
        callback(oid);
      });
    }else{
      callback(openid);
    }
  }
})
;