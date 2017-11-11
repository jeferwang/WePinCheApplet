//获取应用实例
let app = getApp();
let currDate = new Date();
let date_s = [currDate.getFullYear(), currDate.getMonth() + 1, currDate.getDate()].join('-');
let time_s = [(currDate.getHours()>=10?'':'0')+currDate.getHours(), (currDate.getMinutes()>=10?'':'0')+currDate.getMinutes()].join(':');
Page({
  data: {
    // 表单数据容器
    formData: {
      date: date_s,
      time: time_s,
      peopleNum: 6
    }
  },
  // 加载
  onLoad: function (options) {
    let that = this;
    console.log(that.data.formData);
  },
  // 日期选择
  bindDateChange: function (e) {
    let that = this;
    that.data.formData.date = e.detail.value;
    console.log(e.detail.value);
    that.setData({
      formData: that.data.formData
    });
  },
  // 时间选择
  bindTimeChange: function (e) {
    let that = this;
    that.data.formData.time = e.detail.value;
    console.log(e.detail.value);
    that.setData({
      formData: that.data.formData
    });
  }
});
