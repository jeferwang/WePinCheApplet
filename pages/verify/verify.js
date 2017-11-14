let app = getApp();
Page({
  data: {
    formData: {}
  },
  // 加载
  onLoad: function (options) {
    let that = this;
  },
  // 点击发布按钮
  publish: function () {
    const that = this;
    console.log(that.data.formData);
  },
  // 表单输入通用处理
  formInput: function (e) {
    const that = this;
    const key = e.currentTarget.dataset.key;
    const value = e.detail.value;
    that.data.formData[key] = value;
    that.setData({
      formData: that.data.formData
    });
  },
  // 图片上传通用处理
  chooseImage: function (e) {
    const that = this;
    const key = e.currentTarget.dataset.key;
    wx.chooseImage({
      count: 1,
      success: function (resp) {
        const tempImgPath=resp.tempFilePaths[0];
        console.log(tempImgPath);
        wx.uploadFile({
          url:app.globalData.apiPath+'/api/file/upload',
          filePath:tempImgPath,
          name:'file',
          success:function  (resp) {
            console.log(resp);
          }
        })
      }
    });
  }
});
