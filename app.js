//app.js
let util = require('utils/util.js');
App({
  globalData: {
    userInfo: null,
    applet_id: 666,
    openid: '',
    Urln: 'http://www.sy.com',
    appid: null,
    appsecret: null
  },
  onLaunch: function () {
    let that = this;
  },
  /**
   * 获取用户信息
   * @param cb 回调
   */
  getUserInfo: function (cb = null) {
    let that = this;
    wx.getUserInfo({
      withCredentials: false,
      lang: 'zh_CN',
      success: function (resp) {
        cb(resp);
      },
      fail: function () {
        that.resetAuth();
      },
      complete: function () {
      }
    });
    
  },
  /**
   * 重新申请授权
   */
  resetAuth: function () {
    let that = this;
    wx.getSetting({
      success: function (setting) {
        if (!setting.authSetting['scope.userInfo']) {
          wx.showModal({
            title: '提示',
            content: '请允许我们获取您的基本信息,否则可能无法正常为您服务',
            showCancel: false,
            success: function () {
              wx.openSetting({
                success: function (res) {
                  if (!res.authSetting['scope.userInfo']) {
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
  requestOpenId: function (e) {
    const that = this;
    wx.login({
      success: function (resp1) {
        wx.request({
          url: that.globalData.path_info.api + '/api/applet/getOpenIdByCode',
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
                  url: that.globalData.path_info.api + '/api/user/setUser',
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
});