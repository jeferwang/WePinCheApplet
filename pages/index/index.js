//index.js
//获取应用实例
let app = getApp();

Page({
  data: {
    tabIndex: 1
  },
  // 人找车<>车找人 标签页切换
  toggleTab: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      tabIndex: index
    });
    if (index == 0) {
    
    } else if (index == 1) {
    
    } else {
      // 不可能滴
      return false;
    }
  }
});
