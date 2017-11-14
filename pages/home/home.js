let app = getApp();
Page({
  data: {
    userInfo: null
  },
  // 加载
  onLoad: function (options) {
    let that = this;
    // 加载用户信息
    wx.getUserInfo({
      withCredentials: false,
      lang: 'zh_CN',
      success: function (resp) {
        that.setData({
          userInfo: resp.userInfo
        });
      }
    });
  }
});
