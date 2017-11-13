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
    that.setUser();
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
   */
  setUser: function () {
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
            wx.setStorageSync('openid', resp2.data.data.openid);
            wx.getUserInfo({
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
          }, fail: function (resp) {
            console.log('requestOpenId fail');
          }
        });
      }, fail: function () {
        console.log('login error');
      }
    });
  }
})
;