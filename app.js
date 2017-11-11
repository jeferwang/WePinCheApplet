//app.js
let util = require('utils/util.js');
App({
  
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
  }
});