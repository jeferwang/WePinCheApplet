let app = getApp();
Page({
  data: {
    userInfo: null
  },
  // 加载
  onLoad: function (options) {
    let that = this;
    app.getUserInfo(function (resp) {
      console.log(resp.userInfo);
      that.setData({
        userInfo: resp.userInfo
      });
    });
  }
});
